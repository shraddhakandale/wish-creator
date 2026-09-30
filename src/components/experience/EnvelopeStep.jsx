import { useState } from 'react';
import { triggerConfettiBurst } from '../../utils/confetti';
import { synthManager } from '../../services/audioSynth';
import { ArrowRight } from 'lucide-react';

export default function EnvelopeStep({ wishData, onNext }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUnseal = () => {
    setIsOpen(true);
    triggerConfettiBurst();
    synthManager.playPop();
    setTimeout(() => {
      onNext();
    }, 700);
  };

  return (
    <div className="w-full flex flex-col items-center text-center space-y-6">
      <div className="space-y-2 max-w-lg">
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 leading-tight">
          {wishData.cardTitle || `Greetings, ${wishData.recipient}!`}
        </h2>
        {wishData.headerSubtitle && (
          <p className="text-slate-300 text-xs sm:text-sm">
            {wishData.headerSubtitle}
          </p>
        )}
      </div>

      <div 
        onClick={handleUnseal}
        className={`relative my-6 w-72 sm:w-80 h-48 bg-gradient-to-br from-rose-700 to-pink-900 rounded-2xl shadow-2xl border border-pink-400/30 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-500 hover:scale-105 ${
          isOpen ? 'scale-110 opacity-0' : 'scale-100'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-rose-800/80 rounded-t-2xl border-b border-pink-400/30 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center shadow-lg text-amber-950 font-bold text-2xl hover:scale-110 transition-transform">
            💌
          </div>
        </div>

        <div className="pt-12 text-center space-y-1">
          <p className="font-serif italic text-pink-200 text-sm">To: <span className="font-bold">{wishData.recipient}</span></p>
          <p className="text-[10px] text-pink-300/80 tracking-widest uppercase font-semibold">Tap To Unseal Wish</p>
        </div>
      </div>

      <button
        onClick={handleUnseal}
        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold text-sm shadow-xl shadow-pink-500/30 hover:scale-105 transition-all flex items-center gap-2"
      >
        <span>Open Surprise Card</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}