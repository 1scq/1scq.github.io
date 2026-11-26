import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const context = vm.createContext({});
const data = readFileSync(new URL("../data.js", import.meta.url), "utf8");
const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");
vm.runInContext(data, context);
vm.runInContext(script.replace(/\ninit\(\);\s*$/, ""), context);

test("EgoLoAF has a Video link to the project film", () => {
  const html = vm.runInContext(
    'renderPublications(siteData.publications.filter(({ title }) => title.startsWith("EgoLoAF:")))',
    context
  );
  assert.match(html, /<a href="https:\/\/egoloaf\.github\.io\/#film">\s*<i[^>]*><\/i>\s*<span>Video<\/span>/);
});

test("publications without a video URL omit the Video link", () => {
  const html = vm.runInContext(
    "renderPublications(siteData.publications.filter(({ videoUrl }) => !videoUrl))",
    context
  );
  assert.doesNotMatch(html, /<span>Video<\/span>/);
});
