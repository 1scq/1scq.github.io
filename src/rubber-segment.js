// Adapted from the supplied React Bits RubberSegment interaction model.
// Native Web Animations preserves the elastic thumb without adding a React runtime.
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const rubber = (over, width) => over * width * 0.55 / (width + 0.55 * Math.abs(over));
const nearest = (slots, x) => slots.reduce((best, slot, i) =>
  Math.abs((slot.l + slot.r) / 2 - x) < Math.abs((slots[best].l + slots[best].r) / 2 - x) ? i : best, 0);

export function mountRubberSegment(track, { value, onChange }) {
  const items = [...track.querySelectorAll('[role="radio"]')];
  const thumb = track.querySelector('.rubber-segment__thumb');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const inset = 4, radius = 8;
  let index = Math.max(0, items.findIndex(item => item.dataset.value === value));
  let slots = [], width = 1, left = 0, right = 0, animation = null, drag = null, suppressClick = false;
  const listeners = [];
  const listen = (el, name, fn) => { el.addEventListener(name, fn); listeners.push(() => el.removeEventListener(name, fn)); };
  for (const item of items) {
    const copy = document.createElement('span');
    copy.className = 'rubber-segment__item rubber-segment__copy';
    copy.innerHTML = item.innerHTML;
    thumb.append(copy);
  }
  const clip = (l, r) => `inset(0 ${Math.max(0, width - r)}px 0 ${Math.max(0, l)}px round ${radius}px)`;
  function stop() {
    const current = getComputedStyle(thumb).clipPath;
    animation?.cancel();
    animation = null;
    return current;
  }
  function jump(to) {
    stop();
    left = slots[to].l; right = slots[to].r;
    thumb.style.clipPath = clip(left, right);
  }
  function land(to, from = index, elastic = true) {
    const current = stop();
    const target = slots[to], a = slots[from];
    const final = clip(target.l, target.r);
    left = target.l; right = target.r;
    thumb.style.clipPath = final;
    if (reduce.matches || !thumb.animate) return;
    const dir = Math.sign(to - from) || 1;
    const frames = elastic ? [
      { clipPath: current === 'none' ? clip(a.l, a.r) : current, offset: 0 },
      { clipPath: clip(Math.min(a.l, target.l), Math.max(a.r, target.r)), offset: 0.36 },
      { clipPath: clip(target.l + (dir > 0 ? 3 : 0), target.r - (dir < 0 ? 3 : 0)), offset: 0.8 },
      { clipPath: final, offset: 1 }
    ] : [{ clipPath: current }, { clipPath: final }];
    animation = thumb.animate(frames, { duration: elastic ? 480 : 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  function sync() {
    items.forEach((item, i) => {
      item.setAttribute('aria-checked', String(i === index));
      item.tabIndex = i === index ? 0 : -1;
    });
  }
  function commit(to) {
    if (to === index) return;
    index = to;
    sync();
    onChange(items[index].dataset.value);
  }
  function measure() {
    cancelDrag();
    const rect = track.getBoundingClientRect();
    width = rect.width - inset * 2;
    slots = items.map(item => {
      const r = item.getBoundingClientRect();
      return { l: r.left - rect.left - inset, r: r.right - rect.left - inset };
    });
    jump(index);
  }
  function cancelDrag() {
    if (!drag) return;
    const old = drag;
    drag = null;
    delete track.dataset.held;
    delete items[old.slot].dataset.pressed;
    if (slots.length) jump(index);
    try { old.target.releasePointerCapture(old.id); } catch {}
  }
  const local = e => e.clientX - track.getBoundingClientRect().left - inset;
  listen(track, 'pointerdown', e => {
    if (drag || e.button !== 0) return;
    const slot = items.indexOf(e.target.closest('[role="radio"]'));
    if (slot < 0) return;
    const x = local(e);
    const current = stop();
    // Read both edges of an interrupted animation before taking over its thumb.
    const values = current.match(/^inset\(0(?:px)? ([\d.]+)px 0(?:px)? ([\d.]+)px/);
    if (values) { left = Number(values[2]); right = width - Number(values[1]); }
    thumb.style.clipPath = current;
    drag = { id: e.pointerId, target: items[slot], slot, x0: x, y0: e.clientY,
      onThumb: x >= left && x <= right, live: false, offset: x - left, w: right - left,
      hist: [[e.timeStamp, x]] };
    suppressClick = false;
    items[slot].dataset.pressed = '';
    try { items[slot].setPointerCapture(e.pointerId); } catch {}
  });
  listen(track, 'pointermove', e => {
    if (!drag || drag.id !== e.pointerId || !drag.onThumb) return;
    const x = local(e);
    drag.hist.push([e.timeStamp, x]);
    if (drag.hist.length > 8) drag.hist.shift();
    if (!drag.live && Math.abs(x - drag.x0) < 4) return;
    drag.live = true;
    track.dataset.held = '';
    const l = x - drag.offset, max = width - drag.w;
    if (reduce.matches) { left = clamp(l, 0, max); right = left + drag.w; }
    else if (l < 0) { left = 0; right = drag.w - rubber(-l, drag.w); }
    else if (l > max) { right = width; left = max + rubber(l - max, drag.w); }
    else { left = l; right = l + drag.w; }
    thumb.style.clipPath = clip(left, right);
  });
  listen(track, 'pointerup', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const d = drag;
    drag = null;
    delete track.dataset.held;
    delete items[d.slot].dataset.pressed;
    suppressClick = d.live || Math.abs(local(e) - d.x0) > 10 || Math.abs(e.clientY - d.y0) > 10;
    if (!d.live) { if (suppressClick || d.slot === index) jump(index); return; }
    const recent = d.hist.filter(([t]) => e.timeStamp - t <= 100);
    const first = recent[0], last = recent.at(-1);
    const v = first && last && last[0] - first[0] >= 8
      ? clamp((last[1] - first[1]) / (last[0] - first[0]) * 1000, -2000, 2000) : 0;
    const damping = 1 - 0.1 * 0.05 ** 0.75;
    const glide = reduce.matches ? 0 : (v / 1000) * damping / (1 - damping);
    let to = nearest(slots, (left + right) / 2 + glide);
    if (!reduce.matches && Math.abs(v) > 110 && to === index) to = clamp(to + Math.sign(v), 0, items.length - 1);
    const from = index;
    commit(to);
    land(to, from, false);
    items[to].focus({ preventScroll: true });
  });
  listen(track, 'pointercancel', cancelDrag);
  listen(track, 'lostpointercapture', cancelDrag);
  listen(window, 'blur', cancelDrag);
  listen(track, 'click', e => {
    if (suppressClick) { suppressClick = false; return; }
    const to = items.indexOf(e.target.closest('[role="radio"]'));
    if (to < 0 || to === index) return;
    const from = index;
    commit(to);
    land(to, from);
  });
  listen(track, 'keydown', e => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let to = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : delta ? clamp(index + delta, 0, items.length - 1) : null;
    if (to === null) return;
    e.preventDefault();
    cancelDrag();
    commit(to); jump(to); items[to].focus({ preventScroll: true });
  });
  const onReduce = () => { cancelDrag(); jump(index); };
  reduce.addEventListener('change', onReduce);
  const observer = new ResizeObserver(measure);
  observer.observe(track);
  let destroyed = false;
  document.fonts?.ready.then(() => { if (!destroyed) measure(); });
  sync(); measure();
  return {
    setValue(value) {
      const to = items.findIndex(item => item.dataset.value === value);
      if (to < 0 || to === index) return;
      cancelDrag(); index = to; sync(); jump(to);
    },
    destroy() { destroyed = true; cancelDrag(); stop(); observer.disconnect(); reduce.removeEventListener('change', onReduce); listeners.forEach(remove => remove()); }
  };
}
