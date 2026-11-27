import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const context = vm.createContext({});
const data = readFileSync(new URL("../data.js", import.meta.url), "utf8");
const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");
vm.runInContext(data, context);
vm.runInContext(script.replace(/\ninit\(\);\s*$/, ""), context);

test("LimX Dynamics renders a single monochrome logo for both themes", () => {
  const html = vm.runInContext(
    'renderExperience(siteData.workExperience.filter(({ institution }) => institution === "LimX Dynamics"))',
    context
  );
  assert.match(html, /experience-logo--monochrome"\s+src="\.\/assets\/limx-dynamics\.png" alt="LimX Dynamics logo"/);
  assert.equal((html.match(/<img /g) || []).length, 1);
});

test("an experience with one logo renders it without a theme modifier", () => {
  const html = vm.runInContext(
    'renderExperience([{ institution: "Example", role: "Intern", period: "2026", logo: "./logo.png" }])',
    context
  );
  assert.match(html, /class="experience-logo"\s+src="\.\/logo\.png" alt="Example"/);
  assert.equal((html.match(/<img /g) || []).length, 1);
});
