const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;

// Decodes a base64 string into a Uint8Array.
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM audio data into an AudioBuffer.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// Plays audio from a base64 encoded string.
export async function playAudio(base64Audio: string): Promise<{ source: AudioBufferSourceNode; context: AudioContext }> {
  // FIX: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: SAMPLE_RATE,
  });
  
  const decodedBytes = decode(base64Audio);
  const audioBuffer = await decodeAudioData(decodedBytes, audioContext, SAMPLE_RATE, NUM_CHANNELS);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();

  return { source, context: audioContext };
}

// Stops an audio source.
export function stopAudio(source: AudioBufferSourceNode) {
  try {
    source.stop();
  } catch(e) {
    console.warn("Could not stop audio source, it might have already finished.", e);
  }
}
