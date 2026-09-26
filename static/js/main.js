/*
 * Video comparison sets.
 * Each tab loads   `${dir}/${tab.id}/${key}.mp4`   for every [key, label] in `rows`.
 * A missing file just stays as a placeholder, so drop videos in and they appear.
 * A tab can override `rows`, and can set `events: [{ t: seconds, label }]`
 * to mark moments on the shared scrubber (e.g. a vehicle leaving / returning).
 */
const BASELINES = [
  ['trackdiffusion', 'TrackDiffusion'],
  ['panacea', 'Panacea'],
  ['dreamforge', 'DreamForge'],
  ['magicdrive-v2', 'MagicDrive-V2'],
];

const SETS = {
  normal: {
    dir: 'videos/normal',
    tabs: [
      { id: 'scene-0634', label: 'Scene 1' },
      { id: 'scene-0905', label: 'Scene 2' },
      { id: 'scene-0094', label: 'Scene 3' },
      { id: 'scene-0107', label: 'Scene 4' },
      { id: 'scene-0914', label: 'Scene 5' },
      { id: 'scene-0795', label: 'Scene 6' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['real', 'Real Video'], ['ours', 'MemOIR (Ours)']],
      BASELINES,
    ],
  },

  counterfactual: {
    dir: 'videos/counterfactual',
    tabs: [
      { id: 'A_0331_npcloss003', label: 'Scene 1' },
      { id: 'B_0330_npcloss006', label: 'Scene 2' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['ours', 'MemOIR (Ours)']],
      BASELINES,
    ],
  },

  'counterfactual-sim': {
    dir: 'videos/counterfactual',
    tabs: [
      { id: 'carla-cutin-smoke', label: 'Scene 1' },
      { id: 'carla-beside-ctrlloss-smoke', label: 'Scene 2' },
    ],
    rows: [[['condition', 'Blocks-World Condition'], ['ours', 'MemOIR (Ours)']]],
  },

  consistency: {
    dir: 'videos/consistency',
    tabs: [
      { id: '2021.06.23.15.18.10_veh-26_00165_02848__c72__5c7e4289', label: 'Scene 1' },
      { id: '2021.07.16.18.06.21_veh-38_04933_05307__c16__b66d0d17', label: 'Scene 2' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['real', 'Real Video'], ['ours', 'MemOIR (Ours)']],
      BASELINES,
    ],
  },

  'long-horizon': {
    dir: 'videos/long-horizon',
    tabs: [
      { id: 'uturn-01', label: 'Scene 1' },
      { id: 'uturn-02', label: 'Scene 2' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['ours', 'MemOIR (Ours)']],
      [['magi-1', 'MAGI-1'], ['epona', 'Epona']],
    ],
  },

  'ablation-kv': {
    dir: 'videos/ablation/kv-cache',
    tabs: [
      { id: 'scene-01', label: 'Scene 1' },
      { id: 'scene-02', label: 'Scene 2' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['real', 'Real Video'], ['ours', '+ Warped RoPE (Ours)']],
      [['no-kv', 'Baseline (No KV Memory)'], ['naive-kv', '+ Naïve KV Caching'], ['instance-kv', '+ Instance-level Caching']],
    ],
  },

  'ablation-stationary': {
    dir: 'videos/ablation/stationary',
    tabs: [
      { id: 'scene-01', label: 'Scene 1' },
      { id: 'scene-02', label: 'Scene 2' },
      { id: 'scene-03', label: 'Scene 3' },
    ],
    rows: [
      [['real', 'Real Video'], ['condition', 'Condition (With Stationary)'], ['condition-nostatic', 'Condition (w/o Stationary)']],
      [['ours', 'With Stationary Instances'], ['ablated', 'w/o Stationary Instances']],
    ],
  },

  appearance: {
    dir: 'videos/appearance',
    tabs: [
      { id: 'scene-01', label: 'Scene 1' },
      { id: 'scene-02', label: 'Scene 2' },
    ],
    rows: [
      [['condition', 'Blocks-World Condition'], ['prompt-1', 'Prompt 1'], ['prompt-2', 'Prompt 2']],
      [['prompt-3', 'Prompt 3'], ['prompt-4', 'Prompt 4'], ['prompt-5', 'Prompt 5']],
    ],
  },

  freeview: {
    dir: 'videos/freeview',
    tabs: [
      { id: 'orbit', label: 'Orbit' },
      { id: 'low-orbit', label: 'Low Orbit' },
      { id: 'span', label: 'Span' },
      { id: 'low-span', label: 'Low Span' },
      { id: 'survey', label: 'Survey' },
      { id: 'crane', label: 'Crane' },
      { id: 'fpv', label: 'Low FPV' },
    ],
    rows: [[['condition', 'Blocks-World Canvas'], ['ours', 'Generated']]],
  },

  pedestrian: {
    dir: 'videos/pedestrian',
    tabs: [
      { id: 'clip-01', label: 'Clip 1' },
      { id: 'clip-02', label: 'Clip 2' },
    ],
    rows: [[['condition', 'Condition (Box + Skeleton)'], ['ours', 'Generated']]],
  },

  ablation: {
    dir: 'videos/ablation',
    tabs: [
      {
        id: 'stationary',
        label: 'w/o Stationary Instances',
        rows: [[['condition', 'Condition'], ['ablated', 'w/o Stationary'], ['ours', 'Full Model']]],
      },
      {
        id: 'kv-cache',
        label: 'w/o KV Caching',
        rows: [[['condition', 'Condition'], ['ablated', 'w/o KV Caching'], ['ours', 'Full Model']]],
      },
    ],
  },
};

