import { jsPDF } from 'jspdf';
import { ScreeningResult } from '../types';
import { FISH_DISEASES } from '../data/diseases';

export function generateFishDiseasePDF(result: ScreeningResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('AQUACULTURE PATHOLOGY & HEALTH SCREENING', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('AI Vision Transformer Diagnostic System (panda992/fish_disease_datasets)', margin, 18);
  doc.text(`Report ID: #${result.id}  •  Generated: ${new Date(result.timestamp).toLocaleString()}`, margin, 23);

  currentY = 36;

  // Primary Diagnosis Box
  const disease = FISH_DISEASES[result.primaryClassId] || FISH_DISEASES[4];
  const isHealthy = result.primaryClassId === 4;

  if (isHealthy) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(239, 68, 68);
  }

  doc.setLineWidth(0.8);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 32, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIMARY PATHOLOGICAL DIAGNOSIS', margin + 6, currentY + 7);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(result.primaryClassName, margin + 6, currentY + 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Pathogen / Category: ${disease.pathogen} (${disease.scientificCategory})`, margin + 6, currentY + 21);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const confText = `Confidence: ${(result.primaryProbability * 100).toFixed(1)}%`;
  const severityText = `Status: ${disease.severity.toUpperCase()}`;
  doc.setTextColor(isHealthy ? 5 : 185, isHealthy ? 150 : 28, isHealthy ? 105 : 28);
  doc.text(`${confText}  •  ${severityText}`, margin + 6, currentY + 27);

  currentY += 38;

  // Specimen Image & Telemetry Box
  const colWidth = (pageWidth - 2 * margin - 8) / 2;

  // Left Box: Image
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, colWidth, 54, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SPECIMEN CAPTURE', margin + 4, currentY + 6);

  try {
    if (result.imageThumbnail) {
      doc.addImage(result.imageThumbnail, 'JPEG', margin + 4, currentY + 9, colWidth - 8, 40);
    }
  } catch (e) {
    console.warn('PDF image embedding notice:', e);
  }

  // Right Box: Telemetry
  const qx = margin + colWidth + 8;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(qx, currentY, colWidth, 54, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('IMAGE QUALITY & TELEMETRY', qx + 4, currentY + 6);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const q = result.qualityMetrics;
  const metricsList = [
    `Overall Rating: ${q.qualityRating}`,
    `Resolution: ${q.width} x ${q.height} px`,
    `Mean Brightness: ${q.brightness} / 255`,
    `Contrast Index: ${q.contrast}`,
    `Sharpness Index: ${q.sharpnessScore}`,
    `Inference Latency: ${result.inferenceTimeMs} ms`,
    `Capture Source: ${result.deviceType}`
  ];

  metricsList.forEach((line, idx) => {
    doc.text(line, qx + 4, currentY + 13 + idx * 5.6);
  });

  currentY += 60;

  // 7-Class Table
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('FULL 7-CLASS CLASSIFICATION PROBABILITY BREAKDOWN', margin, currentY);

  currentY += 4;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('CLASS ID & NAME', margin + 3, currentY + 4.2);
  doc.text('PROBABILITY', margin + 110, currentY + 4.2);
  doc.text('PERCENTAGE', margin + 145, currentY + 4.2);

  currentY += 6;

  result.probabilities.forEach((item) => {
    const isSelected = item.classId === result.primaryClassId;
    if (isSelected) {
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, currentY, pageWidth - 2 * margin, 5.5, 'F');
    }

    doc.setFont('helvetica', isSelected ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(isSelected ? 15 : 71, isSelected ? 23 : 85, isSelected ? 42 : 105);

    doc.text(`${item.classId} - ${item.className}`, margin + 3, currentY + 3.8);
    doc.text(item.probability.toFixed(4), margin + 110, currentY + 3.8);
    doc.text(`${item.percentage.toFixed(1)}%`, margin + 145, currentY + 3.8);

    const barWidth = 24;
    const filledWidth = Math.max(0.5, item.probability * barWidth);
    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 158, currentY + 1.5, barWidth, 2.5, 'F');
    doc.setFillColor(isSelected ? 37 : 148, isSelected ? 99 : 163, isSelected ? 235 : 184);
    doc.rect(margin + 158, currentY + 1.5, filledWidth, 2.5, 'F');

    currentY += 5.5;
  });

  currentY += 6;

  // Clinical Guidance
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CLINICAL PRESENTATION & RECOMMENDED INTERVENTIONS', margin, currentY);

  currentY += 4;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Key Clinical Signs:', margin, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  disease.clinicalSigns.slice(0, 3).forEach((sign) => {
    doc.text(`• ${sign}`, margin + 3, currentY);
    currentY += 3.8;
  });

  currentY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Immediate Quarantine & Treatment Protocol:', margin, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  disease.immediateActions.slice(0, 2).forEach((act) => {
    doc.text(`• ${act}`, margin + 3, currentY);
    currentY += 3.8;
  });
  disease.treatmentOptions.slice(0, 2).forEach((treat) => {
    doc.text(`• Treatment: ${treat}`, margin + 3, currentY);
    currentY += 3.8;
  });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  const footerText = 'DISCLAIMER: Generated by computer vision health screening tool (panda992/fish_disease_datasets ViT model). Intended for aquaculture triage and early detection. Confirm with a licensed aquatic veterinarian before initiating prescription pharmaceuticals.';
  const splitFooter = doc.splitTextToSize(footerText, pageWidth - 2 * margin);
  doc.text(splitFooter, margin, pageHeight - 12);

  const filename = `Fish_Health_Report_${result.primaryClassName.replace(/[^a-zA-Z0-9]/g, '_')}_${result.id}.pdf`;
  doc.save(filename);
}
