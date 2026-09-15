import os
import json
import torch
import numpy as np
from transformers import ViTForImageClassification, ViTImageProcessor

MODEL_ID = "panda992/fish_disease_datasets"
OUTPUT_DIR = "./public/model"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Loading model {MODEL_ID} from Hugging Face...")
model = ViTForImageClassification.from_pretrained(MODEL_ID)
processor = ViTImageProcessor.from_pretrained(MODEL_ID)

model.eval()

print("Model architecture:", type(model))
print("Config id2label:", model.config.id2label)

# Save class labels and preprocessor config for the browser
labels_meta = {
    "id2label": {int(k): v for k, v in model.config.id2label.items()},
    "label2id": {k: int(v) for k, v in model.config.label2id.items()},
    "image_size": model.config.image_size,
    "image_mean": processor.image_mean if hasattr(processor, "image_mean") else [0.5, 0.5, 0.5],
    "image_std": processor.image_std if hasattr(processor, "image_std") else [0.5, 0.5, 0.5],
    "rescale_factor": processor.rescale_factor if hasattr(processor, "rescale_factor") else 1.0 / 255.0,
    "model_name": MODEL_ID
}

with open(os.path.join(OUTPUT_DIR, "model_meta.json"), "w") as f:
    json.dump(labels_meta, f, indent=2)
print("Saved model_meta.json to", OUTPUT_DIR)

# Prepare dummy input for ONNX export
dummy_input = torch.randn(1, 3, 224, 224, dtype=torch.float32)

onnx_path = os.path.join(OUTPUT_DIR, "fish_disease_vit.onnx")
print(f"Exporting to ONNX at {onnx_path}...")

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

print(f"ONNX export complete! Size: {os.path.getsize(onnx_path) / (1024 * 1024):.2f} MB")

# Also produce an optimized / quantized version (int8) for faster web browser loading
try:
    from onnxruntime.quantization import quantize_dynamic, QuantType
    quant_path = os.path.join(OUTPUT_DIR, "fish_disease_vit_quantized.onnx")
    print(f"Quantizing ONNX model to {quant_path}...")
    quantize_dynamic(
        model_input=onnx_path,
        model_output=quant_path,
        weight_type=QuantType.QUInt8
    )
    print(f"Quantized model created! Size: {os.path.getsize(quant_path) / (1024 * 1024):.2f} MB")
except Exception as e:
    print("Quantization skipped or failed:", e)

# Validate ONNX with onnxruntime in Python
import onnxruntime as ort

session = ort.InferenceSession(onnx_path)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

test_input = np.random.randn(1, 3, 224, 224).astype(np.float32)
torch_out = model(torch.from_numpy(test_input)).logits.detach().numpy()
onnx_out = session.run([output_name], {input_name: test_input})[0]

diff = np.max(np.abs(torch_out - onnx_out))
print(f"Max absolute difference between PyTorch and ONNX: {diff}")
assert diff < 1e-3, f"Difference too high: {diff}"
print("VERIFICATION SUCCESS: ONNX model exactly matches PyTorch model outputs!")