/* ---------- helpers ---------- */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function placeholder(label, src) {
  const ph = el('div', 'ph');
  const name = el('span', 'ph-label');
  name.textContent = label;
  const path = el('code');
  path.textContent = src;
  ph.append(name, path);
  return ph;
}

function makeVideo(src, onReady) {
  const v = el('video');
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = 'auto';
  v.addEventListener('loadeddata', onReady, { once: true });
  v.src = src;
  return v;
}

function fmt(t) {
  if (!isFinite(t)) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ---------- synced playback ---------- */

class SyncGroup {
  constructor(bar) {
    this.videos = [];
    this.playing = true;
    this.rate = 1;
    this.bar = bar;
    this.btn = bar.querySelector('button');
    this.range = bar.querySelector('input');
    this.time = bar.querySelector('.time');
    this.speed = bar.querySelector('select');

    this.btn.addEventListener('click', () => (this.playing ? this.pause() : this.play()));
    this.range.addEventListener('input', () => {
      const m = this.master;
      if (m && isFinite(m.duration)) this.seek((this.range.value / 1000) * m.duration);
    });
    this.speed.addEventListener('change', () => {
      this.rate = Number(this.speed.value);
      this.videos.forEach(v => (v.playbackRate = this.rate));
    });
  }

  get master() {
    return this.videos.find(v => v.readyState >= 2);
  }

  add(v) {
    this.videos.push(v);
    v.playbackRate = this.rate;
    v.addEventListener('loadeddata', () => {
      const m = this.master;
      if (m && m !== v) v.currentTime = m.currentTime;
      if (this.playing && this.visible) v.play().catch(() => {});
    });
    v.addEventListener('timeupdate', () => {
      if (v === this.master) this.tick(v);
    });
  }

  clear() {
    this.videos.forEach(v => v.pause());
    this.videos = [];
  }

  tick(m) {
    if (isFinite(m.duration)) this.range.value = (m.currentTime / m.duration) * 1000;
    this.time.textContent = `${fmt(m.currentTime)} / ${fmt(m.duration)}`;
    for (const v of this.videos) {
      if (v !== m && v.readyState >= 2 && Math.abs(v.currentTime - m.currentTime) > 0.1) {
        v.currentTime = m.currentTime;
      }
    }
  }

  play() {
    this.playing = true;
    this.btn.textContent = '❚❚';
    this.btn.setAttribute('aria-label', 'Pause');
    this.videos.forEach(v => v.readyState >= 2 && v.play().catch(() => {}));
  }

  pause() {
    this.playing = false;
    this.btn.textContent = '▶';
    this.btn.setAttribute('aria-label', 'Play');
    this.videos.forEach(v => v.pause());
  }

  seek(t) {
    this.videos.forEach(v => v.readyState >= 1 && (v.currentTime = t));
  }

  setVisible(visible) {
    this.visible = visible;
    if (!visible) this.videos.forEach(v => v.pause());
    else if (this.playing) this.play();
  }

  setEvents(events = [], duration) {
    const track = this.bar.querySelector('.track');
    track.querySelectorAll('.marker').forEach(n => n.remove());
    if (!duration) return;
    for (const e of events) {
      const mk = el('span', 'marker');
      mk.textContent = e.label;
      mk.style.left = `${(e.t / duration) * 100}%`;
      track.append(mk);
    }
  }
}

function makeSyncBar() {
  const bar = el('div', 'sync');
  bar.innerHTML = `
    <button type="button" aria-label="Pause">❚❚</button>
    <div class="track"><input type="range" min="0" max="1000" value="0" aria-label="Seek"></div>
    <span class="time">0:00 / 0:00</span>
    <select class="speed" aria-label="Playback speed">
      <option value="0.25">0.25×</option>
      <option value="0.5">0.5×</option>
      <option value="1" selected>1×</option>
    </select>`;
  return bar;
}

/* ---------- comparison blocks ---------- */

function buildCompare(root) {
  const set = SETS[root.dataset.set];
  if (!set) return;

  const tabs = el('div', 'tabs', { role: 'tablist' });
  const panels = el('div', 'panels');
  const bar = makeSyncBar();
  const group = new SyncGroup(bar);

  const panelFor = set.tabs.map((tab, i) => {
    const btn = el('button', 'tab', { type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false' });
    btn.textContent = tab.label;
    tabs.append(btn);

    const panel = el('div', 'panel', { role: 'tabpanel' });
    panel.hidden = i !== 0;
    for (const row of tab.rows || set.rows) {
      const r = el('div', 'grid-row');
      r.style.setProperty('--n', row.length);
      for (const [key, label] of row) {
        const fig = el('figure', 'slot' + (key === 'ours' ? ' is-ours' : ''));
        const src = `${set.dir}/${tab.id}/${key}.mp4`;
        fig.dataset.src = src;
        const media = el('div', 'slot-media');
        media.append(placeholder(label, src));
        const cap = el('figcaption');
        cap.textContent = label;
        fig.append(media, cap);
        r.append(fig);
      }
      panel.append(r);
    }
    panels.append(panel);

    btn.addEventListener('click', () => activate(i));
    return panel;
  });

  function activate(i) {
    [...tabs.children].forEach((b, j) => b.setAttribute('aria-selected', j === i ? 'true' : 'false'));
    panelFor.forEach((p, j) => (p.hidden = j !== i));
    group.clear();
    group.setEvents();

    const tab = set.tabs[i];
    panelFor[i].querySelectorAll('.slot').forEach(fig => {
      let v = fig.querySelector('video');
      if (!v) {
        v = makeVideo(fig.dataset.src, () => {
          fig.classList.add('is-loaded');
          if (tab.events && v === group.master) group.setEvents(tab.events, v.duration);
        });
        fig.querySelector('.slot-media').prepend(v);
      }
      group.add(v);
    });
    if (group.playing) group.play();
  }

  root.append(tabs, panels, bar);

  // Load the first tab only once the block scrolls near the viewport.
  let started = false;
  new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting && !started) {
        started = true;
        group.visible = true;
        activate(0);
      }
      group.setVisible(e.isIntersecting);
    }
  }, { rootMargin: '200px 0px' }).observe(root);
}

