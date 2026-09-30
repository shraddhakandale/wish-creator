import { useState } from 'react';
import { triggerConfettiBurst } from '../../utils/confetti';
import { synthManager } from '../../services/audioSynth';
import { Mic, Wind, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CakeCandleStep({ wishData, onNext, onBack }) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  const getOrdinal = (n) => {
    const num = parseInt(n) || 0;
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleBlowOut = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    setShowAgeModal(true);
    triggerConfettiBurst();
    synthManager.playPop();
  };

  const enableMicBlow = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    setIsMicListening(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const mic = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      mic.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const checkVolume = () => {
        analyzer.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((acc, v) => acc + v, 0);
        let average = sum / dataArray.length;

        if (average > 60) {
          handleBlowOut();
          setIsMicListening(false);
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        requestAnimationFrame(checkVolume);
      };
      checkVolume();
    }).catch(() => {
      setIsMicListening(false);
    });
  };

  const isAnniversary = wishData.occasion === 'anniversary';
  const milestoneCount = isAnniversary ? (wishData.yearsCompleted || 5) : (wishData.age || 21);

  return (
    <div className="w-full flex flex-col items-center space-y-6 text-center">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">Chapter 2 • Celebration Milestone</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white drop-shadow">Blow The Candles! 🕯️</h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-md font-light">
          Blow into your device microphone or tap the candles to light up your milestone!
        </p>
      </div>

      <div className="relative my-2 flex flex-col items-center justify-center min-h-[260px] w-full max-w-md bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl">
        <div className="relative pt-12 pb-4">
          <div className="absolute top-2 inset-x-0 flex justify-center items-end gap-5 z-20">
            {[1, 2, 3].map(id => (
              <div 
                key={id} 
                onClick={handleBlowOut}
                className="cursor-pointer relative flex flex-col items-center"
              >
                {!candlesBlown && (
                  <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full animate-pulse shadow-lg shadow-orange-500/80 -mb-1" />
                )}
                {candlesBlown && (
                  <div className="text-[10px] text-slate-300 -mb-1 animate-ping">💨</div>
                )}
                <div className="w-3 h-12 bg-gradient-to-b from-pink-300 to-pink-500 rounded-t-sm shadow-md border-x border-pink-200 flex items-center justify-center">
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col items-center">
            <div className="w-40 h-12 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-t-3xl shadow-md border-t-2 border-white/60 flex items-center justify-around px-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow"></div>
              <div className="w-3 h-3 rounded-full bg-purple-400 shadow"></div>
            </div>
            <div className="w-52 h-14 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 shadow-lg border-t-4 border-amber-100 flex items-center justify-center">
              <span className="font-serif italic text-white text-lg tracking-wider">
                {isAnniversary ? 'Happy Anniversary' : 'Happy Birthday'}
              </span>
            </div>
            <div className="w-64 h-14 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-b-2xl shadow-xl border-t-4 border-pink-300 flex items-center justify-center">
              <div className="w-full h-2 bg-amber-600/40"></div>
            </div>
            <div className="w-72 h-4 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 rounded-full shadow-2xl border-t border-white"></div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={enableMicBlow}
            className={`px-5 py-2.5 rounded-full border text-xs font-medium flex items-center gap-2 transition-all backdrop-blur-md ${
              isMicListening 
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-black/40 hover:bg-black/60 border-white/20 text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4 text-pink-400" />
            <span>{isMicListening ? 'Listening...' : 'Enable Mic Blow 🎤'}</span>
          </button>

          <button
            onClick={handleBlowOut}
            className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 backdrop-blur-md"
          >
            <Wind className="w-4 h-4" /> Tap To Blow
          </button>
        </div>
      </div>

      {showAgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <button 
              onClick={() => setShowAgeModal(false)}
              className="absolute top-3 right-3 text-slate-300 hover:text-white p-1.5 rounded-full bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-lg animate-pulse">
              👑
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-300">Milestone Unlocked!</span>
              <h3 className="text-3xl font-serif font-extrabold text-amber-300">
                {isAnniversary 
                  ? `${milestoneCount} Years Completed! 🥂` 
                  : `You turned ${milestoneCount}! 🎂`}
              </h3>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed font-light">
                {isAnniversary
                  ? <>Happy {getOrdinal(milestoneCount)} Anniversary to <span className="font-semibold text-pink-300">{wishData.recipient}</span>! May your bond grow stronger with every passing year!</>
                  : <>Happy {getOrdinal(milestoneCount)} Birthday, <span className="font-semibold text-pink-300">{wishData.recipient}</span>! May this new chapter bring endless joy and adventure!</>}
              </p>
            </div>

            <button
              onClick={() => setShowAgeModal(false)}
              className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-1.5 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Continue Celebration
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="px-7 py-3 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-md"
        >
          <span>Unbox Surprise Gifts 🎁</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}