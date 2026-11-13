// Original connected script strokes, inspired by the supplied outlined wordmark.
export const DANNY_STROKES = [
  'M48 110 C53 77 68 38 86 25 C102 14 122 20 118 43 C113 72 91 104 63 113 C33 125 12 108 19 78 C26 47 60 15 97 13 C126 11 143 24 136 31 C132 35 124 27 114 25',
  'M121 88 C109 75 89 89 89 106 C88 127 108 117 119 95 L114 115 C111 127 128 118 138 105',
  'M139 84 L129 118 C140 93 156 77 161 88 C166 99 143 124 159 120 C168 118 175 108 181 103',
  'M182 84 L172 119 C184 93 200 78 205 89 C210 101 187 124 204 120 C214 117 223 106 228 98',
  'M231 85 C226 97 218 120 228 121 C238 122 252 101 259 84 C251 112 245 143 227 151 C215 157 207 149 215 141 C226 131 252 128 268 113'
];

export function createDannyLettering() {
  const paths = DANNY_STROKES.map(d => {
    const measure = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    measure.setAttribute('d', d);
    return { path: new Path2D(d), length: measure.getTotalLength() };
  });
  return (ctx, progress, x = 50, y = 52, scale = 0.88) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < paths.length; i++) {
      const {path, length} = paths[i];
      const portion = Math.max(0, Math.min(1, progress * paths.length - i));
      if (portion === 0) continue;
      ctx.setLineDash([length, length]);
      ctx.lineDashOffset = length * (1 - portion);
      ctx.strokeStyle = '#84848a';
      ctx.lineWidth = 10;
      ctx.stroke(path);
      ctx.strokeStyle = '#f5f4f0';
      ctx.lineWidth = 5.8;
      ctx.stroke(path);
    }
    ctx.restore();
  };
}
