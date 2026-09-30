import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, appId } from '../../config/firebase';
import { THEMES } from '../../config/themes';
import { compressImage } from '../../utils/imageCompressor';
import PrintablePostcard from './PrintablePostcard';

import { 
  Wand2, 
  Sliders, 
  QrCode, 
  Camera, 
  Trash2, 
  Gift, 
  Plus, 
  RefreshCw, 
  Eye,
  Type,
  Calendar
} from 'lucide-react';

export default function WishCreator({ wishData, setWishData, user, onPreview }) {
  const [activeTab, setActiveTab] = useState('FORM');
  const [isSaving, setIsSaving] = useState(false);
  const [createdWishId, setCreatedWishId] = useState(null);

  const handleTextChange = (field, val) => {
    setWishData(prev => ({ ...prev, [field]: val }));
  };

  const handleDeviceUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedList = await Promise.all(
        files.map(file => compressImage(file))
      );
      setWishData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...compressedList]
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const removePhoto = (idx) => {
    setWishData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  const updateScratchGift = (idx, text) => {
    const copy = [...wishData.scratchGifts];
    copy[idx] = text;
    setWishData(prev => ({ ...prev, scratchGifts: copy }));
  };

  const addScratchGift = () => {
    if (wishData.scratchGifts.length >= 6) return;
    setWishData(prev => ({
      ...prev,
      scratchGifts: [...prev.scratchGifts, '🎁 New Surprise Reward!']
    }));
  };

  const handleSaveAndGenerate = async () => {
    setIsSaving(true);
    try {
      if (user) {
        const wishesRef = collection(db, 'artifacts', appId, 'public', 'data', 'wishes');
        const docRef = await addDoc(wishesRef, {
          ...wishData,
          createdAt: new Date().toISOString(),
          createdBy: user.uid
        });
        setCreatedWishId(docRef.id);
      } else {
        const encoded = btoa(encodeURIComponent(JSON.stringify(wishData)));
        setCreatedWishId(`hash_${encoded}`);
      }
      setActiveTab('POSTCARD');
    } catch (err) {
      console.error('Cloud save failed', err);
      const encoded = btoa(encodeURIComponent(JSON.stringify(wishData)));
      setCreatedWishId(`hash_${encoded}`);
      setActiveTab('POSTCARD');
    } finally {
      setIsSaving(false);
    }
  };

  const getFullShareUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    if (!createdWishId) return origin;
    if (createdWishId.startsWith('hash_')) {
      return `${origin}#data=${createdWishId.replace('hash_', '')}`;
    }
    return `${origin}?wishId=${createdWishId}`;
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-pink-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <Wand2 className="w-3.5 h-3.5" /> Studio Generator
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white drop-shadow">Design Greeting QR Card</h2>
        <p className="text-slate-300 text-xs sm:text-sm font-light">
          Customize every title, message, milestone count, photo, and reward completely dynamically!
        </p>
      </div>

      <div className="flex justify-center border-b border-white/10 pb-3 gap-3">
        <button
          onClick={() => setActiveTab('FORM')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-md flex items-center gap-2 ${
            activeTab === 'FORM'
              ? 'bg-black/60 border border-white/30 text-white shadow-lg'
              : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" /> 1. Customize Wish Data
        </button>
        <button
          onClick={handleSaveAndGenerate}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-md flex items-center gap-2 ${
            activeTab === 'POSTCARD'
              ? 'bg-black/60 border border-white/30 text-white shadow-lg'
              : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/10'
          }`}
        >
          <QrCode className="w-4 h-4" /> 2. View Printable QR Postcard
        </button>
      </div>

      {activeTab === 'FORM' ? (
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 border border-white/15 space-y-5 text-xs text-slate-200 shadow-2xl">
          
          {/* Occasion & Milestone Settings */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label className="text-slate-200 font-semibold flex items-center gap-1.5 text-sm">
              <Calendar className="w-4 h-4 text-pink-400" /> Occasion Setup
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Occasion</label>
                <select
                  value={wishData.occasion || 'birthday'}
                  onChange={(e) => handleTextChange('occasion', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                >
                  <option value="birthday">Birthday 🎂</option>
                  <option value="anniversary">Anniversary 🥂</option>
                  <option value="festival">Festival 🪔</option>
                </select>
              </div>

              <div>
                {wishData.occasion === 'anniversary' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Years Completed</label>
                    <input
                      type="number"
                      value={wishData.yearsCompleted || 5}
                      onChange={(e) => handleTextChange('yearsCompleted', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                    />
                  </div>
                )}
                {wishData.occasion === 'birthday' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Turning Age</label>
                    <input
                      type="number"
                      value={wishData.age || 21}
                      onChange={(e) => handleTextChange('age', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 21"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                    />
                  </div>
                )}
                {wishData.occasion === 'festival' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Festival Milestone / Year</label>
                    <input
                      type="text"
                      value={wishData.festivalYear || '2026'}
                      onChange={(e) => handleTextChange('festivalYear', e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Header Titles */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label className="text-slate-200 font-semibold flex items-center gap-1.5 text-sm">
              <Type className="w-4 h-4 text-amber-400" /> Header Titles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Main Card Title *</label>
                <input
                  type="text"
                  value={wishData.cardTitle || ''}
                  onChange={(e) => handleTextChange('cardTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Header Subtitle</label>
                <input
                  type="text"
                  value={wishData.headerSubtitle || ''}
                  onChange={(e) => handleTextChange('headerSubtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Recipient Name *</label>
              <input
                type="text"
                value={wishData.recipient}
                onChange={(e) => handleTextChange('recipient', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Sender Name(s) *</label>
              <input
                type="text"
                value={wishData.sender}
                onChange={(e) => handleTextChange('sender', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 backdrop-blur-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Visual Color Palette & Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(THEMES).map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTextChange('theme', t.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all backdrop-blur-sm ${
                    wishData.theme === t.id
                      ? 'border-pink-400 bg-black/80 text-white font-bold shadow-lg'
                      : 'border-white/10 bg-black/40 text-slate-400 hover:border-white/30 hover:bg-black/60'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Heartfelt Message / Letter</label>
            <textarea
              rows="3"
              value={wishData.wishMessage}
              onChange={(e) => handleTextChange('wishMessage', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-pink-400 resize-none leading-relaxed backdrop-blur-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-400" /> Device Memory Photos
              </label>
            </div>

            <div className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-4 bg-black/40 text-center transition-all relative group cursor-pointer backdrop-blur-sm">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleDeviceUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-full bg-black/60 text-pink-300 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  Tap or drag photos from gallery
                </p>
              </div>
            </div>

            {wishData.photos && wishData.photos.length > 0 && (
              <div className="mt-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {wishData.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/20 group bg-black/60">
                      <img src={photo} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full hover:scale-110 transition-transform shadow"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" /> Virtual Scratch Rewards
              </label>
              <button
                type="button"
                onClick={addScratchGift}
                className="text-[11px] text-amber-300 bg-black/50 hover:bg-black/70 px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3" /> Add Gift
              </button>
            </div>

            <div className="space-y-2">
              {wishData.scratchGifts.map((gift, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={gift}
                    onChange={(e) => updateScratchGift(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs backdrop-blur-sm"
                  />
                  {wishData.scratchGifts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setWishData(prev => ({
                          ...prev,
                          scratchGifts: prev.scratchGifts.filter((_, idx) => idx !== i)
                        }));
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              disabled={isSaving}
              className="flex-1 py-3 rounded-2xl bg-black/70 hover:bg-black/90 border border-white/30 text-white font-bold text-xs shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" /> Generate QR Code Postcard
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onPreview}
              className="px-6 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 backdrop-blur-md"
            >
              <Eye className="w-4 h-4" /> Live Preview
            </button>
          </div>
        </div>
      ) : (
        <PrintablePostcard
          wishData={wishData}
          shareUrl={getFullShareUrl()}
          onPreview={onPreview}
        />
      )}
    </div>
  );
}