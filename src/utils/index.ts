import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Race = "human" | "elf" | "orc" | "dragon" | "undead" | "demon";
export type Element = "fire" | "water" | "wind" | "earth" | "light" | "dark" | "chaos";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "common":
      return "text-gray-400";
    case "rare":
      return "text-blue-400";
    case "epic":
      return "text-purple-400";
    case "legendary":
      return "text-yellow-400";
    default:
      return "text-gray-400";
  }
}

export function getRarityBorder(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "common":
      return "border-gray-500";
    case "rare":
      return "border-blue-500";
    case "epic":
      return "border-purple-500";
    case "legendary":
      return "border-yellow-500";
    default:
      return "border-gray-500";
  }
}

export function getRarityBg(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "common":
      return "bg-gray-900/50";
    case "rare":
      return "bg-blue-900/30";
    case "epic":
      return "bg-purple-900/30";
    case "legendary":
      return "bg-yellow-900/30";
    default:
      return "bg-gray-900/50";
  }
}

export function getRaceName(race: string): string {
  const raceMap: Record<string, string> = {
    human: "人类",
    elf: "精灵",
    orc: "兽人",
    dragon: "龙族",
    undead: "亡灵",
    demon: "魔族",
  };
  return raceMap[race.toLowerCase()] ?? race;
}

export function getElementName(element: string): string {
  const elementMap: Record<string, string> = {
    fire: "火",
    water: "水",
    wind: "风",
    earth: "土",
    light: "光",
    dark: "暗",
    chaos: "混沌",
  };
  return elementMap[element.toLowerCase()] ?? element;
}

export function getRarityName(rarity: string): string {
  const rarityMap: Record<string, string> = {
    common: "普通",
    rare: "稀有",
    epic: "史诗",
    legendary: "传说",
  };
  return rarityMap[rarity.toLowerCase()] ?? rarity;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function weightedRandom(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);

  if (totalWeight <= 0) {
    return entries[0]?.[0] ?? "";
  }

  let random = Math.random() * totalWeight;

  for (const [key, weight] of entries) {
    random -= weight;
    if (random <= 0) {
      return key;
    }
  }

  return entries[entries.length - 1][0];
}

export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