/* ---------- teaser wipe ---------- */

function buildWipe(root) {
  const bottom = el('div', 'layer bottom');
  const top = el('div', 'layer top');
  const handle = el('div', 'handle');
  const tagL = el('span', 'tag left');
  const tagR = el('span', 'tag right');
  tagL.textContent = 'Blocks-World';
  tagR.textContent = 'Generated';

  bottom.append(placeholder('Blocks-World Condition', root.dataset.canvas));
  top.append(placeholder('Generated Video', root.dataset.gen));

  const vBottom = makeVideo(root.dataset.canvas, () => bottom.classList.add('is-loaded'));
  const vTop = makeVideo(root.dataset.gen, () => top.classList.add('is-loaded'));
  bottom.prepend(vBottom);
  top.prepend(vTop);
  root.append(bottom, top, handle, tagL, tagR);

  [vBottom, vTop].forEach(v => v.addEventListener('loadeddata', () => v.play().catch(() => {})));
  vTop.addEventListener('timeupdate', () => {
    if (vBottom.readyState >= 2 && Math.abs(vBottom.currentTime - vTop.currentTime) > 0.1) {
      vBottom.currentTime = vTop.currentTime;
    }
  });

  const setPos = x => {
    const r = root.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    root.style.setProperty('--pos', `${p}%`);
  };
  let dragging = false;
  root.addEventListener('pointerdown', e => {
    dragging = true;
    root.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  });
  root.addEventListener('pointermove', e => {
    if (dragging || e.pointerType === 'mouse') setPos(e.clientX);
  });
  root.addEventListener('pointerup', () => (dragging = false));
  root.addEventListener('pointercancel', () => (dragging = false));
}

/* ---------- static images ---------- */

function buildImage(root) {
  const src = root.dataset.src;
  root.append(placeholder(root.dataset.label || 'Figure', src));
  const img = new Image();
  img.alt = root.dataset.label || '';
  img.onload = () => {
    root.prepend(img);
    root.classList.add('is-loaded');
  };
  img.src = src;
}

/* ---------- bibtex copy ---------- */

function buildCopy(btn) {
  btn.addEventListener('click', async () => {
    const text = btn.parentElement.querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Select & copy';
    }
    setTimeout(() => (btn.textContent = 'Copy'), 1500);
  });
}

/* ---------- nav: highlight the section in view ---------- */

function buildToc(nav) {
  const links = new Map([...nav.querySelectorAll('a[href^="#"]')].map(a => [a.hash.slice(1), a]));
  const sections = [...links.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const update = () => {
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < window.innerHeight * 0.35) current = s.id;
    links.forEach((a, id) => a.classList.toggle('is-active', id === current));
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

document.querySelectorAll('.toc').forEach(buildToc);
document.querySelectorAll('.compare').forEach(buildCompare);
document.querySelectorAll('.wipe').forEach(buildWipe);
document.querySelectorAll('.img-slot').forEach(buildImage);
document.querySelectorAll('.copy').forEach(buildCopy);
