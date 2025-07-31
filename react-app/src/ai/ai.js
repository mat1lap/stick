//converted from ai.cpp

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getSegments(sticks) {
  const segments = [];
  const n = sticks.length;
  let i = 0;
  while (i < n) {
    if (sticks[i]) {
      const start = i;
      while (i < n && sticks[i]) {
        i++;
      }
      segments.push({ start, len: i - start });
    } else {
      i++;
    }
  }
  return segments;
}

function getMex(s) {
  let mex = 0;
  const arr = Array.from(s).sort((a, b) => a - b);
  for (const v of arr) {
    if (v !== mex) return mex;
    mex++;
  }
  return mex;
}

function getMoveAny(sticks, a, b) {
  const len = sticks.length;
  const n = sticks.filter(Boolean).length;
  const dp = Array(n + 1).fill(false);
  const loseMovePercentage = Array(n + 1).fill(0);
  const bestMove = Array.from({ length: n + 1 }, () => []);

  for (let i = 1; i <= n; i++) {
    for (let j = a; j <= b && i - j >= 0; j++) {
      if (!dp[i - j]) {
        dp[i] = true;
        loseMovePercentage[i]++;
        bestMove[i].push(i - j);
      }
    }
    const possible = Math.max(0, Math.min(b, i) - a + 1);
    if (possible > 0) loseMovePercentage[i] /= possible;
  }

  let newN;
  if (bestMove[n].length === 0) {
    newN = n - a;
    for (let i = a + 1; i <= b; i++) {
      if (loseMovePercentage[n - i] < loseMovePercentage[n - newN]) {
        newN = n - i;
      }
    }
  } else {
    const opts = bestMove[n];
    newN = opts[randomInt(0, opts.length - 1)];
  }

  const toRemove = [];
  for (let i = 0; i < len && toRemove.length < n - newN; i++) {
    if (sticks[i]) toRemove.push(i);
  }
  return toRemove;
}

function getMoveConsecutive(sticks, a, b) {
  const n = sticks.filter(Boolean).length;
  const grundy = Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const transitions = new Set();
    for (let j = a; j <= b && i - j >= 0; j++) {
      for (let pos = 0; pos + j <= i; pos++) {
        const left = pos;
        const right = i - pos - j;
        transitions.add(grundy[left] ^ grundy[right]);
      }
    }
    grundy[i] = getMex(transitions);
  }

  let total = 0;
  const segments = getSegments(sticks);
  segments.forEach(seg => { total ^= grundy[seg.len]; });

  const bestMoves = [];
  for (const seg of segments) {
    const maxN = Math.min(b, seg.len);
    if (a > maxN) continue;
    for (let j = a; j <= maxN; j++) {
      for (let pos = 0; pos + j <= seg.len; pos++) {
        const left = pos;
        const right = seg.len - j - pos;
        if ((total ^ grundy[left] ^ grundy[right] ^ grundy[seg.len]) === 0) {
          const mv = [];
          for (let k = 0; k < j; k++) mv.push(seg.start + pos + k);
          bestMoves.push(mv);
        }
      }
    }
  }

  if (bestMoves.length > 0) {
    return bestMoves[randomInt(0, bestMoves.length - 1)];
  }
  for (const seg of segments) {
    if (seg.len >= a) {
      return Array.from({ length: a }, (_, i) => seg.start + i);
    }
  }
  return [];
}

let mem = new Map();
let memLoaded = false;
let memLoadPromise = null;

async function loadMem() {
  if (memLoaded) return;

  const response = await fetch('mem.json');
  const data = await response.json();
  
  mem.clear();
  for (const [key, value] of Object.entries(data)) {
    mem.set(key, value);
  }
  memLoaded = true;
}

memLoadPromise = loadMem();

