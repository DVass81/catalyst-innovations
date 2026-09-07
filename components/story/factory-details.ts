import * as T from "three";
type Mat = T.MeshStandardMaterial;
type Box = (
  parent: T.Object3D,
  w: number,
  h: number,
  d: number,
  m: Mat,
  x?: number,
  y?: number,
  z?: number,
  round?: number,
) => T.Mesh;
/** Recognizable manufacturing equipment, safety zones and logistics at human scale. */
export function addFactoryDetails(
  factory: T.Group,
  equipment: T.Group,
  box: Box,
  makeMat: (color: number, metalness?: number, roughness?: number) => Mat,
  resources: Set<T.BufferGeometry | T.Material | T.Texture>,
  compact: boolean,
) {
  const steel = makeMat(0x69818d, 0.7, 0.35),
    white = makeMat(0xd8e0e1, 0.18, 0.48),
    dark = makeMat(0x132a38, 0.35, 0.46),
    rubber = makeMat(0x0c1720, 0, 0.8),
    yellow = makeMat(0xeaa728, 0.15, 0.4),
    blue = makeMat(0x236bab, 0.35, 0.3),
    glass = makeMat(0x255a70, 0.65, 0.15),
    cargo = makeMat(0x9e7652, 0, 0.85);
  const details = new T.Group();
  factory.add(details);
  function cylinder(
    parent: T.Object3D,
    r: number,
    len: number,
    m: Mat,
    x: number,
    y: number,
    z: number,
    axis: "x" | "y" | "z" = "y",
  ) {
    const g = new T.CylinderGeometry(r, r, len, compact ? 10 : 20);
    resources.add(g);
    const obj = new T.Mesh(g, m);
    obj.position.set(x, y, z);
    if (axis === "x") obj.rotation.z = Math.PI / 2;
    if (axis === "z") obj.rotation.x = Math.PI / 2;
    parent.add(obj);
    return obj;
  }
  function beam(
    parent: T.Object3D,
    a: number[],
    b: number[],
    r: number,
    m: Mat,
  ) {
    const start = new T.Vector3(...(a as [number, number, number])),
      end = new T.Vector3(...(b as [number, number, number]));
    const obj = cylinder(
      parent,
      r,
      start.distanceTo(end),
      m,
      ...(start.clone().add(end).multiplyScalar(0.5).toArray() as [
        number,
        number,
        number,
      ]),
    );
    obj.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      end.sub(start).normalize(),
    );
    return obj;
  }
  function sign(
    parent: T.Object3D,
    text: string,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    bg = "#122f40",
    fg = "#e6f2f4",
  ) {
    const c = document.createElement("canvas");
    c.width = 768;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 768, 128);
    ctx.fillStyle = fg;
    ctx.font = "600 65px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 384, 66);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    resources.add(tex);
    const m = new T.MeshStandardMaterial({ map: tex, roughness: 0.7 });
    resources.add(m);
    const g = new T.PlaneGeometry(w, h);
    resources.add(g);
    const o = new T.Mesh(g, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  }
  // A tall CNC enclosure, with a glazed access door and separate operator control.
  box(equipment, 0.86, 0.85, 0.67, white, -0.91, 0.43, -0.03, 0.035);
  box(equipment, 0.67, 0.65, 0.03, dark, -0.91, 0.47, 0.325, 0.015);
  box(equipment, 0.49, 0.44, 0.028, glass, -0.96, 0.56, 0.347, 0.01);
  box(equipment, 0.025, 0.28, 0.045, steel, -0.69, 0.49, 0.37, 0.007);
  box(equipment, 0.2, 0.33, 0.06, blue, -0.38, 0.62, 0.29, 0.015);
  box(equipment, 0.14, 0.15, 0.02, glass, -0.38, 0.67, 0.328, 0.008);
  cylinder(equipment, 0.032, 0.23, yellow, -1.15, 0.98, -0.02);
  sign(equipment, "CNC / 01", 0.6, 0.095, -0.92, 0.86, 0.352);
  // The replacement pump and motor are clearly different from a generic monitor.
  box(equipment, 0.77, 0.1, 0.61, steel, -0.02, 0.13, 0.02, 0.02);
  cylinder(equipment, 0.17, 0.45, blue, -0.03, 0.36, 0.02, "x");
  cylinder(equipment, 0.2, 0.05, steel, -0.28, 0.36, 0.02, "x");
  cylinder(equipment, 0.12, 0.16, steel, 0.28, 0.36, 0.02, "x");
  cylinder(equipment, 0.06, 0.24, steel, 0.35, 0.52, 0.02);
  beam(equipment, [0.35, 0.63, 0.02], [0.35, 0.63, -0.27], 0.058, steel);
  for (let i = 0; i < 6; i++)
    cylinder(equipment, 0.187, 0.018, blue, -0.23 + i * 0.062, 0.36, 0.02, "x");
  box(equipment, 0.89, 0.026, 0.77, yellow, -0.02, 0.063, 0.03, 0.006);
  box(equipment, 0.78, 0.029, 0.66, dark, -0.02, 0.065, 0.03, 0.006);
  sign(
    equipment,
    "PUMP / LINE 02",
    0.75,
    0.11,
    -0.02,
    0.18,
    0.36,
    "#d49c2a",
    "#152635",
  );
  const requestLamp = makeMat(0xffb14b, 0.15, 0.24);
  requestLamp.emissive.set(0xde6b1a);
  requestLamp.emissiveIntensity = 0.55;
  cylinder(equipment, 0.045, 0.095, requestLamp, 0.29, 0.74, 0.01);
  // Industrial robot: pedestal, shoulder, elbow, wrist and a visible gripper.
  cylinder(equipment, 0.19, 0.13, steel, 0.86, 0.12, 0.0);
  cylinder(equipment, 0.13, 0.23, yellow, 0.86, 0.28, 0.0);
  beam(equipment, [0.86, 0.36, 0], [0.72, 0.78, 0.05], 0.075, yellow);
  cylinder(equipment, 0.105, 0.15, dark, 0.72, 0.78, 0.05, "z");
  beam(equipment, [0.72, 0.78, 0.05], [0.43, 0.66, 0.52], 0.068, yellow);
  cylinder(equipment, 0.075, 0.12, steel, 0.43, 0.66, 0.52, "x");
  beam(equipment, [0.43, 0.66, 0.52], [0.43, 0.46, 0.58], 0.04, steel);
  box(equipment, 0.21, 0.035, 0.05, dark, 0.43, 0.45, 0.58, 0.006);
  box(equipment, 0.025, 0.12, 0.035, steel, 0.34, 0.4, 0.58, 0.004);
  box(equipment, 0.025, 0.12, 0.035, steel, 0.52, 0.4, 0.58, 0.004);
  // Roller conveyor with parts and support feet.
  box(equipment, 2.53, 0.09, 0.39, steel, 0, 0.2, 0.69, 0.012);
  box(equipment, 2.45, 0.035, 0.3, rubber, 0, 0.27, 0.69, 0.006);
  for (let i = 0; i < (compact ? 9 : 16); i++)
    cylinder(
      equipment,
      0.026,
      0.31,
      steel,
      -1.15 + i * (2.3 / (compact ? 8 : 15)),
      0.29,
      0.69,
      "z",
    );
  for (const x of [-1.06, 0.98]) {
    box(equipment, 0.075, 0.23, 0.33, steel, x, 0.105, 0.69, 0.006);
    box(equipment, 0.16, 0.05, 0.44, dark, x, 0.015, 0.69, 0.01);
  }
  for (const x of [-0.83, -0.45, 0.86])
    box(equipment, 0.18, 0.12, 0.18, white, x, 0.36, 0.69, 0.012);
  // Overhead gantry and steel uprights give the cutaway a building-scale structure.
  for (const x of [-1.35, 1.35]) {
    box(details, 0.065, 1.16, 0.065, steel, x, 0.58, 0.44, 0.008);
    box(details, 0.18, 0.04, 0.18, steel, x, 0.02, 0.44, 0.005);
  }
  box(details, 2.85, 0.11, 0.13, yellow, 0, 1.2, 0.44, 0.015);
  box(details, 0.27, 0.13, 0.26, dark, 0.24, 1.18, 0.44, 0.02);
  beam(details, [0.24, 1.1, 0.44], [0.24, 0.92, 0.44], 0.012, steel);
  // Loading bay with a ribbed roller door on the building's visible right side.
  box(details, 0.055, 0.78, 0.76, dark, 1.484, 0.41, -0.26, 0.008);
  for (let i = 0; i < 8; i++)
    box(
      details,
      0.061,
      0.061,
      0.64,
      steel,
      1.52,
      0.105 + i * 0.082,
      -0.26,
      0.002,
    );
  for (const z of [-0.67, 0.17])
    box(details, 0.12, 0.86, 0.065, yellow, 1.54, 0.43, z, 0.01);
  box(details, 0.55, 0.05, 0.8, steel, 1.75, 0.05, -0.26, 0.01);
  // A yellow forklift and stacked pallets make the logistics area unmistakable.
  const lift = new T.Group();
  lift.position.set(1.9, 0, 0.73);
  lift.rotation.y = -0.25;
  details.add(lift);
  box(lift, 0.38, 0.25, 0.52, yellow, 0, 0.21, 0, 0.045);
  box(lift, 0.3, 0.27, 0.27, dark, 0, 0.45, -0.06, 0.025);
  for (const x of [-0.18, 0.18])
    for (const z of [-0.17, 0.17])
      cylinder(lift, 0.095, 0.085, rubber, x, 0.12, z, "x");
  for (const x of [-0.14, 0.14]) {
    box(lift, 0.032, 0.56, 0.032, steel, x, 0.49, 0.22, 0.004);
    box(lift, 0.05, 0.035, 0.49, steel, x, 0.105, 0.44, 0.003);
    box(lift, 0.025, 0.45, 0.025, steel, x, 0.59, -0.2, 0.004);
  }
  box(lift, 0.4, 0.038, 0.42, yellow, 0, 0.82, -0.02, 0.012);
  for (let i = 0; i < 3; i++) {
    box(details, 0.56, 0.045, 0.54, cargo, 1.9, 0.06 + i * 0.29, 1.4, 0.006);
    box(details, 0.5, 0.24, 0.47, cargo, 1.9, 0.2 + i * 0.29, 1.4, 0.012);
    box(details, 0.035, 0.245, 0.48, white, 1.9, 0.2 + i * 0.29, 1.4, 0.002);
  }
  // A service yard and safety markings, avoiding an undifferentiated blue plinth.
  for (let i = 0; i < 6; i++) {
    const stripe = box(
      details,
      0.19,
      0.008,
      0.05,
      yellow,
      -1.22 + i * 0.29,
      0.005,
      1.33,
      0.002,
    );
    stripe.rotation.y = -0.55;
  }
  box(details, 2.8, 0.008, 0.024, yellow, -0.03, 0.003, 1.15, 0.003);
  for (const x of [-1.38, 1.38])
    box(details, 0.022, 0.009, 0.95, yellow, x, 0.004, 0.69, 0.002);
  const floorLabel = sign(
    details,
    "PRODUCTION / LINE 02",
    1.72,
    0.23,
    -0.05,
    0.013,
    1.48,
  );
  floorLabel.rotation.x = -Math.PI / 2;
  const brand = sign(
    details,
    "CATALYST MANUFACTURING",
    2.55,
    0.23,
    0,
    1.025,
    -0.88,
  );
  brand.rotation.y = 0;
  return { details, requestLamp };
}
