# Tabaquillo · Gin de Autor — sitio web

Sitio estático: HTML, CSS y JavaScript. **No necesita servidor, ni Node, ni base de datos.**
Se sube la carpeta tal cual y funciona.

---

## ⚠️ Lo que hay que completar antes de publicar

Todo esto está en un solo archivo: **`lib/manifest.js`**. Se abre con el Bloc de notas.

| Dato | Estado | Dónde |
|---|---|---|
| **Número de WhatsApp** | ⚠️ **Puesto de ejemplo** — `5492656000000` | `lib/manifest.js` → `whatsapp` |
| Email de contacto | Vacío (opcional) | `lib/manifest.js` → `email` |
| Instagram | ✅ Ya cargado | `lib/manifest.js` → `instagram` |

El número va **sin `+`, sin `0` y sin `15`**: código de país + área + número.
Ejemplo, para un (2656) 45-6789 de Merlo → `5492656456789`.

Si el número queda mal, el formulario avisa en pantalla en vez de romperse.

---

## Datos que saqué de sus fotos y conviene que confirmen

Armé el contenido leyendo las etiquetas y las publicaciones de
[@tabaquillogindeautor](https://www.instagram.com/tabaquillogindeautor/).
Lo que está seguro y lo que conviene chequear:

**Seguro** (sale de la etiqueta o del certificado):
- «Destilado y envasado en el tercer microclima del mundo»
- Merlo, San Luis, Argentina · EST. 2021 · línea **Boticario**
- Medalla de **Plata**, CopCom 2024, categoría Gin de Autor

**A confirmar** (lo leí de fotos de etiqueta, puede tener errores):
- Botánicos de **Boticario Cannabis**: cardamomo, coriandro, pimienta de Jamaica, manzanilla, piel de limón, cannabis
- Botánicos de **Boticario Mandarina**: enebro, cardamomo, lavanda, manzanilla, mandarina, especias
- Puntos de venta: Merlo, Carpintería, Salto, Pergamino, CABA y AMBA *(los tomé de los destacados de Instagram — faltan direcciones)*
- No puse **graduación alcohólica, contenido en ml ni precios** porque no los tengo. Si los quieren mostrar, decime y los agrego.

Las descripciones de sabor y los textos de la sección «Ritual» los escribí yo.
Cámbienlos con confianza si no suenan a la marca.

---

## Cómo editar los textos

Todo el texto visible está en **`index.html`**, en orden, con comentarios que marcan cada sección:

```
PORTAL → NAV → HERO → ORIGEN → LOS GINES → BOTÁNICOS
→ RITUAL → PREMIO → DÓNDE → PEDIDOS → FOOTER
```

Se abre con el Bloc de notas, se busca el texto y se reemplaza. **No hay que tocar nada más.**

---

## Cómo publicar en Hostinger

1. Entrar al **Administrador de archivos** de Hostinger.
2. Abrir la carpeta `public_html`.
3. Arrastrar **todo el contenido** de esta carpeta adentro.
4. Listo.

Sirve igual para Netlify, Vercel o cualquier hosting: es una carpeta de archivos.

### Cada vez que suban una versión nueva

En `index.html` hay tres lugares que dicen `?v=20260830`. **Cambiar esa fecha por la del día.**
Sin eso, los visitantes que ya entraron siguen viendo la versión vieja durante días.

El archivo `.htaccess` ya se encarga del resto del caché. **No lo borren** — se ve invisible en
Windows pero tiene que subir igual.

### Carpetas que pueden borrar antes de subir

- `assets/photos/source/` — las fotos originales, guardadas por las dudas
- `tools/` — scripts que usé para generar el logo, no forman parte del sitio
- `LEEME.md` — este archivo

Sin ellas el sitio pesa unos **500 KB**.

---

## Decisiones que conviene conocer

**El fondo del hero es una foto prestada.** Es un cielo estrellado sobre una sierra, de dominio
público (CC0, National Park Service). Está creditada en el pie. **Vale mucho más una foto propia de
los Comechingones**: reemplacen `assets/img/hero-sierras.jpg` por una suya con el mismo nombre y
borren el bloque `credito` de `lib/manifest.js`. Cuanto más grande y más oscura, mejor.

**Las botellas son dibujos, no fotos.** Las hice en vectorial porque las fotos de Instagram tienen
fondos que distraen (una pared de listones, un certificado) y se ven pixeladas en pantallas grandes.
El dibujo se ve nítido en cualquier tamaño y permite cambiar el color de la banda por variedad.
Si consiguen fotos de las botellas con fondo limpio, se pueden cambiar.

**El logo también es vectorial.** Lo reconstruí a partir del sello: el abanico, el círculo y las dos
leyendas curvas. Por eso se ve perfecto en cualquier tamaño y sirve de favicon. Si tienen el
archivo original del diseñador (`.ai`, `.svg`), mejor todavía — se puede reemplazar.

**La puerta de edad** guarda la respuesta en el navegador: se pregunta una sola vez por persona.
Está hecha para que, si el JavaScript falla, la puerta abra igual y nadie quede trabado.

**El formulario no manda mails.** Abre WhatsApp con el mensaje ya escrito. Es lo que realmente usa
una marca chica en Argentina y no depende de ningún servicio que se pueda caer o vencer.

---

## Detalles técnicos

- Sin frameworks, sin npm, sin compilación. HTML + CSS + JS clásico.
- Única librería: GSAP (en `lib/`), para el parallax del hero y el estante de botánicos.
  **Si GSAP no carga, el sitio funciona igual**: el estante pasa a ser un carrusel táctil normal.
- Las animaciones de aparición tienen tres redes de seguridad, así que el contenido
  no puede quedar invisible aunque el navegador estrangule el JavaScript.
- Los micro-gestos (hover, giros, fundidos) **no** están apagados por `prefers-reduced-motion`,
  porque Windows lo trae activado de fábrica en muchas máquinas y dejaría la web muerta.
  Sí se apaga lo intrusivo (el pulso y la línea del scroll).
- Contraste: todas las combinaciones de color pasan WCAG AA; la mayoría, AAA.
- Probado a 390 px, 768 px, 1280 px y 1440 px, sin desbordes horizontales.

### Ver el sitio en la computadora

Doble clic en `index.html` alcanza. Para verlo como en el servidor real:

```bash
node tools/servidor.mjs 8765
```

y abrir `http://localhost:8765/`.
