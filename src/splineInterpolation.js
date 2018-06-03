function gaussElimination(A, Y) {
  const sizeOfArray = A.length;
  for (let i = 0; i < sizeOfArray; i++) {
    let maxElemInColumn = Math.abs(A[i][i]),
      maxRow = i;
    for (let k = i + 1; k < sizeOfArray; k++) {
      if (Math.abs(A[k][i]) > maxElemInColumn) {
        maxElemInColumn = Math.abs(A[k][i]);
        maxRow = k;
      }
    }
    for (let k = i; k < sizeOfArray; k++) {
      [A[i][k], A[maxRow][k]] = [A[maxRow][k], A[i][k]];
    }
    [Y[maxRow], Y[i]] = [Y[i], Y[maxRow]];
    for (let k = i + 1; k < sizeOfArray; k++) {
      const diff = -A[k][i] / A[i][i];
      for (let j = i; j < sizeOfArray; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += diff * A[i][j];
        }
      }
      Y[k] += diff * Y[i];
    }
  }

  const results = [];
  for (let i = sizeOfArray - 1; i > -1; i--) {
    results[i] = Y[i] / A[i][i];
    for (let k = i - 1; k > -1; k--) {
      Y[k] -= A[k][i] * results[i];
    }
  }

  return results;
}
export function creteInterpolationSplines(inputValues, outputValues) {
  const interpolationNodes = [];
  for (let i = 0; i < inputValues.length; i++) {
    interpolationNodes.push({ x: inputValues[i], y: outputValues[i] });
  }

  const n = inputValues.length - 1;
  const deltas = [];
  for (let i = 0; i <= n - 1; i++) {
    deltas[i] =
      (interpolationNodes[i + 1].y - interpolationNodes[i].y) /
      (interpolationNodes[i + 1].x - interpolationNodes[i].x);
  }
  const thetas = [];
  for (let i = 0; i <= n - 2; i++) {
    thetas[i] =
      (deltas[i + 1] - deltas[i]) /
      (interpolationNodes[i + 2].x - interpolationNodes[i].x);
  }

  const h = [];
  for (let i = 0; i <= n - 1; i++) {
    h[i] = interpolationNodes[i + 1].x - interpolationNodes[i].x;
  }

  const u = [];
  const w = [];
  for (let i = 1; i <= n - 1; i++) {
    u[i] = h[i - 1] / (h[i - 1] + h[i]);
    w[i] = h[i] / (h[i - 1] + h[i]);
  }

  const A = [];
  for (let i = 0; i <= n - 2; i++) {
    A[i] = [];
    for (let j = 0; j <= n - 2; j++) {
      if (i === j) A[i][j] = 2;
      else if (i === j + 1) A[i][j] = u[i + 1];
      else if (i + 1 === j) A[i][j] = w[j];
      else A[i][j] = 0;
    }
  }

  const r = [0].concat(gaussElimination(A, thetas)).concat([0]);
  const as = [];
  const bs = [];
  const cs = [];
  const ds = [];

  for (let i = 0; i <= n; i++) {
    cs[i] = r[i] * 6;
  }
  for (let i = 0; i <= n - 1; i++) {
    as[i] = interpolationNodes[i].y;
    bs[i] = deltas[i] - h[i] * (cs[i + 1] + 2 * cs[i]) / 6;
    ds[i] = (cs[i + 1] - cs[i]) / h[i];
  }
  for (let i = 0; i <= n - 1; i++) {
    let p =
      as[i] +
      bs[i] * (interpolationNodes[i + 1].x - interpolationNodes[i].x) +
      cs[i] *
        (interpolationNodes[i + 1].x - interpolationNodes[i].x) *
        (interpolationNodes[i + 1].x - interpolationNodes[i].x) /
        2 +
      ds[i] *
        (interpolationNodes[i + 1].x - interpolationNodes[i].x) *
        (interpolationNodes[i + 1].x - interpolationNodes[i].x) *
        (interpolationNodes[i + 1].x - interpolationNodes[i].x) /
        6;
  }
  return { as, bs, cs, ds };
}
