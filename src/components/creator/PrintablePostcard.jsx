import { Copy, Share2, Play } from 'lucide-react';

export default function PrintablePostcard({ wishData, shareUrl, onPreview }) {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(shareUrl)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Surprise Card for ${wishData.recipient}`,
        text: `Scan this QR code or tap the link to unlock your interactive card!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 text-center relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400"></div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Printable Postcard</span>
        <h3 className="text-2xl font-serif font-bold text-amber-300">{wishData.cardTitle}</h3>
        <p className="text-xs text-slate-300">Scan this QR code with any phone camera to unlock your surprise!</p>
      </div>

      <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-4 border-pink-400/30 my-1">
        <img 
          src={qrImageUrl} 
          alt="QR Code" 
          className="w-52 h-52 object-contain mx-auto"
        />
        <p className="text-[10px] text-slate-600 font-semibold mt-2">To: {wishData.recipient} • From: {wishData.sender}</p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-pink-400" /> Copy Link
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Postcard
          </button>
        </div>

        <button
          onClick={onPreview}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-all"
        >
          <Play className="w-4 h-4 fill-current" /> Experience Interactive Card Now
        </button>
      </div>
    </div>
  );
}