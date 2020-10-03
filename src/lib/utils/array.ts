export const initialize2DArray = (w: number, h: number, val: number | boolean = 0) => {
  const matrix = [];
  for (let y = 0; y < h; y++) {
    matrix[y] = [];
    for (let x = 0; x < w; x++) {
      matrix[y][x] = val;
    }
  }
  return matrix;
};
