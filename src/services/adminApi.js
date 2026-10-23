/**
 * Admin API layer.
 *
 * Set VITE_API_BASE_URL (e.g. https://api.cs-fifve.patelot.de) to talk to the
 * Java backend. Without it, every call falls back to local mock data so the
 * dashboard works standalone.
 *
 * Expected Java endpoints:
 *   GET  /api/admin/dashboard        -> { siteUrl, online, activeSections, totalSections, teams, matches, matchDays }
 *   GET  /api/admin/changes          -> [{ id, type, title, author, at }]
 *   GET  /api/admin/sections/status  -> [{ key, label, active }]
 *   PUT  /api/admin/config           -> save config JSON
 *   POST /api/admin/publish          -> publish config, returns { publishedAt }
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
const TOKEN_KEY = "fifve-admin-token";

export const isBackendConfigured = Boolean(API_BASE_URL);

async function request(path, options = {}) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API ${response.status} ${path}`);
  }
  return response.status === 204 ? null : response.json();
}

async function withFallback(path, options, fallback) {
  if (!isBackendConfigured) return fallback();
  try {
    return await request(path, options);
  } catch (error) {
    console.warn("Backend unavailable, using local data:", error);
    return fallback();
  }
}

const SECTION_LABELS = {
  hero: "Hero / Accueil",
  meeting: "Programmation",
  documents: "Documents",
  license: "Licences",
  teamWorkspace: "Espace équipe",
  team: "Équipes",
  stats: "Statistiques",
  module: "Module de points",
  ranking: "Classement",
  selected: "Équipes sélectionnées",
  schedule: "Planning",
  location: "Lieu / Événement",
  export: "Export",
  welcomeModal: "Fenêtre de bienvenue",
  footer: "Footer / Contact",
};

export function getDashboardSummary(config) {
  return withFallback("/api/admin/dashboard", {}, () => {
    const sections = Object.values(config.sections || {});
    return {
      siteUrl: "cs-fifve.patelot.de",
      online: true,
      activeSections: sections.filter(Boolean).length,
      totalSections: sections.length,
      teams: 54,
      matches: 24,
      matchDays: 3,
    };
  });
}

export function getSectionStatus(config) {
  return withFallback("/api/admin/sections/status", {}, () =>
    Object.entries(config.sections || {}).map(([key, active]) => ({
      key,
      label: SECTION_LABELS[key] || key,
      active: Boolean(active),
    })),
  );
}

export function getRecentChanges() {
  return withFallback("/api/admin/changes", {}, () => {
    const now = Date.now();
    const h = 36e5;
    return [
      { id: 1, type: "hero", title: "Hero mis à jour", author: "Patrick", at: new Date(now - h).toISOString() },
      { id: 2, type: "team", title: "Équipes mises à jour", author: "Patrick", at: new Date(now - 24 * h).toISOString() },
      { id: 3, type: "document", title: "Document ajouté", author: "Patrick", at: new Date(now - 48 * h).toISOString() },
      { id: 4, type: "schedule", title: "Programmation modifiée", author: "Patrick", at: new Date(now - 72 * h).toISOString() },
    ];
  });
}

export function saveConfig(config) {
  return withFallback(
    "/api/admin/config",
    { method: "PUT", body: JSON.stringify(config) },
    () => config,
  );
}

export function publishConfig(config) {
  return withFallback(
    "/api/admin/publish",
    { method: "POST", body: JSON.stringify(config) },
    () => ({ publishedAt: new Date().toISOString() }),
  );
}
