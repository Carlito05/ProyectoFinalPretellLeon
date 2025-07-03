const preguntas = [
  { pregunta: "Cual es la capital de Francia?", opciones: ["Madrid", "Paris", "Roma", "Berlin"], respuestaCorrecta: 1, premio: 100 },
  { pregunta: "Cuanto es 5 x 6?", opciones: ["30", "20", "56", "15"], respuestaCorrecta: 0, premio: 200 },
  { pregunta: "Quien escribio 'Cien anos de soledad'?", opciones: ["Mario Vargas Llosa", "Gabriel Garcia Marquez", "Julio Cortazar", "Pablo Neruda"], respuestaCorrecta: 1, premio: 500 },
  { pregunta: "Que planeta es el mas cercano al sol?", opciones: ["Venus", "Marte", "Mercurio", "Jupiter"], respuestaCorrecta: 2, premio: 1000 },
  { pregunta: "Que idioma se habla en Brasil?", opciones: ["Espanol", "Portugues", "Ingles", "Frances"], respuestaCorrecta: 1, premio: 2000 },
  { pregunta: "Cual es el oceano mas grande del mundo?", opciones: ["Atlantico", "Indico", "Artico", "Pacifico"], respuestaCorrecta: 3, premio: 3000 },
  { pregunta: "En que ano llego el hombre a la luna?", opciones: ["1965", "1969", "1971", "1959"], respuestaCorrecta: 1, premio: 5000 },
  { pregunta: "Quien pinto la Mona Lisa?", opciones: ["Miguel Angel", "Donatello", "Leonardo da Vinci", "Rafael"], respuestaCorrecta: 2, premio: 10000 },
  { pregunta: "Que instrumento mide los sismos?", opciones: ["Altimetro", "Sismografo", "Barometro", "Georadar"], respuestaCorrecta: 1, premio: 20000 },
  { pregunta: "Cual de estos paises no tiene salida al mar?", opciones: ["Paraguay", "Peru", "Ecuador", "Colombia"], respuestaCorrecta: 0, premio: 50000 },
  { pregunta: "Que lengua antigua se hablaba en el Imperio Romano?", opciones: ["Griego", "Arabe", "Latin", "Arameo"], respuestaCorrecta: 2, premio: 100000 },
  { pregunta: "Cual es el hueso mas largo del cuerpo humano?", opciones: ["Femur", "Tibia", "Humero", "Perone"], respuestaCorrecta: 0, premio: 150000 },
  { pregunta: "Que gas constituye la mayor parte de la atmosfera terrestre?", opciones: ["Oxigeno", "Hidrogeno", "Nitrogeno", "Dioxido de carbono"], respuestaCorrecta: 2, premio: 300000 },
  { pregunta: "Como se llama la parte derecha de un barco?", opciones: ["Proa", "Popa", "Babor", "Estribor"], respuestaCorrecta: 3, premio: 500000 },
  { pregunta: "Cuales eran los nombres de los 3 mosqueteros en la novela de Alejandro Dumas?", opciones: ["Athos, Porthos y Aramis", "Napoleon, Robespierre y Danton", "Leon, Michel y Jacques", "Richelieu, Dartagnan y Dumas"], respuestaCorrecta: 0, premio: 1000000 }
];

let indice = 0;
let premioActual = 0;
let nombreJugador = "";

const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");
const resultado = document.getElementById("resultado");
const preguntaTexto = document.getElementById("preguntaTexto");
const opcionesContainer = document.getElementById("opciones");
const premioSpan = document.getElementById("premioActual");
const saludo = document.getElementById("saludo");
const mensajeFinal = document.getElementById("mensajeFinal");

function mostrarPregunta() {
  const p = preguntas[indice];
  preguntaTexto.textContent = p.pregunta;
  opcionesContainer.innerHTML = "";
  p.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.addEventListener("click", () => verificarRespuesta(i));
    opcionesContainer.appendChild(btn);
  });
}

function verificarRespuesta(seleccion) {
  const correcta = preguntas[indice].respuestaCorrecta;
  if (seleccion === correcta) {
    premioActual = preguntas[indice].premio;
    premioSpan.textContent = premioActual;
    indice++;
    if (indice < preguntas.length) {
      mostrarPregunta();
    } else {
      finalizarJuego(true);
    }
  } else {
    finalizarJuego(false);
  }
}

function finalizarJuego(ganoTodo) {
  juego.style.display = "none";
  resultado.style.display = "block";
  const mensaje = ganoTodo
    ? `Felicidades ${nombreJugador}! Has ganado $${premioActual}`
    : `Lo sentimos ${nombreJugador}, respuesta incorrecta. Te vas con $0.`;
  mensajeFinal.textContent = mensaje;
  localStorage.setItem("nombre", nombreJugador);
  localStorage.setItem("premio", ganoTodo ? premioActual : 0);
}

function iniciarJuego() {
  nombreJugador = document.getElementById("nombreJugador").value;
  if (nombreJugador.trim() === "") return;
  inicio.style.display = "none";
  juego.style.display = "block";
  saludo.textContent = `Hola ${nombreJugador}, comenzamos.`;
  indice = 0;
  premioActual = 0;
  premioSpan.textContent = premioActual;
  mostrarPregunta();
}

document.getElementById("comenzar").addEventListener("click", iniciarJuego);

document.getElementById("retirarse").addEventListener("click", () => {
  juego.style.display = "none";
  resultado.style.display = "block";
  mensajeFinal.textContent = `${nombreJugador}, te has retirado con $${premioActual}.`;
  localStorage.setItem("nombre", nombreJugador);
  localStorage.setItem("premio", premioActual);
});

document.getElementById("reiniciar").addEventListener("click", () => {
  resultado.style.display = "none";
  inicio.style.display = "block";
});