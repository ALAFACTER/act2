/* =========================================================
   Expediente RE4 - app.js
   Funciones interactivas:
   1. Menú móvil (abrir / cerrar)
   2. Encabezado con fondo al hacer scroll y enlace activo
   3. Botones "Ver más" en la historia
   4. Ventana modal con la ficha de cada personaje
   5. Galería interactiva (visor con anterior / siguiente)
   6. Maletín: cambiar contenido al seleccionar un objeto
   7. Validación del formulario de contacto
   8. Efectos del inicio: mira láser y brasas
   9. Arsenal con filtros por tipo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Menú móvil ---------- */
  const menuBoton = document.getElementById("menuBoton");
  const menu = document.getElementById("menu");
  const enlaces = document.querySelectorAll(".menu__enlace");

  function cerrarMenu() {
    menu.classList.remove("abierto");
    menuBoton.setAttribute("aria-expanded", "false");
    menuBoton.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  menuBoton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    menuBoton.setAttribute("aria-expanded", String(abierto));
    menuBoton.innerHTML = abierto
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });

  enlaces.forEach((enlace) => enlace.addEventListener("click", cerrarMenu));

  /* ---------- 2. Encabezado y enlace activo ---------- */
  const encabezado = document.getElementById("encabezado");
  const secciones = document.querySelectorAll("main section[id]");

  function alHacerScroll() {
    encabezado.classList.toggle("con-fondo", window.scrollY > 40);

    let actual = "inicio";
    secciones.forEach((seccion) => {
      if (window.scrollY >= seccion.offsetTop - 120) actual = seccion.id;
    });

    enlaces.forEach((enlace) => {
      enlace.classList.toggle("activo", enlace.getAttribute("href") === "#" + actual);
    });
  }

  window.addEventListener("scroll", alHacerScroll, { passive: true });
  alHacerScroll();

  /* ---------- 3. Ver más / Ver menos ---------- */
  document.querySelectorAll(".ver-mas").forEach((boton) => {
    boton.addEventListener("click", () => {
      const extra = boton.parentElement.querySelector(".tarjeta-lugar__extra");
      const abierto = boton.getAttribute("aria-expanded") === "true";

      extra.hidden = abierto;
      boton.setAttribute("aria-expanded", String(!abierto));
      boton.querySelector("span").textContent = abierto ? "Ver más" : "Ver menos";
    });
  });

  /* ---------- 4. Modal de personajes ---------- */
  const personajes = {
    leon: {
      nombre: "Leon S. Kennedy",
      rol: "Agente del gobierno de EE. UU.",
      icono: "fa-user-shield",
      texto: "Sobrevivió al desastre de Raccoon City en su primer día como policía. Seis años después trabaja para el gobierno y recibe la misión de rescatar a Ashley Graham, secuestrada por un culto en una zona rural de Europa.",
      datos: { "Primera aparición": "Resident Evil 2 (1998)", "Objetivo": "Rescatar a Ashley", "Estilo": "Sereno, con humor seco" }
    },
    ashley: {
      nombre: "Ashley Graham",
      rol: "Hija del presidente",
      icono: "fa-user-graduate",
      texto: "Estudiante universitaria secuestrada por Los Iluminados. Gran parte del juego consiste en protegerla, darle órdenes y avanzar juntos sin que la capturen de nuevo.",
      datos: { "Situación": "Secuestrada", "Papel en el juego": "Personaje a escoltar", "Remake": "Personaje con más desarrollo" }
    },
    luis: {
      nombre: "Luis Sera",
      rol: "Investigador",
      icono: "fa-flask",
      texto: "Exinvestigador que trabajó para el culto y conoce el secreto de Las Plagas. Se une a Leon a lo largo de la aventura y tiene la clave para frenar la infección.",
      datos: { "Origen": "España", "Conocimiento": "Las Plagas", "Relación con Leon": "Aliado" }
    },
    ada: {
      nombre: "Ada Wong",
      rol: "Espía",
      icono: "fa-user-secret",
      texto: "Una agente con objetivos propios que aparece cuando Leon menos lo espera. A veces lo ayuda y a veces no; nadie sabe del todo para quién trabaja.",
      datos: { "Primera aparición": "Resident Evil 2 (1998)", "Objetivo": "Una muestra de Las Plagas", "Lealtad": "Desconocida" }
    },
    saddler: {
      nombre: "Osmund Saddler",
      rol: "Líder de Los Iluminados",
      icono: "fa-eye",
      texto: "El líder religioso detrás del secuestro. Planea usar Las Plagas para controlar a personas con poder y extender la influencia del culto por todo el mundo.",
      datos: { "Organización": "Los Iluminados", "Arma": "Las Plagas", "Papel": "Antagonista principal" }
    },
    krauser: {
      nombre: "Jack Krauser",
      rol: "Exsoldado",
      icono: "fa-skull",
      texto: "Excompañero de misiones de Leon. Se le daba por muerto, pero reaparece trabajando para otros intereses y se convierte en uno de los rivales más duros del juego.",
      datos: { "Relación con Leon": "Excompañero", "Especialidad": "Combate cuerpo a cuerpo", "Papel": "Rival" }
    }
  };

  const modal = document.getElementById("modal");
  const modalCaja = modal.querySelector(".modal__caja");
  let ultimoFoco = null;

  // Ventana modal genérica: la usan personajes y armas
  function mostrarFicha({ titulo, rol, texto, icono, datos, foto, arma }) {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalRol").textContent = rol;
    document.getElementById("modalTexto").textContent = texto;
    document.getElementById("modalIcono").className = "fa-solid " + (icono || "fa-user") + " modal__icono";

    const modalFoto = document.getElementById("modalFoto");
    modalFoto.hidden = !foto;
    if (foto) { modalFoto.src = foto; modalFoto.alt = titulo; }

    const modalArma = document.getElementById("modalArma");
    modalArma.hidden = !arma;
    if (arma) { modalArma.src = arma; modalArma.alt = titulo; }

    const lista = document.getElementById("modalDatos");
    lista.innerHTML = "";
    Object.entries(datos).forEach(([nombreDato, valor]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = nombreDato;
      dd.textContent = valor;
      lista.append(dt, dd);
    });

    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalCaja.scrollTop = 0;
    modalCaja.querySelector(".modal__cerrar").focus();
  }

  function abrirModal(clave) {
    const p = personajes[clave];
    if (!p) return;
    // Si la tarjeta tiene foto real, también se muestra en la ficha
    const fotoTarjeta = document.querySelector(`.expediente[data-personaje="${clave}"] .expediente__foto`);
    mostrarFicha({
      titulo: p.nombre, rol: p.rol, texto: p.texto, icono: p.icono, datos: p.datos,
      foto: fotoTarjeta ? fotoTarjeta.src : null
    });
  }

  function cerrarModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  }

  document.querySelectorAll(".expediente").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => abrirModal(tarjeta.dataset.personaje));
  });

  modal.querySelectorAll("[data-cerrar]").forEach((el) => el.addEventListener("click", cerrarModal));

  /* ---------- 5. Galería interactiva ---------- */
  // Se leen al abrir, para usar la imagen real o la ilustración de respaldo
  const botonesGaleria = [...document.querySelectorAll(".galeria__boton")];
  const fotos = {
    get length() { return botonesGaleria.length; },
    item(i) {
      const img = botonesGaleria[i].querySelector("img");
      return { src: img.currentSrc || img.src, alt: img.alt, titulo: botonesGaleria[i].parentElement.querySelector("figcaption").textContent };
    }
  };

  const visor = document.getElementById("visor");
  const visorImg = document.getElementById("visorImg");
  const visorTexto = document.getElementById("visorTexto");
  let indiceActual = 0;

  function mostrarFoto(indice) {
    indiceActual = (indice + fotos.length) % fotos.length;
    const foto = fotos.item(indiceActual);
    visorImg.src = foto.src;
    visorImg.alt = foto.alt;
    visorTexto.textContent = `${foto.titulo} (${indiceActual + 1} de ${fotos.length})`;
  }

  function abrirVisor(indice) {
    ultimoFoco = document.activeElement;
    mostrarFoto(indice);
    visor.hidden = false;
    document.body.style.overflow = "hidden";
    visor.querySelector(".visor__cerrar").focus();
  }

  function cerrarVisor() {
    visor.hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  }

  document.querySelectorAll(".galeria__boton").forEach((boton) => {
    boton.addEventListener("click", () => abrirVisor(Number(boton.dataset.indice)));
  });

  visor.querySelector(".visor__cerrar").addEventListener("click", cerrarVisor);
  visor.querySelector(".visor__nav--prev").addEventListener("click", () => mostrarFoto(indiceActual - 1));
  visor.querySelector(".visor__nav--next").addEventListener("click", () => mostrarFoto(indiceActual + 1));
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrarVisor(); });

  // Teclado: Escape cierra, flechas cambian de imagen
  document.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") cerrarModal();
    if (!visor.hidden) {
      if (e.key === "Escape") cerrarVisor();
      if (e.key === "ArrowRight") mostrarFoto(indiceActual + 1);
      if (e.key === "ArrowLeft") mostrarFoto(indiceActual - 1);
    }
  });

  /* ---------- 6. Maletín del mercader ---------- */
  const objetos = {
    pistola: { titulo: "Pistola", icono: "fa-gun", texto: "El arma inicial de Leon. Ocupa bastante espacio, pero el mercader puede mejorar su daño, cadencia y capacidad del cargador." },
    hierba: { titulo: "Hierba verde", icono: "fa-leaf", texto: "Recupera algo de salud. Combinada con hierbas roja y amarilla cura por completo y aumenta la salud máxima." },
    spray: { titulo: "Spray de primeros auxilios", icono: "fa-kit-medical", texto: "Restaura toda la salud de una vez. Conviene guardarlo para los jefes." },
    granada: { titulo: "Granada", icono: "fa-bomb", texto: "Útil contra grupos de Ganados que rodean a Leon. Hay versiones de fragmentación, aturdidoras e incendiarias." },
    mira: { titulo: "Mira telescópica", icono: "fa-crosshairs", texto: "Accesorio para rifles que permite apuntar con precisión a larga distancia, ideal para enemigos lejanos." },
    pesetas: { titulo: "Pesetas", icono: "fa-coins", texto: "La moneda del juego. Se obtiene de enemigos y cofres, y se gasta con el mercader en armas y mejoras." },
    joya: { titulo: "Tesoro", icono: "fa-gem", texto: "Gemas y objetos valiosos que se venden al mercader. Algunos valen más si se combinan antes de venderlos." },
    llave: { titulo: "Llave", icono: "fa-key", texto: "Abre puertas y cofres cerrados. Las llaves importantes no ocupan espacio en el maletín." }
  };

  const ficha = document.getElementById("fichaObjeto");
  const botonesObjeto = document.querySelectorAll(".objeto");

  botonesObjeto.forEach((boton) => {
    boton.addEventListener("click", () => {
      const o = objetos[boton.dataset.objeto];
      botonesObjeto.forEach((b) => b.classList.remove("seleccionado"));
      boton.classList.add("seleccionado");

      ficha.querySelector(".maletin__ficha-icono").className = "fa-solid " + o.icono + " maletin__ficha-icono";
      ficha.querySelector(".maletin__ficha-titulo").textContent = o.titulo;
      ficha.querySelector(".maletin__ficha-texto").textContent = o.texto;
    });
  });

  /* ---------- 7. Validación del formulario ---------- */
  const formulario = document.getElementById("formulario");
  const exito = document.getElementById("formularioExito");

  function marcarError(campo, mensaje) {
    const contenedor = campo.closest(".campo");
    contenedor.classList.toggle("con-error", Boolean(mensaje));
    contenedor.querySelector(".campo__error").textContent = mensaje;
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    exito.hidden = true;

    const nombre = formulario.nombre;
    const correo = formulario.correo;
    const favorito = formulario.favorito;
    const mensaje = formulario.mensaje;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valido = true;

    if (nombre.value.trim().length < 2) { marcarError(nombre, "Escribe tu nombre."); valido = false; }
    else marcarError(nombre, "");

    if (!correoValido.test(correo.value.trim())) { marcarError(correo, "Escribe un correo válido, por ejemplo tu@correo.com."); valido = false; }
    else marcarError(correo, "");

    if (!favorito.value) { marcarError(favorito, "Elige un personaje."); valido = false; }
    else marcarError(favorito, "");

    if (mensaje.value.trim().length < 10) { marcarError(mensaje, "El mensaje debe tener al menos 10 caracteres."); valido = false; }
    else marcarError(mensaje, "");

    if (valido) {
      formulario.reset();
      exito.hidden = false;
    } else {
      formulario.querySelector(".con-error input, .con-error select, .con-error textarea").focus();
    }
  });

  /* ---------- 9. Arsenal: tarjetas generadas y filtros ---------- */
  const armas = [
    { id: "sg09r", nombre: "SG-09 R", tipo: "pistola", texto: "La pistola con la que Leon empieza la aventura. Es equilibrada y confiable, y con mejoras sigue siendo útil hasta el final.", destaca: "Precisión y disparos a la cabeza" },
    { id: "sentinel-nine", nombre: "Sentinel Nine", tipo: "pistola", texto: "Pistola incluida como contenido adicional. Comparte munición con las demás pistolas y es una buena opción desde el inicio.", destaca: "Ventaja temprana" },
    { id: "red9", nombre: "Red9", tipo: "pistola", texto: "Una de las pistolas más potentes del juego. Patea fuerte al disparar, pero al ponerle su culata el retroceso se controla mucho mejor.", destaca: "Daño por disparo" },
    { id: "punisher", nombre: "Punisher", tipo: "pistola", texto: "Su bala puede atravesar a varios enemigos alineados y también algunos escudos de madera.", destaca: "Atravesar enemigos" },
    { id: "blacktail", nombre: "Blacktail", tipo: "pistola", texto: "Pistola rápida y ligera. Dispara y recarga con agilidad, lo que la hace muy cómoda en combates largos.", destaca: "Velocidad" },
    { id: "matilda", nombre: "Matilda", tipo: "pistola", texto: "Dispara en ráfagas de tres balas. Gasta munición rápido, pero ayuda mucho cuando los Ganados se acercan en grupo.", destaca: "Ráfagas" },
    { id: "broken-butterfly", nombre: "Broken Butterfly", tipo: "magnum", texto: "Revólver magnum clásico. Tiene pocas balas y recarga despacio, pero cada disparo hace muchísimo daño.", destaca: "Enemigos grandes" },
    { id: "handcannon", nombre: "Handcannon", tipo: "magnum", texto: "Una magnum enorme y exagerada. Es un arma de recompensa que se desbloquea con logros especiales.", destaca: "Potencia máxima" },
    { id: "w870", nombre: "W-870", tipo: "escopeta", texto: "La primera escopeta del juego. A corta distancia derriba a varios enemigos de un solo disparo.", destaca: "Control de grupos" },
    { id: "skull-shaker", nombre: "Skull Shaker", tipo: "escopeta", texto: "Escopeta de palanca incluida como contenido adicional. Tiene un estilo clásico y recarga de forma muy llamativa.", destaca: "Estilo y potencia cercana" },
    { id: "riot-gun", nombre: "Riot Gun", tipo: "escopeta", texto: "Escopeta con dispersión amplia, pensada para limpiar pasillos y salas con muchos enemigos.", destaca: "Área de impacto" },
    { id: "striker", nombre: "Striker", tipo: "escopeta", texto: "Su tambor guarda muchos cartuchos, así que puede disparar varias veces seguidas sin recargar.", destaca: "Capacidad" },
    { id: "sr-m1903", nombre: "SR M1903", tipo: "rifle", texto: "Rifle de cerrojo con mira telescópica. Cada disparo hace mucho daño, aunque entre uno y otro hay que esperar.", destaca: "Larga distancia" },
    { id: "stingray", nombre: "Stingray", tipo: "rifle", texto: "Rifle semiautomático. Hace un poco menos de daño por bala que el de cerrojo, pero dispara mucho más rápido.", destaca: "Ritmo de disparo" },
    { id: "cqbr", nombre: "CQBR Assault Rifle", tipo: "rifle", texto: "Rifle de asalto automático. Funciona bien a media distancia y contra enemigos resistentes.", destaca: "Fuego continuo" },
    { id: "le5", nombre: "LE 5", tipo: "subfusil", texto: "Subfusil con cadencia muy alta y buena precisión. Es de las armas automáticas más completas del juego.", destaca: "Cadencia" },
    { id: "tmp", nombre: "TMP", tipo: "subfusil", texto: "Subfusil compacto que vacía el cargador en segundos. Cada bala hace poco daño, pero la cantidad lo compensa.", destaca: "Volumen de fuego" },
    { id: "chicago-sweeper", nombre: "Chicago Sweeper", tipo: "subfusil", texto: "Subfusil de tambor de estilo antiguo. Es un arma de recompensa que se desbloquea para nuevas partidas.", destaca: "Fuego sin parar" },
    { id: "bolt-thrower", nombre: "Bolt Thrower", tipo: "especial", texto: "Lanza virotes que se pueden recoger después de disparar, y también puede colocar minas en el escenario.", destaca: "Sigilo y trampas" },
    { id: "lanzacohetes", nombre: "Lanzacohetes", tipo: "especial", texto: "Un solo disparo de enorme poder. Se guarda para los momentos más difíciles.", destaca: "Un disparo definitivo" },
    { id: "lanzacohetes-infinito", nombre: "Lanzacohetes (munición infinita)", tipo: "especial", texto: "Versión de cohete rojo con munición ilimitada. Se desbloquea como recompensa para nuevas partidas.", destaca: "Rejugar el juego" },
    { id: "cuchillo-combate", nombre: "Cuchillo de combate", tipo: "cuchillo", texto: "El cuchillo de Leon. Sirve para atacar y para desviar golpes enemigos; se desgasta con el uso y el mercader lo repara.", destaca: "Parar ataques" },
    { id: "cuchillo-krauser", nombre: "Cuchillo de Krauser", tipo: "cuchillo", texto: "Cuchillo de combate pesado ligado a Jack Krauser. Es más resistente que el cuchillo inicial de Leon.", destaca: "Resistencia" },
    { id: "cuchillo-primitivo", nombre: "Cuchillo primitivo", tipo: "cuchillo", texto: "Cuchillo especial de recompensa. Su gran ventaja es que no se desgasta con el uso.", destaca: "No se rompe" },
    { id: "cuchillo-bota", nombre: "Cuchillo de bota", tipo: "cuchillo", texto: "Cuchillo pequeño de doble filo. Es ligero y rápido de usar.", destaca: "Rapidez" },
    { id: "cuchillo-cocina", nombre: "Cuchillo de cocina", tipo: "cuchillo", texto: "Un cuchillo improvisado que se encuentra por el escenario. Se rompe pronto, pero puede salvar una situación apurada.", destaca: "Uso de emergencia" }
  ];

  const nombresTipo = {
    pistola: "Pistola", magnum: "Magnum", escopeta: "Escopeta", rifle: "Rifle",
    subfusil: "Subfusil", especial: "Arma especial", cuchillo: "Cuchillo"
  };

  const listaArsenal = document.getElementById("arsenal-lista");
  const contador = document.getElementById("arsenalContador");
  const filtros = document.querySelectorAll(".filtro");

  function pintarArsenal(filtro) {
    const visibles = filtro === "todas" ? armas : armas.filter((a) => a.tipo === filtro);
    listaArsenal.innerHTML = "";

    visibles.forEach((a, i) => {
      const tarjeta = document.createElement("button");
      tarjeta.type = "button";
      tarjeta.className = "arma";
      tarjeta.style.animationDelay = `${i * 40}ms`;
      tarjeta.innerHTML = `
        <img src="img/armas/${a.id}.jpg" alt="${a.nombre}" loading="lazy">
        <span class="arma__info">
          <span class="arma__nombre">${a.nombre}</span>
          <span class="arma__tipo">${nombresTipo[a.tipo]}</span>
        </span>`;
      tarjeta.addEventListener("click", () => mostrarFicha({
        titulo: a.nombre,
        rol: nombresTipo[a.tipo],
        texto: a.texto,
        icono: "fa-gun",
        arma: `img/armas/${a.id}.jpg`,
        datos: { "Tipo": nombresTipo[a.tipo], "Destaca en": a.destaca }
      }));
      listaArsenal.append(tarjeta);
    });

    contador.textContent = `${visibles.length} ${visibles.length === 1 ? "arma" : "armas"}`;
  }

  filtros.forEach((boton) => {
    boton.addEventListener("click", () => {
      filtros.forEach((b) => {
        b.classList.toggle("activo", b === boton);
        b.setAttribute("aria-pressed", String(b === boton));
      });
      pintarArsenal(boton.dataset.filtro);
    });
  });

  pintarArsenal("todas");

  /* ---------- 8. Efectos del inicio: mira láser y brasas ---------- */
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.getElementById("inicio");
  const laser = document.getElementById("laser");
  const lienzo = document.getElementById("brasas");

  if (!reducirMovimiento) {
    // Mira láser: sigue al cursor con un pequeño retraso, como el pulso de Leon al apuntar.
    // En pantallas táctiles (o si el cursor sale del inicio) recorre la escena sola.
    let destinoX = hero.clientWidth * 0.6, destinoY = hero.clientHeight * 0.5;
    let x = destinoX, y = destinoY;
    let usandoCursor = false;
    let tiempo = 0;

    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      destinoX = e.clientX - r.left;
      destinoY = e.clientY - r.top;
      usandoCursor = true;
    });
    hero.addEventListener("pointerleave", () => { usandoCursor = false; });

    // Brasas que suben desde la parte baja de la escena
    const ctx = lienzo.getContext("2d");
    let brasas = [];

    function ajustarLienzo() {
      const escala = window.devicePixelRatio || 1;
      lienzo.width = hero.clientWidth * escala;
      lienzo.height = hero.clientHeight * escala;
      ctx.setTransform(escala, 0, 0, escala, 0, 0);
      const cantidad = window.innerWidth < 600 ? 35 : 70;
      brasas = Array.from({ length: cantidad }, () => nuevaBrasa(true));
    }

    function nuevaBrasa(inicio) {
      const alto = hero.clientHeight;
      return {
        x: Math.random() * hero.clientWidth,
        y: inicio ? Math.random() * alto : alto + 10,
        r: Math.random() * 2.2 + 1,
        vy: Math.random() * 0.6 + 0.25,
        fase: Math.random() * Math.PI * 2,
        vida: Math.random() * 0.5 + 0.5
      };
    }

    function animar() {
      tiempo += 0.016;

      if (!usandoCursor) {
        destinoX = hero.clientWidth * (0.55 + Math.sin(tiempo * 0.5) * 0.3);
        destinoY = hero.clientHeight * (0.45 + Math.sin(tiempo * 0.8) * 0.15);
      }
      // Pequeño temblor de la mano
      const temblor = Math.sin(tiempo * 9) * 1.2;
      x += (destinoX - x) * 0.12;
      y += (destinoY - y) * 0.12;
      laser.style.transform = `translate(${x + temblor}px, ${y - temblor}px)`;

      ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
      brasas.forEach((b, i) => {
        b.y -= b.vy;
        b.x += Math.sin(tiempo * 2 + b.fase) * 0.4;
        const progreso = 1 - b.y / hero.clientHeight;
        const alfa = Math.max(0, b.vida - progreso) * (0.75 + Math.sin(tiempo * 6 + b.fase) * 0.25);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${140 + Math.floor(b.fase * 15)}, 60, ${alfa})`;
        ctx.shadowColor = "rgba(255, 120, 40, .9)";
        ctx.shadowBlur = 12;
        ctx.fill();
        if (alfa <= 0 && progreso > b.vida) brasas[i] = nuevaBrasa(false);
      });

      requestAnimationFrame(animar);
    }

    ajustarLienzo();
    window.addEventListener("resize", ajustarLienzo);
    requestAnimationFrame(animar);
  } else {
    laser.hidden = true;
  }

  /* ---------- Año del footer ---------- */
  document.getElementById("anio").textContent = new Date().getFullYear();
});
