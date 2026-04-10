import QRCode from "qrcode";

export interface CertificateParams {
  studentName: string;
  courseName: string;
  categoryName: string;
  instructorNames: string;
  completedAt: string; // ISO string
  certId: string;
}

// Civil engineering blueprint pattern data URL
function drawBlueprintGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Blueprint grid lines
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 0.7;
  const step = 32;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Corner marks (blueprint style)
  ctx.strokeStyle = "rgba(212,168,67,0.25)";
  ctx.lineWidth = 1.5;
  const mark = 30, margin = 22;
  // TL
  ctx.beginPath(); ctx.moveTo(margin + mark, margin); ctx.lineTo(margin, margin); ctx.lineTo(margin, margin + mark); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(w - margin - mark, margin); ctx.lineTo(w - margin, margin); ctx.lineTo(w - margin, margin + mark); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(margin + mark, h - margin); ctx.lineTo(margin, h - margin); ctx.lineTo(margin, h - margin - mark); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(w - margin - mark, h - margin); ctx.lineTo(w - margin, h - margin); ctx.lineTo(w - margin, h - margin - mark); ctx.stroke();

  ctx.restore();
}

function drawGoldDivider(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save();
  const grad = ctx.createLinearGradient(x, y, x + width, y);
  grad.addColorStop(0, "rgba(212,168,67,0)");
  grad.addColorStop(0.2, "rgba(212,168,67,0.9)");
  grad.addColorStop(0.5, "#D4A843");
  grad.addColorStop(0.8, "rgba(212,168,67,0.9)");
  grad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + width, y); ctx.stroke();
  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

