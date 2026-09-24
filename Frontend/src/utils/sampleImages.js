// Helper to generate realistic high-resolution specimen images on canvas
// for instant 1-click interactive testing without needing manual upload

export const generateSampleLeafDataUrl = (type) => {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 400, 400);

  // Draw Leaf Base (Potato Leaf Shape)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(200, 40);
  ctx.bezierCurveTo(340, 80, 360, 260, 200, 370);
  ctx.bezierCurveTo(40, 260, 60, 80, 200, 40);
  ctx.closePath();

  // Foliage Green Gradient
  const leafGrad = ctx.createLinearGradient(100, 40, 300, 370);
  if (type === "healthy") {
    leafGrad.addColorStop(0, "#22c55e");
    leafGrad.addColorStop(0.5, "#16a34a");
    leafGrad.addColorStop(1, "#15803d");
  } else if (type === "early_blight") {
    leafGrad.addColorStop(0, "#84cc16");
    leafGrad.addColorStop(0.4, "#65a30d");
    leafGrad.addColorStop(1, "#4d7c0f");
  } else {
    // late blight
    leafGrad.addColorStop(0, "#4ade80");
    leafGrad.addColorStop(0.5, "#22c55e");
    leafGrad.addColorStop(1, "#166534");
  }

  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Central Vein and Lateral Veins
  ctx.beginPath();
  ctx.moveTo(200, 40);
  ctx.quadraticCurveTo(202, 200, 200, 370);
  ctx.strokeStyle = "#86efac";
  ctx.lineWidth = 3;
  ctx.stroke();

  for (let y = 90; y < 330; y += 35) {
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.quadraticCurveTo(250, y - 10, 310, y - 25);
    ctx.moveTo(200, y);
    ctx.quadraticCurveTo(150, y - 10, 90, y - 25);
    ctx.strokeStyle = "rgba(134, 239, 172, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw Pathogen Lesions based on type
  if (type === "early_blight") {
    // Concentric Target / Bulls-eye spots
    const spots = [
      { x: 150, y: 150, r: 24 },
      { x: 250, y: 220, r: 28 },
      { x: 170, y: 280, r: 18 },
      { x: 260, y: 130, r: 16 },
    ];

    spots.forEach((s) => {
      // Yellow chlorotic halo
      const halo = ctx.createRadialGradient(s.x, s.y, s.r * 0.4, s.x, s.y, s.r * 1.5);
      halo.addColorStop(0, "rgba(234, 179, 8, 0.7)");
      halo.addColorStop(1, "rgba(234, 179, 8, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Concentric dark rings
      for (let cr = s.r; cr > 3; cr -= 5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, cr, 0, Math.PI * 2);
        ctx.fillStyle = cr % 10 === 0 ? "#78350f" : "#92400e";
        ctx.fill();
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  } else if (type === "late_blight") {
    // Water-soaked dark brown/black blotches with white halo
    const blotches = [
      { x: 180, y: 130, rx: 45, ry: 30, rot: 0.3 },
      { x: 240, y: 250, rx: 55, ry: 40, rot: -0.2 },
      { x: 130, y: 230, rx: 35, ry: 25, rot: 0.5 },
    ];

    blotches.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);

      // Pale mold margin
      const moldGrad = ctx.createRadialGradient(0, 0, b.rx * 0.6, 0, 0, b.rx * 1.3);
      moldGrad.addColorStop(0, "#1c1917");
      moldGrad.addColorStop(0.7, "#292524");
      moldGrad.addColorStop(0.9, "#e7e5e4");
      moldGrad.addColorStop(1, "transparent");

      ctx.fillStyle = moldGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.rx * 1.2, b.ry * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dark necrotic core
      ctx.fillStyle = "#0c0a09";
      ctx.beginPath();
      ctx.ellipse(0, 0, b.rx * 0.7, b.ry * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  ctx.restore();
  return canvas.toDataURL("image/jpeg", 0.95);
};

export const generateSampleLeafFile = (type) => {
  const dataUrl = generateSampleLeafDataUrl(type);
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const filename = `sample_${type}_specimen.jpg`;
  return {
    file: new File([u8arr], filename, { type: mime }),
    dataUrl,
  };
};

export const sampleSpecimensList = [
  {
    id: "sample_healthy",
    name: "Healthy Foliage Sample",
    type: "healthy",
    label: "Healthy Baseline",
    badgeClass: "healthy",
  },
  {
    id: "sample_early",
    name: "Early Blight Sample",
    type: "early_blight",
    label: "Early Blight (Alternaria)",
    badgeClass: "early",
  },
  {
    id: "sample_late",
    name: "Late Blight Sample",
    type: "late_blight",
    label: "Late Blight (Phytophthora)",
    badgeClass: "late",
  },
];