function getGrundySpecial(lens) {
  if (!memLoaded) {
    if (!memLoadPromise) {
      memLoadPromise = loadMem();
    }
  }
  
  const key = JSON.stringify(lens.slice().sort((x, y) => x - y));
  if (mem.has(key)) return mem.get(key);
  if (lens.length === 0) return mem.set(key, 0).get(key);

  const transitions = new Set();
  const n = lens.length;

  for (let i = 0; i < n; i++) {
    const len = lens[i];
    for (let pos = 0; pos < len; pos++) {
      const trans = lens.slice();
      trans.splice(i, 1);
      const a = pos;
      const b = len - pos - 1;
      if (a) trans.push(a);
      if (b) trans.push(b);
      transitions.add(JSON.stringify(trans.sort((x, y) => x - y)));
    }
  }

  for (let i = 0; i < n; i++) {
    const len = lens[i];
    if (len < 2) continue;
    for (let p1 = 0; p1 < len; p1++) {
      for (let p2 = p1 + 1; p2 < len; p2++) {
        const trans = lens.slice();
        trans.splice(i, 1);
        const a = p1;
        const b = p2 - p1 - 1;
        const c = len - p2 - 1;
        if (a) trans.push(a);
        if (b) trans.push(b);
        if (c) trans.push(c);
        transitions.add(JSON.stringify(trans.sort((x, y) => x - y)));
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const len1 = lens[i], len2 = lens[j];
      for (let p1 = 0; p1 < len1; p1++) {
        for (let p2 = 0; p2 < len2; p2++) {
          const trans = lens.slice();
          trans.splice(j, 1);
          trans.splice(i, 1);
          const a1 = p1;
          const b1 = len1 - p1 - 1;
          const a2 = p2;
          const b2 = len2 - p2 - 1;
          if (a1) trans.push(a1);
          if (b1) trans.push(b1);
          if (a2) trans.push(a2);
          if (b2) trans.push(b2);
          transitions.add(JSON.stringify(trans.sort((x, y) => x - y)));
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const len = lens[i];
    if (len < 3) continue;
    for (let pos = 0; pos <= len - 3; pos++) {
      const trans = lens.slice();
      trans.splice(i, 1);
      const left = pos;
      const right = len - pos - 3;
      if (left) trans.push(left);
      if (right) trans.push(right);
      transitions.add(JSON.stringify(trans.sort((x, y) => x - y)));
    }
  }

  const mexSet = new Set();
  for (const t of transitions) {
    const arr = JSON.parse(t);
    mexSet.add(getGrundySpecial(arr));
  }
  const result = getMex(mexSet);
  mem.set(key, result);
  return result;
}

function getMoveSpecial(sticks) {
  const segments = getSegments(sticks);
  const lens = segments.map(s => s.len);

  for (let i = 0; i < segments.length; i++) {
    const { start, len } = segments[i];
    for (let pos = 0; pos < len; pos++) {
      const trans = lens.slice();
      trans.splice(i, 1);
      const a = pos;
      const b = len - pos - 1;
      if (a) trans.push(a);
      if (b) trans.push(b);
      if (getGrundySpecial(trans) === 0) return [start + pos];
    }
  }

  for (let i = 0; i < segments.length; i++) {
    const { start, len } = segments[i];
    if (len < 2) continue;
    for (let p1 = 0; p1 < len; p1++) {
      for (let p2 = p1 + 1; p2 < len; p2++) {
        const trans = lens.slice();
        trans.splice(i, 1);
        const a = p1;
        const b = p2 - p1 - 1;
        const c = len - p2 - 1;
        if (a) trans.push(a);
        if (b) trans.push(b);
        if (c) trans.push(c);
        if (getGrundySpecial(trans) === 0) return [start + p1, start + p2];
      }
    }
  }

  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const { start: s1, len: l1 } = segments[i];
      const { start: s2, len: l2 } = segments[j];
      for (let p1 = 0; p1 < l1; p1++) {
        for (let p2 = 0; p2 < l2; p2++) {
          const trans = lens.slice();
          trans.splice(j, 1);
          trans.splice(i, 1);
          const a1 = p1;
          const b1 = l1 - p1 - 1;
          const a2 = p2;
          const b2 = l2 - p2 - 1;
          if (a1) trans.push(a1);
          if (b1) trans.push(b1);
          if (a2) trans.push(a2);
          if (b2) trans.push(b2);
          if (getGrundySpecial(trans) === 0) return [s1 + p1, s2 + p2];
        }
      }
    }
  }

  for (const { start, len } of segments) {
    if (len < 3) continue;
    for (let pos = 0; pos <= len - 3; pos++) {
      const trans = lens.slice();
      trans.splice(segments.indexOf({ start, len }), 1);
      const left = pos;
      const right = len - pos - 3;
      if (left) trans.push(left);
      if (right) trans.push(right);
      if (getGrundySpecial(trans) === 0) {
        return [start + pos, start + pos + 1, start + pos + 2];
      }
    }
  }

  if (segments.length > 0) return [segments[0].start];
  return [];
}

export function getOptimalMove(mode, sticks, a = 0, b = 0, k = 0) {
  switch (mode) {
    case 1: return getMoveAny(sticks, 1, k);
    case 2: return getMoveAny(sticks, a, b);
    case 3: return getMoveConsecutive(sticks, 1, k);
    case 4: return getMoveConsecutive(sticks, a, b);
    case 5: return getMoveSpecial(sticks);
    default: return [];
  }
}