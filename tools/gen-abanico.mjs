// Dev-time only. Genera la geometria del abanico/sol del isotipo Tabaquillo.
// No se despliega. Ejecutar:  node tools/gen-abanico.mjs
const CX = 100, CY = 118;      // vertice del abanico
const N = 13;                  // cantidad de rayos
const SPAN = 158;              // apertura total en grados
const R0 = 15, R1 = 101;       // radio interior / exterior
const W0 = 0.7, W1 = 3.0;      // semi-ancho en base / punta
const r2 = n => Math.round(n * 100) / 100;

function pt(r, theta, off) {
  const t = (theta * Math.PI) / 180;
  // 0 grados = arriba; positivo = derecha
  const ux = Math.sin(t), uy = -Math.cos(t);   // direccion del rayo
  const px = Math.cos(t), py = Math.sin(t);    // perpendicular
  return [r2(CX + ux * r + px * off), r2(CY + uy * r + py * off)];
}

const rays = [];
for (let i = 0; i < N; i++) {
  const th = -SPAN / 2 + (i * SPAN) / (N - 1);
  const a = pt(R0, th, -W0), b = pt(R1, th, -W1), c = pt(R1, th, W1), d = pt(R0, th, W0);
  rays.push(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}L${d[0]} ${d[1]}Z`);
}

// Monticulo solido de la base (el "brote" del que nacen los rayos)
const bl = pt(R0 + 1, -SPAN / 2, 0), br = pt(R0 + 1, SPAN / 2, 0);
const base = `M${bl[0]} ${bl[1]}A17 17 0 0 1 ${br[0]} ${br[1]}L${br[0]} ${r2(CY + 4)}A${r2((br[0]-bl[0])/2)} 6 0 0 1 ${bl[0]} ${r2(CY + 4)}Z`;

console.log("=== RAYOS ===");
console.log(rays.join("\n"));
console.log("\n=== BASE ===");
console.log(base);

// Arco punteado exterior (guia del borde del abanico)
const al = pt(R1 + 7, -SPAN / 2 - 2, 0), ar = pt(R1 + 7, SPAN / 2 + 2, 0);
console.log("\n=== ARCO ===");
console.log(`M${al[0]} ${al[1]}A${R1 + 7} ${R1 + 7} 0 0 1 ${ar[0]} ${ar[1]}`);