export async function generateCertificate(params: CertificateParams): Promise<void> {
  const W = 1122;
  const H = 794;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background gradient ──────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0A1628");
  bg.addColorStop(0.45, "#0F1E35");
  bg.addColorStop(1, "#071022");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Blueprint grid
  drawBlueprintGrid(ctx, W, H);

  // ── Left accent bar ──────────────────────────────────────────────
  const barGrad = ctx.createLinearGradient(0, 0, 0, H);
  barGrad.addColorStop(0, "#D4A843");
  barGrad.addColorStop(0.5, "#F0C860");
  barGrad.addColorStop(1, "#B8902A");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, 8, H);

  // ── Side panel (left) ────────────────────────────────────────────
  ctx.fillStyle = "rgba(212,168,67,0.06)";
  ctx.fillRect(0, 0, 220, H);

  // ── Logo area (left panel) ───────────────────────────────────────
  // Hexagon logo placeholder
  ctx.save();
  ctx.translate(110, 90);
  const hex = 36;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const px = hex * Math.cos(angle);
    const py = hex * Math.sin(angle);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const hexGrad = ctx.createLinearGradient(-hex, -hex, hex, hex);
  hexGrad.addColorStop(0, "#D4A843");
  hexGrad.addColorStop(1, "#F0C860");
  ctx.fillStyle = hexGrad;
  ctx.fill();

  // "C" letter inside hex
  ctx.fillStyle = "#0A1628";
  ctx.font = "bold 30px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("C", 0, 0);
  ctx.restore();

  // CIVILIANS text
  ctx.fillStyle = "#F0C860";
  ctx.font = "bold 13px 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("CIVILIANS", 110, 145);

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "8px Arial, sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("PLATFORM PELATIHAN TEKNIK SIPIL", 110, 162);

  // Thin divider in left panel
  drawGoldDivider(ctx, 30, 185, 160);

  // ── Cert label in left panel ─────────────────────────────────────
  ctx.fillStyle = "rgba(212,168,67,0.15)";
  ctx.fillRect(24, 200, 172, 70);
  ctx.strokeStyle = "rgba(212,168,67,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 200, 172, 70);

  ctx.fillStyle = "#F0C860";
  ctx.font = "bold 8px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SERTIFIKAT", 110, 222);
  ctx.fillText("PENYELESAIAN KURSUS", 110, 234);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "7px Arial, sans-serif";
  ctx.fillText("CERTIFICATE OF COMPLETION", 110, 254);

  // ── QR Code (signature area) ─────────────────────────────────────
  const qrData = JSON.stringify({
    id: params.certId,
    name: params.studentName,
    course: params.courseName,
    instructor: params.instructorNames,
    date: new Date(params.completedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
    issued_by: "CIVILIANS Platform",
    verify: `https://civilians.id/verify?cert=${params.certId}`
  });

  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, qrData, {
    width: 140,
    margin: 1,
    color: { dark: "#D4A843", light: "#0A1628" }
  });

  const qrY = 300;
  // QR background
  ctx.fillStyle = "#0A1628";
  ctx.fillRect(35, qrY - 4, 152, 152);
  ctx.strokeStyle = "rgba(212,168,67,0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(35, qrY - 4, 152, 152);
  ctx.drawImage(qrCanvas, 41, qrY + 2, 140, 140);

  // QR caption
  ctx.fillStyle = "rgba(212,168,67,0.7)";
  ctx.font = "bold 7px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SCAN UNTUK VERIFIKASI", 110, qrY + 152);

  // Instructor label below QR
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "7px Arial, sans-serif";
  ctx.fillText("Diterbitkan atas nama:", 110, qrY + 168);

  ctx.fillStyle = "#F0C860";
  ctx.font = "bold 8.5px Arial, sans-serif";
  const instrLines = params.instructorNames.split("&");
  instrLines.forEach((name, i) => {
    ctx.fillText(name.trim(), 110, qrY + 182 + i * 13);
  });

  // ── Main content area (right of left panel) ──────────────────────
  const mainX = 265;
  const mainW = W - mainX - 60;

  // Top eyebrow
  ctx.fillStyle = "rgba(212,168,67,0.15)";
  ctx.fillRect(mainX, 55, mainW, 28);
  ctx.fillStyle = "#D4A843";
  ctx.font = "bold 8px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.letterSpacing = "3px";
  ctx.fillText("SERTIFIKAT PENYELESAIAN KURSUS  ·  CIVILIANS PLATFORM", mainX + 16, 74);
  ctx.letterSpacing = "0px";

  // Main divider
  drawGoldDivider(ctx, mainX, 96, mainW);

  // Presented to label
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "italic 11px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Dengan bangga diberikan kepada:", mainX + mainW / 2, 128);

  // Student name — large and prominent
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 56px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Name shadow for depth
  ctx.shadowColor = "rgba(212,168,67,0.4)";
  ctx.shadowBlur = 22;
  ctx.fillText(params.studentName, mainX + mainW / 2, 200);
  ctx.shadowBlur = 0;

  // Name underline
  const nameWidth = Math.min(ctx.measureText(params.studentName).width, mainW - 60);
  const nameX = mainX + mainW / 2 - nameWidth / 2;
  const underGrad = ctx.createLinearGradient(nameX, 0, nameX + nameWidth, 0);
  underGrad.addColorStop(0, "rgba(212,168,67,0)");
  underGrad.addColorStop(0.5, "#D4A843");
  underGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = underGrad;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(nameX, 210); ctx.lineTo(nameX + nameWidth, 210); ctx.stroke();

  // Completion statement
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "12px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("telah berhasil menyelesaikan kursus pelatihan teknik sipil:", mainX + mainW / 2, 248);

  // Course name — styled in golden box
  const courseBoxPad = 20;
  const courseFont = "bold 17px 'Arial', sans-serif";
  ctx.font = courseFont;
  const courseTextW = Math.min(ctx.measureText(params.courseName).width + courseBoxPad * 2, mainW - 40);
  const courseBoxX = mainX + mainW / 2 - courseTextW / 2;

  // Course box background
  ctx.fillStyle = "rgba(212,168,67,0.12)";
  ctx.beginPath();
  ctx.roundRect(courseBoxX, 265, courseTextW, 44, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(212,168,67,0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(courseBoxX, 265, courseTextW, 44, 6);
  ctx.stroke();

  ctx.fillStyle = "#F0C860";
  ctx.font = "bold 16px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(params.courseName, mainX + mainW / 2, 287, mainW - 60);

  // Category badge
  ctx.fillStyle = "rgba(212,168,67,0.2)";
  const badgeW = 120;
  ctx.fillRect(mainX + mainW / 2 - badgeW / 2, 322, badgeW, 20);
  ctx.fillStyle = "#D4A843";
  ctx.font = "bold 8px Arial, sans-serif";
  ctx.fillText(params.categoryName.toUpperCase(), mainX + mainW / 2, 332, badgeW);

  // Divider
  drawGoldDivider(ctx, mainX, 358, mainW);

  // ── Bottom meta row ──────────────────────────────────────────────
  const metaY = 390;
  const cols = [
    { label: "TANGGAL SELESAI", value: new Date(params.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
    { label: "NO. SERTIFIKAT", value: params.certId },
    { label: "DURASI", value: "2x Pertemuan" },
    { label: "LEVEL KOMPETENSI", value: "Terverifikasi" },
  ];

  const colW = mainW / cols.length;
  cols.forEach((col, i) => {
    const cx = mainX + colW * i + colW / 2 - 10;
    ctx.fillStyle = "rgba(212,168,67,0.6)";
    ctx.font = "bold 7px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.letterSpacing = "1.5px";
    ctx.fillText(col.label, cx - colW / 2 + 20, metaY);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.fillText(col.value, cx - colW / 2 + 20, metaY + 18);

    // Vertical sep
    if (i < cols.length - 1) {
      ctx.strokeStyle = "rgba(212,168,67,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mainX + colW * (i + 1), metaY - 8);
      ctx.lineTo(mainX + colW * (i + 1), metaY + 32);
      ctx.stroke();
    }
  });

  // ── Bottom decorative section ────────────────────────────────────
  drawGoldDivider(ctx, mainX, 438, mainW);

  // Description text
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "italic 10px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Sertifikat ini diterbitkan sebagai bukti resmi penyelesaian program pelatihan teknik sipil yang diselenggarakan oleh CIVILIANS Platform.",
    mainX + mainW / 2, 462, mainW - 20
  );
  ctx.fillText(
    "Scan QR Code untuk memverifikasi keaslian sertifikat ini secara digital.",
    mainX + mainW / 2, 478, mainW - 20
  );

  // ── Blueprint decorative structure (right-bottom) ─────────────────
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#D4A843";
  ctx.lineWidth = 1;
  // simple truss silhouette
  const tx = mainX + mainW - 160, ty = H - 160;
  ctx.beginPath();
  ctx.moveTo(tx, ty + 130); ctx.lineTo(tx + 120, ty + 130); // base
  ctx.moveTo(tx + 60, ty); ctx.lineTo(tx, ty + 130);         // left side
  ctx.moveTo(tx + 60, ty); ctx.lineTo(tx + 120, ty + 130);   // right side
  ctx.moveTo(tx + 30, ty + 65); ctx.lineTo(tx + 90, ty + 65); // mid
  ctx.moveTo(tx + 60, ty); ctx.lineTo(tx + 30, ty + 65);
  ctx.moveTo(tx + 60, ty); ctx.lineTo(tx + 90, ty + 65);
  ctx.stroke();
  ctx.restore();

  // ── Bottom strip ─────────────────────────────────────────────────
  const bottomGrad = ctx.createLinearGradient(0, H - 36, 0, H);
  bottomGrad.addColorStop(0, "rgba(212,168,67,0.05)");
  bottomGrad.addColorStop(1, "rgba(212,168,67,0.15)");
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, H - 36, W, 36);

  ctx.fillStyle = "#D4A843";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, H - 36); ctx.lineTo(W, H - 36); ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "7px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";
  ctx.fillText("CIVILIANS PLATFORM  ·  PELATIHAN PROFESIONAL TEKNIK SIPIL  ·  civilians.id", W / 2, H - 14);
  ctx.letterSpacing = "0px";

  // ── Finish & Download ─────────────────────────────────────────────
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sertifikat-${params.studentName.replace(/\s+/g, "-")}-${params.certId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, "image/png");
}
