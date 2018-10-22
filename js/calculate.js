function calculateArea(outline) {
  if (!outline) {
    return 0;
  }
  return outline.slice(0, -1).reduce((area, point, index) => {
    const a = point["range"];
    const b = outline[index + 1]["range"];
    const theta = Math.abs(outline[index + 1]["angle"] - point["angle"]);
    return area + (1 / 2) * a * b * Math.sin((theta * Math.PI) / 180);
  }, 0);
}

export { calculateArea };
