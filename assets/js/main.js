/* Portfolio BTS SIO SLAM — main.js
   Tout est statique (pas de framework).
   Personnalisation rapide : modifie LINKS + PROJECTS.
*/

const LINKS = {
  github: "https://github.com/Clem-dev15",
  linkedin: "https://www.linkedin.com/in/TON_PROFIL",
  email: "mailto:ton.mail@example.com",
};

const PROJECTS = [
  {
    id: "monopoly",
    title: "Monopoly (Python)",
    kicker: "Jeu / Algorithmique",
    category: "cours",
    desc:
      "Jeu type Monopoly en Python : gestion des tours, dés, achats, loyers, prison, et une logique orientée objet pour garder un code propre et testable.",
    tags: ["Python", "POO", "Structures", "Console/GUI"],
    links: [
      { label: "Repo GitHub", url: "https://github.com/Clem-dev15/monopoly-python" },
      { label: "Documentation", url: "#" },
    ],
    badges: ["Python", "POO"],
  },
  {
    id: "beeflix",
    title: "Beeflix",
    kicker: "Front web (Netflix-like)",
    category: "cours",
    desc:
      "Clone front (type Netflix) en HTML/CSS/JS : page d’accueil, fiches, interactions, et une UI responsive avec animations.",
    tags: ["HTML", "CSS", "JS"],
    links: [
      { label: "Démo", url: "#" },
      { label: "Repo GitHub", url: "https://github.com/Clem-dev15/beeflix" },
    ],
    badges: ["Web", "UI"],
  },
  {
    id: "pilatbikes",
    title: "Pilat Bikes Services",
    kicker: "Projet web (WordPress)",
    category: "stage",
    desc:
      "Site vitrine WordPress pour un magasin de vélos : présentation, services, contact, et un design orienté conversion (CTA).",
    tags: ["WordPress", "HTML", "CSS", "JS"],
    links: [
      { label: "Site en ligne", url: "#" },
      { label: "Capture / PDF", url: "#" },
    ],
    badges: ["Web", "WordPress"],
  },

  {
    id: "woodycraft",
    title: "Woodycraft (e-commerce)",
    kicker: "Site web dynamique (PHP + BDD)",
    category: "cours",
    desc:
      "Site e-commerce de vente de puzzles : catalogue, fiche produit, panier (selon version), et données reliées à une base SQL. Développé en PHP avec un environnement local Laragon.",
    tags: ["PHP", "SQL", "Laragon", "HTML", "CSS", "JS"],
    links: [
      { label: "Repo GitHub", url: "https://github.com/Clem-dev15/woodycraft" },
      { label: "Démo / captures", url: "#" },
    ],
    badges: ["Web", "PHP"],
  },


  {
    id: "miva",
    title: "MIVA (site vitrine)",
    kicker: "Site WordPress — Salon de beauté",
    category: "stage",
    desc:
      "Site vitrine WordPress pour le salon de beauté MIVA : présentation, services, galerie, prise de contact (et réservation selon version).",
    tags: ["WordPress", "HTML", "CSS", "UI"],
    links: [
      { label: "Site en ligne", url: "#" },
      { label: "Captures / PDF", url: "#" },
    ],
    badges: ["Web", "WordPress"],
  },

];

/* ========== Helpers ========== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function formatMonthFR(yyyyMm) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

/* ========== Theme (light/dark) ========== */
(function themeInit() {
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (prefersLight) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

/* ========== Navbar (mobile) ========== */
function setupNav() {
  const btn = $(".nav__toggle");
  const links = $("#navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // close on click
  links.addEventListener("click", (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      links.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // click outside
  document.addEventListener("click", (e) => {
    if (!links.classList.contains("is-open")) return;
    if (links.contains(e.target) || btn.contains(e.target)) return;
    links.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });
}

/* ========== Reveal on scroll ========== */
function setupReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) ent.target.classList.add("is-in");
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ========== Projects grid + filtering + modal ========== */
function projectCard(p) {
  const badge = (txt, kind) => `<span class="badge ${kind || ""}">${txt}</span>`;
  const badgeKind =
    p.category === "cours" ? "badge--accent" : p.category === "stage" ? "badge--green" : "";
  return `
    <article class="card project" data-id="${p.id}" data-category="${p.category}" tabindex="0" role="button" aria-label="Ouvrir ${p.title}">
      <div class="project__top">
        <div>
          <p class="project__kicker">${p.kicker}</p>
          <h3 class="project__title">${p.title}</h3>
        </div>
        ${badge(p.category.toUpperCase(), badgeKind)}
      </div>
      <p class="project__desc">${p.desc}</p>
      <div class="project__meta">
        ${p.badges.map((b) => badge(b)).join("")}
      </div>
    </article>
  `;
}

function renderProjects(filter = "all") {
  const grid = $("#projectsGrid");
  if (!grid) return;

  const visible =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  grid.innerHTML = visible.map(projectCard).join("");

  // update stat
  const stat = $("#statProjects");
  if (stat) stat.textContent = String(PROJECTS.length);

  // click/keyboard open modal
  $$(".project", grid).forEach((card) => {
    card.addEventListener("click", () => openProject(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(card.dataset.id);
      }
    });
  });
}

function setupFilters() {
  const chips = $$(".filters .chip--btn");
  chips.forEach((c) => {
    c.addEventListener("click", () => {
      chips.forEach((x) => x.classList.remove("is-active"));
      c.classList.add("is-active");
      renderProjects(c.dataset.filter);
    });
  });
}

function openProject(id) {
  const modal = $("#projectModal");
  if (!modal) return;

  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;

  $("#modalKicker").textContent = p.kicker;
  $("#modalTitle").textContent = p.title;
  $("#modalDesc").textContent = p.desc;

  const tagsWrap = $("#modalTags");
  tagsWrap.innerHTML = p.tags.map((t) => `<span class="chip">${t}</span>`).join("");

  const linksWrap = $("#modalLinks");
  linksWrap.innerHTML = p.links
    .map(
      (l) =>
        `<a class="link" href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`
    )
    .join("");

  modal.showModal();
}

function setupModal() {
  const modal = $("#projectModal");
  const close = $("#modalClose");
  if (!modal || !close) return;

  close.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) modal.close();
  });
}

/* ========== Init ========== */
function setupLinks() {
  const g = $("#linkGithub");
  const l = $("#linkLinkedIn");
  const e = $("#linkEmail");
  if (g) g.href = LINKS.github;
  if (l) l.href = LINKS.linkedin;
  if (e) e.href = LINKS.email;
}

function setupFooterYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupReveal();

  setupLinks();
  setupFooterYear();

  renderProjects("all");
  setupFilters();
  setupModal();
  const t = $("#themeToggle");
  if (t) t.addEventListener("click", toggleTheme);
});
