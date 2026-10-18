import { describe, expect, it } from "vitest";
import { GROUPS, GROUP, loadPrefs, savePrefs, type Prefs } from "@/lib/data";

describe("Group question", () => {
  it("offers the sample group first so the first profile question is the group", () => {
    expect(GROUPS[0]).toBe(GROUP);
    expect(GROUPS).toContain("BTS");
  });

  it("saves and loads the chosen group in prefs", () => {
    localStorage.clear();
    const prefs: Prefs = { group: "Stray Kids", members: ["Haneul"], cps: [], stanType: "Solo stan" };
    savePrefs(prefs);
    expect(loadPrefs()?.group).toBe("Stray Kids");
  });
});
