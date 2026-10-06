// Satu-satunya tempat yang menyentuh Web Audio, <audio> dan Web Speech API.
// Semua method aman dipanggil kapan saja: kegagalan audio tidak pernah menghentikan game.
import { MUSIC_URL, VOICE_FILES, VOICE_LANG, DEFAULTS } from './config.js';
import { SFX, createMusicLoop } from './synth.js';

class AudioManager {
  ctx = null;
  musicGain = null;
  sfxGain = null;
  stopLoop = null;
  musicEl = null;
  voiceEl = null;
  voice = null;
  lastSpeech = { text: '', at: 0 };
  musicEnabled = true;
  sfxEnabled = true;
  voiceEnabled = true;
  musicVolume = DEFAULTS.musicVolume;
  sfxVolume = DEFAULTS.sfxVolume;
  wantMusic = false;
  listeners = new Set();

  constructor() {
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        const choose = () => {
          const voices = synth.getVoices();
          this.voice = voices.find((v) => v.lang?.replace('_', '-').toLowerCase().startsWith('id')) || null;
        };
        choose();
        synth.addEventListener?.('voiceschanged', choose);
      }
    } catch { /* Web Speech tidak tersedia */ }
  }

  get speechSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // true jika browser masih menahan audio (belum ada interaksi pengguna).
  get locked() {
    return !this.ctx || this.ctx.state !== 'running';
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit() { this.listeners.forEach((fn) => fn()); }

  // Panggil dari event sentuh/klik. Membuat AudioContext & membuka kunci autoplay.
  unlock() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.ctx.onstatechange = () => this.emit();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.sfxGain.gain.value = this.sfxVolume;
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().then(() => this.emit(), () => {});
      // iOS: "pancing" speechSynthesis di dalam gesture agar ucapan berikutnya diizinkan.
      if (this.speechSupported && !this._primed) {
        this._primed = true;
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        window.speechSynthesis.speak(u);
      }
      if (this.wantMusic) this.playMusic();
    } catch { /* abaikan */ }
    this.emit();
  }

  playMusic() {
    this.wantMusic = true;
    if (!this.musicEnabled || this.locked) return;
    try {
      if (MUSIC_URL) {
        if (!this.musicEl) {
          this.musicEl = new Audio(MUSIC_URL);
          this.musicEl.loop = true;
          this.musicEl.onerror = () => { this.musicEl = null; };
        }
        this.musicEl.volume = this.musicVolume;
        this.musicEl.play().catch(() => {});
      } else if (!this.stopLoop) {
        this.stopLoop = createMusicLoop(this.ctx, this.musicGain);
      }
    } catch { /* abaikan */ }
  }

  stopMusic() {
    this.wantMusic = false;
    this.stopLoop?.();
    this.stopLoop = null;
    try { this.musicEl?.pause(); } catch { /* abaikan */ }
  }

  playSfx(name) {
    if (!this.sfxEnabled || this.locked || !SFX[name]) return;
    try { SFX[name](this.ctx, this.sfxGain); } catch { /* abaikan */ }
  }

  // speak(text): kalimat baru menggantikan kalimat lama (tidak bertumpuk).
  // Kalimat yang sama dalam 1 detik diabaikan agar tidak diulang-ulang saat anak mengetuk cepat.
  speak(text, { fileKey } = {}) {
    if (!this.voiceEnabled || !text) return;
    const now = performance.now();
    if (this.lastSpeech.text === text && now - this.lastSpeech.at < 1000) return;
    this.lastSpeech = { text, at: now };
    this.stopVoice();

    const file = VOICE_FILES[fileKey] || VOICE_FILES[text];
    if (file) {
      try {
        this.voiceEl = new Audio(file);
        this.duck(true);
        this.voiceEl.onended = this.voiceEl.onerror = () => this.duck(false);
        this.voiceEl.play().catch(() => { this.duck(false); this.speakTTS(text); });
        return;
      } catch { /* jatuh ke TTS */ }
    }
    this.speakTTS(text);
  }

  speakLetter(letter) {
    this.speak(letter.spoken, { fileKey: `letter:${letter.id}` });
  }

  speakTTS(text) {
    if (!this.speechSupported) return;
    try {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.voice?.lang || VOICE_LANG;
      if (this.voice) u.voice = this.voice;
      u.rate = 0.9;
      u.pitch = 1.15;
      u.onstart = () => this.duck(true);
      u.onend = u.onerror = () => this.duck(false);
      // Jeda kecil setelah cancel(): Chrome kadang membuang ucapan yang dipanggil langsung.
      setTimeout(() => { try { synth.speak(u); } catch { /* abaikan */ } }, 60);
    } catch { /* abaikan */ }
  }

  stopVoice() {
    try { this.voiceEl?.pause(); } catch { /* abaikan */ }
    try { if (this.speechSupported) window.speechSynthesis.cancel(); } catch { /* abaikan */ }
    this.duck(false);
  }

  // Kecilkan musik saat guide berbicara.
  duck(on) {
    try {
      const v = on ? this.musicVolume * 0.35 : this.musicVolume;
      if (this.musicGain && this.ctx) this.musicGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
      if (this.musicEl) this.musicEl.volume = v;
    } catch { /* abaikan */ }
  }

  setMusicEnabled(on) {
    this.musicEnabled = on;
    if (on) { if (this.wantMusic) this.playMusic(); } else {
      const want = this.wantMusic;
      this.stopMusic();
      this.wantMusic = want;
    }
  }
  setSfxEnabled(on) { this.sfxEnabled = on; }
  setVoiceEnabled(on) {
    this.voiceEnabled = on;
    if (!on) this.stopVoice();
  }
  setMusicVolume(v) {
    this.musicVolume = v;
    this.duck(false);
  }
  setSfxVolume(v) {
    this.sfxVolume = v;
    try { if (this.sfxGain) this.sfxGain.gain.value = v; } catch { /* abaikan */ }
  }
}

export const audio = new AudioManager();
