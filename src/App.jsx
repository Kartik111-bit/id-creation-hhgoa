import React, { useState, useEffect, useRef } from 'react';
import heic2any from 'heic2any';
import Lanyard from './components/Lanyard';
import './App.css';

const C = {
  yellow: '#FFE600',
  pink: '#FF007F',
  cyan: '#00F5FF',
  lime: '#39FF14',
  purpleBg: '#11002C',
  purpleCard: '#1D0047',
  cardCream: '#FAF8F0',
  white: '#FFFFFF',
  black: '#000000',
  grayText: '#AAAAAA'
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
  'Blockchain': ['Smart Contract', 'On-Chain', 'Web3', 'Protocol', 'DeFi'],
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

        const themeMap = {
          'Night Owl': { cardBg: '#1C003D', textColor: '#FFFFFF', subColor: '#00F5FF', photoBg: C.pink },
          'Coffee Addict': { cardBg: '#2B1408', textColor: '#FFFFFF', subColor: '#FFE600', photoBg: C.yellow },
          'Beach Bum': { cardBg: '#09331D', textColor: '#FFFFFF', subColor: '#F9B828', photoBg: C.lime },
          'Code Warrior': { cardBg: '#051923', textColor: '#FFFFFF', subColor: '#00F5FF', photoBg: C.cyan },
          'Bug Hunter': { cardBg: '#2D1F00', textColor: '#FFFFFF', subColor: '#FFE600', photoBg: C.yellow },
          'Ship It': { cardBg: '#1E0040', textColor: '#FFFFFF', subColor: '#00F5FF', photoBg: C.pink },
          'Chill': { cardBg: '#082419', textColor: '#FFFFFF', subColor: '#39FF14', photoBg: C.lime },
          'Chaos': { cardBg: '#3D0022', textColor: '#FFFFFF', subColor: '#FFE600', photoBg: C.pink }
        };

        const t = themeMap[vibe] || themeMap['Beach Bum'];

        // Outer Backdrop
        ctx.fillStyle = C.purpleBg;
        ctx.fillRect(0, 0, W, H);

        // Sunburst Rays
        const rayCx = W / 2;
        const rayCy = 950;
        const numRays = 26;
        const rayAngle = (Math.PI * 2) / numRays;
        ctx.fillStyle = 'rgba(255, 0, 127, 0.22)';
        for (let i = 0; i < numRays; i += 2) {
          ctx.beginPath();
          ctx.moveTo(rayCx, rayCy);
          ctx.arc(rayCx, rayCy, 1600, i * rayAngle, (i + 1) * rayAngle);
          ctx.closePath();
          ctx.fill();
        }

        // Main Card
        const cardW = 800;
        const cardH = 1460;
        const cardX = (W - cardW) / 2;
        const cardY = 240;

        drawRoundedRect(ctx, cardX + 18, cardY + 18, cardW, cardH, 38);
        ctx.fillStyle = C.black; ctx.fill();

        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 38);
        ctx.fillStyle = t.cardBg; ctx.fill();
        ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.stroke();

        // Card Grid Overlay
        ctx.save();
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 38);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1.5;
        for (let cx = cardX; cx < cardX + cardW; cx += 32) {
          ctx.beginPath(); ctx.moveTo(cx, cardY); ctx.lineTo(cx, cardY + cardH); ctx.stroke();
        }
        for (let cy = cardY; cy < cardY + cardH; cy += 32) {
          ctx.beginPath(); ctx.moveTo(cardX, cy); ctx.lineTo(cardX + cardW, cy); ctx.stroke();
        }
        ctx.restore();

        // Header
        const headerY = cardY + 110;
        const contentX = cardX + 50;

        drawRoundedRect(ctx, contentX, headerY, 360, 44, 12);
        ctx.fillStyle = C.yellow; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.font = '900 16px "JetBrains Mono", monospace';
        ctx.fillStyle = C.black;
        ctx.textAlign = 'center';
        ctx.fillText('✦ OFFICIAL BUILDER PASS ✦', contentX + 180, headerY + 28);

        // 2:47 PM STUDIO Target
        const studioX = cardX + cardW - 140;
        const studioY = headerY + 15;
        ctx.save();
        ctx.translate(studioX, studioY);
        ctx.rotate(0.06);
        ctx.beginPath(); ctx.arc(45, -12, 14, 0, Math.PI * 2); ctx.fillStyle = C.pink; ctx.fill();
        ctx.beginPath(); ctx.arc(45, -12, 8, 0, Math.PI * 2); ctx.fillStyle = C.yellow; ctx.fill();
        ctx.beginPath(); ctx.arc(45, -12, 3, 0, Math.PI * 2); ctx.fillStyle = C.black; ctx.fill();

        ctx.font = '900 28px "JetBrains Mono", monospace';
        ctx.fillStyle = C.yellow;
        ctx.textAlign = 'center';
        ctx.fillText('2:47PM', 0, 8);
        ctx.font = '900 15px "JetBrains Mono", monospace';
        ctx.fillText('STUDIO', 0, 28);
        ctx.restore();

        // Logo Box
        const logoBoxX = contentX;
        const logoBoxY = headerY + 62;
        const logoBoxW = 340;
        const logoBoxH = 220;

        drawRoundedRect(ctx, logoBoxX, logoBoxY, logoBoxW, logoBoxH, 18);
        ctx.fillStyle = C.black; ctx.fill();
        ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.stroke();

        ctx.font = '900 68px "Playfair Display", serif';
        ctx.fillStyle = C.yellow;
        ctx.textAlign = 'left';
        ctx.fillText('HACKER', logoBoxX + 18, logoBoxY + 86);
        ctx.fillText('HOUSE', logoBoxX + 18, logoBoxY + 172);

        // Devanagari Goa Sticker
        ctx.save();
        ctx.translate(logoBoxX + logoBoxW / 2 + 10, logoBoxY + logoBoxH / 2 - 4);
        ctx.rotate(-0.16);
        drawRoundedRect(ctx, -62, -28, 124, 56, 12);
        ctx.fillStyle = C.pink; ctx.fill();
        ctx.strokeStyle = C.black; ctx.lineWidth = 4; ctx.stroke();
        ctx.font = '900 34px "Noto Sans Devanagari", sans-serif';
        ctx.fillStyle = C.yellow;
        ctx.textAlign = 'center';
        ctx.fillText('गोवा', 0, 11);
        ctx.restore();

        ctx.font = '800 16px "JetBrains Mono", monospace';
        ctx.fillStyle = t.subColor;
        ctx.textAlign = 'left';
        ctx.fillText('GOA, INDIA  ·  28 - 31 OCT 2026', logoBoxX + 4, logoBoxY + logoBoxH + 30);

        // Stack Icons Sidebar
        const iconsY = logoBoxY + logoBoxH + 65;
        const iconsX = contentX;
        const icons = [
          { symbol: '⚡', bg: C.yellow },
          { symbol: '🏖️', bg: C.cyan },
          { symbol: '🌴', bg: C.pink },
          { symbol: '🚀', bg: C.lime },
          { symbol: '🔥', bg: C.yellow }
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

        // Photo Frame
        const photoSize = 470;
        const photoX = cardX + cardW - photoSize - 50;
        const photoY = iconsY;

        drawRoundedRect(ctx, photoX + 8, photoY + 8, photoSize, photoSize, 32);
        ctx.fillStyle = C.black; ctx.fill();

        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.fillStyle = t.photoBg; ctx.fill();

        const imgAspect = imageObj.width / imageObj.height;
        let sx, sy, sW, sH;
        if (imgAspect > 1) { sH = imageObj.height; sW = sH; sx = (imageObj.width - sW) / 2; sy = 0; }
        else { sW = imageObj.width; sH = sW; sx = 0; sy = (imageObj.height - sH) / 2; }

        ctx.save();
        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.clip();
        ctx.drawImage(imageObj, sx, sy, sW, sH, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 32);
        ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.stroke();

        // Name
        const nameY = photoY + photoSize + 60;
        ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
        const nameWidth = ctx.measureText(fullName.trim()).width;

        ctx.fillStyle = C.yellow;
        ctx.fillRect(contentX, nameY + 6, Math.min(nameWidth, 340), 16);

        ctx.fillStyle = t.textColor;
        ctx.textAlign = 'left';
        ctx.fillText(fullName.trim(), contentX, nameY);

        ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = t.subColor;
        ctx.fillText(stack.toUpperCase() + ' Builder  ·  Hacker House Goa', contentX, nameY + 44);

        // Barcode & Tagline
        const bottomY = cardY + cardH - 130;
        drawBarcode(ctx, contentX, bottomY, 260, 60);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(contentX + 300, bottomY - 10);
        ctx.lineTo(contentX + 300, bottomY + 70);
        ctx.stroke();

        ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = t.textColor;
        ctx.fillText('Code is intelligence', contentX + 325, bottomY + 22);
        ctx.fillText('made visible. #FrameInGoa', contentX + 325, bottomY + 48);

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
      <div class="bg-watermark wm-bottom">HOUSE</div>

      <div className="floating-sticker fs-1">🏝️</div>
      <div className="floating-sticker fs-2">⚡</div>
      <div className="floating-sticker fs-3">🚀</div>
      <div className="floating-sticker fs-4">🔥</div>

      <div className="container">
        <header className="header">
          <div className="studio-pill">
            <span>✦</span>
            <span>2:47 PM STUDIO · HACKER HOUSE GOA 2026</span>
            <span>✦</span>
          </div>

          <div className="countdown-box">
            <div className="countdown-label">⚡ GOA 2026 IN</div>
            <div className="countdown-timer">{countdown}</div>
          </div>

          <h1 className="main-title">BUILD YOUR OFFICIAL LANYARD PASS</h1>
          <p className="sub-caption">
            Upload your portrait photo, pick your details, and watch your interactive 3D physics <span className="highlight-tag">Lanyard Pass</span> swing live!
          </p>
        </header>

        <div className="card">
          <div className="card-title"><span class="icon">📸</span>Step 1: Upload Portrait Photo</div>
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
              <span>CRAFTING 3D LANYARD PASS...</span>
            </>
          ) : (
            <span>GENERATE 3D PHYSICS LANYARD PASS ⚡</span>
          )}
        </button>

        {generatedDataUrl && (
          <div className="result-section visible" ref={resultRef}>
            <div className="result-card-wrapper">
              <div className="lanyard-3d-box">
                <div className="lanyard-hint">👆 Drag & Grab Card in 3D Physics!</div>
                <Lanyard
                  position={[0, 0, 20]}
                  gravity={[0, -40, 0]}
                  fov={20}
                  frontImage={generatedDataUrl}
                  backImage={generatedDataUrl}
                  imageFit="cover"
                  lanyardWidth={1}
                />
              </div>
            </div>

            <div className="action-buttons">
              <a
                className="btn btn-primary"
                href={generatedDataUrl}
                download={`HackerHouse-Goa-2026-${fullName.trim().replace(/\s+/g, '-')}-Pass.png`}
                onClick={() => showToast('Pass Downloaded! ⚡')}
              >
                <span>⬇️ Download High-Res Badge</span>
              </a>

              <button
                className="btn btn-x"
                onClick={() => {
                  const text = `Just generated my official 3D Physics Lanyard Badge for Hacker House Goa 2026! ⚡✦\n\nName: ${fullName}\nStack: ${stack}\n\n#FrameInGoa @hh_goa`;
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
