import { useState } from 'react';
import { Camera, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ScrapbookStep({ wishData, onNext, onBack, isFestival }) {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="text-center space-y-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">Chapter 1 • Memories & Wishes</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Heartfelt Letter</h2>
      </div>

      <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 text-left relative overflow-hidden">
        <div className="space-y-4 text-slate-200 leading-relaxed text-sm sm:text-base">
          <p className="font-serif italic text-2xl sm:text-3xl text-amber-300">
            Dearest {wishData.recipient},
          </p>
          <p className="whitespace-pre-line text-slate-200 font-light leading-relaxed">
            {wishData.wishMessage}
          </p>
          <p className="text-right font-serif italic text-xl text-pink-300 pt-2">
            With love & warm hugs,<br />
            <span className="font-bold text-amber-200">~ {wishData.sender}</span>
          </p>
        </div>

        {wishData.photos && wishData.photos.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-pink-400" /> Memory Highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wishData.photos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(url)}
                  className="relative rounded-xl overflow-hidden shadow border border-white/20 aspect-square group cursor-pointer"
                >
                  <img 
                    src={url} 
                    alt={`Memory ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium">
                    Tap to expand ✨
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl p-2 border border-white/20">
            <img src={activePhoto} alt="Memory Full" className="w-full h-auto rounded-xl object-contain max-h-[80vh]" />
            <p className="text-center text-xs text-slate-300 mt-2">Tap anywhere to close</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>{isFestival ? 'Explore Gifts 🎁' : 'Next: Milestone Celebration 🎂'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}