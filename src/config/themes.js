export const THEMES = {
  rose: {
    id: 'rose',
    name: 'Rose Romantic 🌹',
    bgGradient: 'from-slate-950 via-rose-950 to-pink-950',
    primary: 'pink',
    secondary: 'rose',
    particleType: 'hearts' 
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Neon 🌌',
    bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
    primary: 'purple',
    secondary: 'indigo',
    particleType: 'stars' 
  },
  festival: {
    id: 'festival',
    name: 'Festival Celebration 🪔',
    bgGradient: 'from-slate-950 via-amber-950 to-orange-950',
    primary: 'amber',
    secondary: 'orange',
    particleType: 'festival' 
  },
  gifts: {
    id: 'gifts',
    name: 'Surprise Unboxing 🎁',
    bgGradient: 'from-slate-950 via-emerald-950 to-teal-950',
    primary: 'emerald',
    secondary: 'teal',
    particleType: 'gifts' 
  },
  sky: {
    id: 'sky',
    name: 'Up In The Clouds 🎈',
    bgGradient: 'from-slate-950 via-sky-900 to-cyan-950',
    primary: 'cyan',
    secondary: 'sky',
    particleType: 'balloons' 
  }
};

export const DEFAULT_WISH = {
  recipient: 'Alex',
  sender: 'Sam & Friends',
  occasion: 'birthday', // 'birthday' | 'anniversary' | 'festival'
  age: 21,
  yearsCompleted: 5,
  theme: 'rose',
  cardTitle: 'Happy Birthday, Alex! 🎉',
  headerSubtitle: 'Wishing you an incredible day filled with love and laughter.',
  wishMessage: 'On this special day, I want to celebrate how incredible, kind, and brilliant you are. May your year ahead be filled with overflowing laughter, boundless success, unforgettable adventures, and every bit of happiness you truly deserve!',
  photos: [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop'
  ],
  scratchGifts: [
    '🎟️ Unlimited Hugs & Movie Night Pass!',
    '🍕 Gourmet Dinner & Drinks On Me Any Day!',
    '✨ One Secret Wish Granted No Questions Asked!'
  ]
};