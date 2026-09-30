import ScratchCanvasCard from './ScratchCanvasCard';
import { ArrowLeft, Wand2 } from 'lucide-react';

export default function ScratchGiftsStep({ wishData, onBack, onOpenCreator }) {
  return (
    <div className="w-full flex flex-col items-center space-y-6 text-center">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">Chapter 3 • Mystery Unboxing</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Your Surprise Rewards 🎁</h2>
        <p className="text-slate-300 text-xs sm:text-sm">Scratch the cards below to reveal your gifts!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full my-2">
        {wishData.scratchGifts.map((giftText, idx) => (
          <ScratchCanvasCard key={idx} index={idx + 1} rewardText={giftText} />
        ))}
      </div>

      <div className="flex items-center justify-between w-full pt-4 border-t border-white/10">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onOpenCreator}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          <span>Create New Wish</span>
        </button>
      </div>
    </div>
  );
}