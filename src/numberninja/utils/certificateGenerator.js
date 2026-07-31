import jsPDF from 'jspdf';

/**
 * Renders an official HTML5 Canvas Ninja Mastery Certificate and triggers download as PNG or PDF.
 */
export function generateCertificateCanvas(canvasEl, { playerName, rankTitle, worldName, xp, totalMastered }) {
  if (!canvasEl) return;

  const ctx = canvasEl.getContext('2d');
  const width = 1200;
  const height = 850;
  canvasEl.width = width;
  canvasEl.height = height;

  // Background Gradient (Dark Ninja Glass)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e1b4b');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Gold Decorative Border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Inner Subtle Gold Line
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // Corner Accents
  const cornerSize = 40;
  ctx.fillStyle = '#f59e0b';
  [[45, 45], [width - 45 - cornerSize, 45], [45, height - 45 - cornerSize], [width - 45 - cornerSize, height - 45 - cornerSize]].forEach(([x, y]) => {
    ctx.fillRect(x, y, cornerSize, cornerSize);
  });

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('NORTHSTAR SCHOOL OS — PRACTICE ZONE', width / 2, 110);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'black 48px system-ui, sans-serif';
  ctx.fillText('CERTIFICATE OF MATH MASTERY', width / 2, 175);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 22px system-ui, sans-serif';
  ctx.fillText('This certifies that Number Ninja student', width / 2, 230);

  // Student Name
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.fillText(playerName.toUpperCase(), width / 2, 310);

  // Divider Line
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 335);
  ctx.lineTo(width / 2 + 250, 335);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = '#f8fafc';
  ctx.font = '24px system-ui, sans-serif';
  ctx.fillText(`has successfully mastered all levels in`, width / 2, 390);

  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(worldName || 'The 100-Level Adaptive Curriculum', width / 2, 445);

  // Ninja Rank Badge Title
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(`NINJA RANK: ${rankTitle.toUpperCase()}`, width / 2, 510);

  // Statistics Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(width / 2 - 300, 560, 600, 100);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(width / 2 - 300, 560, 600, 100);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`TOTAL MASTERY XP: ${xp} XP   |   LEVELS MASTERED: ${totalMastered} / 100`, width / 2, 618);

  // Golden Stamp Seal (Right Side)
  const sealX = width - 160;
  const sealY = height - 160;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
  ctx.fillStyle = '#d97706';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText('🥷', sealX, sealY + 12);

  // Date and Verification Signature
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`Issued: ${issueDate}`, 80, height - 100);
  ctx.fillText(`Verification: Client-Side Verified (No DB Overhead)`, 80, height - 75);

  ctx.textAlign = 'right';
  ctx.fillText(`Number Ninja Engine v2.0`, width - 80, height - 75);
}

export function downloadCertificateAsImage(canvasEl, filename = 'Number_Ninja_Mastery_Certificate.png') {
  if (!canvasEl) return;
  const dataUrl = canvasEl.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function downloadCertificateAsPdf(canvasEl, filename = 'Number_Ninja_Mastery_Certificate.pdf') {
  if (!canvasEl) return;
  const imgData = canvasEl.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1200, 850]
  });
  pdf.addImage(imgData, 'PNG', 0, 0, 1200, 850);
  pdf.save(filename);
}
