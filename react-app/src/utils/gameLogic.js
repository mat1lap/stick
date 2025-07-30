function areConsecutive(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.every((val, i) => i === 0 || val === sorted[i - 1] + 1);
}

export function isValidMove(selected, sticks, mode, k, a, b) {
  const indices = Array.from(selected);
  if (indices.length === 0) return false;
  for (let i of indices) {
    if (i < 0 || i >= sticks.length || !sticks[i]) return false;
  }

  const count = indices.length;
  if (mode === 1) return count >= 1 && count <= k;
  if (mode === 2) return count >= a && count <= b;
  if (mode === 3) return count >= 1 && count <= k && areConsecutive(indices);
  if (mode === 4) return count >= a && count <= b && areConsecutive(indices);
  if (mode === 5) {
    if (count === 1) return true;
    if (count === 2) return true;
    if (count === 3) return areConsecutive(indices);
    return false;
  }
  return false;
}