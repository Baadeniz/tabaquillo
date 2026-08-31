/* =============================================================
   TABAQUILLO — datos de la marca
   -------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE HACE FALTA TOCAR PARA ACTUALIZAR
   TELEFONO, REDES O TEXTOS DE CONTACTO. No hay que saber programar:
   cambiar lo que esta entre comillas y guardar.
   ============================================================= */
(function () {
  "use strict";

  window.__BRAND__ = {
    nombre: "Tabaquillo",
    bajada: "Gin de Autor",
    lugar: "Merlo, San Luis, Argentina",
    desde: 2021,

    contacto: {
      /* ⚠️ REEMPLAZAR por el numero real de la marca.
         Formato: codigo de pais + area + numero, SIN +, SIN 0, SIN 15.
         Ej. para (2656) 45-6789 de Merlo:  "5492656456789"          */
      whatsapp: "5492656000000",

      /* ⚠️ REEMPLAZAR por el mail real (o dejar "" para ocultarlo) */
      email: "",

      instagram: "https://www.instagram.com/tabaquillogindeautor/",
      instagramUser: "@tabaquillogindeautor"
    },

    /* Texto con el que se abre WhatsApp cuando alguien completa el
       formulario. {nombre}, {lugar}, {tipo} y {mensaje} se reemplazan solos. */
    plantillaPedido:
      "Hola Tabaquillo! Soy {nombre}, de {lugar}.\n" +
      "Me interesa: {tipo}.\n" +
      "{mensaje}",

    /* Credito de la foto de fondo del hero (licencia CC0).
       Si la reemplazan por una foto propia, borrar este bloque. */
    credito: {
      texto: "Foto del cielo: National Park Service · CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/"
    }
  };
})();
