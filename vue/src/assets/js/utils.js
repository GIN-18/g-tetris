export function preventZoom() {
  document.addEventListener("gesturestart", function(e) {
    e.preventDefault();
    document.body.style.zoom = 1;
  });
  document.addEventListener("gesturechange", function(e) {
    e.preventDefault();

    document.body.style.zoom = 1;
  });
  document.addEventListener("gestureend", function(e) {
    e.preventDefault();
    document.body.style.zoom = 1;
  });
  document.addEventListener("dblclick", function(e) {
    e.preventDefault();
    document.body.style.zoom = 1;
  });
}

export function forEachShape(shape, fn, xStep = 0, yStep = 0) {
  const cs = shape.value.pieces[shape.value.rotation];

  for (let i = 0; i < cs.length; i++) {
    const x = cs[i][1] + xStep;
    const y = cs[i][0] + yStep;

    fn(cs, x, y);
  }
}
