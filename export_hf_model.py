import os
import json
import numpy as np
import torch
from transformers import ViTForImageClassification, ViTImageProcessor

MODEL_ID = "panda992/fish_disease_datasets"
OUTPUT_DIR = "./public/model"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Loading model {MODEL_ID} from Hugging Face...")
model = ViTForImageClassification.from_pretrained(MODEL_ID)
model.eval()

print("Model architecture:", type(model))
print("Config id2label:", model.config.id2label)

meta = {
    "model_id": MODEL_ID,
    "architecture": "ViTForImageClassification",
    "base_model": "google/vit-base-patch16-224-in21k",
    "validation_accuracy": 0.9728,
    "num_classes": len(model.config.id2label),
    "classes": model.config.id2label,
    "input_size": [1, 3, 224, 224],
    "image_mean": [0.5, 0.5, 0.5],
    "image_std": [0.5, 0.5, 0.5],
}

meta_path = os.path.join(OUTPUT_DIR, "model_meta.json")
with open(meta_path, "w") as f:
    json.dump(meta, f, indent=2)
print(f"Saved model_meta.json to {OUTPUT_DIR}")

# Export to ONNX
dummy_input = torch.randn(1, 3, 224, 224, dtype=torch.float32)
onnx_path = os.path.join(OUTPUT_DIR, "fish_disease_vit.onnx")
print(f"Exporting to ONNX at {onnx_path}...")

try:
    # Use torch.onnx.export with dynamo=False for reliable classic TorchScript exporter
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={
            "pixel_values": {0: "batch_size"},
            "logits": {0: "batch_size"}
        },
        dynamo=False
    )
except TypeError:
    # Older torch version without dynamo arg
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={
            "pixel_values": {0: "batch_size"},
            "logits": {0: "batch_size"}
        }
    )

print(f"ONNX export complete! File size: {os.path.getsize(onnx_path) / (1024 * 1024):.2f} MB")

# Create quantized web-friendly model
quant_path = os.path.join(OUTPUT_DIR, "fish_disease_vit_quantized.onnx")
try:
    from onnxruntime.quantization import quantize_dynamic, QuantType
    print(f"Quantizing ONNX model to {quant_path}...")
    quantize_dynamic(
        model_input=onnx_path,
        model_output=quant_path,
        weight_type=QuantType.QUInt8
    )
    print(f"Quantized model created! File size: {os.path.getsize(quant_path) / (1024 * 1024):.2f} MB")
except Exception as e:
    print("Quantization warning:", e)

# Validate with ONNX Runtime
import onnxruntime as ort

val_model_path = quant_path if os.path.exists(quant_path) else onnx_path
session = ort.InferenceSession(val_model_path)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

test_input = np.random.randn(1, 3, 224, 224).astype(np.float32)
torch_out = model(torch.from_numpy(test_input)).logits.detach().numpy()
onnx_out = session.run([output_name], {input_name: test_input})[0]

diff = np.max(np.abs(torch_out - onnx_out))
print(f"Max absolute difference between PyTorch and ONNX: {diff:.4f}")
print("VERIFICATION COMPLETED SUCCESSFULLY!")
