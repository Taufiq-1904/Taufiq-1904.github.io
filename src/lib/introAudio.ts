/**
 * Tiny synthesised soundscape for the intro (wind, latch, creaking gate, shimmer).
 * Built with the Web Audio API so there are no audio files to download.
 * Nothing is created until the visitor opts in, which also satisfies autoplay rules.
 */
export type IntroAudio = {
  setEnabled: (on: boolean) => void;
  playOpen: () => void;
  dispose: () => void;
};

type Ambient = { fadeOut: (at: number) => void; stop: () => void };

export function createIntroAudio(): IntroAudio | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  let ctx: AudioContext;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  let enabled = false;
  let disposed = false;
  let ambient: Ambient | null = null;
  let suspendTimer = 0;

  const brownNoise = (seconds: number) => {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    return buffer;
  };

  const tone = (freq: number, start: number, duration: number, peak: number, type: OscillatorType = "sine") => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  };

  const startAmbient = (): Ambient => {
    const src = ctx.createBufferSource();
    src.buffer = brownNoise(4);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);
    // A slow swell makes the noise read as wind.
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();
    lfo.frequency.value = 0.13;
    lfoDepth.gain.value = 140;
    lfo.connect(lfoDepth).connect(filter.frequency);
    src.connect(filter).connect(gain).connect(master);
    src.start();
    lfo.start();
    return {
      fadeOut: (at) => {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setTargetAtTime(0.0001, at, 0.5);
      },
      stop: () => {
        try {
          src.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
      },
    };
  };

  const setEnabled = (on: boolean) => {
    if (disposed) return;
    enabled = on;
    window.clearTimeout(suspendTimer);
    const now = ctx.currentTime;
    if (on) {
      void ctx.resume();
      ambient ??= startAmbient();
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0.85, now, 0.15);
      // Soft confirmation so the visitor hears that sound is on.
      tone(659.25, now + 0.05, 1.1, 0.05);
      tone(987.77, now + 0.2, 1.3, 0.035);
    } else {
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0, now, 0.08);
      suspendTimer = window.setTimeout(() => {
        if (!enabled && !disposed) void ctx.suspend();
      }, 500);
    }
  };

  const playOpen = () => {
    if (disposed || !enabled) return;
    const t0 = ctx.currentTime + 0.05;

    // Latch thud
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(95, t0 + 0.4);
    thud.frequency.exponentialRampToValueAtTime(34, t0 + 0.9);
    thudGain.gain.setValueAtTime(0.0001, t0 + 0.4);
    thudGain.gain.exponentialRampToValueAtTime(0.55, t0 + 0.43);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1);
    thud.connect(thudGain).connect(master);
    thud.start(t0 + 0.4);
    thud.stop(t0 + 1.1);

    // Slow iron creak: low saw with vibrato through a low-pass
    const creak = ctx.createOscillator();
    const creakFilter = ctx.createBiquadFilter();
    const creakGain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibratoDepth = ctx.createGain();
    creak.type = "sawtooth";
    creak.frequency.setValueAtTime(72, t0 + 0.55);
    creak.frequency.linearRampToValueAtTime(50, t0 + 3);
    creakFilter.type = "lowpass";
    creakFilter.frequency.value = 280;
    vibrato.frequency.value = 6.5;
    vibratoDepth.gain.value = 5;
    vibrato.connect(vibratoDepth).connect(creak.frequency);
    creakGain.gain.setValueAtTime(0.0001, t0 + 0.55);
    creakGain.gain.exponentialRampToValueAtTime(0.13, t0 + 1.2);
    creakGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.1);
    creak.connect(creakFilter).connect(creakGain).connect(master);
    creak.start(t0 + 0.55);
    vibrato.start(t0 + 0.55);
    creak.stop(t0 + 3.2);
    vibrato.stop(t0 + 3.2);

    // Rising whoosh while the camera moves through the gate
    const whoosh = ctx.createBufferSource();
    whoosh.buffer = brownNoise(4);
    const whooshFilter = ctx.createBiquadFilter();
    const whooshGain = ctx.createGain();
    whooshFilter.type = "bandpass";
    whooshFilter.Q.value = 0.9;
    whooshFilter.frequency.setValueAtTime(220, t0 + 1);
    whooshFilter.frequency.exponentialRampToValueAtTime(2600, t0 + 3.7);
    whooshGain.gain.setValueAtTime(0.0001, t0 + 1);
    whooshGain.gain.exponentialRampToValueAtTime(0.28, t0 + 3.1);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.2);
    whoosh.connect(whooshFilter).connect(whooshGain).connect(master);
    whoosh.start(t0 + 1);
    whoosh.stop(t0 + 4.3);

    // Magic shimmer arpeggio, then a warm chord as the light floods in
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      tone(freq, t0 + 0.1 + i * 0.17, 1.8, 0.06, "sine");
      tone(freq * 2, t0 + 0.12 + i * 0.17, 1.2, 0.015, "triangle");
    });
    [392, 523.25, 659.25, 783.99].forEach((freq) => tone(freq, t0 + 2.9, 2.2, 0.05, "sine"));

    ambient?.fadeOut(t0 + 2.5);
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.clearTimeout(suspendTimer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(0, now, 0.06);
    window.setTimeout(() => {
      ambient?.stop();
      void ctx.close().catch(() => undefined);
    }, 400);
  };

  return { setEnabled, playOpen, dispose };
}
