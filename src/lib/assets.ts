/**
 * Every replaceable file in one place. Change a path here and the whole site follows.
 * Files live in /public, so "/images/x.jpg" means public/images/x.jpg.
 *
 * Nothing below is bundled with the project: you supply the real files.
 * If a file is missing the page keeps working and shows a documented fallback.
 */
export const assets = {
  /** Your real photograph. Recommended: portrait 4:5, at least 800 x 1000, JPG or WebP. */
  profilePhoto: "/images/portrait/profile.jpg",

  /** Your real CV. Must be a PDF you made yourself. */
  cv: {
    path: "/files/cv.pdf",
    /** The name the visitor's device saves the file under. */
    downloadName: "Taufiq_Candra_Kurniawan_CV.pdf",
  },

  /** A track you are licensed to use (see public/audio/README.md). */
  music: "/audio/wizarding-ambience.mp3",

  /**
   * Optional photographic backdrops for the sections below the hero (the hero keeps its animated scene).
   * Leave a value empty to use the built-in illustrated backdrop, which is original artwork drawn in code.
   * Only use images you own or are licensed to use, for example "/images/backgrounds/library.webp".
   */
  backdrops: {
    about: "",
    projects: "",
    experience: "",
    skills: "",
    contact: "",
  },
} as const;

export type BackdropId = keyof typeof assets.backdrops;
