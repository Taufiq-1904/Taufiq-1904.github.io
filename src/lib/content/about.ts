import type { Localized } from "@/lib/i18n/locales";

// Copy for the About chapter. Only facts that are already known go here.

export const about = {
  prologue: {
    en: [
      "I am Taufiq Candra Kurniawan. I study Informatics at UPN “Veteran” Yogyakarta, and I learn best by building things that have to actually run: mobile apps, network tooling, and the infrastructure underneath them.",
      "Some of that work is set by coursework and some of it is plain curiosity. The two keep blurring together.",
    ],
    id: [
      "Saya Taufiq Candra Kurniawan. Saya kuliah Informatika di UPN “Veteran” Yogyakarta, dan saya paling mudah belajar dengan membangun sesuatu yang benar-benar harus berjalan: aplikasi mobile, perangkat jaringan, dan infrastruktur di bawahnya.",
      "Sebagian pekerjaan itu datang dari tugas kuliah, sebagian lagi murni rasa ingin tahu. Keduanya terus bercampur.",
    ],
  } satisfies Localized<readonly string[]>,
  coursework: [
    { en: "Mobile programming", id: "Pemrograman mobile" },
    { en: "Computer networks", id: "Jaringan komputer" },
    { en: "Cloud computing", id: "Komputasi awan" },
    { en: "Computer graphics", id: "Grafika komputer" },
    { en: "Object-oriented analysis and design", id: "Analisis dan desain berorientasi objek" },
  ] satisfies readonly Localized[],
  direction: {
    en: "I am aiming to become a Security Engineer. Networking and infrastructure are the ground I am building that on, and two of my projects already sit there: a network monitoring app for hospitals, and a detector for DHCP starvation attacks in software-defined networks.",
    id: "Saya menargetkan menjadi Security Engineer. Jaringan dan infrastruktur adalah landasan yang sedang saya bangun, dan dua proyek saya sudah berada di sana: aplikasi pemantauan jaringan untuk rumah sakit, dan detektor serangan DHCP starvation pada jaringan yang ditentukan perangkat lunak (SDN).",
  } satisfies Localized,
  interests: [
    {
      name: { en: "Mobile Development", id: "Pengembangan Mobile" },
      line: {
        en: "Flutter apps such as ScopeApp and UpCycleHub.",
        id: "Aplikasi Flutter seperti ScopeApp dan UpCycleHub.",
      },
    },
    {
      name: { en: "Networking", id: "Jaringan" },
      line: {
        en: "Routing practicums, network monitoring, and SDN experiments with Mininet and Ryu.",
        id: "Praktikum routing, pemantauan jaringan, dan eksperimen SDN dengan Mininet dan Ryu.",
      },
    },
    {
      name: { en: "Cybersecurity", id: "Keamanan Siber" },
      line: {
        en: "Traffic classification to spot DHCP starvation attacks.",
        id: "Klasifikasi lalu lintas untuk mengenali serangan DHCP starvation.",
      },
    },
    {
      name: { en: "Infrastructure", id: "Infrastruktur" },
      line: {
        en: "Docker, Prometheus and Grafana, and deployments on Google Cloud.",
        id: "Docker, Prometheus dan Grafana, serta deployment di Google Cloud.",
      },
    },
  ] satisfies readonly { name: Localized; line: Localized }[],
};
