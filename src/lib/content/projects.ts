import type { Localized } from "@/lib/i18n/locales";

// The project collection. Each entry only states what is actually known.
// Empty `contribution`, `stack` or `links` arrays are hidden in the dialog instead of being padded out,
// so fill them in as the facts are confirmed. Every sentence is written in English and Indonesian.
//
// To add a demo or repository link, fill `links`, for example:
//   links: [{ label: { en: "Live demo", id: "Demo langsung" }, href: "https://example.com" }]

export const projectCategories = ["Mobile", "Networking", "Security", "Infrastructure"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type ProjectLink = { label: Localized; href: string };

/** A real screenshot of the project. `src` is a path under /public, e.g. "/images/projects/scopeapp/dashboard.png". */
export type ProjectScreenshot = { src: string; alt?: Localized; caption?: Localized };

/** Which built-in conceptual diagram stands in until real screenshots are added. */
export type ProjectDiagram = "scopeapp" | "sdn" | "upcyclehub" | "console" | "kripto";
export type StackItem = { name: string; role?: Localized };

export type Project = {
  slug: string;
  name: string;
  /** One short line naming what kind of thing this is. */
  kind: Localized;
  categories: readonly [ProjectCategory, ...ProjectCategory[]];
  summary: Localized;
  /** Extra paragraphs shown in the dialog only. */
  details?: Localized<readonly string[]>;
  stack: readonly StackItem[];
  contribution: Localized<readonly string[]>;
  links: readonly ProjectLink[];
  /**
   * Real screenshots, in the order they should appear. While this is empty (or the files are
   * missing) the card shows the labelled conceptual diagram below instead, never an invented UI.
   * To add one: put the image in public/images/projects/<slug>/ and list it here.
   */
  screenshots: readonly ProjectScreenshot[];
  diagram: ProjectDiagram;
};

export const projects: readonly Project[] = [
  {
    slug: "scopeapp",
    name: "ScopeApp",
    kind: { en: "Hospital network monitoring", id: "Pemantauan jaringan rumah sakit" },
    categories: ["Mobile", "Networking", "Infrastructure"],
    summary: {
      en: "A network monitoring application for hospitals, pairing a Flutter app with a Node.js backend and a Prometheus and Grafana monitoring stack.",
      id: "Aplikasi pemantauan jaringan untuk rumah sakit, memadukan aplikasi Flutter dengan backend Node.js serta tumpukan pemantauan Prometheus dan Grafana.",
    },
    stack: [
      { name: "Flutter", role: { en: "Mobile app", id: "Aplikasi mobile" } },
      { name: "Node.js", role: { en: "Backend", id: "Backend" } },
      { name: "Docker", role: { en: "Containers", id: "Kontainer" } },
      { name: "Prometheus", role: { en: "Metrics", id: "Metrik" } },
      { name: "Grafana", role: { en: "Dashboards", id: "Dasbor" } },
      { name: "REST API", role: { en: "Integration with Prometheus", id: "Integrasi dengan Prometheus" } },
    ],
    contribution: {
      en: [
        "Built it during my software engineer internship at RST Slamet Riyadi Surakarta (January to February 2026).",
        "Designed and developed the Flutter app for real-time network and infrastructure monitoring in a hospital setting.",
        "Wrote REST API integration with Prometheus and Grafana to show server health, network traffic and system metrics.",
        "Containerized the monitoring services with Docker to simplify deployment.",
      ],
      id: [
        "Dikerjakan saat magang sebagai software engineer di RST Slamet Riyadi Surakarta (Januari hingga Februari 2026).",
        "Merancang dan mengembangkan aplikasi Flutter untuk pemantauan jaringan dan infrastruktur secara real-time di lingkungan rumah sakit.",
        "Menulis integrasi REST API dengan Prometheus dan Grafana untuk menampilkan kesehatan server, lalu lintas jaringan, dan metrik sistem.",
        "Mengemas layanan pemantauan dengan Docker agar deployment lebih mudah.",
      ],
    },
    links: [{ label: { en: "Source on GitHub", id: "Kode di GitHub" }, href: "https://github.com/Taufiq-1904/ScopeApp" }],
    screenshots: [],
    diagram: "scopeapp",
  },
  {
    slug: "sdn-dhcp-starvation",
    name: "SDN DHCP Starvation Detection",
    kind: { en: "Research and dashboard", id: "Riset dan dasbor" },
    categories: ["Networking", "Security"],
    summary: {
      en: "Research on classifying network traffic to detect DHCP starvation attacks in a software-defined network, using a Random Forest model.",
      id: "Riset klasifikasi lalu lintas jaringan untuk mendeteksi serangan DHCP starvation pada jaringan yang ditentukan perangkat lunak (SDN), menggunakan model Random Forest.",
    },
    details: {
      en: [
        "The network is emulated with Mininet and managed by a Ryu controller. A Streamlit dashboard presents the detector's output.",
      ],
      id: [
        "Jaringan diemulasikan dengan Mininet dan dikelola oleh kontroler Ryu. Dasbor Streamlit menampilkan keluaran detektor.",
      ],
    },
    stack: [
      { name: "Random Forest", role: { en: "Traffic classifier", id: "Pengklasifikasi lalu lintas" } },
      { name: "Mininet", role: { en: "Network emulation", id: "Emulasi jaringan" } },
      { name: "Ryu", role: { en: "SDN controller", id: "Kontroler SDN" } },
      { name: "Streamlit", role: { en: "Dashboard", id: "Dasbor" } },
    ],
    contribution: {
      en: [
        "Built the Streamlit dashboard for the detector.",
        "The model works on 19 traffic features; the dashboard explains each one in a short table, such as Unique Ingress, after a lecturer asked for them to be explained.",
        "Designed the interface to stay minimal and tidy.",
      ],
      id: [
        "Membangun dasbor Streamlit untuk detektor.",
        "Model bekerja dengan 19 fitur lalu lintas; dasbor menjelaskan tiap fitur dalam tabel singkat, misalnya Unique Ingress, setelah dosen meminta agar fitur-fitur itu dijelaskan.",
        "Merancang antarmuka agar tetap minimalis dan rapi.",
      ],
    },
    links: [],
    screenshots: [],
    diagram: "sdn",
  },
  {
    slug: "upcyclehub",
    name: "UpCycleHub",
    kind: { en: "Sustainable marketplace app", id: "Aplikasi marketplace berkelanjutan" },
    categories: ["Mobile"],
    summary: {
      en: "A marketplace app for upcycled goods that supports sustainable waste management, built with Flutter.",
      id: "Aplikasi marketplace barang hasil upcycle yang mendukung pengelolaan sampah berkelanjutan, dibangun dengan Flutter.",
    },
    stack: [
      { name: "Flutter", role: { en: "Mobile app", id: "Aplikasi mobile" } },
      { name: "GetX", role: { en: "Clean architecture", id: "Arsitektur bersih" } },
      { name: "Dio", role: { en: "HTTP client", id: "Klien HTTP" } },
      { name: "Firebase", role: { en: "Backend services", id: "Layanan backend" } },
      { name: "Cloudinary", role: { en: "Image storage", id: "Penyimpanan gambar" } },
    ],
    contribution: {
      en: [
        "Structured the app with GetX in a clean architecture layout.",
        "Moved configuration into a .env file using flutter_dotenv.",
        "Replaced Firebase Storage with Cloudinary for images.",
        "Fixed interface problems such as layout overflow, locale errors and a blank profile screen.",
        "Drew up a production architecture on Google Cloud: three Cloud Run services, two React and Vite frontends on App Engine, MySQL with Firestore, and Cloud Storage. This is a design, not a deployed system.",
      ],
      id: [
        "Menyusun aplikasi dengan GetX dalam tata letak arsitektur bersih.",
        "Memindahkan konfigurasi ke berkas .env menggunakan flutter_dotenv.",
        "Mengganti Firebase Storage dengan Cloudinary untuk penyimpanan gambar.",
        "Memperbaiki masalah antarmuka seperti layout overflow, galat locale, dan layar profil yang kosong.",
        "Merancang arsitektur produksi di Google Cloud: tiga layanan Cloud Run, dua frontend React dan Vite di App Engine, MySQL dengan Firestore, dan Cloud Storage. Ini adalah rancangan, bukan sistem yang sudah dideploy.",
      ],
    },
    links: [],
    screenshots: [],
    diagram: "upcyclehub",
  },
  {
    slug: "server-management-console",
    name: "Server Management Console",
    kind: { en: "Server administration", id: "Administrasi server" },
    categories: ["Infrastructure"],
    summary: {
      en: "A project for managing and monitoring servers from one place.",
      id: "Proyek untuk mengelola dan memantau server dari satu tempat.",
    },
    stack: [
      { name: "Node.js (Express)", role: { en: "Backend", id: "Backend" } },
      { name: "PostgreSQL", role: { en: "Database", id: "Basis data" } },
      { name: "Docker", role: { en: "Containers", id: "Kontainer" } },
      { name: "JWT", role: { en: "Authentication", id: "Autentikasi" } },
    ],
    contribution: {
      en: [
        "Built a JWT-secured server management system with role-based access control for three roles: user, manager and admin.",
        "Wrote more than ten REST API endpoints for user management and activity and audit logging.",
        "Designed the PostgreSQL schema (five or more tables) for user data and system logs, and containerized the application with Docker.",
      ],
      id: [
        "Membangun sistem manajemen server yang diamankan JWT dengan kontrol akses berbasis peran untuk tiga peran: user, manager, dan admin.",
        "Menulis lebih dari sepuluh endpoint REST API untuk manajemen pengguna serta pencatatan aktivitas dan audit.",
        "Merancang skema PostgreSQL (lima tabel atau lebih) untuk data pengguna dan log sistem, serta mengemas aplikasi dengan Docker.",
      ],
    },
    links: [
      { label: { en: "Source on GitHub", id: "Kode di GitHub" }, href: "https://github.com/Taufiq-1904/Server_Management_Console" },
    ],
    screenshots: [],
    diagram: "console",
  },
  {
    slug: "kripto-app",
    name: "Kripto App",
    kind: { en: "Applied cryptography study", id: "Studi kriptografi terapan" },
    categories: ["Security"],
    summary: {
      en: "A Python application that applies classical encryption, biometric login and basic steganography, built in a learning-focused setting.",
      id: "Aplikasi Python yang menerapkan enkripsi klasik, login biometrik, dan steganografi dasar, dibuat dalam konteks pembelajaran.",
    },
    stack: [
      { name: "Python", role: { en: "Application", id: "Aplikasi" } },
      { name: "MySQL", role: { en: "Data storage", id: "Penyimpanan data" } },
    ],
    contribution: {
      en: [
        "Applied three security mechanisms: classical encryption and decryption, biometric-based login, and basic steganography.",
        "Built five or more modules covering authentication, encryption, decryption, data storage and steganography.",
        "Evaluated the limitations of classical cryptography and biometric authentication.",
      ],
      id: [
        "Menerapkan tiga mekanisme keamanan: enkripsi dan dekripsi klasik, login berbasis biometrik, dan steganografi dasar.",
        "Membangun lima modul atau lebih yang mencakup autentikasi, enkripsi, dekripsi, penyimpanan data, dan steganografi.",
        "Mengevaluasi keterbatasan kriptografi klasik dan autentikasi biometrik.",
      ],
    },
    links: [{ label: { en: "Source on GitHub", id: "Kode di GitHub" }, href: "https://github.com/Taufiq-1904/Kripto_App" }],
    screenshots: [],
    diagram: "kripto",
  },
];
