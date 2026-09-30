import { useState } from 'react';
import { Heart, Star, Sparkles, PartyPopper, Gift } from 'lucide-react';

const BALLOON_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const FESTIVAL_TYPES = ['diya', 'lantern', 'cracker', 'holi'];
const HOLI_COLORS = ['#f43f5e', '#a855f7', '#06b6d4', '#eab308', '#22c55e', '#ec4899'];

export default function BackgroundParticles({ particleType = 'hearts' }) {
  const [particles] = useState(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 22) + 18, 
      duration: Math.random() * 12 + 10, 
      delay: Math.random() * 10, 
      opacity: Math.random() * 0.2 + 0.8, 
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      festivalVariant: FESTIVAL_TYPES[Math.floor(Math.random() * FESTIVAL_TYPES.length)],
      holiColor: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
      swayType: Math.random() > 0.5 ? 1 : 2 
    }));
  });

  const getIcon = (type, p) => {
    switch (type) {
      case 'hearts':
        return <Heart size={p.size} className="text-pink-300 fill-pink-300/20" />;
      case 'stars':
        return <Star size={p.size} className="text-purple-300 fill-purple-300/20" />;
      case 'sparkles':
        return <Sparkles size={p.size} className="text-amber-300" />;
      case 'party':
        return <PartyPopper size={p.size} className="text-teal-300" />;
      case 'gifts':
        return <Gift size={p.size} className="text-rose-300" />;
      case 'balloons':
        return (
          <svg width={p.size * 1.5} height={p.size * 2.2} viewBox="0 0 100 160" style={{ color: p.color }}>
            <path d="M50,105 Q40,125 50,140 T50,160" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
            <path d="M50,5 C20,5 5,30 5,60 C5,85 30,105 50,105 C70,105 95,85 95,60 C95,30 80,5 50,5 Z" fill="currentColor" />
            <ellipse cx="28" cy="35" rx="8" ry="20" transform="rotate(-30 28 35)" fill="rgba(255,255,255,0.3)" />
            <polygon points="43,103 57,103 50,112" fill="currentColor" />
          </svg>
        );
      case 'festival':
        // Renders random festive elements: Diyas, Lanterns, Crackers, and Holi color clouds
        if (p.festivalVariant === 'diya') {
          return (
            <svg width={p.size * 1.6} height={p.size * 1.2} viewBox="0 0 100 80">
              {/* Diya Flame */}
              <path d="M50,5 C45,20 35,30 50,45 C65,30 55,20 50,5 Z" fill="#fef08a" opacity="0.9" />
              <path d="M50,15 C47,23 42,28 50,38 C58,28 53,23 50,15 Z" fill="#f97316" />
              {/* Clay Bowl Base */}
              <path d="M10,50 Q50,85 90,50 Z" fill="#b45309" />
              <path d="M15,45 Q50,40 85,45 Q90,50 85,55 Q50,90 15,55 Q10,50 15,45 Z" fill="#d97706" />
            </svg>
          );
        } else if (p.festivalVariant === 'lantern') {
          return (
            <svg width={p.size * 1.2} height={p.size * 1.6} viewBox="0 0 80 110">
              {/* Hanging string */}
              <path d="M40,0 L40,20" stroke="#fde047" strokeWidth="2" fill="none" />
              {/* Paper Lantern Body */}
              <ellipse cx="40" cy="55" rx="25" ry="30" fill="#f43f5e" />
              {/* Lantern Ribs */}
              <path d="M40,25 Q30,55 40,85 Q50,55 40,25 Z" fill="#fbbf24" opacity="0.6" />
              {/* Top & Bottom Caps */}
              <rect x="30" y="20" width="20" height="6" rx="2" fill="#ca8a04" />
              <rect x="30" y="84" width="20" height="6" rx="2" fill="#ca8a04" />
            </svg>
          );
        } else if (p.festivalVariant === 'cracker') {
          return (
            <svg width={p.size * 1.4} height={p.size * 1.4} viewBox="0 0 100 100">
              {/* Firework Sparkle / Cracker Burst */}
              <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="50" r="10" fill="#f97316" />
              <circle cx="50" cy="50" r="4" fill="#ffffff" />
            </svg>
          );
        } else {
          // Holi Color Splash Cloud
          return (
            <svg width={p.size * 1.5} height={p.size * 1.2} viewBox="0 0 100 80" style={{ color: p.holiColor }}>
              <path d="M20,50 Q10,30 35,25 Q50,5 65,25 Q90,30 80,50 Q90,70 65,75 Q50,90 35,75 Q10,70 20,50 Z" fill="currentColor" opacity="0.75" />
            </svg>
          );
        }
      default:
        return <Sparkles size={p.size} className="text-white/40" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <style>{`
        @keyframes lucideFloatUp {
          0% { transform: translate3d(0, 110vh, 0) rotate(0deg) scale(0.8); }
          50% { transform: translate3d(15px, 50vh, 0) rotate(180deg) scale(1.1); }
          100% { transform: translate3d(-15px, -20vh, 0) rotate(360deg) scale(0.8); }
        }

        @keyframes balloonFloatUp1 {
          0% { transform: translate3d(0, 110vh, 0) rotate(0deg); }
          33% { transform: translate3d(25px, 65vh, 0) rotate(8deg); }
          66% { transform: translate3d(-20px, 20vh, 0) rotate(-8deg); }
          100% { transform: translate3d(0, -20vh, 0) rotate(0deg); }
        }

        @keyframes balloonFloatUp2 {
          0% { transform: translate3d(0, 110vh, 0) rotate(0deg); }
          33% { transform: translate3d(-25px, 65vh, 0) rotate(-8deg); }
          66% { transform: translate3d(20px, 20vh, 0) rotate(8deg); }
          100% { transform: translate3d(0, -20vh, 0) rotate(0deg); }
        }
      `}</style>

      {particles.map((p) => {
        let animationName = 'lucideFloatUp';
        if (particleType === 'balloons' || particleType === 'festival') {
          animationName = p.swayType === 1 ? 'balloonFloatUp1' : 'balloonFloatUp2';
        }

        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.left,
              opacity: particleType === 'balloons' || particleType === 'festival' ? p.opacity : p.opacity * 0.5,
              animation: `${animationName} ${p.duration}s linear infinite`,
              animationDelay: `-${p.delay}s`,
              willChange: 'transform',
            }}
          >
            {getIcon(particleType, p)}
          </div>
        );
      })}
    </div>
  );
}