// src/ai/ai.js
// Оптимальные ходы, переписано с C++ code.txt

// --- Вспомогательная функция: разбиение на сегменты ---
export function getSegments(sticks) {
  const segments = [];
  let i = 0;
  const n = sticks.length;

  while (i < n) {
    if (sticks[i]) {
      const start = i;
      while (i < n && sticks[i]) i++;
      const len = i - start;
      segments.push({ start, len });
    } else {
      i++;
    }
  }
  return segments;
}

// --- Режим 1: 1..k любых палочек ---
export function getMoveMode1(sticks, k) {
  const count = sticks.filter(s => s).length;
  const dp = Array(count + 1).fill(false);

  for (let i = 1; i <= count; i++) {
    for (let t = 1; t <= Math.min(k, i); t++) {
      if (!dp[i - t]) {
        dp[i] = true;
        break;
      }
    }
  }

  let take = -1;
  for (let t = 1; t <= Math.min(k, count); t++) {
    if (count - t >= 0 && !dp[count - t]) {
      take = t;
      break;
    }
  }

  if (take === -1 || take === 0) {
    take = Math.min(k, count);
  }
  if (take === 0) return [];

  const indices = [];
  for (let i = 0; i < sticks.length && indices.length < take; i++) {
    if (sticks[i]) indices.push(i);
  }
  return indices;
}

// --- Режим 2: a..b любых палочек ---
export function getMoveMode2(sticks, a, b) {
  const count = sticks.filter(s => s).length;
  const dp = Array(count + 1).fill(false);

  for (let i = 1; i <= count; i++) {
    const lowT = Math.max(1, a);
    const highT = Math.min(b, i);
    if (lowT > highT) continue;

    for (let t = lowT; t <= highT; t++) {
      if (!dp[i - t]) {
        dp[i] = true;
        break;
      }
    }
  }

  let take = -1;
  for (let t = Math.max(a, 1); t <= Math.min(b, count); t++) {
    if (count - t >= 0 && !dp[count - t]) {
      take = t;
      break;
    }
  }

  if (take === -1) {
    take = Math.min(b, count);
    if (take < a && count > 0) take = Math.min(b, count);
  }
  if (take === 0) return [];

  const indices = [];
  for (let i = 0; i < sticks.length && indices.length < take; i++) {
    if (sticks[i]) indices.push(i);
  }
  return indices;
}

// --- Режим 3: 1..k подряд идущих ---
const memoGrundy3 = new Map();

export function getMoveMode3(sticks, k) {
  const segments = getSegments(sticks);
  const maxLen = sticks.length;
  const g = Array(maxLen + 1).fill(0);

  // Предварительный расчёт Grundy-чисел
  for (let len = 1; len <= maxLen; len++) {
    const mexSet = new Set();
    for (let take = 1; take <= Math.min(k, len); take++) {
      for (let pos = 0; pos <= len - take; pos++) {
        const leftLen = pos;
        const rightLen = len - take - pos;
        const val = g[leftLen] ^ g[rightLen];
        mexSet.add(val);
      }
    }
    let mex = 0;
    while (mexSet.has(mex)) mex++;
    g[len] = mex;
  }

  // Общее XOR всех сегментов
  let total = 0;
  for (const seg of segments) {
    total ^= g[seg.len];
  }

  // Ищем выигрышный ход
  for (const seg of segments) {
    const len = seg.len;
    for (let take = 1; take <= Math.min(k, len); take++) {
      for (let pos = 0; pos <= len - take; pos++) {
        const leftLen = pos;
        const rightLen = len - take - pos;
        const newVal = total ^ g[len] ^ g[leftLen] ^ g[rightLen];
        if (newVal === 0) {
          const move = [];
          const startIdx = seg.start + pos;
          for (let i = 0; i < take; i++) {
            move.push(startIdx + i);
          }
          return move;
        }
      }
    }
  }

  // Если нет выигрышного хода — делаем любой
  if (segments.length > 0) {
    const take = Math.min(k, segments[0].len);
    const move = [];
    for (let i = 0; i < take; i++) {
      move.push(segments[0].start + i);
    }
    return move;
  }

  return [];
}

