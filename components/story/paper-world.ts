import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { addFactoryDetails } from "./factory-details";

let studioData: Promise<ArrayBuffer> | undefined;
async function studioTexture() {
  studioData ??= fetch("/lighting/studio.bin.gz").then((response) => {
    if (!response.ok) throw new Error("Studio lighting unavailable");
    if (!response.body) throw new Error("Studio lighting is empty");
    return new Response(
      response.body.pipeThrough(new DecompressionStream("gzip")),
    ).arrayBuffer();
  });
  const data = await studioData;
  const header = new DataView(data);
  const texture = new T.DataTexture(
    new Uint16Array(data, 8),
    header.getUint32(0, true),
    header.getUint32(4, true),
    T.RGBAFormat,
    T.HalfFloatType,
  );
  texture.mapping = T.CubeUVReflectionMapping;
  texture.minFilter = T.LinearFilter;
  texture.magFilter = T.LinearFilter;
  texture.colorSpace = T.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export type WorldFrame = {
  opening: number;
  connected: number;
  industry: number;
  target: number;
  approved: boolean;
};
const clamp = T.MathUtils.clamp;
const blend = (v: number, a: number, b: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = T.MathUtils.lerp;
type Solid = T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>;

/** A finite, demand-rendered miniature. Its panels really rotate about fold edges. */
export function createPaperWorld(
  canvas: HTMLCanvasElement,
  compact: boolean,
  review = false,
) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: !compact,
    alpha: true,
    powerPreference: "low-power",
    preserveDrawingBuffer: review,
  });
  const context = renderer.getContext();
  const graphicsInfo = context.getExtension("WEBGL_debug_renderer_info");
  const graphicsName = graphicsInfo
    ? String(context.getParameter(graphicsInfo.UNMASKED_RENDERER_WEBGL))
    : "";
  compact ||= /swiftshader|llvmpipe|softpipe|software rasterizer/i.test(
    graphicsName,
  );
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, compact ? 1.15 : 1.6),
  );
  renderer.setClearColor(0x07111f, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33, 1, 0.1, 80);
  let environment: T.DataTexture | undefined;
  scene.add(new T.HemisphereLight(0xd8eeff, 0x182c42, 1.1));
  const key = new T.DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 8, 5);
  key.castShadow = !compact;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -5,
    right: 5,
    top: 5,
    bottom: -5,
    near: 0.5,
    far: 25,
  });
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new T.DirectionalLight(0x56b3ff, 1.8);
  rim.position.set(5, 3, -4);
  scene.add(rim);
  const root = new T.Group();
  scene.add(root);
  const resources = new Set<T.BufferGeometry | T.Material | T.Texture>();
  const material = (color: number, metalness = 0, roughness = 0.6) => {
    const m = new T.MeshStandardMaterial({ color, metalness, roughness });
    resources.add(m);
    return m;
  };
  const ivory = material(0xe7edf3, 0.08, 0.42);
  const silver = material(0xbacbdb, 0.55, 0.3);
  const dark = material(0x17314c, 0.48, 0.34);
  const navy = material(0x0b2137, 0.2, 0.5);
  const blue = material(0x60c4ff, 0.35, 0.19);
  blue.emissive.set(0x148be2);
  blue.emissiveIntensity = 0.6;
  const windowMat = material(0x4494bc, 0.7, 0.17);
  const amber = material(0xe8b16e, 0.2, 0.35);
  function mesh(
    g: T.BufferGeometry,
    m: T.MeshStandardMaterial,
    parent: T.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) {
    resources.add(g);
    const obj = new T.Mesh(g, m);
    obj.castShadow = !compact;
    obj.receiveShadow = !compact;
    obj.position.set(x, y, z);
    parent.add(obj);
    return obj;
  }
  function box(
    parent: T.Object3D,
    w: number,
    h: number,
    d: number,
    m: T.MeshStandardMaterial,
    x = 0,
    y = 0,
    z = 0,
    round = 0.025,
  ) {
    return mesh(
      new RoundedBoxGeometry(
        w,
        h,
        d,
        compact ? 1 : 2,
        Math.min(round, w / 3, h / 3, d / 3),
      ),
      m,
      parent,
      x,
      y,
      z,
    );
  }
  const floorMat = material(0xe9eef4, 0.18, 0.5);
  box(root, 6.1, 0.055, 4.45, floorMat, 0, -0.08, 0, 0.06);
  const plinth = box(root, 6.17, 0.12, 4.52, dark, 0, -0.16, 0, 0.04);
  const edgeLight = box(root, 6.13, 0.013, 4.49, blue, 0, -0.115, 0, 0.03);
  // An ordinary request is literally the surface from which the building folds.
  const paperCanvas = document.createElement("canvas");
  paperCanvas.width = 1024;
  paperCanvas.height = 768;
  const ctx = paperCanvas.getContext("2d")!;
  ctx.fillStyle = "#eef3f8";
  ctx.fillRect(0, 0, 1024, 768);
  ctx.fillStyle = "#15324c";
  ctx.font = "600 32px sans-serif";
  ctx.fillText("MAINTENANCE / LINE 02", 90, 118);
  ctx.font = "600 66px sans-serif";
  ctx.fillText("Replacement pump", 90, 242);
  ctx.font = "400 38px sans-serif";
  ctx.fillText("$2,400 / Awaiting review", 90, 315);
  ctx.fillStyle = "#c4d2df";
  for (let i = 0; i < 4; i++)
    ctx.fillRect(90, 397 + i * 52, i === 3 ? 470 : 820, 9);
  ctx.fillStyle = "#1455d9";
  ctx.fillRect(90, 650, 120, 7);
  const paperTexture = new T.CanvasTexture(paperCanvas);
  paperTexture.colorSpace = T.SRGBColorSpace;
  resources.add(paperTexture);
  const ink = new T.MeshStandardMaterial({
    map: paperTexture,
    transparent: true,
    roughness: 0.6,
    side: T.DoubleSide,
  });
  resources.add(ink);
  const sheet = mesh(new T.PlaneGeometry(6.08, 4.43), ink, root, 0, -0.045, 0);
  sheet.rotation.x = -Math.PI / 2;
  const factory = new T.Group();
  factory.position.set(-0.6, 0, -0.35);
  root.add(factory);
  const folds: T.Group[] = [];
  function fold(x: number, z: number, yaw: number, w: number, h: number) {
    const hinge = new T.Group();
    hinge.position.set(x, 0, z);
    hinge.rotation.y = yaw;
    factory.add(hinge);
    const panel = new T.Group();
    hinge.add(panel);
    folds.push(panel);
    box(panel, w, h, 0.035, ivory, 0, h / 2, 0, 0.01);
    if (h > 0.5) {
      for (let i = 0; i < Math.floor(w / 0.42); i++) {
        box(
          panel,
          0.27,
          0.27,
          0.012,
          windowMat,
          -w / 2 + 0.26 + i * 0.42,
          h * 0.62,
          0.025,
          0.008,
        );
      }
      box(panel, w - 0.08, 0.045, 0.04, blue, 0, 0.12, 0.025, 0.008);
    }
    return panel;
  }
  fold(0, -0.93, 0, 2.9, 1.06);
  fold(-1.45, 0, Math.PI / 2, 1.86, 1.06);
  fold(1.45, 0, -Math.PI / 2, 1.86, 1.06);
  fold(0, 0.93, Math.PI, 2.9, 0.82);
  const roof = new T.Group();
  roof.position.set(0, 1.06, -0.43);
  factory.add(roof);
  for (let i = 0; i < 4; i++) {
    const facet = box(
      roof,
      0.81,
      0.035,
      1.1,
      ivory,
      -1.12 + i * 0.74,
      0.13,
      0,
      0.012,
    );
    facet.rotation.z = 0.33;
    const glassEnd = box(
      roof,
      0.028,
      0.27,
      1.06,
      windowMat,
      -0.75 + i * 0.74,
      0.11,
      0,
      0.006,
    );
    glassEnd.rotation.z = 0;
  }
  const equipment = new T.Group();
  factory.add(equipment);
  const factoryDetail = addFactoryDetails(
    factory,
    equipment,
    box,
    material,
    resources,
    compact,
  );
  const chimney = box(factory, 0.24, 1.6, 0.24, silver, -1.15, 0.8, -0.73);
  const chimneyCap = box(factory, 0.3, 0.065, 0.3, ivory, -1.15, 1.61, -0.73);
  // Field and client worlds reuse the same stage and lighting.
  const service = new T.Group();
  service.position.set(-0.5, 0, -0.25);
  root.add(service);
  box(service, 2.5, 0.84, 1.12, ivory, -0.15, 0.7, 0, 0.12);
  box(service, 0.88, 0.7, 1.05, ivory, 1.2, 0.61, 0, 0.16);
  box(service, 0.06, 0.42, 0.85, windowMat, 1.62, 0.87, 0, 0.06);
  box(service, 0.65, 0.39, 0.035, windowMat, 1.1, 0.89, 0.54, 0.07);
  box(service, 1.94, 0.16, 0.028, blue, -0.34, 0.75, 0.574);
  for (const x of [-0.98, 1.12])
    for (const z of [-0.57, 0.57]) {
      const wheel = mesh(
        new T.CylinderGeometry(0.3, 0.3, 0.18, compact ? 12 : 24),
        navy,
        service,
        x,
        0.3,
        z,
      );
      wheel.rotation.x = Math.PI / 2;
      const hub = mesh(
        new T.CylinderGeometry(0.13, 0.13, 0.19, 12),
        silver,
        service,
        x,
        0.3,
        z,
      );
      hub.rotation.x = Math.PI / 2;
    }
  for (let i = 0; i < 3; i++)
    box(service, 0.85, 0.04, 0.07, silver, -0.73 + i * 0.51, 1.19, 0, 0.01);
  const office = new T.Group();
  office.position.set(-0.55, 0, -0.25);
  root.add(office);
  box(office, 3.04, 1.65, 0.055, ivory, 0, 0.825, -0.82);
  box(office, 0.055, 1.65, 1.75, ivory, -1.5, 0.825, 0);
  for (let i = 0; i < 3; i++) {
    const x = -0.93 + i * 0.94;
    box(office, 0.75, 0.045, 0.64, ivory, x, 0.63, 0.13);
    box(office, 0.09, 0.6, 0.42, silver, x, 0.31, 0.13);
    box(office, 0.56, 0.37, 0.035, dark, x, 0.9, -0.04);
    box(office, 0.45, 0.27, 0.018, windowMat, x, 0.91, -0.015);
    box(office, 0.5, 0.07, 0.46, navy, x, 0.43, 0.7);
    box(office, 0.5, 0.49, 0.06, navy, x, 0.69, 0.94);
    box(office, 0.74, 0.44, 0.014, windowMat, x, 1.18, -0.778);
  }
  // Beveled glass ribbon: one vertex topology transforms between the C and industry outlines.
  const outerC = [
    [50, 4],
    [88, 26],
    [88, 44],
    [72, 35],
    [50, 22],
    [28, 35],
    [28, 65],
    [50, 78],
    [72, 65],
    [88, 56],
    [88, 74],
    [50, 96],
    [12, 74],
    [12, 26],
    [50, 4],
  ];
  const silhouettes = [
    [
      [12, 86],
      [12, 42],
      [35, 54],
      [35, 36],
      [58, 48],
      [58, 30],
      [77, 42],
      [77, 12],
      [89, 12],
      [89, 86],
      [12, 86],
    ],
    [
      [9, 80],
      [9, 30],
      [61, 30],
      [76, 42],
      [89, 60],
      [94, 80],
      [79, 80],
      [72, 91],
      [61, 80],
      [31, 80],
      [23, 91],
      [15, 80],
      [9, 80],
    ],
    [
      [12, 17],
      [88, 17],
      [88, 73],
      [58, 73],
      [58, 87],
      [73, 87],
      [73, 94],
      [27, 94],
      [27, 87],
      [42, 87],
      [42, 73],
      [12, 73],
      [12, 17],
    ],
  ];
  function resample(points: number[][], count: number) {
    const lengths = [0];
    for (let i = 1; i < points.length; i++)
      lengths.push(
        lengths[i - 1] +
          Math.hypot(
            points[i][0] - points[i - 1][0],
            points[i][1] - points[i - 1][1],
          ),
      );
    const total = lengths[lengths.length - 1];
    return Array.from({ length: count }, (_, i) => {
      const d = (i / count) * total;
      let j = 1;
      while (lengths[j] < d && j < lengths.length - 1) j++;
      const t = (d - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1);
      return new T.Vector2(
        (lerp(points[j - 1][0], points[j][0], t) - 50) / 50,
        (50 - lerp(points[j - 1][1], points[j][1], t)) / 50,
      );
    });
  }
  const n = 84;
  const shapeSamples = [outerC, ...silhouettes].map((s) => resample(s, n));
  // The ribbon traces the perimeter of the existing mark, preserving its double-C identity.
  function ribbonPositions(points: T.Vector2[], thickness: number) {
    const out = new Float32Array(n * 8 * 3);
    const profile = [
      [-0.025, -thickness],
      [0.025, -thickness],
      [0.044, -thickness * 0.6],
      [0.044, thickness * 0.6],
      [0.025, thickness],
      [-0.025, thickness],
      [-0.044, thickness * 0.6],
      [-0.044, -thickness * 0.6],
    ];
    points.forEach((p, i) => {
      const tangent = points[(i + 1) % n]
        .clone()
        .sub(points[(i + n - 1) % n])
        .normalize();
      const normal = new T.Vector2(-tangent.y, tangent.x);
      profile.forEach(([w, z], j) => {
        const k = (i * 8 + j) * 3;
        out[k] = p.x + normal.x * w;
        out[k + 1] = p.y + normal.y * w;
        out[k + 2] = z;
      });
    });
    return out;
  }
  const ribbonStates = shapeSamples.map((s) => ribbonPositions(s, 0.09));
  const ribbonGeo = new T.BufferGeometry();
  const ribbonAttribute = new T.BufferAttribute(ribbonStates[0].slice(), 3);
  ribbonGeo.setAttribute("position", ribbonAttribute);
  const indexes: number[] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < 8; j++) {
      const a = i * 8 + j,
        b = ((i + 1) % n) * 8 + j,
        c = ((i + 1) % n) * 8 + ((j + 1) % 8),
        d = i * 8 + ((j + 1) % 8);
      indexes.push(a, b, d, b, c, d);
    }
  ribbonGeo.setIndex(indexes);
  ribbonGeo.computeVertexNormals();
  resources.add(ribbonGeo);
  const glass = new T.MeshPhysicalMaterial({
    color: 0x418ccc,
    metalness: 0.04,
    roughness: 0.09,
    transmission: compact ? 0 : 0.65,
    thickness: 0.6,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.2,
    transparent: true,
    opacity: 0.97,
    side: T.DoubleSide,
  });
  resources.add(glass);
  const signature = new T.Group();
  root.add(signature);
  const cShape = new T.Shape(
    outerC.map(([x, y]) => new T.Vector2((x - 50) / 50, (50 - y) / 50)),
  );
  const solidCGeometry = new T.ExtrudeGeometry(cShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
    steps: 1,
  });
  resources.add(solidCGeometry);
  const solidC = new T.Mesh(solidCGeometry, glass);
  solidC.position.z = -0.07;
  signature.add(solidC);
  const outer = new T.Mesh(ribbonGeo, glass);
  signature.add(outer);
  const inner = new T.Mesh(ribbonGeo.clone(), glass);
  resources.add(inner.geometry);
  inner.scale.setScalar(0.46);
  inner.position.z = 0.075;
  signature.add(inner);
  const logoPedestal = box(
    root,
    0.93,
    0.14,
    0.83,
    silver,
    2.46,
    0.01,
    -0.4,
    0.08,
  );
  const logoBaseLight = box(
    root,
    0.88,
    0.022,
    0.78,
    blue,
    2.46,
    0.09,
    -0.4,
    0.06,
  );
  const records: Solid[] = [];
  for (let i = 0; i < 7; i++)
    records.push(box(root, 0.45, 0.025, 0.6, ivory, 0, 0, 0, 0.02));
  const routes: {
    geometry: T.BufferGeometry;
    before: Float32Array;
    after: Float32Array;
    line: T.Mesh;
    packet: T.Mesh;
    curve: T.CatmullRomCurve3;
  }[] = [];
  for (let i = 0; i < 3; i++) {
    const start = new T.Vector3(-1.6 + i * 0.9, 0.07, 0.4);
    const finish = new T.Vector3(2.46, 0.12, -0.4);
    const good = new T.CatmullRomCurve3([
      start,
      new T.Vector3(start.x, 0.07, 1.2),
      new T.Vector3(1.7, 0.07, 1.2),
      finish,
    ]);
    const bad = new T.CatmullRomCurve3([
      start,
      new T.Vector3(0.8 - i * 0.7, 0.22, 1.6),
      new T.Vector3(-1 + i * 0.8, 0.1, 1.5),
      new T.Vector3(2, 0.3, 0.7),
      finish,
    ]);
    const afterGeo = new T.TubeGeometry(
      good,
      40,
      0.018,
      compact ? 4 : 6,
      false,
    );
    const beforeGeo = new T.TubeGeometry(
      bad,
      40,
      0.018,
      compact ? 4 : 6,
      false,
    );
    resources.add(afterGeo);
    resources.add(beforeGeo);
    const routeMat = new T.MeshStandardMaterial({
      color: 0x69c8ff,
      emissive: 0x3fafff,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      transparent: true,
    });
    resources.add(routeMat);
    const line = new T.Mesh(afterGeo, routeMat);
    root.add(line);
    const packet = mesh(new T.SphereGeometry(0.045, 8, 6), blue, root);
    routes.push({
      geometry: afterGeo,
      before: (beforeGeo.attributes.position.array as Float32Array).slice(),
      after: (afterGeo.attributes.position.array as Float32Array).slice(),
      line,
      packet,
      curve: good,
    });
  }
  // The screen approaches the real HTML decision card at the end of the opening.
  const screen = new T.Group();
  root.add(screen);
  box(screen, 2.15, 0.89, 0.085, dark, 0, 0, 0, 0.075);
  box(screen, 1.98, 0.72, 0.018, navy, 0, 0, 0.054, 0.04);
  for (let i = 0; i < 3; i++)
    box(
      screen,
      i === 0 ? 1.35 : 0.92,
      0.042,
      0.025,
      i === 0 ? ivory : silver,
      -0.19,
      i === 0 ? 0.19 : 0.02 - i * 0.1,
      0.07,
      0.006,
    );
  const screenStatus = box(
    screen,
    0.41,
    0.16,
    0.026,
    blue,
    0.61,
    -0.2,
    0.072,
    0.03,
  );
  let previous: WorldFrame = {
    opening: 1,
    connected: 1,
    industry: 0,
    target: 0,
    approved: false,
  };
  let w = 0,
    h = 0,
    disposed = false,
    prepared = false;
  const colorA = new T.Color(0xeaf0f6),
    colorB = new T.Color(0x46565f);
  let lastEnvelope = NaN,
    lastTarget = -1,
    lastConnection = NaN;
  function draw(frame: WorldFrame) {
    if (disposed) return;
    previous = frame;
    if (!prepared) return;
    const { opening: p, connected: c, industry: idx, target, approved } = frame;
    const formation = blend(p, 0.16, 0.54),
      connection = blend(p, 0.42, 0.7),
      arrival = blend(p, 0.75, 1);
    root.rotation.y = lerp(-0.08, 0.1, formation);
    root.position.y = lerp(0.2, -0.03, formation);
    const scale = lerp(0.76, 1, blend(p, 0.06, 0.36));
    root.scale.setScalar(scale);
    floorMat.color.copy(colorA).lerp(colorB, formation);
    ink.opacity = 1 - blend(p, 0.12, 0.37);
    sheet.visible = ink.opacity > 0.005;
    plinth.scale.y = Math.max(0.001, formation);
    plinth.visible = formation > 0.01;
    edgeLight.visible = formation > 0.2;
    folds.forEach((f, i) => {
      const a = blend(p, 0.14 + i * 0.025, 0.44 + i * 0.025);
      f.rotation.x = (-Math.PI / 2) * (1 - a);
      f.scale.y = Math.max(0.001, blend(p, 0.04, 0.19));
    });
    folds[3].rotation.x -= blend(p, 0.46, 0.69) * Math.PI * 0.49;
    factoryDetail.details.visible = p > 0.31;
    factoryDetail.details.scale.y = Math.max(0.001, blend(p, 0.31, 0.62));
    roof.scale.y = Math.max(0.001, blend(p, 0.3, 0.54));
    roof.position.y = 1.06 * formation;
    roof.visible = p > 0.23;
    equipment.scale.y = Math.max(0.001, blend(p, 0.32, 0.59));
    equipment.visible = p > 0.25;
    chimney.scale.y = Math.max(0.001, formation);
    chimney.visible = p > 0.22;
    chimneyCap.visible = p > 0.32;
    chimneyCap.position.y = 1.61 * formation;
    const weights = [0, 1, 2].map((i) => Math.max(0, 1 - Math.abs(idx - i)));
    [factory, service, office].forEach((g, i) => {
      g.visible = weights[i] > 0.001;
      g.scale.setScalar(Math.max(0.001, weights[i] * (i === 0 ? 1.18 : 1.12)));
      g.position.y = (1 - weights[i]) * 0.65;
    });
    const gl = blend(p, 0.42, 0.66);
    signature.position.set(lerp(0.7, 2.46, gl), lerp(0.35, 0.83, gl), -0.4);
    signature.scale.setScalar(Math.max(0.001, gl * 0.51));
    signature.rotation.y = lerp(-Math.PI * 0.8, 0.38, gl);
    logoPedestal.scale.y = Math.max(0.001, gl);
    logoPedestal.visible = gl > 0.01;
    logoBaseLight.visible = gl > 0.1;
    const envelope = Math.sin(
      Math.PI * (1 - clamp(Math.abs(target - idx), 0, 1)),
    );
    const shape = ribbonStates[clamp(target + 1, 1, 3)];
    if (envelope !== lastEnvelope || target !== lastTarget) {
      for (let k = 0; k < ribbonAttribute.array.length; k++)
        ribbonAttribute.array[k] = lerp(ribbonStates[0][k], shape[k], envelope);
      ribbonAttribute.needsUpdate = true;
      ribbonGeo.computeVertexNormals();
      lastEnvelope = envelope;
      lastTarget = target;
    }
    inner.scale.setScalar(0.46 * (1 - envelope));
    solidC.scale.setScalar(Math.max(0.001, 1 - envelope));
    records.forEach((r, i) => {
      const chaosX = -2.12 + (i % 4) * 1.12,
        chaosZ = 1.35 + (i % 2) * 0.15;
      r.position.set(
        lerp(chaosX, 1.65, c),
        0.06 + i * 0.031,
        lerp(chaosZ, 0.87, c),
      );
      r.rotation.y = lerp((i % 2 ? 1 : -1) * (0.35 + i * 0.19), 0, c);
      r.scale.setScalar(formation * (1 - arrival * 0.25));
    });
    routes.forEach((r, i) => {
      const attr = r.geometry.attributes.position as T.BufferAttribute;
      if (c !== lastConnection) {
        for (let k = 0; k < attr.array.length; k++)
          attr.array[k] = lerp(r.before[k], r.after[k], c);
        attr.needsUpdate = true;
      }
      r.geometry.setDrawRange(
        0,
        Math.floor((connection * r.geometry.index!.count) / 3) * 3,
      );
      r.line.visible = formation > 0.3;
      const m = r.line.material as T.MeshStandardMaterial;
      m.color.set(c > 0.5 ? 0x69c8ff : 0xe8b16e);
      m.emissiveIntensity = 0.3 + connection * 0.7;
      r.packet.visible = p > 0.46 && p < 0.85 && c > 0.5;
      r.packet.position.copy(r.curve.getPointAt((p * 2 + i / 3) % 1));
    });
    lastConnection = c;
    screen.position.set(-0.45, lerp(0.04, 0.48, arrival), 1.51);
    screen.visible = idx > 0.9;
    screen.rotation.x = lerp(-Math.PI / 2, -0.12, arrival);
    screen.scale.setScalar(Math.max(0.001, blend(p, 0.65, 0.9)));
    screenStatus.material = approved ? blue : amber;
    const viewHeight = Math.max(4.45, 7.25 / camera.aspect);
    const distance =
      viewHeight / (2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)));
    camera.position
      .set(
        lerp(4.8, 5.0, formation),
        lerp(8, 4.7, formation),
        lerp(8, 7.7, formation),
      )
      .normalize()
      .multiplyScalar(distance);
    camera.lookAt(-0.1, 0.42, 0.12);
    renderer.render(scene, camera);
  }
  function resize() {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    if (width !== w || height !== h) {
      w = width;
      h = height;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    draw(previous);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  // Let the driver compile all three worlds without a blocking first render.
  // Keep the native still visible and the real page controls usable meanwhile.
  const ready = studioTexture().then(async (texture) => {
    if (disposed) {
      texture.dispose();
      return;
    }
    environment = texture;
    scene.environment = texture;
    await renderer.compileAsync(scene, camera);
    if (disposed) return;
    prepared = true;
    resize();
  });
  return {
    draw,
    ready,
    dispose() {
      disposed = true;
      observer.disconnect();
      resources.forEach((r) => r.dispose());
      environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
