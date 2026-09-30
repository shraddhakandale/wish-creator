class AudioSynthManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timeoutId = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio pop error', e);
    }
  }

  playBirthdaySong(onNote) {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;

    const notes = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.35 }, { f: 293.66, d: 0.7 },
      { f: 261.63, d: 0.7 },  { f: 349.23, d: 0.7 },  { f: 329.63, d: 1.1 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.35 }, { f: 293.66, d: 0.7 },
      { f: 261.63, d: 0.7 },  { f: 392.00, d: 0.7 },  { f: 349.23, d: 1.1 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.35 }, { f: 523.25, d: 0.7 },
      { f: 440.00, d: 0.7 },  { f: 349.23, d: 0.7 },  { f: 329.63, d: 0.7 }, { f: 293.66, d: 0.9 },
      { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.35 }, { f: 440.00, d: 0.7 },
      { f: 349.23, d: 0.7 },  { f: 392.00, d: 0.7 },  { f: 349.23, d: 1.2 }
    ];

    let startTime = this.ctx.currentTime + 0.05;
    notes.forEach((note, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);
      
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.d);

      if (onNote) {
        setTimeout(() => {
          if (this.isPlaying) onNote(idx);
        }, (startTime - this.ctx.currentTime) * 1000);
      }

      startTime += note.d + 0.08;
    });

    const totalDuration = (startTime - this.ctx.currentTime) * 1000;
    this.timeoutId = setTimeout(() => {
      if (this.isPlaying) {
        this.playBirthdaySong(onNote);
      }
    }, totalDuration);
  }

  stop() {
    this.isPlaying = false;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

export const synthManager = new AudioSynthManager();