// --- Режим 4: a..b подряд идущих ---
const memoGrundy4 = new Map();

export function getMoveMode4(sticks, a, b) {
  const segments = getSegments(sticks);
  const maxLen = sticks.length;
  const g = Array(maxLen + 1).fill(0);

  for (let len = 1; len <= maxLen; len++) {
    const mexSet = new Set();
    const lowT = Math.max(1, a);
    const highT = Math.min(b, len);
    if (lowT > highT) continue;

    for (let take = lowT; take <= highT; take++) {
      for (let pos = 0; pos <= len - take; pos++) {
        const leftLen = pos;
        const rightLen = len - take - pos;
        const val = g[leftLen] ^ g[rightLen];
        mexSet.add(val);
      }
    }
    let mex = 0;
    while (mexSet.has(mex)) mex++;
    g[len] = mex;
  }

  let total = 0;
  for (const seg of segments) {
    total ^= g[seg.len];
  }

  for (const seg of segments) {
    const len = seg.len;
    const lowT = Math.max(a, 1);
    const highT = Math.min(b, len);
    if (lowT > highT) continue;

    for (let take = lowT; take <= highT; take++) {
      for (let pos = 0; pos <= len - take; pos++) {
        const leftLen = pos;
        const rightLen = len - take - pos;
        const newVal = total ^ g[len] ^ g[leftLen] ^ g[rightLen];
        if (newVal === 0) {
          const move = [];
          const startIdx = seg.start + pos;
          for (let i = 0; i < take; i++) {
            move.push(startIdx + i);
          }
          return move;
        }
      }
    }
  }

  // Если нет выигрышного хода — минимальный допустимый
  for (const seg of segments) {
    if (seg.len >= a) {
      const take = Math.min(seg.len, a);
      const move = [];
      for (let i = 0; i < take; i++) {
        move.push(seg.start + i);
      }
      return move;
    }
  }

  return [];
}

// --- Режим 5: 1, 2 любые или 3 подряд ---
const memoGrundy5 = new Map();

function grundyMode5(state) {
  // Сортируем для уникального ключа
  const key = [...state].sort((a, b) => a - b).join(',');
  if (memoGrundy5.has(key)) return memoGrundy5.get(key);

  if (state.length === 0) {
    memoGrundy5.set(key, 0);
    return 0;
  }

  const nextStatesSet = new Set();

  // 1. Одна палочка
  for (let i = 0; i < state.length; i++) {
    const seg = state[i];
    for (let pos = 0; pos < seg; pos++) {
      const newState = [...state];
      newState.splice(i, 1);
      if (pos > 0) newState.push(pos);
      if (seg - pos - 1 > 0) newState.push(seg - pos - 1);
      nextStatesSet.add([...newState].sort((a, b) => a - b).join(','));
    }
  }

  // 2. Две любые в одном сегменте
  for (let i = 0; i < state.length; i++) {
    const seg = state[i];
    if (seg < 2) continue;
    for (let i1 = 0; i1 < seg; i1++) {
      for (let i2 = i1 + 1; i2 < seg; i2++) {
        const newState = [...state];
        newState.splice(i, 1);
        const a = i1;
        const b = i2 - i1 - 1;
        const c = seg - i2 - 1;
        if (a > 0) newState.push(a);
        if (b > 0) newState.push(b);
        if (c > 0) newState.push(c);
        nextStatesSet.add([...newState].sort((a, b) => a - b).join(','));
      }
    }
  }

  // 3. Две из разных сегментов
  for (let i = 0; i < state.length; i++) {
    for (let j = i + 1; j < state.length; j++) {
      const s1 = state[i], s2 = state[j];
      for (let p1 = 0; p1 < s1; p1++) {
        for (let p2 = 0; p2 < s2; p2++) {
          const newState = [...state];
          newState.splice(j, 1);
          newState.splice(i, 1);
          if (p1 > 0) newState.push(p1);
          if (s1 - p1 - 1 > 0) newState.push(s1 - p1 - 1);
          if (p2 > 0) newState.push(p2);
          if (s2 - p2 - 1 > 0) newState.push(s2 - p2 - 1);
          nextStatesSet.add([...newState].sort((a, b) => a - b).join(','));
        }
      }
    }
  }

  // 4. Три подряд
  for (let i = 0; i < state.length; i++) {
    const seg = state[i];
    if (seg < 3) continue;
    for (let pos = 0; pos <= seg - 3; pos++) {
      const newState = [...state];
      newState.splice(i, 1);
      if (pos > 0) newState.push(pos);
      if (seg - pos - 3 > 0) newState.push(seg - pos - 3);
      nextStatesSet.add([...newState].sort((a, b) => a - b).join(','));
    }
  }

  const nextG = new Set();
  for (const nsKey of nextStatesSet) {
    const ns = nsKey.split(',').map(Number);
    nextG.add(grundyMode5(ns));
  }

  let mex = 0;
  while (nextG.has(mex)) mex++;
  memoGrundy5.set(key, mex);
  return mex;
}

