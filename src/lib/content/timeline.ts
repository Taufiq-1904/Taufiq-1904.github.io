import type { Localized } from "@/lib/i18n/locales";

// Education and experience, in the order they read best: the base, the lab work, then the field work.

export type TimelineKind = "Education" | "Practicum" | "Work" | "Community";

export type TimelineEntry = {
  id: string;
  kind: TimelineKind;
  /** Shown as written; dates are only given where they are known. */
  when: Localized;
  title: Localized;
  place: Localized;
  summary: Localized;
  highlights: Localized<readonly string[]>;
  /** Technology names and similar terms, shown as written. */
  tags: readonly string[];
};

const upn: Localized = { en: "UPN “Veteran” Yogyakarta", id: "UPN “Veteran” Yogyakarta" };

export const timeline: readonly TimelineEntry[] = [
  {
    id: "upn-informatics",
    kind: "Education",
    when: { en: "In progress", id: "Sedang berjalan" },
    title: { en: "Informatics", id: "Informatika" },
    place: upn,
    summary: {
      en: "University studies in Informatics, with coursework in mobile programming, computer networks, cloud computing, computer graphics, and object-oriented analysis and design.",
      id: "Studi sarjana Informatika, dengan mata kuliah pemrograman mobile, jaringan komputer, komputasi awan, grafika komputer, serta analisis dan desain berorientasi objek.",
    },
    highlights: {
      en: [
        "Built Flutter apps with GetX, REST APIs and local SQLite storage, including a news reader with infinite scroll and local notifications.",
        "Built an interactive 2D graphics editor in plain HTML, CSS and JavaScript for a computer graphics course, with shape primitives, flood fill, transformations and undo and redo.",
        "Wrote analysis and design documents for an object-oriented design course, including a cash-on-delivery marketplace modelled across four actors.",
      ],
      id: [
        "Membangun aplikasi Flutter dengan GetX, REST API, dan penyimpanan SQLite lokal, termasuk pembaca berita dengan infinite scroll dan notifikasi lokal.",
        "Membangun editor grafis 2D interaktif dengan HTML, CSS, dan JavaScript murni untuk mata kuliah grafika komputer, lengkap dengan bentuk dasar, flood fill, transformasi, serta undo dan redo.",
        "Menulis dokumen analisis dan desain untuk mata kuliah desain berorientasi objek, termasuk marketplace bayar di tempat (COD) yang dimodelkan dengan empat aktor.",
      ],
    },
    tags: ["Flutter", "GetX", "SQLite", "JavaScript", "UML"],
  },
  {
    id: "practicums",
    kind: "Practicum",
    when: { en: "During studies", id: "Selama perkuliahan" },
    title: { en: "Networking and cloud practicums", id: "Praktikum jaringan dan cloud" },
    place: upn,
    summary: {
      en: "Hands-on lab work in computer networks and cloud computing.",
      id: "Kerja laboratorium langsung di bidang jaringan komputer dan komputasi awan.",
    },
    highlights: {
      en: [
        "Networks: planned subnets with VLSM for a multi-site topology (Jakarta, Backbone and Bandung), routed with OSPF and RIPv2.",
        "Cloud: deployed a notes application to Google Cloud, with an Express.js backend on Cloud Run and a static frontend on App Engine, and wrote the deployment report.",
      ],
      id: [
        "Jaringan: merancang subnet dengan VLSM untuk topologi multi-lokasi (Jakarta, Backbone, dan Bandung), dengan routing OSPF dan RIPv2.",
        "Cloud: men-deploy aplikasi catatan ke Google Cloud, dengan backend Express.js di Cloud Run dan frontend statis di App Engine, serta menulis laporan deployment-nya.",
      ],
    },
    tags: ["VLSM", "OSPF", "RIPv2", "Cloud Run", "App Engine"],
  },
  {
    id: "rst-internship",
    kind: "Work",
    when: { en: "Jan – Feb 2026", id: "Jan – Feb 2026" },
    title: { en: "Software Engineer Intern", id: "Software Engineer Intern" },
    place: { en: "RST Slamet Riyadi Surakarta", id: "RST Slamet Riyadi Surakarta" },
    summary: {
      en: "An internship building a mobile network monitoring application for a hospital's IT infrastructure.",
      id: "Magang membangun aplikasi mobile pemantauan jaringan untuk infrastruktur TI sebuah rumah sakit.",
    },
    highlights: {
      en: [
        "Developed a Flutter app that shows real-time network performance and system status.",
        "Integrated Grafana dashboards and backend monitoring services, and used Docker to support deployment.",
        "Gained hands-on experience with Flutter, Grafana, Docker and DevOps practices in a healthcare environment.",
      ],
      id: [
        "Mengembangkan aplikasi Flutter yang menampilkan performa jaringan dan status sistem secara real-time.",
        "Mengintegrasikan dasbor Grafana dan layanan pemantauan backend, serta memakai Docker untuk mendukung deployment.",
        "Mendapat pengalaman langsung dengan Flutter, Grafana, Docker, dan praktik DevOps di lingkungan layanan kesehatan.",
      ],
    },
    tags: ["Flutter", "Grafana", "Docker", "Prometheus"],
  },
  {
    id: "lab-staff",
    kind: "Work",
    when: { en: "Jul 2024 – present", id: "Jul 2024 – sekarang" },
    title: { en: "Laboratory Assistant and Laboratory Administrator", id: "Asisten Laboratorium dan Administrator Laboratorium" },
    place: upn,
    summary: {
      en: "Teaching practical classes and keeping the computer laboratories running (assistant since August 2024, administrator since July 2024).",
      id: "Mengajar kelas praktikum dan menjaga laboratorium komputer tetap berjalan (asisten sejak Agustus 2024, administrator sejak Juli 2024).",
    },
    highlights: {
      en: [
        "Assistant: created and delivered more than five lab modules (programming, data structures and algorithms, networks, web), and prepared and graded work for over 70 students per semester.",
        "Assistant: ran hands-on sessions for classes of up to 30 students.",
        "Administrator: maintained 8 computer laboratories (200+ workstations) and supported large computer-based exams across 11 laboratories (300+ workstations).",
        "Administrator: looked after 3 on-site servers and 16+ network switches.",
      ],
      id: [
        "Asisten: membuat dan menyampaikan lebih dari lima modul praktikum (pemrograman, struktur data dan algoritma, jaringan, web), serta menyiapkan dan menilai tugas untuk lebih dari 70 mahasiswa per semester.",
        "Asisten: memandu sesi praktik untuk kelas hingga 30 mahasiswa.",
        "Administrator: merawat 8 laboratorium komputer (200+ workstation) dan mendukung ujian berbasis komputer berskala besar di 11 laboratorium (300+ workstation).",
        "Administrator: mengurus 3 server on-site dan 16+ switch jaringan.",
      ],
    },
    tags: ["Teaching", "System administration", "Networks", "Troubleshooting"],
  },
  {
    id: "rasi-bintang",
    kind: "Work",
    when: { en: "Jan 2022 – Apr 2023", id: "Jan 2022 – Apr 2023" },
    title: { en: "Technical Support (previously Intern Technical Support)", id: "Technical Support (sebelumnya Intern Technical Support)" },
    place: { en: "PT Rasi Bintang Perkasa", id: "PT Rasi Bintang Perkasa" },
    summary: {
      en: "Field and customer network support at an internet service provider: internship from January to April 2022, then technical support from June 2022 to April 2023.",
      id: "Dukungan jaringan lapangan dan pelanggan di penyedia layanan internet: magang Januari sampai April 2022, lalu technical support Juni 2022 sampai April 2023.",
    },
    highlights: {
      en: [
        "Handled customer troubleshooting, Wi-Fi installation and service support, and configured and fixed customer routers and LAN/WLAN networks.",
        "Took part in routine maintenance checks of 20 BTS towers.",
        "As an intern, worked beside senior engineers on daily connectivity tasks and basic hardware and software problems.",
      ],
      id: [
        "Menangani pemecahan masalah pelanggan, pemasangan Wi-Fi, dan dukungan layanan, serta mengonfigurasi dan memperbaiki router dan jaringan LAN/WLAN pelanggan.",
        "Ikut dalam pemeriksaan pemeliharaan rutin 20 menara BTS.",
        "Saat magang, bekerja bersama engineer senior pada tugas konektivitas harian dan masalah dasar perangkat keras dan lunak.",
      ],
    },
    tags: ["Routers", "LAN/WLAN", "Troubleshooting"],
  },
  {
    id: "lex-cilikan",
    kind: "Community",
    when: { en: "14–25 Sep 2026", id: "14–25 Sep 2026" },
    title: { en: "Learning Express (LeX) community programme", id: "Program komunitas Learning Express (LeX)" },
    place: {
      en: "Padukuhan Cilikan, with Singapore Polytechnic students",
      id: "Padukuhan Cilikan, bersama mahasiswa Singapore Polytechnic",
    },
    summary: {
      en: "A joint community programme on waste management and environmental innovation, working with the local waste group Enggal Makmur.",
      id: "Program komunitas bersama tentang pengelolaan sampah dan inovasi lingkungan, bekerja sama dengan kelompok sampah setempat, Enggal Makmur.",
    },
    highlights: {
      en: [
        "Worked on three prototypes: an ecobrick, an ecobrick press, and a home composter.",
        "The gallery walk left the ecobrick and press as they were, and led to revisions on the composter: usage posters, a three-compartment ingredient bin, a scoop and tongs, and a section at the bottom for the liquid.",
        "Wrote Chapter VII (Opportunities, Challenges, and Lessons) of the programme book “Cilikan dan Cerita Perubahan”.",
        "Building a village information portal for Dusun Cilikan with Next.js and Supabase, covering news, organisations, local businesses and a map.",
      ],
      id: [
        "Mengerjakan tiga prototipe: ecobrick, alat press ecobrick, dan komposter rumah tangga.",
        "Gallery walk tidak mengubah ecobrick dan alat press, tetapi menghasilkan revisi pada komposter: poster petunjuk penggunaan, wadah bahan tiga kompartemen, sekop dan penjepit, serta bagian di dasar untuk menampung cairan.",
        "Menulis Bab VII (Peluang, Tantangan, dan Pelajaran) dari buku program “Cilikan dan Cerita Perubahan”.",
        "Sedang membangun portal informasi desa untuk Dusun Cilikan dengan Next.js dan Supabase, mencakup berita, organisasi, usaha lokal, dan peta.",
      ],
    },
    tags: ["Waste management", "Prototyping", "Technical writing", "Next.js", "Supabase"],
  },
];
