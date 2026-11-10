/**
 * Procedural Ambient Audio Generator and Speech Synthesis for Tikbook E-reader
 * Uses Web Audio API for noise synthesis (Rain, Fireplace, Library)
 * Uses Web Speech API for audiobook narration
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private activeType: string = 'silence';
  private fireInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSound(type: 'rain' | 'fireplace' | 'library' | 'coffee' | 'silence', volume: number = 0.5) {
    this.stopSound();
    if (type === 'silence') {
      this.activeType = 'silence';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx) return;

      this.activeType = type;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (type === 'rain') {
        this.createRainSound();
      } else if (type === 'fireplace') {
        this.createFireplaceSound();
      } else if (type === 'library' || type === 'coffee') {
        this.createLibrarySound();
      }
    } catch {
      // Audio autoplay might be limited until user gesture
    }
  }

  private createRainSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start(0);
    this.currentSource = whiteNoise;
  }

  private createFireplaceSound() {
    if (!this.ctx || !this.gainNode) return;
    // Base low rumble
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(this.gainNode);
    osc.start();

    // Crackle generator
    this.fireInterval = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || this.activeType !== 'fireplace') return;
      if (Math.random() > 0.4) {
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(200 + Math.random() * 800, this.ctx.currentTime);
        snapGain.gain.setValueAtTime(0.12 * Math.random(), this.ctx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        snapOsc.connect(snapGain);
        snapGain.connect(this.gainNode);
        snapOsc.start();
        snapOsc.stop(this.ctx.currentTime + 0.06);
      }
    }, 180);

    this.currentSource = osc;
  }

  private createLibrarySound() {
    if (!this.ctx || !this.gainNode) return;
    // Deep warm relaxing drone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    droneGain.connect(this.gainNode);

    osc1.start();
    osc2.start();
    this.currentSource = osc1;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
    }
  }

  public playPageTurn() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  public stopSound() {
    if (this.fireInterval) {
      clearInterval(this.fireInterval);
      this.fireInterval = null;
    }
    if (this.currentSource) {
      try {
        (this.currentSource as AudioScheduledSourceNode).stop?.();
        this.currentSource.disconnect();
      } catch {
        // Source might already have stopped
      }
      this.currentSource = null;
    }
    this.activeType = 'silence';
  }

  public getActiveSound(): string {
    return this.activeType;
  }
}

export const ambientAudio = new AmbientAudioEngine();

// Text to speech narrator manager with voice selection
class SpeechNarrator {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private onEndCallback: (() => void) | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private onVoicesLoadedCallbacks: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const update = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.onVoicesLoadedCallbacks.forEach(cb => cb(this.voices));
      };

      update();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = update;
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  public onVoicesReady(cb: (voices: SpeechSynthesisVoice[]) => void) {
    if (this.voices.length > 0) {
      cb(this.voices);
    }
    this.onVoicesLoadedCallbacks.push(cb);
  }

  public speak(
    text: string,
    onEnd?: () => void,
    speed: number = 0.95,
    pitch: number = 1.0,
    voiceURI?: string
  ) {
    this.stop();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.onEndCallback = onEnd || null;
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'es-ES';
    this.utterance.rate = Math.max(0.5, Math.min(2.0, speed));
    this.utterance.pitch = Math.max(0.5, Math.min(1.8, pitch));

    const allVoices = this.getVoices();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (voiceURI) {
      selectedVoice = allVoices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    }

    if (!selectedVoice) {
      // Pick best Spanish voice
      selectedVoice = allVoices.find(v => v.lang.startsWith('es') || v.lang.includes('ES')) || allVoices[0];
    }

    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
      this.utterance.lang = selectedVoice.lang;
    }

    this.utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(this.utterance);
  }

  public testVoice(voiceURI: string, pitch: number = 1.0, speed: number = 1.0) {
    this.speak(
      'Tikbook. Las palabras susurran historias en la penumbra del lector.',
      undefined,
      speed,
      pitch,
      voiceURI
    );
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.isSpeaking = false;
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isSpeaking = true;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getStatus() {
    return this.isSpeaking;
  }
}

export const speechNarrator = new SpeechNarrator();
