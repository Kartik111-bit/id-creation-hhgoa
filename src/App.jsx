import React, { useState, useEffect, useRef } from 'react';
import heic2any from 'heic2any';
import './App.css';

const C = {
  greenBg: '#0B5639',
  greenCard: '#08291B',
  gold: '#F9B828',
  pink: '#D6006E',
  crimson: '#B8003A',
  cyan: '#00F5FF',
  lime: '#39FF14',
  white: '#FFFFFF',
  cardBg: '#B8003A',
  black: '#000000',
  grayText: '#FFE6EA'
};

const titleAdjectives = {
  'Frontend': ['Pixel', 'DOM', 'CSS', 'React', 'Canvas', 'WebGL', 'UI'],
  'Backend': ['API', 'Server', 'Database', 'Cache', 'Queue', 'Graph'],
  'Fullstack': ['Stack', 'Universal', 'Polyglot', 'Swiss Army', 'Architect'],
  'Mobile': ['Native', 'Cross-Platform', 'Gesture', 'Touch', 'Mobile'],
  'DevOps': ['Pipeline', 'Container', 'Cloud', 'Terraform', 'Kubernetes'],
  'Design': ['Pixel', 'Motion', 'Interface', 'Visual', 'Vector'],
  'Product': ['Growth', 'Strategy', 'Vision', 'PMF', 'Vibe'],
  'AI/ML': ['Neural', 'Tensor', 'Model', 'Prompt', 'GenAI'],
  'Blockchain': ['On-Chain', 'Smart Contract', 'Web3', 'Protocol', 'DeFi'],
  'Hardware': ['Embedded', 'IoT', 'Circuit', 'Silicon', 'Robotics'],
  'Other': ['Wildcard', 'Renaissance', 'Hybrid', 'Anomaly', 'Maverick']
};

const titleNouns = {
  'Night Owl': ['Hacker', 'Crafter', 'Wizard', 'Artisan', 'Overlord'],
  'Coffee Addict': ['Brewer', 'Barista', 'Alchemist', 'Fueler', 'Engine'],
  'Beach Bum': ['Surfer', 'Drifter', 'Nomad', 'Explorer', 'Wavemaker'],
  'Code Warrior': ['Knight', 'Champion', 'Guardian', 'Mercenary', 'Slayer'],
  'Bug Hunter': ['Tracker', 'Slayer', 'Detective', 'Ranger', 'Terminator'],
  'Ship It': ['Captain', 'Pilot', 'Commander', 'Astronaut', 'Launcher'],
  'Chill': ['Zen Master', 'Flow Keeper', 'Harmonizer', 'Guru'],
  'Chaos': ['Disruptor', 'Firestarter', 'Rebel', 'Stormbringer', 'Catalyst']
};

