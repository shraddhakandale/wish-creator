import { Eye, Wand2 } from 'lucide-react';

export default function Navbar({ viewMode, setViewMode, wishData, currentStep }) {
  return (
    <header className="relative z-20 w-full px-4 py-3 bg-slate-900/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20">
          🎂
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-base text-pink-300 tracking-wide leading-tight flex items-center gap-1.5">
            {viewMode === 'CREATOR' ? 'Birthday QR Studio' : `Surprise for ${wishData.recipient}`}
          </h1>
          <p className="text-[11px] text-slate-400">
            {viewMode === 'CREATOR' ? 'Create & Share Scannable Wish Cards' : `Interactive Experience • Step ${currentStep} of 4`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode(viewMode === 'CREATOR' ? 'EXPERIENCE' : 'CREATOR')}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold shadow hover:scale-105 transition-transform flex items-center gap-1.5"
        >
          {viewMode === 'CREATOR' ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Card</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create New QR</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}