export function getMoveMode5(sticks) {
  const segments = getSegments(sticks);
  const state = segments.map(s => s.len);

  // 1. Одна любая
  for (let idx = 0; idx < segments.length; idx++) {
    const { start, len } = segments[idx];
    for (let pos = 0; pos < len; pos++) {
      const newState = [...state];
      newState.splice(idx, 1);
      if (pos > 0) newState.push(pos);
      if (len - pos - 1 > 0) newState.push(len - pos - 1);
      if (grundyMode5([...newState].sort((a, b) => a - b)) === 0) {
        return [start + pos];
      }
    }
  }

  // 2. Две любые в одном сегменте
  for (let idx = 0; idx < segments.length; idx++) {
    const { start, len } = segments[idx];
    if (len < 2) continue;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const newState = [...state];
        newState.splice(idx, 1);
        const a = i;
        const b = j - i - 1;
        const c = len - j - 1;
        if (a > 0) newState.push(a);
        if (b > 0) newState.push(b);
        if (c > 0) newState.push(c);
        if (grundyMode5([...newState].sort((a, b) => a - b)) === 0) {
          return [start + i, start + j];
        }
      }
    }
  }

  // 3. Две из разных сегментов
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const { start: s1, len: l1 } = segments[i];
      const { start: s2, len: l2 } = segments[j];
      for (let p1 = 0; p1 < l1; p1++) {
        for (let p2 = 0; p2 < l2; p2++) {
          const newState = [...state];
          newState.splice(j, 1);
          newState.splice(i, 1);
          if (p1 > 0) newState.push(p1);
          if (l1 - p1 - 1 > 0) newState.push(l1 - p1 - 1);
          if (p2 > 0) newState.push(p2);
          if (l2 - p2 - 1 > 0) newState.push(l2 - p2 - 1);
          if (grundyMode5([...newState].sort((a, b) => a - b)) === 0) {
            return [s1 + p1, s2 + p2];
          }
        }
      }
    }
  }

  // 4. Три подряд
  for (let idx = 0; idx < segments.length; idx++) {
    const { start, len } = segments[idx];
    if (len < 3) continue;
    for (let pos = 0; pos <= len - 3; pos++) {
      const newState = [...state];
      newState.splice(idx, 1);
      if (pos > 0) newState.push(pos);
      if (len - pos - 3 > 0) newState.push(len - pos - 3);
      if (grundyMode5([...newState].sort((a, b) => a - b)) === 0) {
        return [start + pos, start + pos + 1, start + pos + 2];
      }
    }
  }

  // 5. По умолчанию — первая палочка
  if (segments.length > 0 && segments[0].len > 0) {
    return [segments[0].start];
  }

  return [];
}

// --- Основная функция ---
export function getOptimalMove(mode, sticks, a, b, k) {
  switch (mode) {
    case 1: return getMoveMode1(sticks, k);
    case 2: return getMoveMode2(sticks, a, b);
    case 3: return getMoveMode3(sticks, k);
    case 4: return getMoveMode4(sticks, a, b);
    case 5: return getMoveMode5(sticks);
    default: return [];
  }
}