import React, { useRef, useEffect, useState } from 'react';

const WaveformVisualizer = ({ 
  isRecording, 
  audioData = [], 
  className = '',
  height = 120 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas?.parentElement?.getBoundingClientRect();
      setDimensions({ width: rect?.width, height });
      canvas.width = rect?.width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${rect?.width}px`;
      canvas.style.height = `${height}px`;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    const { width, height: canvasHeight } = dimensions;
    
    if (width === 0) return;

    const draw = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      const dpr = window.devicePixelRatio;
      ctx?.scale(dpr, dpr);
      
      const centerY = canvasHeight / 2;
      const barWidth = 4;
      const barSpacing = 2;
      const totalBars = Math.floor(width / (barWidth + barSpacing));
      
      // Create gradient
      const gradient = ctx?.createLinearGradient(0, 0, 0, canvasHeight);
      gradient?.addColorStop(0, '#4285F4');
      gradient?.addColorStop(0.5, '#1976D2');
      gradient?.addColorStop(1, '#0D47A1');
      
      ctx.fillStyle = gradient;
      
      if (isRecording && audioData?.length > 0) {
        // Draw real-time audio data
        for (let i = 0; i < totalBars; i++) {
          const dataIndex = Math.floor((i / totalBars) * audioData?.length);
          const amplitude = audioData?.[dataIndex] || 0;
          const barHeight = Math.max(2, amplitude * (canvasHeight * 0.8));
          
          const x = i * (barWidth + barSpacing);
          const y = centerY - barHeight / 2;
          
          ctx.globalAlpha = 0.8 + amplitude * 0.2;
          ctx?.fillRect(x, y, barWidth, barHeight);
        }
      } else if (!isRecording && audioData?.length === 0) {
        // Draw idle state with subtle animation
        const time = Date.now() * 0.002;
        for (let i = 0; i < totalBars; i++) {
          const wave = Math.sin(time + i * 0.1) * 0.3 + 0.7;
          const barHeight = Math.max(2, wave * 8);
          
          const x = i * (barWidth + barSpacing);
          const y = centerY - barHeight / 2;
          
          ctx.globalAlpha = 0.3;
          ctx?.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Draw static waveform for playback
        for (let i = 0; i < totalBars; i++) {
          const dataIndex = Math.floor((i / totalBars) * audioData?.length);
          const amplitude = audioData?.[dataIndex] || 0;
          const barHeight = Math.max(2, amplitude * (canvasHeight * 0.6));
          
          const x = i * (barWidth + barSpacing);
          const y = centerY - barHeight / 2;
          
          ctx.globalAlpha = 0.6;
          ctx?.fillRect(x, y, barWidth, barHeight);
        }
      }
      
      ctx?.setTransform(1, 0, 0, 1, 0, 0);
    };

    const animate = () => {
      draw();
      if (isRecording) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, [isRecording, audioData, dimensions]);

  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: `${height}px` }}
      />
      {!isRecording && audioData?.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Ready to record</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveformVisualizer;