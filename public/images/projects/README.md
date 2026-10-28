# Project screenshots

1. Create a folder per project, named after its slug: `scopeapp`, `sdn-dhcp-starvation`, `upcyclehub`,
   `server-management-console`.
2. Add real screenshots of the running project (PNG or WebP, about 1600 px wide).
3. List them in `src/lib/content/projects.ts`, in the project's `screenshots`:

   screenshots: [
     { src: "/images/projects/scopeapp/dashboard.png",
       alt: { en: "ScopeApp dashboard", id: "Dasbor ScopeApp" },
       caption: { en: "Network overview", id: "Ringkasan jaringan" } },
   ],

Until a listed file exists, the project shows a labelled conceptual diagram, never an invented interface.