export default function App() {
  const [imageObj, setImageObj] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fullName, setFullName] = useState('');
  const [stack, setStack] = useState('');
  const [vibe, setVibe] = useState('');
  const [gender, setGender] = useState('');
  const [github, setGithub] = useState('');
  const [builderTitle, setBuilderTitle] = useState('');
  const [generatedDataUrl, setGeneratedDataUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [countdown, setCountdown] = useState('78D : 02H : 11M : 43S');

  const canvasRef = useRef(null);
  const resultRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date('October 28, 2026 09:00:00').getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const format = (n) => String(n).padStart(2, '0');
        setCountdown(`${days}D : ${format(hours)}H : ${format(minutes)}M : ${format(seconds)}S`);
      }
    };
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  // Update generated title
  useEffect(() => {
    if (stack && vibe) {
      const s = stack || 'Other';
      const v = vibe || 'Ship It';
      const adjs = titleAdjectives[s] || titleAdjectives['Other'];
      const nouns = titleNouns[v] || titleNouns['Ship It'];
      const generated = adjs[Math.floor(Math.random() * adjs.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)];
      setBuilderTitle(generated);
    } else {
      setBuilderTitle('');
    }
  }, [stack, vibe]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'heic' || ext === 'heif') {
      showToast('Converting HEIC image...');
      heic2any({ blob: file, toType: 'image/jpeg' })
        .then((converted) => loadImage(converted))
        .catch(() => showToast('Could not convert HEIC. Try JPG/PNG.'));
    } else {
      loadImage(file);
    }
  };

  const loadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setPreviewUrl(url);
    };
    img.onerror = () => showToast('Invalid image file');
    img.src = url;
  };

  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawStarburst = (ctx, cx, cy, spikes, outerR, innerR, color) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx, y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = C.black;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  };

  const drawBarcode = (ctx, x, y, width, height) => {
    ctx.fillStyle = C.white;
    let currentX = x;
    const endX = x + width;
    while (currentX < endX) {
      const barWidth = Math.floor(Math.random() * 4) + 2;
      const gapWidth = Math.floor(Math.random() * 3) + 2;
      ctx.fillRect(currentX, y, barWidth, height);
      currentX += barWidth + gapWidth;
    }
  };

  const drawLanyardClip = (ctx, cardX, cardY, cardW) => {
    const clipCx = cardX + cardW / 2;
    const clipCy = cardY + 54;

    // Fabric Lanyard Strap (Acid Lime / Yellow)
    ctx.fillStyle = C.lime;
    ctx.fillRect(clipCx - 38, 0, 76, clipCy - 30);
    ctx.strokeStyle = C.black;
    ctx.lineWidth = 4.5;
    ctx.strokeRect(clipCx - 38, 0, 76, clipCy - 30);

    // Rivet Dot
    ctx.fillStyle = C.black;
    ctx.beginPath(); ctx.arc(clipCx, clipCy - 55, 7, 0, Math.PI * 2); ctx.fill();

    // Silver Clasp Ring
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#F3F4F6';
    ctx.beginPath();
    ctx.arc(clipCx, clipCy - 15, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = C.black;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Swivel Hook
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(clipCx - 11, clipCy - 5, 22, 28);
    ctx.strokeStyle = C.black;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(clipCx - 11, clipCy - 5, 22, 28);

    // Slot Hole
    drawRoundedRect(ctx, clipCx - 42, cardY + 40, 84, 28, 14);
    ctx.fillStyle = '#041B12'; ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 4; ctx.stroke();
  };

  // RETRO GOA BACKDROP STICKERS & GRAPHICS
  const drawSealStamp = (ctx, cx, cy, radius) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.1);
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 248, 240, 0.95)'; ctx.fill();
    ctx.strokeStyle = '#0B5639'; ctx.lineWidth = 4.5; ctx.stroke();

    ctx.beginPath(); ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌴', 0, 8);

    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0B5639';
    ctx.fillText('BUILD IN GOA', 0, -radius + 22);
    ctx.fillText('SHIP FROM PARADISE', 0, radius - 12);
    ctx.restore();
  };

  const drawPostageStamp = (ctx, x, y, w, h) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.08);
    drawRoundedRect(ctx, 0, 0, w, h, 8);
    ctx.fillStyle = 'rgba(250, 248, 240, 0.95)'; ctx.fill();
    ctx.strokeStyle = C.pink; ctx.lineWidth = 3.5; ctx.stroke();

    ctx.font = '900 14px "JetBrains Mono", monospace'; ctx.fillStyle = C.crimson;
    ctx.fillText('GOA 2026', 12, 24);
    ctx.font = '32px sans-serif'; ctx.fillText('🌅🌴', w / 2 - 20, h - 14);
    ctx.restore();
  };

  const drawLetsBuildSticker = (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.12);
    drawRoundedRect(ctx, 0, 0, 130, 48, 12);
    ctx.fillStyle = C.gold; ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.font = '900 15px "Playfair Display", serif'; ctx.fillStyle = C.black;
    ctx.textAlign = 'center';
    ctx.fillText("LET'S BUILD!", 65, 30);
    ctx.restore();
  };

  const drawSignpost = (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#8B4513'; ctx.fillRect(40, 0, 12, 160);
    ctx.strokeStyle = C.black; ctx.lineWidth = 2; ctx.strokeRect(40, 0, 12, 160);

    const signs = [
      { text: 'BUILD ➔', bg: C.gold, y: 15 },
      { text: 'SHIP ➔', bg: C.pink, y: 60 },
      { text: 'REPEAT ➔', bg: C.lime, y: 105 }
    ];
    signs.forEach(s => {
      drawRoundedRect(ctx, 0, s.y, 90, 32, 6);
      ctx.fillStyle = s.bg; ctx.fill();
      ctx.strokeStyle = C.black; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.font = '900 12px "JetBrains Mono", monospace'; ctx.fillStyle = C.black;
      ctx.textAlign = 'center'; ctx.fillText(s.text, 45, s.y + 21);
    });
    ctx.restore();
  };

  const drawSurfboards = (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.save(); ctx.rotate(-0.15);
    drawRoundedRect(ctx, 0, 0, 32, 120, 16);
    ctx.fillStyle = C.gold; ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = C.pink; ctx.fillRect(14, 0, 4, 120);
    ctx.restore();

    ctx.save(); ctx.translate(24, 10); ctx.rotate(0.12);
    drawRoundedRect(ctx, 0, 0, 32, 120, 16);
    ctx.fillStyle = C.pink; ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = C.white; ctx.fillRect(14, 0, 4, 120);
    ctx.restore();
    ctx.restore();
  };

  const generateCard = () => {
    if (!imageObj || fullName.trim().length < 2 || !stack || !vibe || !gender) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const W = 1200;
        const H = 1800;
        canvas.width = W;
        canvas.height = H;

        const vibeColors = {
          'Night Owl': C.pink,
          'Coffee Addict': C.gold,
          'Beach Bum': C.lime,
          'Code Warrior': C.cyan,
          'Bug Hunter': C.gold,
          'Ship It': C.pink,
          'Chill': C.lime,
          'Chaos': C.pink
        };

        const photoBgColor = vibeColors[vibe] || C.gold;

        // 1. RETRO-TROPICAL EMERALD GREEN CANVAS BACKDROP (BEHIND CARD)
        const radGrad = ctx.createRadialGradient(W / 2, 400, 50, W / 2, 900, 1200);
        radGrad.addColorStop(0, '#117851');
        radGrad.addColorStop(0.6, '#0B5639');
        radGrad.addColorStop(1, '#052B1C');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);

        // Sunburst Radial Rays Behind Card
        const rayCx = W / 2;
        const rayCy = 900;
        const numRays = 26;
        const rayAngle = (Math.PI * 2) / numRays;
        ctx.fillStyle = 'rgba(249, 184, 40, 0.14)';
        for (let i = 0; i < numRays; i += 2) {
          ctx.beginPath();
          ctx.moveTo(rayCx, rayCy);
          ctx.arc(rayCx, rayCy, 1600, i * rayAngle, (i + 1) * rayAngle);
          ctx.closePath();
          ctx.fill();
        }

        // Giant Background Watermark Text Behind Card
        ctx.font = '900 240px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(249, 184, 40, 0.05)';
        ctx.textAlign = 'right';
        ctx.fillText('HACKER', W + 40, 300);
        ctx.textAlign = 'left';
        ctx.fillText('HOUSE', -40, H - 100);

        // FLOATING STICKERS & RETRO GOA ELEMENTS IN BACKDROP
        drawSealStamp(ctx, 130, 210, 65);
        drawPostageStamp(ctx, W - 180, 160, 120, 85);

        drawLetsBuildSticker(ctx, 35, 760);
        drawSignpost(ctx, W - 145, 720);

        drawSurfboards(ctx, W - 140, 1260);

        // Floating Yellow/Lime Starbursts & Sparkles
        drawStarburst(ctx, 150, 510, 14, 90, 40, C.gold);
        drawStarburst(ctx, 120, 1240, 12, 50, 24, C.lime);

        // Wavy Accent Line Behind Card
        ctx.strokeStyle = 'rgba(249, 184, 40, 0.35)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 1100);
        ctx.bezierCurveTo(300, 1000, 900, 1250, W, 1150);
        ctx.stroke();

        // 2. MAIN LANYARD BADGE CARD (Rich Dark Crimson #B8003A)
        const cardW = 800;
        const cardH = 1460;
        const cardX = (W - cardW) / 2;
        const cardY = 240;

        // 3D Offset Drop Shadow Box
        drawRoundedRect(ctx, cardX + 18, cardY + 18, cardW, cardH, 38);
        ctx.fillStyle = C.black; ctx.fill();

        // Dark Crimson #B8003A Card Fill
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 38);
        ctx.fillStyle = C.crimson; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 6; ctx.stroke();

        // Subtle Card Grid Overlay
        ctx.save();
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 38);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        for (let cx = cardX; cx < cardX + cardW; cx += 32) {
          ctx.beginPath(); ctx.moveTo(cx, cardY); ctx.lineTo(cx, cardY + cardH); ctx.stroke();
        }
        for (let cy = cardY; cy < cardY + cardH; cy += 32) {
          ctx.beginPath(); ctx.moveTo(cardX, cy); ctx.lineTo(cardX + cardW, cy); ctx.stroke();
        }
        ctx.restore();

        // Top Lanyard Metallic Clasp & Slot Hole
        drawLanyardClip(ctx, cardX, cardY, cardW);

        // 3. HEADER INSIDE CARD
        const headerY = cardY + 110;
        const contentX = cardX + 50;

        // Top Sticker Pill: "✦ OFFICIAL BUILDER PASS ✦"
        drawRoundedRect(ctx, contentX, headerY, 360, 44, 12);
        ctx.fillStyle = C.gold; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.font = '900 16px "JetBrains Mono", monospace';
        ctx.fillStyle = C.black;
        ctx.textAlign = 'center';
        ctx.fillText('✦ OFFICIAL BUILDER PASS ✦', contentX + 180, headerY + 28);

        // 2:47 PM STUDIO STAMP — RETRO MARKER DISPLAY FONT STYLE
        const studioX = cardX + cardW - 175;
        const studioY = headerY + 22;
        ctx.save();
        ctx.translate(studioX, studioY);
        ctx.rotate(0.06);

        // Target Circle Ring (Pink 28px, Gold 16px, Black 7px)
        ctx.beginPath(); ctx.arc(112, -26, 28, 0, Math.PI * 2); ctx.fillStyle = C.pink; ctx.fill();
        ctx.beginPath(); ctx.arc(112, -26, 16, 0, Math.PI * 2); ctx.fillStyle = C.gold; ctx.fill();
        ctx.beginPath(); ctx.arc(112, -26, 7, 0, Math.PI * 2); ctx.fillStyle = C.black; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = C.black; ctx.stroke();

        // 2:47PM Headline in 'Permanent Marker', cursive
        ctx.font = '400 58px "Permanent Marker", cursive';
        ctx.fillStyle = C.black;
        ctx.textAlign = 'center';
        ctx.fillText('2:47PM', 3, 15);
        ctx.fillStyle = C.gold;
        ctx.fillText('2:47PM', 0, 12);

        // STUDIO Subtitle in 'Permanent Marker', cursive
        ctx.font = '400 32px "Permanent Marker", cursive';
        ctx.fillStyle = C.black;
        ctx.fillText('STUDIO', 3, 52);
        ctx.fillStyle = C.gold;
        ctx.fillText('STUDIO', 0, 49);
        ctx.restore();

        // HACKER HOUSE Stacked Serif Logo Box
        const logoBoxX = contentX;
        const logoBoxY = headerY + 68;
        const logoBoxW = 340;
        const logoBoxH = 220;

        drawRoundedRect(ctx, logoBoxX, logoBoxY, logoBoxW, logoBoxH, 18);
        ctx.fillStyle = C.black; ctx.fill();
        ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.stroke();

        ctx.font = '900 68px "Playfair Display", serif';
        ctx.fillStyle = C.gold;
        ctx.textAlign = 'left';
        ctx.fillText('HACKER', logoBoxX + 18, logoBoxY + 86);
        ctx.fillText('HOUSE', logoBoxX + 18, logoBoxY + 172);

        // Overlapping Darker Hot Pink Devanagari "गोवा" Sticker Badge
        ctx.save();
        ctx.translate(logoBoxX + logoBoxW / 2 + 10, logoBoxY + logoBoxH / 2 - 4);
        ctx.rotate(-0.16);
        drawRoundedRect(ctx, -62, -28, 124, 56, 12);
        ctx.fillStyle = C.pink; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 4; ctx.stroke();
        ctx.font = '900 34px "Noto Sans Devanagari", sans-serif';
        ctx.fillStyle = C.gold;
        ctx.textAlign = 'center';
        ctx.fillText('गोवा', 0, 11);
        ctx.restore();

        // Date & Location Label
        ctx.font = '800 16px "JetBrains Mono", monospace';
        ctx.fillStyle = C.gold;
        ctx.textAlign = 'left';
        ctx.fillText('GOA, INDIA  ·  28 - 31 OCT 2026', logoBoxX + 4, logoBoxY + logoBoxH + 30);

        // 4. LEFT SIDEBAR NEON TOOL BADGES (STACK ICONS)
        const iconsY = logoBoxY + logoBoxH + 65;
        const iconsX = contentX;
        const icons = [
          { symbol: '⚡', bg: C.gold },
          { symbol: '🏖️', bg: C.cyan },
          { symbol: '🌴', bg: C.pink },
          { symbol: '🚀', bg: C.lime },
          { symbol: '🔥', bg: C.gold }
        ];

        icons.forEach((ic, i) => {
          const iy = iconsY + (i * 64);
          drawRoundedRect(ctx, iconsX, iy, 44, 44, 10);
          ctx.fillStyle = ic.bg; ctx.fill();
          ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ic.symbol, iconsX + 22, iy + 30);
        });

        // 5. LARGE PORTRAIT PHOTO WITH VIBRANT BACKDROP & OVERLAY BADGES
        const photoSize = 500;
        const photoX = cardX + cardW - photoSize - 35;
        const photoY = iconsY - 10;

        // 3D Black Drop Shadow Box
        drawRoundedRect(ctx, photoX + 10, photoY + 10, photoSize, photoSize, 32);
        ctx.fillStyle = C.black; ctx.fill();

        // Vibrant Photo Backdrop
        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.fillStyle = photoBgColor; ctx.fill();

        const imgAspect = imageObj.width / imageObj.height;
        let sx, sy, sW, sH;
        if (imgAspect > 1) { sH = imageObj.height; sW = sH; sx = (imageObj.width - sW) / 2; sy = 0; }
        else { sW = imageObj.width; sH = sW; sx = 0; sy = (imageObj.height - sH) / 2; }

        ctx.save();
        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.clip();
        ctx.drawImage(imageObj, sx, sy, sW, sH, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        // Thick Black Frame Outline around Photo
        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.strokeStyle = C.black; ctx.lineWidth = 5.5; ctx.stroke();

        // TOP PHOTO OVERLAY STICKER: "★ VERIFIED BUILDER"
        const topTagX = photoX + 20;
        const topTagY = photoY - 14;
        drawRoundedRect(ctx, topTagX + 3, topTagY + 3, 215, 38, 10);
        ctx.fillStyle = C.black; ctx.fill();
        drawRoundedRect(ctx, topTagX, topTagY, 215, 38, 10);
        ctx.fillStyle = C.gold; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.font = '900 14px "JetBrains Mono", monospace';
        ctx.fillStyle = C.black;
        ctx.textAlign = 'center';
        ctx.fillText('★ VERIFIED BUILDER', topTagX + 107, topTagY + 24);

        // BOTTOM PHOTO OVERLAY STICKER: "ACCESS ALL AREAS // 26"
        const botTagX = photoX + photoSize - 235;
        const botTagY = photoY + photoSize - 22;
        drawRoundedRect(ctx, botTagX + 3, botTagY + 3, 225, 38, 10);
        ctx.fillStyle = C.black; ctx.fill();
        drawRoundedRect(ctx, botTagX, botTagY, 225, 38, 10);
        ctx.fillStyle = C.cyan; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.font = '900 12px "JetBrains Mono", monospace';
        ctx.fillStyle = C.black;
        ctx.textAlign = 'center';
        ctx.fillText('ACCESS ALL AREAS // 26', botTagX + 112, botTagY + 24);

        // 6. BUILDER NAME & SUBTITLE
        const nameY = photoY + photoSize + 54;
        const rawName = fullName.trim();
        let nameFontSize = 58;
        if (rawName.length > 18) nameFontSize = 42;
        else if (rawName.length > 14) nameFontSize = 48;

        ctx.font = `900 ${nameFontSize}px "Playfair Display", serif`;
        const nameWidth = ctx.measureText(rawName).width;

        // Warm Gold Underline Highlight Banner
        drawRoundedRect(ctx, contentX - 6, nameY + 6, Math.min(nameWidth + 16, 360), 14, 6);
        ctx.fillStyle = C.gold; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 2.5; ctx.stroke();

        // 3D Offset Black Shadow for Name Text
        ctx.fillStyle = C.black;
        ctx.textAlign = 'left';
        ctx.fillText(rawName, contentX + 3, nameY + 3);

        // Giant Crisp White Name Text
        ctx.fillStyle = C.white;
        ctx.fillText(rawName, contentX, nameY);

        ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = C.gold;
        ctx.fillText('Hacker House Goa  ·  Builder Pass', contentX, nameY + 36);

        // 7. SIDE-BY-SIDE "PRIMARY STACK" (CYAN) AND "VIBE CHECK" (PINK) RETRO PILL BADGES FROM USER SCREENSHOT
        const stackVibeY = nameY + 50;
        const pillW = 168;
        const pillH = 58;
        const gap = 14;

        // PILL 1: PRIMARY STACK (Cyan Border & Dark Fill)
        const p1X = contentX;
        drawRoundedRect(ctx, p1X + 4, stackVibeY + 4, pillW, pillH, 14);
        ctx.fillStyle = C.black; ctx.fill();

        drawRoundedRect(ctx, p1X, stackVibeY, pillW, pillH, 14);
        ctx.fillStyle = '#001920'; ctx.fill();
        ctx.strokeStyle = C.cyan; ctx.lineWidth = 3.5; ctx.stroke();

        ctx.font = '900 10px "JetBrains Mono", monospace';
        ctx.fillStyle = C.cyan;
        ctx.textAlign = 'center';
        ctx.fillText('✦ PRIMARY STACK', p1X + pillW / 2, stackVibeY + 20);

        ctx.font = '900 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = C.white;
        ctx.fillText((stack || 'MOBILE').toUpperCase(), p1X + pillW / 2, stackVibeY + 44);

        // PILL 2: VIBE CHECK (Hot Pink Border & Dark Fill)
        const p2X = contentX + pillW + gap;
        drawRoundedRect(ctx, p2X + 4, stackVibeY + 4, pillW, pillH, 14);
        ctx.fillStyle = C.black; ctx.fill();

        drawRoundedRect(ctx, p2X, stackVibeY, pillW, pillH, 14);
        ctx.fillStyle = '#220014'; ctx.fill();
        ctx.strokeStyle = C.pink; ctx.lineWidth = 3.5; ctx.stroke();

        ctx.font = '900 10px "JetBrains Mono", monospace';
        ctx.fillStyle = C.pink;
        ctx.textAlign = 'center';
        ctx.fillText('🍺 VIBE CHECK', p2X + pillW / 2, stackVibeY + 20);

        ctx.font = '900 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = C.white;
        ctx.fillText((vibe || 'CHILL').toUpperCase(), p2X + pillW / 2, stackVibeY + 44);

        // 8. ★ BUILDER TITLE BADGE (MATCHING SCREENSHOT)
        const badgeTitleText = '★ ' + (builderTitle || 'On-Chain Surfer');
        const badgeY = stackVibeY + pillH + 18;
        ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
        const badgeTextWidth = ctx.measureText(badgeTitleText).width;
        const badgeW = Math.max(340, badgeTextWidth + 44);
        const badgeH = 48;

        drawRoundedRect(ctx, contentX + 4, badgeY + 4, badgeW, badgeH, 16);
        ctx.fillStyle = C.black; ctx.fill();

        drawRoundedRect(ctx, contentX, badgeY, badgeW, badgeH, 16);
        ctx.fillStyle = '#1A0018'; ctx.fill();

        ctx.strokeStyle = C.pink; ctx.lineWidth = 3.5; ctx.stroke();

        ctx.fillStyle = C.white;
        ctx.textAlign = 'left';
        ctx.fillText(badgeTitleText, contentX + 22, badgeY + 32);

        // 9. BOTTOM BARCODE + TAGLINE SECTION
        const bottomY = cardY + cardH - 110;
        drawBarcode(ctx, contentX, bottomY, 260, 56);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(contentX + 300, bottomY - 10);
        ctx.lineTo(contentX + 300, bottomY + 66);
        ctx.stroke();

        ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = C.white;
        ctx.fillText('Code is intelligence', contentX + 325, bottomY + 20);
        ctx.fillText('made visible. #FrameInGoa', contentX + 325, bottomY + 46);

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setGeneratedDataUrl(dataUrl);
        setIsGenerating(false);

        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);

      } catch (err) {
        console.error(err);
        showToast('Error generating pass. Please try again.');
        setIsGenerating(false);
      }
    }, 100);
  };

  const isFormValid = imageObj && fullName.trim().length >= 2 && stack && vibe && gender;

  return (
    <div className="app-container">
      <div className="bg-watermark wm-top">HACKER</div>
      <div className="bg-watermark wm-bottom">HOUSE</div>

      {/* Retro Goa Background Stickers in Web UI */}
      <div className="floating-sticker fs-1">🌴</div>
      <div className="floating-sticker fs-2">🏄‍♂️</div>
      <div className="floating-sticker fs-3">🛵</div>
      <div className="floating-sticker fs-4">⚡</div>

      <div className="container">
        <header className="header">
          {/* Top Row: Studio Brand & Countdown Pill */}
          <div className="header-top-row">
            <div className="studio-brand">
              <div className="studio-title">2:47PM</div>
              <div className="studio-subtitle">STUDIO</div>
            </div>

            <div className="countdown-pill">
              <div className="countdown-label">✦ GOA 2026 IN</div>
              <div className="countdown-timer">{countdown}</div>
            </div>
          </div>

          {/* Middle Header Pill */}
          <div className="middle-header-pill">
            HACKER HOUSE GOA 2026 · OFFICIAL BUILDER PASS ✦
          </div>

          {/* Hero Stacked Title + Hot Pink Devanagari Goa Sticker */}
          <div className="hero-title-box">
            <h1 className="hero-title">
              HACKER<br />HOUSE
            </h1>
            <div className="devanagari-sticker">गोवा</div>
          </div>

          {/* Location Badge Pill */}
          <div>
            <div className="location-pill">
              GOA, INDIA  ·  28 - 31 OCT 2026
            </div>
          </div>

          <p className="sub-caption">
            Upload your portrait photo, customize your official retro-tropical builder pass with automated builder title, and share with <span className="highlight-hashtag">#FrameInGoa</span>.
          </p>
        </header>

        <div className="card">
          <div className="card-title"><span className="icon">📸</span>Step 1: Upload Portrait Photo</div>
          <div className={`upload-zone ${previewUrl ? 'has-image' : ''}`}>
            <input type="file" accept="image/*,.heic,.heif" onChange={handleFileChange} />
            {previewUrl ? (
              <>
                <img src={previewUrl} className="upload-preview" alt="Preview" />
                <div className="upload-change">Change Photo</div>
              </>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">🏖️</div>
                <div className="upload-text">Tap or Drag Photo Here</div>
                <div className="upload-hint">JPG · PNG · HEIC (iPhone)</div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title"><span className="icon">✏️</span>Step 2: Builder Info</div>
          <div className="field-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              maxLength={26}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Stack / Role</label>
              <select value={stack} onChange={(e) => setStack(e.target.value)}>
                <option value="">Pick Stack...</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Hardware">Hardware</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="field-group">
              <label>Vibe Check</label>
              <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
                <option value="">Pick Vibe...</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Coffee Addict">Coffee Addict</option>
                <option value="Beach Bum">Beach Bum</option>
                <option value="Code Warrior">Code Warrior</option>
                <option value="Bug Hunter">Bug Hunter</option>
                <option value="Ship It">Ship It</option>
                <option value="Chill">Chill</option>
                <option value="Chaos">Chaos</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="field-group">
              <label>GitHub / X Handle</label>
              <input
                type="text"
                placeholder="@username"
                maxLength={24}
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>
          </div>

          {builderTitle && (
            <div className="title-preview">
              <div className="title-preview-value">★ {builderTitle}</div>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={generateCard} disabled={!isFormValid || isGenerating}>
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              <span>CRAFTING 1200×1800 PASS...</span>
            </>
          ) : (
            <span>GENERATE ID CARD 🌴</span>
          )}
        </button>

        {generatedDataUrl && (
          <div className="result-section visible" ref={resultRef}>
            <div className="result-card-wrapper">
              <img id="generatedCard" src={generatedDataUrl} alt="Hacker House Goa 2026 Pass" />
            </div>

            <div className="action-buttons">
              <a
                className="btn btn-primary"
                href={generatedDataUrl}
                download={`HackerHouse-Goa-2026-${fullName.trim().replace(/\s+/g, '-')}-Pass.png`}
                onClick={() => showToast('Pass Downloaded! ⚡')}
              >
                <span>⬇️ Download High-Res Pass</span>
              </a>

              <button
                className="btn btn-x"
                onClick={() => {
                  const text = `Just generated my official Lanyard Badge for Hacker House Goa 2026! ⚡✦\n\nName: ${fullName}\nStack: ${stack}\nTitle: ★ ${builderTitle}\n\n#FrameInGoa @hh_goa`;
                  navigator.clipboard.writeText(text);
                  showToast('Caption copied! Opening X...');
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                <span>𝕏 Share to X (#FrameInGoa)</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setGeneratedDataUrl(null);
                  setImageObj(null);
                  setPreviewUrl(null);
                  setFullName('');
                  setStack('');
                  setVibe('');
                  setGender('');
                  setGithub('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>↺ Create Another Badge</span>
              </button>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Hacker House <span className="hashtag">#FrameInGoa</span> · Goa, India ⚡</p>
        </footer>
      </div>

      {toastMsg && <div className="toast show">{toastMsg}</div>}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
