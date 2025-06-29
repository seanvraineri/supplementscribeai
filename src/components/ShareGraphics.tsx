'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Instagram, Copy, Sparkles } from 'lucide-react';

interface ShareGraphicsProps {
  userName: string;
  supplements: string[];
  healthScore?: number;
  referralCode: string;
  referralUrl: string;
  logoSrc?: string;
}

type GraphicFormat = 'story' | 'square' | 'landscape';

export default function ShareGraphics({ 
  userName, 
  supplements, 
  healthScore = 85, 
  referralCode, 
  referralUrl,
  logoSrc = '/supplement-scribe-logo.png'
}: ShareGraphicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<GraphicFormat>('story');
  const [isGenerating, setIsGenerating] = useState(false);

  const formats = {
    story: { width: 1080, height: 1920, name: 'Instagram Story', icon: '📱' },
    square: { width: 1080, height: 1080, name: 'Instagram Post', icon: '⬜' },
    landscape: { width: 1200, height: 630, name: 'LinkedIn/Email', icon: '🖥️' }
  };

  // Draw the SupplementScribe logo (pill in circle)
  const drawLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2;
    
    // Outer circle with gradient
    const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    gradient.addColorStop(0, '#00D4FF');
    gradient.addColorStop(1, '#0099CC');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner pill shape
    ctx.fillStyle = '#FFFFFF';
    const pillWidth = radius * 0.6;
    const pillHeight = radius * 1.2;
    const pillX = x - pillWidth / 2;
    const pillY = y - pillHeight / 2;
    
    // Draw pill (rounded rectangle)
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillWidth / 2);
    ctx.fill();
    
    // Add highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight * 0.4, pillWidth / 2);
    ctx.fill();
  };

  const generateGraphic = async (format: GraphicFormat) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load logo image once and cache
    const loadLogo = () => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = logoSrc;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wait for logo to load
    let logoImg: HTMLImageElement | null = null;
    try {
      logoImg = await loadLogo();
    } catch {
      logoImg = null; // fallback draws constructed logo if loading fails
    }

    // Canvas dimensions based on selected format
    const { width, height } = formats[format];
    canvas.width = width;
    canvas.height = height;

    // ---------- BACKGROUND ----------
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF'; // pure white background
    ctx.fillRect(0, 0, width, height);

    // Common layout metrics
    const margin = format === 'story' ? 80 : format === 'square' ? 60 : 50;

    // Custom typography baseline per format
    const titleSize = format === 'story' ? 100 : format === 'square' ? 72 : 48;

    // ---------- TITLE (top-left) ----------
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = `700 ${titleSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;

    // Draw title lines
    const cleanName = userName.trim().endsWith("'") ? userName.trim() : userName.trim();
    ctx.fillText(`${cleanName}'s`, margin, margin + titleSize / 1.2);
    ctx.fillText('Supplement', margin, margin + titleSize * 2);
    ctx.fillText('Stack', margin, margin + titleSize * 3);

    // ---------- LOGO (top-right) ----------
    if (logoImg) {
      const logoWidth = format === 'story' ? 420 : format === 'square' ? 320 : 220; // proportionally sized
      const logoHeight = logoWidth * (logoImg.height / logoImg.width);
      const logoX = width - margin - logoWidth;
      const logoY = margin;
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    } else {
      // Fallback primitive logo drawing (previous code)
      const circleSize = format === 'story' ? 120 : format === 'square' ? 90 : 70;
      const circleRadius = circleSize / 2;
      const circleX = width - margin - circleRadius;
      const circleY = margin + circleRadius;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000000';
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      const pillW = circleSize * 0.25;
      const pillH = circleSize * 0.55;
      const pillX = circleX - pillW / 2;
      const pillY = circleY - pillH / 2;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillW / 2);
      ctx.fill();
    }

    // ---------- SUPPLEMENTS LIST ----------
    const pillsStartY = margin + titleSize * 3 + 80; // spacing after title
    let pillHeight = format === 'story' ? 110 : format === 'square' ? 90 : 70;
    const pillWidth = width - margin * 2;
    let pillRadius = pillHeight / 2;
    let pillFontSize = pillHeight * 0.38;
    const pillSpacing = format === 'story' ? 30 : format === 'square' ? 24 : 20;

    // Dynamically shrink pill height/font if it would overflow vertical space (square & landscape)
    const footerReserve = pillHeight * 2; // space for website + referral text
    const totalPillBlock = supplements.length * pillHeight + (supplements.length - 1) * pillSpacing;
    const requiredHeight = pillsStartY + totalPillBlock + footerReserve + margin;
    if (requiredHeight > height) {
      const availableForPills = height - pillsStartY - footerReserve - margin;
      pillHeight = Math.max(50, Math.floor(availableForPills / supplements.length - pillSpacing));
      pillRadius = pillHeight / 2;
      pillFontSize = Math.floor(pillHeight * 0.38);
    }

    ctx.font = `500 ${pillFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';

    supplements.forEach((supplement, idx) => {
      const y = pillsStartY + idx * (pillHeight + pillSpacing);
      // Draw black pill
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(margin, y, pillWidth, pillHeight, pillRadius);
      ctx.fill();

      // Supplement name in white
      ctx.fillStyle = '#FFFFFF';
      const text = supplement.length > 30 ? `${supplement.substring(0,27)}…` : supplement;
      ctx.fillText(text, margin + pillWidth / 2, y + pillHeight / 1.7);
    });

    // ---------- REFERRAL CODE (bottom-right) ----------
    const referralY = height - margin - pillFontSize * 0.5;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.font = `500 ${pillFontSize * 0.9}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
    ctx.fillText('Referral Code:', width - margin, referralY - pillFontSize * 0.3);
    ctx.font = `700 ${pillFontSize * 1.1}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
    ctx.fillText(referralCode, width - margin, referralY + pillFontSize * 0.9);

    // ---------- WEBSITE (bottom-left) ----------
    ctx.textAlign = 'left';
    ctx.font = `500 ${pillFontSize * 0.9}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
    ctx.fillText('supplementscribe.ai', margin, referralY + pillFontSize * 0.9);

    setIsGenerating(false);
  };

  useEffect(() => {
    generateGraphic(selectedFormat);
  }, [selectedFormat, userName, supplements, healthScore, referralCode]);

  const downloadGraphic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${userName.replace(/\s+/g, '-')}-supplement-stack-${selectedFormat}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const shareGraphic = async (platform: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      if (navigator.share && platform === 'native') {
        try {
          await navigator.share({
            title: `${userName}'s Supplement Stack`,
            text: `Check out my personalized supplement stack! Use code ${referralCode} to get yours at supplementscribe.ai`,
            files: [new File([blob], `${userName}-supplement-stack.png`, { type: 'image/png' })]
          });
        } catch (error) {
          console.log('Native share failed:', error);
          copyToClipboard(blob);
        }
      } else {
        copyToClipboard(blob);
      }
    }, 'image/png', 1.0);
  };

  const copyToClipboard = async (blob: Blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      
      // Show success feedback
      const button = document.activeElement as HTMLButtonElement;
      const originalText = button?.textContent;
      if (button && originalText) {
        button.textContent = '✓ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.log('Clipboard failed, downloading instead');
      downloadGraphic();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-dark-accent" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary">Share Your Stack</h3>
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-dark-accent" />
        </div>
        <p className="text-dark-secondary text-sm sm:text-base lg:text-lg">Create viral-worthy graphics to share your supplement journey</p>
      </div>

      {/* Format Selection */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {Object.entries(formats).map(([key, format]) => (
          <Button
            key={key}
            variant={selectedFormat === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFormat(key as GraphicFormat)}
            className={`transition-all duration-200 text-xs sm:text-sm touch-target ${
              selectedFormat === key 
                ? "bg-dark-accent text-white shadow-lg scale-105" 
                : "border-dark-border text-dark-secondary hover:bg-dark-border hover:scale-102"
            }`}
          >
            <span className="mr-1 sm:mr-2">{format.icon}</span>
            <span className="hidden sm:inline">{format.name}</span>
            <span className="sm:hidden">{format.name.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Canvas Preview */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="bg-gradient-to-br from-dark-panel to-dark-background border border-dark-border rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl lg:shadow-2xl">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain rounded-lg sm:rounded-xl shadow-lg"
              style={{ 
                width: selectedFormat === 'story' ? '180px' : selectedFormat === 'square' ? '250px' : '100%',
                maxWidth: selectedFormat === 'story' ? '180px' : selectedFormat === 'square' ? '250px' : '350px',
                height: 'auto'
              }}
            />
            
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center">
                <div className="bg-dark-background border border-dark-border rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-dark-accent border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-3"></div>
                  <p className="text-dark-primary font-medium text-xs sm:text-sm lg:text-base">Generating your viral graphic...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center">
        <Button
          onClick={downloadGraphic}
          disabled={isGenerating}
          size="sm"
          className="bg-dark-accent text-white hover:bg-dark-accent/80 shadow-lg hover:shadow-xl transition-all duration-200 touch-target text-xs sm:text-sm"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
          Download
        </Button>
        
        <Button
          onClick={() => shareGraphic('native')}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary transition-all duration-200 touch-target text-xs sm:text-sm"
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
          Share
        </Button>
        
        <Button
          onClick={() => shareGraphic('copy')}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary transition-all duration-200 touch-target text-xs sm:text-sm"
        >
          <Copy className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
          Copy
        </Button>
        
        <Button
          onClick={() => shareGraphic('instagram')}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary transition-all duration-200 touch-target text-xs sm:text-sm"
        >
          <Instagram className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
          Instagram
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-dark-primary mb-2 sm:mb-3">💡 Sharing Tips</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-dark-secondary">
          <div>
            <span className="font-medium text-dark-accent">📱 Stories:</span> Perfect for quick shares
          </div>
          <div>
            <span className="font-medium text-dark-accent">⬜ Posts:</span> Great for discovery
          </div>
          <div>
            <span className="font-medium text-dark-accent">💼 LinkedIn:</span> Professional sharing
          </div>
        </div>
      </div>
    </div>
  );
} 