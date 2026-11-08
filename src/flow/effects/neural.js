// Original scene: sparse axon bundles carrying pulses through a layered network.
import { stage, TAU, clamp, lerp, rng } from "../flow-stage.js";

export const meta={id:"neural",name:"神经脉冲",hint:"信号沿神经束传播；鼠标牵动节点；点击从附近节点发出一轮脉冲"};
const cubic=(a,b,c,d,u)=>{const v=1-u;return v*v*v*a+3*v*v*u*b+3*v*u*u*c+u*u*u*d;};

export function mount(canvas) {
  let layout=null,burst=null;
  function build(w,h) {
    const random=rng(928),counts=w<600?[4,6,7,6,4]:[5,8,10,9,7,4],nodes=[],layers=[],edges=[];
    counts.forEach((count,layer)=>{
      const list=[];
      for(let row=0;row<count;row++){
        const node={id:nodes.length,layer,x:w*(0.075+0.85*layer/(counts.length-1)),y:h*(0.14+0.7*(row+0.5)/count)+(random()-0.5)*h*0.022,phase:random()*TAU,dx:0,dy:0};
        nodes.push(node);list.push(node);
      }
      layers.push(list);
    });
    for(let layer=0;layer<layers.length-1;layer++)for(const A of layers[layer]){
      const candidates=[...layers[layer+1]].sort((a,b)=>Math.abs(a.y-A.y)-Math.abs(b.y-A.y));
      for(const B of candidates.slice(0,3))edges.push({a:A,b:B,bend:(random()-0.5)*h*0.1,seed:random(),layer});
    }
    return {w,h,nodes,layers,edges};
  }
  function frame({ctx,w,h,t,dt,ptr,ink,red,paper,still}) {
    if(!layout||layout.w!==w||layout.h!==h){layout=build(w,h);burst=null;}
    const time=still?3800:t;
    const damp=still?1:1-Math.exp(-dt/220),radius=Math.min(w,h)*0.26;
    for(const node of layout.nodes){
      const dx=node.x-ptr.sx,dy=node.y-ptr.sy,d=Math.hypot(dx,dy)||1;
      const strength=ptr.k*clamp(1-d/radius)**2;
      node.dx=lerp(node.dx,dx/d*strength*28,damp);
      node.dy=lerp(node.dy,dy/d*strength*28,damp);
    }
    const point=node=>[node.x+node.dx,node.y+node.dy+Math.sin(time*0.0004+node.phase)*h*0.003];
    const activity=new Map();
    for(const edge of layout.edges){
      const A=point(edge.a),B=point(edge.b),mid=(A[0]+B[0])/2;
      const bez=u=>[cubic(A[0],mid,mid,B[0],u),cubic(A[1],A[1]+edge.bend,B[1]-edge.bend,B[1],u)];
      ctx.beginPath();ctx.moveTo(...A);ctx.bezierCurveTo(mid,A[1]+edge.bend,mid,B[1]-edge.bend,...B);
      ctx.strokeStyle=ink(0.14+edge.seed*0.08);ctx.lineWidth=0.7;ctx.stroke();
      const phase=((time-edge.layer*450-edge.seed*3700)%5500+5500)%5500;
      let u=phase/1050;
      if(burst&&burst.arrival.has(edge.a.id))u=(time-burst.t0-burst.arrival.get(edge.a.id))/500;
      if(u>=0&&u<=1&&(Math.floor(edge.seed*1000)%3===0||burst&&burst.arrival.has(edge.a.id))){
        for(let segment=0;segment<5;segment++){
          const v=Math.max(0,u-segment*0.022),q=Math.max(0,v-0.022);
          ctx.beginPath();ctx.moveTo(...bez(q));ctx.lineTo(...bez(v));ctx.strokeStyle=red(0.8*(1-segment/5));ctx.lineWidth=1.4;ctx.stroke();
        }
        const P=bez(u);ctx.beginPath();ctx.arc(...P,1.8,0,TAU);ctx.fillStyle=red(0.9);ctx.fill();
        activity.set(edge.b.id,Math.max(activity.get(edge.b.id)||0,clamp((u-0.7)/0.3)));
      }
    }
    for(const node of layout.nodes){
      const P=point(node),a=activity.get(node.id)||0,r=2.2+a*1.4;
      ctx.beginPath();ctx.arc(...P,r+3.6,0,TAU);ctx.strokeStyle=a?red(a*0.22):ink(0.08);ctx.lineWidth=0.6;ctx.stroke();
      ctx.beginPath();ctx.arc(...P,r,0,TAU);ctx.fillStyle=paper;ctx.fill();ctx.strokeStyle=a?red(0.8):ink(0.5);ctx.lineWidth=0.9;ctx.stroke();
      if(a){ctx.beginPath();ctx.arc(...P,1.1,0,TAU);ctx.fillStyle=red(a);ctx.fill();}
    }
    if(burst&&time-burst.t0>6000)burst=null;
  }
  function click(x,y,t){
    if(!layout)return;
    const nearest=layout.nodes.filter(n=>n.layer<layout.layers.length-1).reduce((best,node)=>Math.hypot(node.x-x,node.y-y)<Math.hypot(best.x-x,best.y-y)?node:best);
    const arrival=new Map([[nearest.id,0]]);
    for(const edge of layout.edges)if(arrival.has(edge.a.id))arrival.set(edge.b.id,Math.min(arrival.get(edge.b.id)??Infinity,arrival.get(edge.a.id)+500));
    burst={t0:t,arrival};
  }
  return stage(canvas,{frame,click,stillT:3800,startT:3800});
}
