export interface CertificateParams {
  studentName: string;
  courseName: string;
  categoryName: string;
  instructorNames: string;
  completedAt: string; // ISO string
  certId: string;
  instructorSignatures?: string[];
}

// ── New Design Utilities ──────────────────────────────────────────

function drawCornerPatterns(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  
  // Colors
  const darkBlue = "#1E40AF";
  const midBlue = "#3B82F6";
  const lightBlue = "#DBEAFE";

  // Top Left - Cascading Arcs
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = darkBlue;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 240, 0, Math.PI / 2);
  ctx.fill();

  ctx.fillStyle = midBlue;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 180, 0, Math.PI / 2);
  ctx.fill();

  ctx.fillStyle = lightBlue;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 120, 0, Math.PI / 2);
  ctx.fill();

  // Top Right - Cascading Arcs (Mirrored)
  ctx.fillStyle = darkBlue;
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.arc(w, 0, 240, Math.PI / 2, Math.PI);
  ctx.fill();

  ctx.fillStyle = midBlue;
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.arc(w, 0, 180, Math.PI / 2, Math.PI);
  ctx.fill();

  ctx.fillStyle = lightBlue;
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.arc(w, 0, 120, Math.PI / 2, Math.PI);
  ctx.fill();

  // Bottom Left - Sharp Geometric
  ctx.globalAlpha = 1;
  ctx.fillStyle = darkBlue;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(180, h);
  ctx.lineTo(0, h - 140);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = midBlue;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(120, h);
  ctx.lineTo(0, h - 80);
  ctx.closePath();
  ctx.fill();

  // Bottom Right - Sharp Geometric
  ctx.fillStyle = darkBlue;
  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 180, h);
  ctx.lineTo(w, h - 140);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = midBlue;
  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 120, h);
  ctx.lineTo(w, h - 80);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawElegantFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 1.5;
  const margin = 40;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
  
  // Inner thinner frame
  ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
  ctx.lineWidth = 0.5;
  const marginInner = 50;
  ctx.strokeRect(marginInner, marginInner, w - marginInner * 2, h - marginInner * 2);
  ctx.restore();
}

