import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { Sparkles, ZoomIn, Sun, RotateCw, Check, ShoppingBag, ShieldCheck } from "lucide-react";

interface TheVaultProps {
  product: Product;
  onAddToBag: (product: Product, monogram: { initials: string; foil: "gold" | "silver" } | null) => void;
}

type LightingEnv = "golden-hour" | "office" | "evening-gala";

export default function TheVault({ product, onAddToBag }: TheVaultProps) {
  const [rotation, setRotation] = useState<number>(0); // 0 to 11 (12 frames of 3D rotation)
  const [lighting, setLighting] = useState<LightingEnv>("golden-hour");
  const [showStitchZoom, setShowStitchZoom] = useState<boolean>(false);
  const [monogramInitials, setMonogramInitials] = useState<string>("");
  const [monogramFoil, setMonogramFoil] = useState<"gold" | "silver">("gold");
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drag rotating handlers
  const dragStartRef = useRef<number | null>(null);
  const rotationStartRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = e.clientX;
    rotationStartRef.current = rotation;
    setIsRotating(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartRef.current === null) return;
    const deltaX = e.clientX - dragStartRef.current;
    const steps = Math.floor(deltaX / 15); // Adjust sensitivity
    let newRotation = (rotationStartRef.current + steps) % 12;
    if (newRotation < 0) newRotation += 12;
    setRotation(newRotation);
  };

  const handleMouseUpOrLeave = () => {
    dragStartRef.current = null;
    setIsRotating(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      dragStartRef.current = e.touches[0].clientX;
      rotationStartRef.current = rotation;
      setIsRotating(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartRef.current === null || !e.touches[0]) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current;
    const steps = Math.floor(deltaX / 15);
    let newRotation = (rotationStartRef.current + steps) % 12;
    if (newRotation < 0) newRotation += 12;
    setRotation(newRotation);
  };

  // Render the 3D leather product canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const width = 450;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Apply soft drop shadow
    ctx.shadowColor = "rgba(18, 18, 18, 0.15)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 20;

    // Define color configurations based on lighting environmental atmosphere
    let baseRGB = hexToRgb(product.baseColor) || { r: 61, g: 35, b: 20 };
    let leatherColor = `rgb(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b})`;
    let highlightColor = "rgba(255, 255, 255, 0.2)";
    let shadowColor = "rgba(0, 0, 0, 0.4)";
    let backgroundGradient: CanvasGradient;

    if (lighting === "golden-hour") {
      backgroundGradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, 250);
      backgroundGradient.addColorStop(0, "#fcfbfa");
      backgroundGradient.addColorStop(1, "#f4eede"); // Soft warm gold sheen
      highlightColor = "rgba(255, 220, 160, 0.45)"; // Amber gold gloss
      shadowColor = "rgba(61, 35, 20, 0.35)"; // Warm deep brown shadow
    } else if (lighting === "evening-gala") {
      backgroundGradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, 250);
      backgroundGradient.addColorStop(0, "#2a2220"); // Dark warm gray
      backgroundGradient.addColorStop(1, "#110b0a"); // Midnight dark chocolate
      highlightColor = "rgba(255, 255, 255, 0.15)";
      shadowColor = "rgba(0, 0, 0, 0.75)";
    } else { // Office
      backgroundGradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, 250);
      backgroundGradient.addColorStop(0, "#fafaf9");
      backgroundGradient.addColorStop(1, "#e5e5e5"); // Cool sterile studio gray
      highlightColor = "rgba(255, 255, 255, 0.35)";
      shadowColor = "rgba(0, 0, 0, 0.25)";
    }

    // Draw background within canvas
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    // Reset shadow for inner elements
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Rotation multiplier & calculations
    const angle = (rotation / 12) * Math.PI * 2;
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);

    ctx.save();
    ctx.translate(width / 2, height / 2 + 10);

    // DRAW THE FLOOR REFLECTION/GLOW
    const reflectionGrad = ctx.createRadialGradient(0, 110, 5, 0, 110, 150);
    if (lighting === "golden-hour") {
      reflectionGrad.addColorStop(0, "rgba(197, 160, 89, 0.25)");
      reflectionGrad.addColorStop(1, "rgba(252, 251, 250, 0)");
    } else if (lighting === "evening-gala") {
      reflectionGrad.addColorStop(0, "rgba(0, 0, 0, 0.6)");
      reflectionGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      reflectionGrad.addColorStop(0, "rgba(0, 0, 0, 0.15)");
      reflectionGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    }
    ctx.fillStyle = reflectionGrad;
    ctx.beginPath();
    ctx.ellipse(0, 110, 160 * Math.abs(cosVal) + 80, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D MODEL SIMULATOR - DRAW LUXURY COMPONENT (BAG, WALLET, BELT)
    const isBag = product.category === "BAG";
    const isWallet = product.category === "WALLET" || product.id.includes("cardholder");
    const isBelt = product.category === "BELT";

    // Draw Leather Grain Texture Overlay Helper
    const drawLeatherTexture = (pathFn: () => void) => {
      ctx.save();
      pathFn();
      ctx.clip();
      
      // Draw organic grain texture using tiny noise particles
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      for (let i = -180; i < 180; i += 3) {
        for (let j = -120; j < 120; j += 3) {
          // Generate a repeatable leather pore noise grid
          const n = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
          const noiseVal = n - Math.floor(n);
          if (noiseVal > 0.94) {
            ctx.fillRect(i, j, 1, 1);
          }
        }
      }
      ctx.restore();
    };

    if (isBag) {
      // 1. Draw Bag Body Structure
      const drawBody = () => {
        ctx.beginPath();
        // Dynamic perspective width based on rotation angle
        const baseWidth = 140;
        const thickness = 60;
        const currentWidth = baseWidth * Math.abs(cosVal) + thickness * Math.abs(sinVal);
        const topWidth = currentWidth * 0.85;

        ctx.moveTo(-currentWidth / 2, 70);
        ctx.bezierCurveTo(-currentWidth / 2, 75, -currentWidth / 2 + 10, 80, -currentWidth / 2 + 20, 80);
        ctx.lineTo(currentWidth / 2 - 20, 80);
        ctx.bezierCurveTo(currentWidth / 2 - 10, 80, currentWidth / 2, 75, currentWidth / 2, 70);
        ctx.lineTo(topWidth / 2, -40);
        ctx.bezierCurveTo(topWidth / 2, -50, -topWidth / 2, -50, -topWidth / 2, -40);
        ctx.closePath();
      };

      // Base Fill
      ctx.fillStyle = leatherColor;
      ctx.beginPath();
      drawBody();
      ctx.fill();

      // Layer fine leather pores on top of the bag
      drawLeatherTexture(drawBody);

      // Add dynamic 3D shading
      const shadeGrad = ctx.createLinearGradient(-150, 0, 150, 0);
      shadeGrad.addColorStop(0, shadowColor);
      shadeGrad.addColorStop(0.3 + sinVal * 0.1, "rgba(255,255,255,0)");
      shadeGrad.addColorStop(0.7 + sinVal * 0.1, "rgba(255,255,255,0)");
      shadeGrad.addColorStop(1, shadowColor);
      ctx.fillStyle = shadeGrad;
      ctx.beginPath();
      drawBody();
      ctx.fill();

      // Dynamic Highlight reflecting environment lighting
      const highlightGrad = ctx.createLinearGradient(0, -50, 0, 80);
      highlightGrad.addColorStop(0, highlightColor);
      highlightGrad.addColorStop(0.4, "rgba(255,255,255,0)");
      ctx.fillStyle = highlightGrad;
      ctx.beginPath();
      drawBody();
      ctx.fill();

      // 2. Draw Saddle Stitch Line detailing around edges
      ctx.strokeStyle = "rgba(197, 160, 89, 0.45)"; // Soft golden flax linen thread
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]); // Simulated stitching dots
      ctx.beginPath();
      const currentWidth = 140 * Math.abs(cosVal) + 60 * Math.abs(sinVal);
      const topWidth = currentWidth * 0.85;
      // Stitched edge matching bag geometry
      ctx.moveTo(-currentWidth / 2 + 6, 70);
      ctx.lineTo(-topWidth / 2 + 6, -38);
      ctx.bezierCurveTo(-topWidth / 2 + 6, -44, topWidth / 2 - 6, -44, topWidth / 2 - 6, -38);
      ctx.lineTo(currentWidth / 2 - 6, 70);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 3. Draw Premium Handle (Equestrian arches)
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 8;
      
      ctx.strokeStyle = leatherColor;
      ctx.lineWidth = 14 * Math.abs(cosVal) + 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      // Arch handle dynamically morphing with 3D viewpoint rotation
      ctx.arc(0, -48, 35 * Math.abs(cosVal) + 10, Math.PI, 0, false);
      ctx.stroke();

      // Draw burnished black sealed seam inside handle arch
      ctx.strokeStyle = "rgba(18, 18, 18, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -48, 35 * Math.abs(cosVal) + 10, Math.PI, 0, false);
      ctx.stroke();
      ctx.shadowColor = "transparent"; // Reset shadow

      // 4. Solid Brass hardware accents
      ctx.fillStyle = "#d4af37"; // Real brass/gold sheen
      if (lighting === "silver") ctx.fillStyle = "#e0e0e0";
      
      // Hardware clasps where handle connects
      const claspOffset = 35 * Math.abs(cosVal) + 10;
      ctx.beginPath();
      ctx.arc(-claspOffset, -48, 6, 0, Math.PI * 2);
      ctx.arc(claspOffset, -48, 6, 0, Math.PI * 2);
      ctx.fill();

      // Metallic sheen shine on brass clasps
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-claspOffset - 2, -50, 1.5, 0, Math.PI * 2);
      ctx.arc(claspOffset - 2, -50, 1.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (isWallet) {
      // Draw luxury wallet sleeve
      const drawWalletBody = () => {
        ctx.beginPath();
        const baseW = 160;
        const h = 100;
        const w = baseW * Math.abs(cosVal) + 40 * Math.abs(sinVal);
        ctx.moveTo(-w / 2, -h / 2);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
      };

      ctx.fillStyle = leatherColor;
      ctx.beginPath();
      drawWalletBody();
      ctx.fill();

      drawLeatherTexture(drawWalletBody);

      // Shading & environment light highlight
      const shadeGrad = ctx.createLinearGradient(-100, -50, 100, 50);
      shadeGrad.addColorStop(0, highlightColor);
      shadeGrad.addColorStop(0.5, "transparent");
      shadeGrad.addColorStop(1, shadowColor);
      ctx.fillStyle = shadeGrad;
      ctx.beginPath();
      drawWalletBody();
      ctx.fill();

      // Stitch lines around wallet border
      ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      const sw = (160 * Math.abs(cosVal) + 40 * Math.abs(sinVal)) - 8;
      const sh = 100 - 8;
      ctx.rect(-sw/2, -sh/2, sw, sh);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (isBelt) {
      // Draw elegant coiled belt roll
      ctx.strokeStyle = leatherColor;
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.beginPath();
      // Draw premium tight coil concentric arches
      for (let r = 15; r < 60; r += 12) {
        ctx.arc(0, 0, r, 0, Math.PI * 1.6 + cosVal * 0.2);
      }
      ctx.stroke();

      // Brass buckle accentuating front of belt
      ctx.save();
      ctx.translate(50 * cosVal, 10 * sinVal);
      ctx.rotate(angle);
      ctx.strokeStyle = "#d4af37"; // Solid gold buckle
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-15, -20, 30, 40, 4);
      ctx.stroke();
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(-10, -2, 22, 4); // Buckle pin
      ctx.restore();
    }

    // 5. EMBOSSED GOLD/SILVER FOIL HOT-STAMPED MONOGRAM RENDER
    if (monogramInitials && monogramInitials.trim().length > 0) {
      ctx.save();
      ctx.font = "italic tracking-widest bold 13px 'Cormorant Garamond', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const textY = isBag ? 35 : (isWallet ? 15 : 45); // Vertical offset position on leather
      const stampX = 0; // Centered

      // Create rich foil color gradient (Gold or Silver)
      const foilGrad = ctx.createLinearGradient(stampX - 30, textY - 10, stampX + 30, textY + 10);
      if (monogramFoil === "gold") {
        foilGrad.addColorStop(0, "#8a6f27");
        foilGrad.addColorStop(0.3, "#e8d7b3");
        foilGrad.addColorStop(0.5, "#d4af37");
        foilGrad.addColorStop(0.7, "#f9f1d0");
        foilGrad.addColorStop(1, "#aa851e");
      } else { // Silver
        foilGrad.addColorStop(0, "#666666");
        foilGrad.addColorStop(0.3, "#f0f0f0");
        foilGrad.addColorStop(0.5, "#cccccc");
        foilGrad.addColorStop(0.7, "#ffffff");
        foilGrad.addColorStop(1, "#888888");
      }

      // 1. Embossed Shadow to simulate deep leather heat stamping
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillText(monogramInitials.toUpperCase(), stampX, textY - 0.5);

      // 2. Main Foil layer
      ctx.fillStyle = foilGrad;
      ctx.fillText(monogramInitials.toUpperCase(), stampX, textY);

      // 3. Highlight Glow catching environment lighting
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillText(monogramInitials.toUpperCase(), stampX - 0.5, textY + 0.5);

      ctx.restore();
    }

    ctx.restore();
  }, [product, rotation, lighting, monogramInitials, monogramFoil]);

  // Render the hyper-zoom Saddle Stitch simulation
  useEffect(() => {
    if (!showStitchZoom) return;
    const canvas = document.getElementById("macro-stitch-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 350;
    canvas.width = size;
    canvas.height = size;

    // Draw close-up Vachetta/Calfskin leather grain under hyper-zoom
    ctx.fillStyle = product.baseColor; // Deep base
    ctx.fillRect(0, 0, size, size);

    // Draw detailed close-up natural leather textures
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let x = 0; x < size; x += 4) {
      for (let y = 0; y < size; y += 4) {
        const noise = Math.sin(x * 0.123 + y * 0.456) * 1000;
        const fraction = noise - Math.floor(noise);
        if (fraction > 0.95) {
          ctx.beginPath();
          ctx.ellipse(x, y, 2.5, 1.5, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Apply high contrast leather highlights/depth lines
    const linearGlow = ctx.createLinearGradient(0, 0, size, size);
    linearGlow.addColorStop(0, "rgba(255,255,255,0.06)");
    linearGlow.addColorStop(0.5, "transparent");
    linearGlow.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = linearGlow;
    ctx.fillRect(0, 0, size, size);

    // Draw the exquisite angled Saddle Stitch seam (45-degree angled hand-stitch)
    const stitchLineX = size / 2;
    ctx.strokeStyle = "rgba(0,0,0,0.45)"; // Deep puncture needle holes
    ctx.lineWidth = 3;

    // Draw elegant hand-stitched linen threads
    const stitchLength = 26;
    const paddingY = 20;

    for (let y = paddingY; y < size - paddingY; y += stitchLength + 8) {
      // 1. Draw leather puncture hole shadow
      ctx.fillStyle = "rgba(12, 8, 5, 0.8)";
      ctx.beginPath();
      ctx.ellipse(stitchLineX, y, 4, 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw actual 45-degree hand-pulled saddle stitch thread
      const threadGrad = ctx.createLinearGradient(stitchLineX - 8, y - 10, stitchLineX + 8, y + 10);
      threadGrad.addColorStop(0, "#d4af37"); // Rich golden flaxen linen
      threadGrad.addColorStop(0.5, "#fff2cc"); // Soft light reflecting off silk/flax fibers
      threadGrad.addColorStop(1, "#a8801d");

      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.3)"; // Thread drop shadow inside leather indent
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(stitchLineX - 8, y - 10);
      ctx.lineTo(stitchLineX + 8, y + 10);
      ctx.stroke();

      ctx.strokeStyle = threadGrad;
      ctx.lineWidth = 4.5;
      ctx.stroke();

      // Draw subtle twisted linen thread micro texture lines
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(stitchLineX - 8, y - 10);
      ctx.lineTo(stitchLineX + 8, y + 10);
      ctx.stroke();
      ctx.restore();
    }

    // Overlay descriptive label on macro canvas
    ctx.fillStyle = "rgba(252, 251, 250, 0.9)";
    ctx.fillRect(15, size - 45, size - 30, 30);
    ctx.font = "tracking-wider text-xs font-sans uppercase";
    ctx.fillStyle = "#1e1412";
    ctx.textAlign = "center";
    ctx.fillText("45° SADDLE STITCHING - EXQUISITE HAND THREADING", size / 2, size - 26);

  }, [showStitchZoom, product]);

  // Utility hex color converter
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const triggerAddToBag = () => {
    const monogram = monogramInitials.trim().length > 0
      ? { initials: monogramInitials.toUpperCase(), foil: monogramFoil }
      : null;
    onAddToBag(product, monogram);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div ref={containerRef} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 md:p-8 border border-espresso/5 rounded-sm">
      
      {/* LEFT: 3D Canvas Customizer stage */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        {/* Main customized viewport */}
        <div className="relative w-full overflow-hidden rounded-sm border border-espresso/5 bg-alabaster select-none">
          
          <AnimatePresence mode="wait">
            {!showStitchZoom ? (
              <motion.div
                key="3D-customizer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex justify-center items-center cursor-ew-resize"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
              >
                <canvas ref={canvasRef} className="max-w-full block h-auto" />
                
                {/* 3D Prompt Overlay */}
                <div className="absolute bottom-4 left-4 bg-espresso/90 text-alabaster text-[10px] tracking-widest uppercase py-1 px-3 font-light rounded-sm flex items-center gap-1.5 backdrop-blur-xs">
                  <RotateCw className="w-3 h-3 animate-spin-slow" /> Drag to Rotate 360°
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 border ${
                    lighting === "golden-hour" ? "bg-amber-500/10 border-amber-500/30 text-amber-600" :
                    lighting === "evening-gala" ? "bg-indigo-950/20 border-indigo-500/20 text-indigo-400" :
                    "bg-zinc-500/10 border-zinc-500/30 text-zinc-600"
                  } rounded-xs font-semibold`}>
                    {lighting.replace("-", " ")}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stitch-magnifier"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative flex justify-center items-center p-6 bg-alabaster-dark"
              >
                <div className="border border-gold-burnished/40 p-1 bg-white rounded-sm shadow-sm">
                  <canvas id="macro-stitch-canvas" className="max-w-full block rounded-sm" />
                </div>
                
                {/* Micro Details Callout */}
                <div className="absolute top-4 left-4 bg-espresso/90 text-alabaster text-[10px] tracking-widest uppercase py-1.5 px-3 font-light rounded-sm flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-burnished" /> Certified 45° Saddle Thread Seam
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Viewport Control Actions */}
        <div className="flex gap-4 w-full mt-4 justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStitchZoom(!showStitchZoom)}
              className={`py-2.5 px-4 text-xs uppercase tracking-widest border transition-all duration-300 rounded-sm flex items-center gap-2 ${
                showStitchZoom 
                  ? "bg-gold-burnished text-white border-gold-burnished" 
                  : "bg-transparent border-espresso/15 text-espresso hover:border-espresso"
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              {showStitchZoom ? "Exit Zoom" : "Inspect Saddle Stitch"}
            </button>
          </div>

          <div className="flex gap-1.5 bg-alabaster p-1 rounded-sm border border-espresso/5">
            {(["golden-hour", "office", "evening-gala"] as LightingEnv[]).map((env) => (
              <button
                key={env}
                onClick={() => { setLighting(env); setShowStitchZoom(false); }}
                className={`px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-xs transition-all ${
                  lighting === env 
                    ? "bg-white text-espresso shadow-xs font-semibold" 
                    : "text-espresso/50 hover:text-espresso"
                }`}
              >
                {env === "golden-hour" ? "Golden Hour" : env === "office" ? "Studio Office" : "Evening Gala"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Craft Customizer Options */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">{product.leatherType} Atelier Customizer</span>
          <h2 className="text-3xl font-serif text-espresso leading-tight mt-1">{product.name}</h2>
          <div className="text-xl text-gold-burnished font-serif mt-2">${product.price.toLocaleString()}</div>
          <p className="text-xs text-espresso/60 leading-relaxed font-light mt-3">{product.description}</p>
        </div>

        {/* Dynamic Monogram Form */}
        <div className="p-5 border border-espresso/5 bg-alabaster rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-widest font-medium text-espresso flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-burnished" /> Hot-Stamped Monogram
            </h4>
            <span className="text-[10px] text-espresso/40 font-mono">Gold/Silver Embossed Foil</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-espresso/50 mb-1">Enter Initials (Up to 3 Letters)</label>
              <input
                type="text"
                maxLength={3}
                placeholder="e.g. AMV"
                value={monogramInitials}
                onChange={(e) => setMonogramInitials(e.target.value)}
                className="w-full bg-white border border-espresso/10 rounded-sm py-2 px-3 text-sm tracking-widest font-serif focus:outline-none focus:border-gold-burnished text-center"
              />
            </div>

            {monogramInitials.trim().length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] uppercase tracking-widest text-espresso/50">Foil Colorway</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMonogramFoil("gold")}
                    className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-xs border transition-all ${
                      monogramFoil === "gold" 
                        ? "bg-amber-100 text-amber-800 border-gold-burnished/40" 
                        : "bg-white border-espresso/10 text-espresso/60"
                    }`}
                  >
                    Gold Leaf
                  </button>
                  <button
                    onClick={() => setMonogramFoil("silver")}
                    className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-xs border transition-all ${
                      monogramFoil === "silver" 
                        ? "bg-slate-100 text-slate-800 border-slate-300" 
                        : "bg-white border-espresso/10 text-espresso/60"
                    }`}
                  >
                    Silver Leaf
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Physical Specs & Authentication info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 border-b border-espresso/5 text-xs">
            <span className="text-espresso/50 uppercase tracking-widest">Handcrafted Seams</span>
            <span className="text-espresso font-medium">Linen Saddle-Stitch</span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-b border-espresso/5 text-xs">
            <span className="text-espresso/50 uppercase tracking-widest">Edge Finish</span>
            <span className="text-espresso font-medium">Multiple Burnished Wax Sealing</span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-b border-espresso/5 text-xs">
            <span className="text-espresso/50 uppercase tracking-widest">Origin certificate</span>
            <span className="text-espresso font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-burnished" /> Embedded NFC Microchip
            </span>
          </div>
        </div>

        {/* Add to Bag trigger */}
        <button
          onClick={triggerAddToBag}
          disabled={added}
          className="w-full py-4 bg-espresso text-alabaster text-xs uppercase tracking-widest font-semibold hover:bg-gold-burnished transition-colors duration-300 flex items-center justify-center gap-2 rounded-sm shadow-xs"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-gold-light" /> Tailored Spec Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Secure Atelier Custom Piece
            </>
          )}
        </button>

        <p className="text-[10px] text-espresso/40 text-center italic">
          Every piece is built to order. Standard white-glove custom crafting time is 4 to 6 weeks.
        </p>
      </div>

    </div>
  );
}
