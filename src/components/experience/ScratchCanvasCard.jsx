import { useEffect, useRef } from 'react';
import { Gift } from 'lucide-react';

export default function ScratchCanvasCard({ index, rewardText }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.parentElement.offsetWidth || 240;
    canvas.height = 120;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#64748b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', canvas.width / 2, canvas.height / 2 + 4);

    let isScratching = false;

    const scratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    };

    const start = (e) => { isScratching = true; scratch(e); };
    const stop = () => { isScratching = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchmove', scratch);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [rewardText]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 relative border border-white/15 shadow-xl">
      <div className="text-xs font-semibold text-pink-300 flex items-center gap-1">
        <Gift className="w-3.5 h-3.5 text-amber-400" /> Reward #{index}
      </div>
      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gradient-to-br from-pink-950 to-purple-950 border border-pink-500/30 flex items-center justify-center text-center p-3">
        <div className="text-xs text-amber-200 font-semibold leading-relaxed">
          {rewardText}
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer touch-none" />
      </div>
      <p className="text-[10px] text-slate-400">Scratch to reveal voucher</p>
    </div>
  );
}