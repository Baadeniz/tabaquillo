/* =============================================================
   TABAQUILLO · main.js
   Script clasico (sin modulos) para que funcione igual abriendo
   index.html a mano, por FTP o detras de un CDN.
   ============================================================= */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};

  /* ---------- helpers ---------- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced   = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* =============================================================
     PORTAL
     - Modo puerta (visita nueva): el cierre lo maneja el script inline
       del <head>, asi la puerta abre aunque este archivo nunca cargue.
     - Modo destello (ya confirmo la edad antes): se va solo. El CSS
       tiene ademas una animacion de respaldo a los 2,6 s.
     ============================================================= */
  function initPortal() {
    var raiz = document.documentElement;

    if (raiz.classList.contains("portal-flash")) {
      setTimeout(function () {
        raiz.classList.add("portal-out");
        setTimeout(function () { raiz.classList.remove("portal-flash"); }, 800);
      }, 620);
      return;
    }

    if (!raiz.classList.contains("portal-gate")) return;
    var btn = $(".portal-actions .btn-primary");
    if (btn) setTimeout(function () { btn.focus({ preventScroll: true }); }, 700);
  }

  /* =============================================================
     NAV — fondo al hacer scroll, menu movil, seccion activa
     ============================================================= */
  function initNav() {
    var nav = $("[data-nav]");
    var burger = $("[data-burger]");
    if (!nav) return;

    var marcar = function () { nav.classList.toggle("is-stuck", window.scrollY > 40); };
    marcar();
    window.addEventListener("scroll", marcar, { passive: true });

    if (burger) {
      burger.addEventListener("click", function () {
        var abierto = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", abierto ? "true" : "false");
        burger.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        document.body.style.overflow = abierto ? "hidden" : "";
      });
      $$(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }

    /* Seccion activa */
    var enlaces = $$('.nav-links a[href^="#"]');
    var secciones = enlaces.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    if (!secciones.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlaces.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    secciones.forEach(function (s) { io.observe(s); });
  }

  /* =============================================================
     ANCLAS — scroll nativo con offset de nav
     ============================================================= */
  function initAnclas() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      var offset = window.innerWidth >= 960 ? 84 : 74;
      window.scrollTo({
        top: destino.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* =============================================================
     SPLIT DE TEXTO — respeta <br> y <em>
     ============================================================= */
  function initSplit() {
    var i = 0;
    function envolver(texto) {
      return texto.split(/(\s+)/).map(function (p) {
        if (/^\s+$/.test(p) || p === "") return p;
        return '<span class="split-word" aria-hidden="true" style="--i:' + (i++) + '">' + escHTML(p) + "</span>";
      }).join("");
    }

    $$("[data-split]").forEach(function (el) {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
      i = 0;

      var html = Array.prototype.slice.call(el.childNodes).map(function (nodo) {
        if (nodo.nodeType === 3) return envolver(nodo.textContent);
        if (nodo.nodeName === "BR") return "<br>";
        if (nodo.nodeType === 1) {
          var tag = nodo.tagName.toLowerCase();
          return "<" + tag + ">" + envolver(nodo.textContent) + "</" + tag + ">";
        }
        return "";
      }).join("");

      el.innerHTML = html;
    });
  }

  /* =============================================================
     REVEALS — umbral bajisimo + red de seguridad a los 6 s
     ============================================================= */
  function initReveals() {
    var pendientes = $$(".reveal, [data-split]");
    if (!pendientes.length) return;

    var mostrarTodo = function () {
      pendientes.forEach(function (el) { el.classList.add("is-visible"); });
      pendientes = [];
    };

    if (!("IntersectionObserver" in window)) { mostrarTodo(); return; }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
        var i = pendientes.indexOf(e.target);
        if (i > -1) pendientes.splice(i, 1);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -3% 0px" });

    pendientes.forEach(function (el) { io.observe(el); });

    /* Respaldo por scroll.
       El IntersectionObserver es la via principal, pero algunos navegadores
       lo estrangulan (pestaña en segundo plano, ahorro de energia, webviews).
       Si eso pasa, este barrido revela igual lo que ya esta en pantalla:
       el contenido nunca puede quedarse invisible. Se desengancha solo. */
    var ultimo = 0;
    function barrer() {
      ultimo = Date.now();
      var limite = window.innerHeight * 0.95;
      for (var i = pendientes.length - 1; i >= 0; i--) {
        var el = pendientes[i];
        if (el.getBoundingClientRect().top < limite) {
          el.classList.add("is-visible");
          io.unobserve(el);
          pendientes.splice(i, 1);
        }
      }
      if (!pendientes.length) {
        window.removeEventListener("scroll", pedirBarrido);
        window.removeEventListener("resize", pedirBarrido);
      }
    }
    /* Estrangulado por reloj, no por requestAnimationFrame: rAF tambien se
       frena en pestañas de fondo, que es justo cuando hace falta el respaldo. */
    function pedirBarrido() {
      if (Date.now() - ultimo < 120) return;
      barrer();
    }

    window.addEventListener("scroll", pedirBarrido, { passive: true });
    window.addEventListener("resize", pedirBarrido);
    pedirBarrido();

    /* Ultima red: a los 6 s, lo que siga oculto cerca del viewport se muestra */
    setTimeout(barrer, 6000);
  }

  /* =============================================================
     GINES — tarjetas que giran (click / tap / teclado)
     ============================================================= */
  function initFlip() {
    $$("[data-flip]").forEach(function (card) {
      if (card.dataset.flipBound) return;
      card.dataset.flipBound = "1";

      var girar = function () { card.classList.toggle("is-flipped"); };

      card.addEventListener("click", function (e) {
        /* No girar si el click fue sobre un enlace o boton de adentro */
        if (e.target.closest("a, button")) return;
        girar();
      });

      card.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        if (e.target !== card) return;
        e.preventDefault();
        girar();
      });
    });
  }

  /* =============================================================
     WHATSAPP — arma el enlace desde el manifiesto
     ============================================================= */
  function numeroWa() {
    return String((data.contacto && data.contacto.whatsapp) || "").replace(/\D/g, "");
  }
  function enlaceWa(texto) {
    var n = numeroWa();
    if (!n) return null;
    return "https://wa.me/" + n + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  function initWa() {
    var base = enlaceWa("Hola Tabaquillo! Quería consultar por una botella.");
    $$("[data-wa-link]").forEach(function (a) {
      if (base) {
        a.href = base;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.removeAttribute("href");
        a.textContent = "A confirmar";
      }
    });
  }

  /* =============================================================
     FORMULARIO — valida, dibuja el tilde y abre WhatsApp
     ============================================================= */
  function initForm() {
    var form = $("[data-form]");
    if (!form) return;
    var nota = $("[data-form-nota]", form);
    var notaBase = nota ? nota.textContent : "";

    $$("input, textarea", form).forEach(function (campo) {
      campo.addEventListener("input", function () {
        var cont = campo.closest(".campo");
        if (cont) cont.classList.remove("is-error");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.classList.contains("is-ok")) return;

      var falla = null;
      $$("[required]", form).forEach(function (campo) {
        var cont = campo.closest(".campo");
        var vacio = !campo.value.trim();
        if (cont) cont.classList.toggle("is-error", vacio);
        if (vacio && !falla) falla = campo;
      });

      if (falla) {
        if (nota) {
          nota.textContent = "Falta completar tu nombre y tu ciudad.";
          nota.classList.add("is-error");
        }
        falla.focus();
        return;
      }

      if (nota) { nota.textContent = notaBase; nota.classList.remove("is-error"); }

      var tipoSel = $('input[name="tipo"]:checked', form);
      var plantilla = data.plantillaPedido || "Hola! Soy {nombre}, de {lugar}. Me interesa: {tipo}. {mensaje}";
      var texto = plantilla
        .replace("{nombre}", $("#f-nombre").value.trim())
        .replace("{lugar}", $("#f-lugar").value.trim())
        .replace("{tipo}", tipoSel ? tipoSel.value : "Una botella")
        .replace("{mensaje}", $("#f-msg").value.trim())
        .replace(/\n{2,}/g, "\n")
        .trim();

      var url = enlaceWa(texto);
      if (!url) {
        if (nota) {
          nota.textContent = "Falta cargar el número de WhatsApp en lib/manifest.js";
          nota.classList.add("is-error");
        }
        return;
      }

      form.classList.add("is-ok");
      if (nota) nota.textContent = "Abriendo WhatsApp…";

      setTimeout(function () {
        window.open(url, "_blank", "noopener");
        setTimeout(function () {
          form.classList.remove("is-ok");
          if (nota) nota.textContent = notaBase;
        }, 1600);
      }, 780);
    });
  }

  /* =============================================================
     PIE — año y credito de la foto
     ============================================================= */
  function initPie() {
    $$("[data-anio]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var cred = $("[data-creditos]");
    if (!cred || !data.credito || cred.children.length) return;
    cred.innerHTML = data.credito.url
      ? '<a href="' + escHTML(data.credito.url) + '" target="_blank" rel="noopener">' + escHTML(data.credito.texto) + "</a>"
      : escHTML(data.credito.texto);
  }

  /* =============================================================
     GSAP — parallax del hero
     ============================================================= */
  function initHeroParallax() {
    var img = $("[data-parallax]");
    var hero = $(".hero");
    if (!img || !hero || reduced) return;

    gsap.to(img, {
      yPercent: 11,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* =============================================================
     GSAP — estante de botanicos anclado (solo escritorio amplio)
     Sin GSAP, o en pantallas chicas, queda como carrusel horizontal
     normal, que es exactamente lo que dice el CSS por defecto.
     ============================================================= */
  function initShowcase() {
    var sec = $("[data-showcase]");
    var track = $("[data-track]");
    if (!sec || !track) return;
    if (!matchMedia("(min-width: 960px) and (min-height: 720px)").matches) return;

    var vp = $(".show-viewport", sec);
    if (!vp) return;
    sec.classList.add("is-pinned");

    var distancia = function () {
      var cs = getComputedStyle(vp);
      var interior = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return Math.max(0, track.scrollWidth - interior);
    };

    gsap.to(track, {
      x: function () { return -distancia(); },
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: function () { return "+=" + (distancia() + window.innerHeight * 0.5); },
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  }

  /* =============================================================
     BOOT
     ============================================================= */
  function boot() {
    safe(initPortal, "initPortal");
    safe(initNav, "initNav");
    safe(initAnclas, "initAnclas");
    safe(initSplit, "initSplit");
    safe(initReveals, "initReveals");
    safe(initFlip, "initFlip");
    safe(initWa, "initWa");
    safe(initForm, "initForm");
    safe(initPie, "initPie");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
      safe(initHeroParallax, "initHeroParallax");
      safe(initShowcase, "initShowcase");

      /* Las tipografias de Google cambian las alturas: recalcular */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          try { ScrollTrigger.refresh(); } catch (e) {}
        });
      }
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
