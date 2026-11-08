import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const kit=(await readFile(new URL('../src/flow/flow-stage.js',import.meta.url),'utf8')).replaceAll('export ','');
for(const id of ['neural']) {
  const scene=(await readFile(new URL(`../src/flow/effects/${id}.js`,import.meta.url),'utf8')).replace(/^import .*;$/m,'').replaceAll('export ','');
  for(const [width,height] of [[1440,900],[390,844]]) {
    test(`${id} renders finite desktop/mobile geometry, handles clicks and a reduced-motion still at ${width}×${height}`,()=>{
      let strokes=0;
      const finite=(...args)=>{assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite));strokes++;};
      const ctx={beginPath(){},closePath(){},moveTo:finite,lineTo:finite,bezierCurveTo:finite,ellipse:finite,stroke(){},fill(){},arc(...args){assert.ok(args[2]>=0);finite(...args);}};
      const env=vm.createContext({ctx,width,height});
      vm.runInContext(`${kit}\nstage=(_,scene)=>{globalThis.scene=scene;return {};};\n${scene}\nmount({});\nscene.click(width/2,height/3,0);\nglobalThis.draw=(t,still=false)=>scene.frame({ctx,w:width,h:height,t,dt:33,ptr:{sx:width*.7,sy:height*.3,k:1},ink:()=> '#444',red:()=> '#b23',paper:'#fff',still});\ndraw(4000);scene.click(width*.6,height*.3,4000);for(const t of [4033,4200,4500,5000,8000])draw(t);draw(4000,true);`,env);
      assert.ok(strokes>50);
    });
  }
}
