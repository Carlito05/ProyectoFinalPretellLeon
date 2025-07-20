let preguntas = [];
let indice = 0;
let premioActual = 0;
let nombreJugador = "";
let estadoJuego = "inicio"; // puede ser: inicio, enJuego, terminado

const inicioDiv = document.getElementById("inicio");
const juegoDiv = document.getElementById("juego");
const resultadoDiv = document.getElementById("resultado");
const historialContainer = document.getElementById("historialContainer");

function guardarEstado() {
  const estado = {
    nombreJugador,
    indice,
    premioActual,
    estadoJuego
  };
  localStorage.setItem("estadoJuego", JSON.stringify(estado));
}

function cargarEstado() {
  const estado = JSON.parse(localStorage.getItem("estadoJuego"));
  if (estado) {
    nombreJugador = estado.nombreJugador;
    indice = estado.indice;
    premioActual = estado.premioActual;
    estadoJuego = estado.estadoJuego;
    return true;
  }
  return false;
}

function guardarHistorial(jugador) {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  historial.push(jugador);
  localStorage.setItem("historial", JSON.stringify(historial));
  mostrarHistorial();
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  historialContainer.innerHTML = "<h3>Historial de jugadores</h3>";
  historial.forEach((j, index) => {
    historialContainer.innerHTML += `
      <div class="historial-item">
        ${j.nombre} - $${j.premio} (${j.estado})
        <button class="historial-btn" onclick="editarNombre(${index})">Editar</button>
        <button class="historial-btn" onclick="borrarJugador(${index})">Borrar</button>
      </div>
    `;
  });
  if (historial.length > 0) {
    historialContainer.innerHTML += '<button onclick="vaciarHistorial()">Vaciar historial</button>';
  }
}

function editarNombre(index) {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  Swal.fire({
    title: 'Editar nombre',
    input: 'text',
    inputValue: historial[index].nombre,
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      historial[index].nombre = result.value;
      localStorage.setItem("historial", JSON.stringify(historial));
      mostrarHistorial();
    }
  });
}

function borrarJugador(index) {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  historial.splice(index, 1);
  localStorage.setItem("historial", JSON.stringify(historial));
  mostrarHistorial();
}

function vaciarHistorial() {
  localStorage.removeItem("historial");
  mostrarHistorial();
}

function mostrarInicio() {
  inicioDiv.innerHTML = `
    <h1>Quien quiere ser millonario?</h1>
    <p>Ingresa tu nombre para comenzar:</p>
    <input type="text" id="nombreJugador" placeholder="Tu nombre" value="${localStorage.getItem("nombre") || ""}">
    <button id="comenzar">Comenzar juego</button>
  `;
  document.getElementById("comenzar").addEventListener("click", iniciarJuego);
}

function mostrarPregunta() {
  const p = preguntas[indice];
  juegoDiv.innerHTML = `
    <h2>Hola ${nombreJugador}</h2>
    <p>${p.pregunta}</p>
    <div id="opciones">
      ${p.opciones.map((op, i) => `<button onclick="verificarRespuesta(${i})">${op}</button>`).join("")}
    </div>
    <p>Premio actual: $${premioActual}</p>
    <button onclick="retirarse()">Retirarse</button>
  `;
}

function verificarRespuesta(seleccion) {
  const correcta = preguntas[indice].respuestaCorrecta;
  if (seleccion === correcta) {
    premioActual = preguntas[indice].premio;
    indice++;
    guardarEstado();
    if (indice < preguntas.length) {
      mostrarPregunta();
    } else {
      finalizarJuego(true);
    }
  } else {
    finalizarJuego(false);
  }
}

function retirarse() {
  finalizarJuego("retirado");
}

function finalizarJuego(estadoFinal) {
  juegoDiv.style.display = "none";
  resultadoDiv.style.display = "block";

  let mensaje = "";
  let estado = "";

  if (estadoFinal === true) {
    mensaje = `${nombreJugador}, ganaste el juego con $ ${premioActual}`;
    estado = "ganador";
  } else if (estadoFinal === false) {
    mensaje = `${nombreJugador}, perdiste. Te llevas $0`;
    premioActual = 0;
    estado = "perdio";
  } else {
    mensaje = `${nombreJugador}, te retiraste con $ ${premioActual}`;
    estado = "retirado";
  }

  resultadoDiv.innerHTML = `
    <h2>Juego terminado</h2>
    <p>${mensaje}</p>
    <button onclick="reiniciar()">Volver a jugar</button>
  `;

  guardarHistorial({ nombre: nombreJugador, premio: premioActual, estado });
  localStorage.removeItem("estadoJuego");
  mostrarHistorial();
}

function reiniciar() {
  location.reload();
}

function iniciarJuego() {
  nombreJugador = document.getElementById("nombreJugador").value.trim();
  if (!nombreJugador) return;

  localStorage.setItem("nombre", nombreJugador);
  inicioDiv.style.display = "none";
  juegoDiv.style.display = "block";
  resultadoDiv.style.display = "none";

  indice = 0;
  premioActual = 0;
  estadoJuego = "enJuego";

  guardarEstado();
  mostrarPregunta();
}

fetch("../js/preguntas.json")
  .then(res => res.json())
  .then(data => {
    preguntas = data;
    if (cargarEstado()) {
      if (estadoJuego === "enJuego") {
        inicioDiv.style.display = "none";
        juegoDiv.style.display = "block";
        mostrarPregunta();
      } else {
        mostrarInicio();
      }
    } else {
      mostrarInicio();
    }
    mostrarHistorial();
  });