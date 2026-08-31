// Dev-time only. Escribe assets/img/marca.svg (isotipo abanico) y favicon.svg.
// No se despliega. Ejecutar:  node tools/gen-marca.mjs
import { writeFileSync } from "node:fs";

const CX = 100, CY = 116, N = 13, SPAN = 152, R0 = 16, R1 = 97, W0 = 0.8, W1 = 3.1;
const r2 = n => Math.round(n * 100) / 100;
const pt = (r, th, off) => {
  const t = (th * Math.PI) / 180;
  return [r2(CX + Math.sin(t) * r + Math.cos(t) * off), r2(CY - Math.cos(t) * r + Math.sin(t) * off)];
};

const rays = [];
for (let i = 0; i < N; i++) {
  const th = -SPAN / 2 + (i * SPAN) / (N - 1);
  const [ax, ay] = pt(R0, th, -W0), [bx, by] = pt(R1, th, -W1);
  const [cx, cy] = pt(R1, th, W1), [dx, dy] = pt(R0, th, W0);
  rays.push(`M${ax} ${ay}L${bx} ${by}L${cx} ${cy}L${dx} ${dy}Z`);
}
const [blx, bly] = pt(R0 + 1, -SPAN / 2, 0), [brx, bry] = pt(R0 + 1, SPAN / 2, 0);
const base = `M${blx} ${bly}A${r2((brx - blx) / 2)} 16 0 0 1 ${brx} ${bry}L${brx} 124A${r2((brx - blx) / 2)} 5 0 0 1 ${blx} 124Z`;

const paths = rays.map(d => `    <path d="${d}"/>`).join("\n");

writeFileSync("assets/img/marca.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" role="img" aria-label="Isotipo Tabaquillo">
  <g fill="#D9C48F">
${paths}
    <path d="${base}"/>
  </g>
</svg>
`);

writeFileSync("assets/img/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill="#0B1220"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="#D9C48F" stroke-width="2.5"/>
  <g fill="#EFE4CB" transform="translate(0 34) scale(0.86) translate(16 0)">
${paths}
    <path d="${base}"/>
  </g>
</svg>
`);

console.log(paths);
console.log("BASE:", base);
