import { useState, useEffect } from "react";
import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, appId } from "./config/firebase";
import { THEMES, DEFAULT_WISH } from "./config/themes";

import Navbar from "./components/common/Navbar";
import BackgroundParticles from "./components/common/BackgroundParticles";
import WishCreator from "./components/creator/WishCreator";
import ExperienceFlow from "./components/experience/ExperienceFlow";
import { Cake } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [viewMode, setViewMode] = useState("LOADING"); // 'LOADING' | 'EXPERIENCE' | 'CREATOR'
  const [wishData, setWishData] = useState(DEFAULT_WISH);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Auth fallback anonymous", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const wishId = searchParams.get("wishId");
    const hash = window.location.hash.substring(1);

    if (hash && hash.startsWith("data=")) {
      try {
        const jsonStr = decodeURIComponent(atob(hash.replace("data=", "")));
        const parsed = JSON.parse(jsonStr);
        setWishData(parsed);
        setViewMode("EXPERIENCE");
        return;
      } catch (e) {
        console.error("Hash decode error:", e);
      }
    }

    if (wishId) {
      if (!authInitialized) return;

      const fetchWish = async () => {
        try {
          const docRef = doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "wishes",
            wishId,
          );
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setWishData(snap.data());
            setViewMode("EXPERIENCE");
            return;
          }
        } catch (e) {
          console.error("Firestore load error:", e);
        }
        setViewMode("CREATOR");
      };

      fetchWish();
      return;
    }

    if (authInitialized) {
      setViewMode("CREATOR");
    }
  }, [user, authInitialized]);

  const activeTheme = THEMES[wishData.theme] || THEMES.rose;

  if (viewMode === "LOADING") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <Cake className="w-6 h-6 text-pink-400 animate-pulse" />
        </div>
        <p className="text-slate-300 text-sm font-medium tracking-wide">
          Unwrapping Magical Surprise...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${activeTheme.bgGradient} text-slate-100 flex flex-col justify-between font-sans relative overflow-x-hidden transition-colors duration-700 select-none`}
    >
      <BackgroundParticles particleType={activeTheme.particleType} />

      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        wishData={wishData}
        currentStep={currentStep}
      />

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-6 max-w-4xl mx-auto w-full">
        {viewMode === "CREATOR" ? (
          <WishCreator
            wishData={wishData}
            setWishData={setWishData}
            user={user}
            onPreview={() => {
              setCurrentStep(1);
              setViewMode("EXPERIENCE");
            }}
          />
        ) : (
          <ExperienceFlow
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            wishData={wishData}
            onOpenCreator={() => setViewMode("CREATOR")}
          />
        )}
      </main>

      <footer className="relative z-10 w-full py-3 text-center text-xs text-slate-400/80 border-t border-white/5 backdrop-blur-sm">
        Crafted with ❤️ • Scannable Greeting Experience Generator
      </footer>
    </div>
  );
}