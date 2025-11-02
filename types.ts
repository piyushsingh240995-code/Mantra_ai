export enum Voice {
  // English
  Zephyr = 'Zephyr',
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  // Hindi
  zubenelgenubi = 'zubenelgenubi',
  sadachbia = 'sadachbia',
  sadaltager = 'sadaltager',
  vindemiatrix = 'vindemiatrix',
  // Japanese
  gacrux = 'gacrux',
  rasalgethi = 'rasalgethi',
  // Sanskrit
  bharani = 'bharani',
  krittika = 'krittika',
}

export const voiceGroups = [
  {
    label: "English",
    options: [
      { value: Voice.Zephyr, label: 'Zephyr (Friendly & Warm)' },
      { value: Voice.Kore, label: 'Kore (Professional & Clear)' },
      { value: Voice.Puck, label: 'Puck (Playful & Energetic)' },
      { value: Voice.Charon, label: 'Charon (Deep & Authoritative)' },
      { value: Voice.Fenrir, label: 'Fenrir (Calm & Soothing)' },
    ]
  },
  {
    label: "Hindi / Hinglish",
    options: [
      { value: Voice.zubenelgenubi, label: 'Goku (Male, Energetic)' },
      { value: Voice.sadaltager, label: 'Gojo Satoru (Male, Confident)' },
      { value: Voice.sadachbia, label: 'Sukuna (Male, Deep)' },
      { value: Voice.vindemiatrix, label: 'Itachi (Male, Emotional)' },
    ]
  },
  {
    label: "Japanese",
    options: [
      { value: Voice.gacrux, label: 'Ichika (Female, Sweet)' },
      { value: Voice.rasalgethi, label: 'Tanjiro (Male, Energetic)' },
    ]
  },
  {
    label: "Sanskrit",
    options: [
      { value: Voice.bharani, label: 'Rishi (Male, Calm)' },
      { value: Voice.krittika, label: 'Devi (Female, Clear)' },
    ]
  }
];
