const rnd = Math.random;

function Segment(start, len) {
    this.start = start;
    this.len = len;
}

export function getSegments(sticks) {
    const segments = [];
    const n = sticks.length;
    let i = 0;
    while (i < n) {
        if (sticks[i]) {
            const start = i;
            while (i < n && sticks[i]) {
                ++i;
            }
            segments.push(new Segment(start, i - start));
        } else {
            ++i;
        }
    }
    return segments;
}

function getMex(s) {
    let mex = 0;
    for (const val of s) {
        if (val !== mex) {
            return mex;
        }
        ++mex;
    }
    return mex;
}

function getMoveAny(sticks, a, b) {
    const len = sticks.length;
    const n = sticks.filter(x => x).length;
    const dp = new Array(n + 1).fill(false);
    const loseMovePercentage = new Array(n + 1).fill(0);
    const bestMove = Array.from({ length: n + 1 }, () => []);

    for (let i = 1; i <= n; ++i) {
        let possibleMoves = 0;
        for (let j = a; j <= b && i - j >= 0; ++j) {
            possibleMoves++;
            if (!dp[i - j]) {
                dp[i] = true;
                loseMovePercentage[i]++;
                bestMove[i].push(i - j);
            }
        }
        if (possibleMoves > 0) {
            loseMovePercentage[i] /= possibleMoves;
        }
    }

    let newN;
    if (bestMove[n].length === 0) {
        newN = n - a;
        for (let i = a + 1; i <= b; ++i) {
            if (i <= n && loseMovePercentage[newN] > loseMovePercentage[n - i]) {
                newN = n - i;
            }
        }
    } else {
        const idx = Math.floor(rnd() * bestMove[n].length);
        newN = bestMove[n][idx];
    }

    const toRemove = n - newN;
    const activeIndices = [];
    for (let i = 0; i < len; ++i) {
        if (sticks[i]) {
            activeIndices.push(i);
        }
    }
    for (let i = activeIndices.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [activeIndices[i], activeIndices[j]] = [activeIndices[j], activeIndices[i]];
    }

    return activeIndices.slice(0, toRemove);
}


function getMoveConsecutive(sticks, a, b) {
    const len = sticks.length;
    const n = sticks.filter(x => x).length;
    const grundy = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; ++i) {
        const transitions = new Set();
        for (let j = a; j <= b && i - j >= 0; ++j) {
            for (let pos = 0; pos + j <= i; ++pos) {
                const left = pos;
                const right = i - pos - j;
                transitions.add(grundy[left] ^ grundy[right]);
            }
        }
        const sortedTransitions = Array.from(transitions).sort((x, y) => x - y);
        grundy[i] = getMex(sortedTransitions);
    }

    let total = 0;
    const segments = getSegments(sticks);
    for (const seg of segments) {
        total ^= grundy[seg.len];
    }

    const bestMoves = [];
    for (const seg of segments) {
        const maxN = Math.min(b, seg.len);
        if (a > maxN) continue;
        for (let j = a; j <= maxN; ++j) {
            for (let pos = 0; pos + j <= seg.len; ++pos) {
                const left = pos;
                const right = seg.len - j - pos;
                if ((total ^ grundy[left] ^ grundy[right] ^ grundy[seg.len]) === 0) {
                    const move = [];
                    for (let i = 0; i < j; ++i) {
                        move.push(seg.start + pos + i);
                    }
                    bestMoves.push(move);
                }
            }
        }
    }

    if (bestMoves.length > 0) {
        const idx = Math.floor(rnd() * bestMoves.length);
        return bestMoves[idx];
    }

    const allMoves = [];
    for (const seg of segments) {
        const maxN = Math.min(b, seg.len);
        for (let j = a; j <= maxN; ++j) {
            for (let pos = 0; pos + j <= seg.len; ++pos) {
                const move = [];
                for (let k = 0; k < j; ++k) {
                    move.push(seg.start + pos + k);
                }
                allMoves.push(move);
            }
        }
    }

    if (allMoves.length > 0) {
        const idx = Math.floor(rnd() * allMoves.length);
        return allMoves[idx];
    }

    return [];
}

function vecToKey(v) {
    return v.join(',');
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

    lens.sort((a, b) => a - b);
    const key = vecToKey(lens);
    const n = lens.length;

    if (mem.has(key)) {
        return mem.get(key);
    }

    if (n === 0) {
        mem.set(key, 0);
        return 0;
    }

    const transitions = new Set();

    for (let i = 0; i < n; ++i) {
        const len = lens[i];
        for (let pos = 0; pos < len; ++pos) {
            const trans = [...lens];
            trans.splice(i, 1);
            const left = pos;
            const right = len - pos - 1;
            if (left !== 0) trans.push(left);
            if (right !== 0) trans.push(right);
            trans.sort((a, b) => a - b);
            transitions.add(vecToKey(trans));
        }
    }

    for (let i = 0; i < n; ++i) {
        const len = lens[i];
        if (len < 2) continue;
        for (let pos1 = 0; pos1 < len; ++pos1) {
            for (let pos2 = pos1 + 1; pos2 < len; ++pos2) {
                const trans = [...lens];
                trans.splice(i, 1);
                const a_val = pos1;
                const b_val = pos2 - pos1 - 1;
                const c = len - pos2 - 1;
                if (a_val) trans.push(a_val);
                if (b_val) trans.push(b_val);
                if (c) trans.push(c);
                trans.sort((x, y) => x - y);
                transitions.add(vecToKey(trans));
            }
        }
    }

    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            const len1 = lens[i];
            const len2 = lens[j];
            for (let pos1 = 0; pos1 < len1; ++pos1) {
                for (let pos2 = 0; pos2 < len2; ++pos2) {
                    const trans = [...lens];
                    trans.splice(j, 1);
                    trans.splice(i, 1);
                    const left1 = pos1;
                    const right1 = len1 - pos1 - 1;
                    const left2 = pos2;
                    const right2 = len2 - pos2 - 1;
                    if (left1) trans.push(left1);
                    if (right1) trans.push(right1);
                    if (left2) trans.push(left2);
                    if (right2) trans.push(right2);
                    trans.sort((x, y) => x - y);
                    transitions.add(vecToKey(trans));
                }
            }
        }
    }

     for (let i = 0; i < n; ++i) {
        const len = lens[i];
        if (len < 3) continue;
        for (let pos = 0; pos <= len - 3; ++pos) {
            const trans = [...lens];
            trans.splice(i, 1);
            const left = pos;
            const right = len - pos - 3;
            if (left !== 0) trans.push(left);
            if (right !== 0) trans.push(right);
            trans.sort((x, y) => x - y);
            transitions.add(vecToKey(trans));
        }
    }


    const grundySet = new Set();
    for (const v_key of transitions) {
        const v = v_key.split(',').map(Number).filter(x => !isNaN(x));
        grundySet.add(getGrundySpecial(v));
    }

    const sortedGrundySet = Array.from(grundySet).sort((x, y) => x - y);
    const result = getMex(sortedGrundySet);
    mem.set(key, result);
    return result;
}