function drawTrophy(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  // Wreath (Leaf pattern)
  ctx.strokeStyle = "#B59410";
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Left wreath
  ctx.arc(-35, 0, 40, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  // Right wreath
  ctx.beginPath();
  ctx.arc(35, 0, 40, Math.PI * 1.5, Math.PI * 2.5);
  ctx.stroke();

  // Trophy Cup
  const gold = "#D4AF37";
  ctx.fillStyle = gold;
  
  // Base
  ctx.fillRect(-15, 30, 30, 5);
  ctx.fillRect(-8, 20, 16, 10);
  
  // Cup body
  ctx.beginPath();
  ctx.moveTo(-18, -15);
  ctx.lineTo(18, -15);
  ctx.lineTo(12, 20);
  ctx.lineTo(-12, 20);
  ctx.closePath();
  ctx.fill();
  
  // Handles
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-18, 0, 8, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(18, 0, 8, Math.PI * 1.5, Math.PI * 2.5);
  ctx.stroke();

  ctx.restore();
}

function drawDivider(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
  
  // Diamond in center
  ctx.fillStyle = "#64748B";
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-3, -3, 6, 6);
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
  const W = 1122; // A4 Landscape roughly
  const H = 794;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── 1. Background (Clean Light) ──────────────────────────────────
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  
  // Subtle gradient overlay
  const bgGrad = ctx.createRadialGradient(W/2, H/2, 100, W/2, H/2, W/2);
  bgGrad.addColorStop(0, "rgba(255,255,255,0)");
  bgGrad.addColorStop(1, "rgba(241, 245, 249, 0.6)");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── 2. Decorative Patterns & Frame ───────────────────────────────
  drawCornerPatterns(ctx, W, H);
  drawElegantFrame(ctx, W, H);

  // ── 3. Main Content (Centered) ───────────────────────────────────
  const centerX = W / 2;
  
  // Header: CERTIFICATE
  ctx.textAlign = "center";
  ctx.fillStyle = "#1E40AF";
  ctx.font = "bold 72px 'Playfair Display', serif";
  ctx.fillText("CERTIFICATE", centerX, 180);

  // Subheader: OF APPRECIATION
  ctx.fillStyle = "#475569";
  ctx.font = "bold 18px 'Inter', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("OF APPRECIATION", centerX, 220);
  ctx.letterSpacing = "0px";

  // Decorative Divider
  drawDivider(ctx, centerX, 260, 400);

  // Intro text
  ctx.fillStyle = "#64748B";
  ctx.font = "500 16px 'Inter', sans-serif";
  ctx.fillText("This certificate is proudly awarded to", centerX, 310);

  // Recipient Name
  ctx.fillStyle = "#1E3A8A";
  ctx.font = "italic 60px 'Playfair Display', serif";
  ctx.fillText(params.studentName, centerX, 385);

  // Horizontal line under name
  ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 250, 400);
  ctx.lineTo(centerX + 250, 400);
  ctx.stroke();

  // Course Description
  ctx.fillStyle = "#475569";
  ctx.font = "500 15px 'Inter', sans-serif";
  const courseText = `For successfully completing the ${params.categoryName} course:`;
  ctx.fillText(courseText, centerX, 440);

  // Course Title (More prominent)
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 22px 'Inter', sans-serif";
  ctx.fillText(params.courseName, centerX, 475);

  const dateStr = new Date(params.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = "#64748B";
  ctx.font = "500 14px 'Inter', sans-serif";
  ctx.fillText(`on ${dateStr}`, centerX, 505);

  // ── 4. Trophy Icon (Bottom Center) ──────────────────────────────
  drawTrophy(ctx, centerX, 650);

  // ── 5. Signatures (Dynamic based on Mentors) ─────────────────────
  // Parse mentors from instructorNames (split by '&' or ',')
  const mentors = params.instructorNames.split(/[&,]/).map(m => m.trim()).filter(m => m !== "");
  
  const sigY = 680;
  const sigWidth = 200;
  const sigSideMargin = 220;

   // Function to draw a single signature block
   const drawSignature = async (name: string, xpx: number, signatureUrl?: string) => {
     ctx.save();
 
     // ── Signature Image or Text ──
     if (signatureUrl) {
       try {
         const img = new Image();
         img.crossOrigin = "anonymous";
         img.src = signatureUrl;
         await new Promise((resolve, reject) => {
           img.onload = resolve;
           img.onerror = reject;
         });
         
         // Draw signature image
         const sigImgW = 400; // Massively enlarged
         const sigImgH = 220; // Massively enlarged
         const ratio = img.width / img.height;
         let drawW = sigImgW;
         let drawH = sigImgW / ratio;
         if (drawH > sigImgH) {
           drawH = sigImgH;
           drawW = sigImgH * ratio;
         }
         
         ctx.drawImage(img, xpx - drawW / 2, sigY - 170, drawW, drawH);
       } catch (e) {
         console.warn("Failed to load signature image, falling back to text:", e);
         // Fallback to text
         ctx.fillStyle = "#1E40AF";
         ctx.font = "400 32px 'Dancing Script', cursive";
         ctx.textAlign = "center";
         ctx.fillText(name, xpx, sigY - 20);
       }
     } else {
       // Signature text (Elegant Script) - Fallback
       ctx.fillStyle = "#1E40AF";
       ctx.font = "400 32px 'Dancing Script', cursive";
       ctx.textAlign = "center";
       ctx.fillText(name, xpx, sigY - 20);
     }
 
     // Line
     ctx.strokeStyle = "#94A3B8";
     ctx.lineWidth = 1;
     ctx.beginPath();
     ctx.moveTo(xpx - sigWidth/2, sigY);
     ctx.lineTo(xpx + sigWidth/2, sigY);
     ctx.stroke();
 
     // Mentor Name (Print)
     ctx.fillStyle = "#0F172A";
     ctx.font = "bold 14px 'Inter', sans-serif";
     ctx.fillText(name, xpx, sigY + 25);
 
     // Role
     ctx.fillStyle = "#64748B";
     ctx.font = "bold 10px 'Inter', sans-serif";
     ctx.letterSpacing = "1px";
     ctx.fillText("MENTOR", xpx, sigY + 40);
     ctx.restore();
   };
 
   if (mentors.length >= 2) {
     // Two mentors: Left and Right
     await drawSignature(mentors[0], sigSideMargin, params.instructorSignatures?.[0]);
     await drawSignature(mentors[1], W - sigSideMargin, params.instructorSignatures?.[1]);
   } else if (mentors.length === 1) {
     // One mentor: Left side, and a default "Civilians Admin" on the right
     await drawSignature(mentors[0], sigSideMargin, params.instructorSignatures?.[0]);
     await drawSignature("Civilians Admin", W - sigSideMargin);
   } else {
     // Fallback if no mentors found
     await drawSignature("Course Instructor", sigSideMargin);
     await drawSignature("Civilians Admin", W - sigSideMargin);
   }

  // ── 6. Certificate ID (Small/Discreet) ───────────────────────────
  ctx.fillStyle = "rgba(100, 116, 139, 0.4)";
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Verified Cert ID: ${params.certId}`, 60, H - 25);

  // ── 7. Finish & Download ─────────────────────────────────────────
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
