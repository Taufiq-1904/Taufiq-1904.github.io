import type { Localized } from "@/lib/i18n/locales";

// The spellbook. Each skill is tied to work it was used in, and none carries a made-up proficiency score.

/**
 * A plain string is a proper noun (a project or product name) and is shown as written; if it matches
 * a project's name it becomes a link that opens that project. A Localized pair is a descriptive label.
 */
export type UsedIn = string | Localized;

export type Skill = {
  /** Technology names are the same in both languages, so this stays a plain string. */
  name: string | Localized;
  note: Localized;
  usedIn: readonly UsedIn[];
};

export type SkillChapter = {
  id: string;
  title: Localized;
  blurb: Localized;
  skills: readonly Skill[];
};

const notesPracticum: Localized = { en: "Notes app practicum", id: "Praktikum aplikasi catatan" };
const thisPortfolio: Localized = { en: "This portfolio", id: "Portofolio ini" };
const sdn = "SDN DHCP Starvation Detection";

export const skillChapters: readonly SkillChapter[] = [
  {
    id: "mobile",
    title: { en: "Mobile", id: "Mobile" },
    blurb: {
      en: "Apps that live in a pocket and still have to talk to a backend.",
      id: "Aplikasi yang hidup di saku, namun tetap harus berbicara dengan backend.",
    },
    skills: [
      {
        name: "Flutter and Dart",
        note: { en: "Cross-platform mobile apps.", id: "Aplikasi mobile lintas platform." },
        usedIn: ["ScopeApp", "UpCycleHub", "Leftovers", "Spaceflight News"],
      },
      {
        name: "GetX",
        note: {
          en: "State, routing and dependency management, including clean architecture layouts.",
          id: "State, routing, dan manajemen dependensi, termasuk tata letak arsitektur bersih.",
        },
        usedIn: ["UpCycleHub", "Leftovers", "Spaceflight News"],
      },
      {
        name: "Dio",
        note: { en: "HTTP client for talking to APIs.", id: "Klien HTTP untuk berkomunikasi dengan API." },
        usedIn: ["UpCycleHub"],
      },
      {
        name: "SQLite",
        note: { en: "Local storage on the device.", id: "Penyimpanan lokal di perangkat." },
        usedIn: ["Spaceflight News"],
      },
    ],
  },
  {
    id: "web",
    title: { en: "Web", id: "Web" },
    blurb: {
      en: "Interfaces in the browser, from a framework down to a bare canvas.",
      id: "Antarmuka di peramban, dari framework hingga kanvas polos.",
    },
    skills: [
      {
        name: "Next.js and TypeScript",
        note: { en: "App Router sites with typed components.", id: "Situs App Router dengan komponen bertipe." },
        usedIn: [thisPortfolio, { en: "Dusun Cilikan portal", id: "Portal Dusun Cilikan" }],
      },
      {
        name: "Tailwind CSS and Framer Motion",
        note: { en: "Styling and animation for this portfolio.", id: "Penataan gaya dan animasi untuk portofolio ini." },
        usedIn: [thisPortfolio],
      },
      {
        name: "HTML, CSS and JavaScript",
        note: { en: "Canvas drawing without a framework.", id: "Menggambar di kanvas tanpa framework." },
        usedIn: [{ en: "2D graphics editor", id: "Editor grafis 2D" }],
      },
    ],
  },
  {
    id: "backend",
    title: { en: "Backend and Data", id: "Backend dan Data" },
    blurb: {
      en: "Services, databases and the scripts that glue them together.",
      id: "Layanan, basis data, dan skrip yang merekatkan semuanya.",
    },
    skills: [
      {
        name: "Node.js and Express.js",
        note: { en: "HTTP backends.", id: "Backend HTTP." },
        usedIn: ["ScopeApp", notesPracticum],
      },
      {
        name: "Python",
        note: { en: "SDN controller code, data dashboards and a security application.", id: "Kode kontroler SDN, dasbor data, dan aplikasi keamanan." },
        usedIn: [sdn, "Kripto App"],
      },
      {
        name: "Streamlit",
        note: { en: "A dashboard for presenting model output.", id: "Dasbor untuk menampilkan keluaran model." },
        usedIn: [sdn],
      },
      {
        name: "Supabase",
        note: { en: "Hosted database and authentication.", id: "Basis data terkelola dan autentikasi." },
        usedIn: [{ en: "Dusun Cilikan portal", id: "Portal Dusun Cilikan" }],
      },
      {
        name: "Firebase",
        note: { en: "Backend services for a mobile app.", id: "Layanan backend untuk aplikasi mobile." },
        usedIn: ["UpCycleHub"],
      },
      { name: "MySQL", note: { en: "Relational storage.", id: "Penyimpanan relasional." }, usedIn: ["Leftovers", "Kripto App"] },
      {
        name: "PostgreSQL",
        note: { en: "Schema design for user data and audit logs.", id: "Desain skema untuk data pengguna dan log audit." },
        usedIn: ["Server Management Console"],
      },
      {
        name: "REST APIs and JWT",
        note: { en: "Endpoints with role-based access control.", id: "Endpoint dengan kontrol akses berbasis peran." },
        usedIn: ["Server Management Console", "ScopeApp"],
      },
    ],
  },
  {
    id: "infrastructure",
    title: { en: "Cloud and Infrastructure", id: "Cloud dan Infrastruktur" },
    blurb: {
      en: "Packaging, deploying and watching software once it is running.",
      id: "Mengemas, men-deploy, dan memantau perangkat lunak setelah berjalan.",
    },
    skills: [
      {
        name: "Docker",
        note: { en: "Containers for running services.", id: "Kontainer untuk menjalankan layanan." },
        usedIn: ["ScopeApp", "Server Management Console"],
      },
      {
        name: "Linux",
        note: {
          en: "Listed under systems on my CV, alongside Windows. No project here is built around it yet.",
          id: "Tercantum di bagian sistem pada CV saya, di samping Windows. Belum ada proyek di sini yang berpusat padanya.",
        },
        usedIn: [],
      },
      { name: "Prometheus", note: { en: "Collecting metrics.", id: "Mengumpulkan metrik." }, usedIn: ["ScopeApp"] },
      {
        name: "Grafana",
        note: { en: "Dashboards over metrics.", id: "Dasbor di atas metrik." },
        usedIn: ["ScopeApp"],
      },
      {
        name: "Google Cloud",
        note: { en: "Cloud Run and App Engine deployments.", id: "Deployment Cloud Run dan App Engine." },
        usedIn: [notesPracticum],
      },
    ],
  },
  {
    id: "networking",
    title: { en: "Networking and Security", id: "Jaringan dan Keamanan" },
    blurb: {
      en: "How traffic moves, how it is watched, and how attacks show up in it.",
      id: "Bagaimana lalu lintas bergerak, bagaimana dipantau, dan bagaimana serangan muncul di dalamnya.",
    },
    skills: [
      {
        name: { en: "Subnetting and routing", id: "Subnetting dan routing" },
        note: { en: "VLSM, OSPF and RIPv2.", id: "VLSM, OSPF, dan RIPv2." },
        usedIn: [{ en: "Computer networks practicum", id: "Praktikum jaringan komputer" }],
      },
      {
        name: { en: "Software-defined networking", id: "Jaringan yang ditentukan perangkat lunak (SDN)" },
        note: {
          en: "Mininet for emulation, Ryu as controller.",
          id: "Mininet untuk emulasi, Ryu sebagai kontroler.",
        },
        usedIn: [sdn],
      },
      {
        name: { en: "Random Forest classification", id: "Klasifikasi Random Forest" },
        note: {
          en: "Telling attack traffic from normal traffic.",
          id: "Membedakan lalu lintas serangan dari lalu lintas normal.",
        },
        usedIn: [sdn],
      },
      {
        name: { en: "TCP/IP and network troubleshooting", id: "TCP/IP dan pemecahan masalah jaringan" },
        note: {
          en: "Router, LAN and WLAN configuration and fault-finding for residential internet customers.",
          id: "Konfigurasi dan pencarian gangguan router, LAN, dan WLAN untuk pelanggan internet rumahan.",
        },
        usedIn: [{ en: "Technical support, PT Rasi Bintang Perkasa", id: "Technical support, PT Rasi Bintang Perkasa" }],
      },
      {
        name: { en: "Applied cryptography", id: "Kriptografi terapan" },
        note: {
          en: "Classical ciphers, biometric login and basic steganography in a learning project.",
          id: "Sandi klasik, login biometrik, dan steganografi dasar dalam proyek pembelajaran.",
        },
        usedIn: ["Kripto App"],
      },
      {
        name: { en: "Network monitoring", id: "Pemantauan jaringan" },
        note: {
          en: "Watching the state of a network over time.",
          id: "Memantau kondisi jaringan dari waktu ke waktu.",
        },
        usedIn: ["ScopeApp", "Server Management Console"],
      },
    ],
  },
];
