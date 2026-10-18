// Curated MVP dataset: one (fictional) group, official updates + curated fan discussion.
export type Kind = "official" | "buzz";
export interface Item {
  id: string;
  kind: Kind;
  daysAgo: number;
  title: string;
  summary: string;
  members: string[];
  cp?: string;
  source: string;
  url: string;
  minutes: number;
  verified: boolean;
}

export const GROUP = "LUMIÈRE";
export const MEMBERS = ["Haneul", "Jiwoo", "Seojin", "Minho", "Taeyang"];
export const GROUPS = ["LUMIÈRE", "BTS", "Stray Kids", "TWICE", "aespa", "SEVENTEEN"];
export const CPS = ["Haneul × Jiwoo", "Seojin × Minho", "Jiwoo × Taeyang"];
export const STAN_TYPES = ["Group stan", "Solo stan", "CP fan"] as const;

export const ITEMS: Item[] = [
  { id: "1", kind: "official", daysAgo: 0, title: "'Afterglow' MV teaser drops", summary: "A 32-second teaser for the comeback title track went live on the official channel, featuring all five members in a neon-lit rooftop set.", members: MEMBERS, source: "YouTube · Official", url: "https://youtube.com", minutes: 1, verified: true },
  { id: "2", kind: "buzz", daysAgo: 0, title: "Fans decode teaser easter eggs", summary: "Threads link the rooftop clock (4:17) to the debut date. This is a fan theory, not confirmed by the agency.", members: MEMBERS, source: "Curated fan threads", url: "#", minutes: 2, verified: false },
  { id: "3", kind: "official", daysAgo: 0, title: "Haneul live on Weverse (48 min)", summary: "Haneul talked about vocal practice for the comeback and played a short snippet of an unreleased b-side.", members: ["Haneul"], source: "Weverse · Official", url: "https://weverse.io", minutes: 1, verified: true },
  { id: "4", kind: "buzz", daysAgo: 0, title: "Haneul mentions Jiwoo's 'secret song'", summary: "During the live, Haneul said Jiwoo wrote a song 'for someone in the team.' Shippers are thrilled; it's interpretation only.", members: ["Haneul", "Jiwoo"], cp: "Haneul × Jiwoo", source: "Curated fan threads", url: "#", minutes: 2, verified: false },
  { id: "5", kind: "official", daysAgo: 1, title: "Seojin & Minho dance practice", summary: "A duo choreography practice of the b-side 'Static' was uploaded, already past 1M views.", members: ["Seojin", "Minho"], cp: "Seojin × Minho", source: "YouTube · Official", url: "https://youtube.com", minutes: 1, verified: true },
  { id: "6", kind: "official", daysAgo: 1, title: "Comeback date announced: Nov 3", summary: "The agency confirmed the 2nd mini album 'Afterglow' releases Nov 3, 6PM KST, with a showcase the same evening.", members: MEMBERS, source: "Official notice", url: "#", minutes: 1, verified: true },
  { id: "7", kind: "buzz", daysAgo: 2, title: "Taeyang's new hair sparks trend", summary: "Silver hair spotted in airport photos trended among international fans. Photos are fan-taken.", members: ["Taeyang"], source: "Curated fan threads", url: "#", minutes: 1, verified: false },
  { id: "8", kind: "official", daysAgo: 3, title: "Jiwoo featured in fashion magazine", summary: "Jiwoo appears in the November issue with a 6-page editorial and short interview about songwriting.", members: ["Jiwoo"], source: "Official Instagram", url: "https://instagram.com", minutes: 1, verified: true },
  { id: "9", kind: "buzz", daysAgo: 4, title: "Jiwoo × Taeyang variety moment", summary: "A clip of the two finishing each other's sentences on a variety show is circulating widely.", members: ["Jiwoo", "Taeyang"], cp: "Jiwoo × Taeyang", source: "Curated fan threads", url: "#", minutes: 2, verified: false },
  { id: "10", kind: "official", daysAgo: 5, title: "Minho solo vlog: studio day", summary: "Minho's vlog shows production sessions and a cameo from Seojin bringing snacks.", members: ["Minho", "Seojin"], source: "YouTube · Official", url: "https://youtube.com", minutes: 1, verified: true },
  { id: "11", kind: "official", daysAgo: 6, title: "Fan meeting tickets sold out", summary: "The year-end fan meeting sold out in under 10 minutes; an extra date is being discussed but not confirmed.", members: MEMBERS, source: "Official notice", url: "#", minutes: 1, verified: true },
];

export interface Prefs {
  group: string;
  members: string[];
  cps: string[];
  stanType: string;
}

export function score(item: Item, p: Prefs) {
  let s = 0;
  s += item.members.filter((m) => p.members.includes(m)).length * 2;
  if (item.cp && p.cps.includes(item.cp)) s += 4;
  if (p.stanType === "Group stan" && item.members.length === MEMBERS.length) s += 3;
  if (item.verified) s += 1;
  return s - item.daysAgo * 0.5;
}

export function buildDigest(p: Prefs | null, days: number, minutes: number, personalized = true) {
  const pool = ITEMS.filter((i) => i.daysAgo < days);
  const sorted = personalized && p
    ? [...pool].sort((a, b) => score(b, p) - score(a, p))
    : [...pool].sort((a, b) => a.daysAgo - b.daysAgo);
  const out: Item[] = [];
  let t = 0;
  for (const i of sorted) {
    if (t + i.minutes > minutes && out.length) break;
    out.push(i);
    t += i.minutes;
  }
  return out;
}

const KEY = "biasbrief-prefs";
export const loadPrefs = (): Prefs | null => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};
export const savePrefs = (p: Prefs) => localStorage.setItem(KEY, JSON.stringify(p));