function getMoveSpecial(sticks) {
    const segments = getSegments(sticks);
    const n = segments.length;
    const lens = segments.map(seg => seg.len);

    const bestMoves = [];

    for (let i = 0; i < n; ++i) {
        const start = segments[i].start;
        const len = segments[i].len;
        for (let pos = 0; pos < len; ++pos) {
            const trans = [...lens];
            trans.splice(i, 1);
            const left = pos;
            const right = len - pos - 1;
            if (left) trans.push(left);
            if (right) trans.push(right);
            if (getGrundySpecial(trans) === 0) {
                bestMoves.push([start + pos]);
            }
        }
    }

    for (let i = 0; i < n; ++i) {
        const start = segments[i].start;
        const len = segments[i].len;
        if (len < 2) continue;
        for (let pos1 = 0; pos1 < len; ++pos1) {
            for (let pos2 = pos1 + 1; pos2 < len; ++pos2) {
                const trans = [...lens];
                trans.splice(i, 1);
                const a_val = pos1;
                const b_val = pos2 - pos1 - 1;
                const c = len - pos2 - 1;
                if (a_val) trans.push(a_val);
                if (b_val) trans.push(b_val);
                if (c) trans.push(c);
                if (getGrundySpecial(trans) === 0) {
                    bestMoves.push([start + pos1, start + pos2]);
                }
            }
        }
    }

    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            const start1 = segments[i].start;
            const len1 = segments[i].len;
            const start2 = segments[j].start;
            const len2 = segments[j].len;
            for (let pos1 = 0; pos1 < len1; ++pos1) {
                for (let pos2 = 0; pos2 < len2; ++pos2) {
                    const trans = [...lens];
                    trans.splice(j, 1);
                    trans.splice(i, 1);
                    const left1 = pos1;
                    const right1 = len1 - pos1 - 1;
                    const left2 = pos2;
                    const right2 = len2 - pos2 - 1;
                    if (left1) trans.push(left1);
                    if (right1) trans.push(right1);
                    if (left2) trans.push(left2);
                    if (right2) trans.push(right2);
                    if (getGrundySpecial(trans) === 0) {
                        bestMoves.push([start1 + pos1, start2 + pos2]);
                    }
                }
            }
        }
    }

    for (let i = 0; i < n; ++i) {
         const start = segments[i].start;
         const len = segments[i].len;
         if (len < 3) continue;
         for (let pos = 0; pos <= len - 3; ++pos) {
             const trans = [...lens];
             trans.splice(i, 1);
             const left = pos;
             const right = len - pos - 3;
             if (left) trans.push(left);
             if (right) trans.push(right);
             if (getGrundySpecial(trans) === 0) {
                 bestMoves.push([start + pos, start + pos + 1, start + pos + 2]);
             }
         }
     }


    if (bestMoves.length > 0) {
        const idx = Math.floor(rnd() * bestMoves.length);
        return bestMoves[idx];
    }

    const allMoves = [];

    for (let i = 0; i < n; ++i) {
        const start = segments[i].start;
        const len = segments[i].len;
        for (let pos = 0; pos < len; ++pos) {
            allMoves.push([start + pos]);
        }
    }

    for (let i = 0; i < n; ++i) {
        const start = segments[i].start;
        const len = segments[i].len;
        if (len < 2) continue;
        for (let pos1 = 0; pos1 < len; ++pos1) {
            for (let pos2 = pos1 + 1; pos2 < len; ++pos2) {
                allMoves.push([start + pos1, start + pos2]);
            }
        }
    }

    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            const start1 = segments[i].start;
            const len1 = segments[i].len;
            const start2 = segments[j].start;
            const len2 = segments[j].len;
            for (let pos1 = 0; pos1 < len1; ++pos1) {
                for (let pos2 = 0; pos2 < len2; ++pos2) {
                    allMoves.push([start1 + pos1, start2 + pos2]);
                }
            }
        }
    }

    for (let i = 0; i < n; ++i) {
        const start = segments[i].start;
        const len = segments[i].len;
        if (len < 3) continue;
        for (let pos = 0; pos <= len - 3; ++pos) {
            allMoves.push([start + pos, start + pos + 1, start + pos + 2]);
        }
    }

    if (allMoves.length > 0) {
        const idx = Math.floor(rnd() * allMoves.length);
        return allMoves[idx];
    }

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