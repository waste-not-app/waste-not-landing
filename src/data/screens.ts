import type { ScreenId } from "../types";

export const simulatorTabs: {
  id: ScreenId;
  title: string;
  desc: string;
}[] = [
  {
    id: "home",
    title: "Home and daily summary",
    desc: "See how much waste you handled today and your latest activity at a glance.",
  },
  {
    id: "ai",
    title: "Scan waste with AI",
    desc: "Point the camera at an item to identify the material and get a suggested Reduce, Reuse, Recycle, or Trash step that you confirm.",
  },
  {
    id: "log",
    title: "Quick manual logging",
    desc: "Pick the material, enter the weight or count, then mark it as Reduce, Reuse, Recycle, or Trash.",
  },
  {
    id: "history",
    title: "History that's easy to browse",
    desc: "Look back at your daily logs, with each entry's category, method, and date.",
  },
  {
    id: "guide",
    title: "Sorting guides for every method",
    desc: "Short, judgment-free references for recognizing a material and handling it properly.",
  },
  {
    id: "stats",
    title: "Weekly habit statistics",
    desc: "Charts of your progress, built from your own logs day by day.",
  },
];
