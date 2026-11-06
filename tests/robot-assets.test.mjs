import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);

test("all robot files match their source manifest and GLB meshes are complete and self-contained", async () => {
  const base = new URL("assets/robots/", root);
  const manifest = JSON.parse(await readFile(new URL("source-manifest.json", base), "utf8"));
  assert.equal(manifest.files.length, 117);
  for (const file of manifest.files) {
    const url = new URL(file.path, base);
    const bytes = await readFile(url);
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, file.path);
    if (file.path.endsWith(".urdf")) {
      for (const [, relative] of bytes.toString().matchAll(/filename="([^"]+)"/g)) {
        await access(new URL(relative, url));
      }
    } else if (file.path.endsWith(".glb")) {
      assert.equal(bytes.toString("ascii", 0, 4), "glTF", file.path);
      assert.equal(bytes.readUInt32LE(8), bytes.length, file.path);
      const model = JSON.parse(bytes.toString("utf8", 20, 20 + bytes.readUInt32LE(12)));
      for (const resource of [...(model.buffers || []), ...(model.images || [])]) {
        assert.ok(!resource.uri || resource.uri.startsWith("data:"), file.path);
      }
    }
  }
});

test("the robot module import graph resolves entirely to bundled local libraries", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const map = JSON.parse(html.match(/<script type="importmap">([\s\S]*?)<\/script>/)[1]).imports;
  const visited = new Set();
  async function inspect(url) {
    if (visited.has(url.href)) return;
    visited.add(url.href);
    const source = await readFile(url, "utf8");
    for (const [, name] of source.matchAll(/(?:import|export)\s+(?:[^;]*?\s+from\s*)?['"]([^'"]+)['"]/g)) {
      if (!name.endsWith(".js") && name !== "three" && name !== "urdf-loader") continue;
      let target;
      if (name.startsWith(".")) target = new URL(name, url);
      else {
        const key = Object.keys(map).find((key) => key.endsWith("/") ? name.startsWith(key) : name === key);
        assert.ok(key, `unmapped module ${name}`);
        target = new URL(map[key] + (key.endsWith("/") ? name.slice(key.length) : ""), root);
      }
      assert.equal(target.protocol, "file:");
      await inspect(target);
    }
  }
  await inspect(new URL("src/flow/robots.js", root));
  assert.ok(visited.size >= 9);
});
