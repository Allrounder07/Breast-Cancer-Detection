import React, { useRef, useEffect } from 'react';
import { Hotspot } from '../types';

interface HeatmapProps {
  imageUrl: string;
  heatmapData: Hotspot[];
  className?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ imageUrl, heatmapData, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    const draw = () => {
      // Match canvas dimensions to the image's natural dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw the original image first
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // If there are no hotspots, we're done
      if (!heatmapData || heatmapData.length === 0) return;

      // Draw each hotspot
      heatmapData.forEach(hotspot => {
        const x = (hotspot.x / 100) * canvas.width;
        const y = (hotspot.y / 100) * canvas.height;
        const radius = (hotspot.radius / 100) * canvas.width;

        // Create a radial gradient for a smooth, glowing effect
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        
        // Classic heatmap color scheme: transitions from transparent yellow to opaque red
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.9)');    // Center: Opaque Red
        gradient.addColorStop(0.3, 'rgba(255, 165, 0, 0.6)'); // Middle: Orange
        gradient.addColorStop(0.6, 'rgba(255, 255, 0, 0.3)');  // Outer: Yellow
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');    // Edge: Transparent

        // Set overall hotspot visibility based on intensity
        context.globalAlpha = hotspot.intensity * 0.6 + 0.3; // Range from 0.3 to 0.9
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
      });

      // Reset global alpha for any future drawing operations
      context.globalAlpha = 1.0;
    };

    img.onload = draw;
    // If the image is already cached, it might not fire 'onload'
    if (img.complete) {
        draw();
    }

    img.onerror = () => {
      console.error("Failed to load image for heatmap canvas.");
      // Optionally draw a placeholder or error message on the canvas
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText('Image could not be loaded', canvas.width / 2, canvas.height / 2);
    };

  }, [imageUrl, heatmapData]);

  return <canvas ref={canvasRef} className={className} aria-label="AI heatmap visualization of the thermogram"/>;
};
