import { createDannyLettering } from './danny-lettering.js';

// Card artwork is drawn locally so names and contact details stay crisp in 3D.
const surface = (width, height, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return { canvas, ctx };
};

export function createBadgeArtwork(portrait) {
  const { canvas: front, ctx } = surface(1024, 1440, '#f5f4f0');
  const imageHeight = 1220;
  const scale = Math.max(1024 / portrait.naturalWidth, imageHeight / portrait.naturalHeight);
  const width = portrait.naturalWidth * scale;
  const height = portrait.naturalHeight * scale;
  ctx.drawImage(portrait, (1024 - width) / 2, 220, width, height);
  ctx.fillStyle = '#222222';
  ctx.font = '500 30px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('@lnscq', 956, 100);
  ctx.textAlign = 'left';
  const drawDanny = createDannyLettering();
  drawDanny(ctx, 1);
  let lastFrame = -1;
  const animateFront = (time, reducedMotion) => {
    const frame = reducedMotion ? 90 : Math.min(90, Math.floor((time % 10) * 30));
    if (frame === lastFrame) return false;
    lastFrame = frame;
    ctx.fillStyle = '#f5f4f0';
    ctx.fillRect(32, 42, 280, 168);
    drawDanny(ctx, frame / 90);
    return true;
  };

  const { canvas: back, ctx: b } = surface(1024, 1440, '#f5f4f0');
  b.fillStyle = '#deddd9';
  b.font = '600 260px Georgia';
  b.fillText('Danny', 74, 426);
  b.fillStyle = '#1c1c1c';
  b.font = '600 76px Georgia';
  b.fillText('Chengqi Shi', 80, 610);
  b.font = '28px monospace';
  b.fillText('UNDERGRADUATE / XJTU', 84, 680);
  b.fillRect(84, 744, 856, 2);
  b.font = '34px Georgia';
  b.fillText('Embodied intelligence', 84, 835);
  b.fillText('& humanoid robotics', 84, 885);
  b.font = '27px monospace';
  b.fillText('cqshi@stu.xjtu.edu.cn', 84, 1090);
  b.fillText('github.com/lnscq', 84, 1140);
  b.font = '24px monospace';
  b.fillStyle = '#777777';
  b.fillText('KEEP EXPLORING.', 84, 1320);

  const { canvas: strap, ctx: s } = surface(512, 128, '#18191b');
  s.fillStyle = '#eeeeee';
  s.font = '500 32px monospace';
  s.textAlign = 'center';
  s.fillText('DANNY / CHENGQI SHI', 256, 77);
  return { frontArtwork: { canvas: front, animate: animateFront }, frontImage: front.toDataURL(), backImage: back.toDataURL(), strapImage: strap.toDataURL() };
}
