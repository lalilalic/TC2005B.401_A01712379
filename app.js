// Laboratorio 8
// Ejemplos basicos de Node.js y solucion de ejercicios en consola.

const fs = require("fs");
const path = require("path");

console.log("===== LABORATORIO 8: NODE.JS =====");
console.log("Node permite ejecutar JavaScript fuera del navegador.");
console.log("Directorio actual del proyecto:", __dirname);

// 1. Funcion que recibe un arreglo de numeros y devuelve su promedio.
function calcularPromedio(numeros) {
  if (!Array.isArray(numeros) || numeros.length === 0) {
    throw new Error("El arreglo debe contener al menos un numero.");
  }

  const suma = numeros.reduce((acumulado, numero) => acumulado + numero, 0);
  return suma / numeros.length;
}

// 2. Funcion que recibe un string y lo escribe en un archivo de texto usando fs.
function escribirTextoEnArchivo(texto, nombreArchivo) {
  const rutaArchivo = path.join(__dirname, nombreArchivo);
  fs.writeFileSync(rutaArchivo, texto, "utf8");
  return rutaArchivo;
}

// 3. Problema extra resuelto en Node.js:
// verificar si dos palabras son anagramas.
function sonAnagramas(textoA, textoB) {
  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .split("")
      .sort()
      .join("");

  return normalizar(textoA) === normalizar(textoB);
}

function ejecutarEjercicios() {
  console.log("\n1) Promedio de un arreglo");
  const numeros = [10, 8, 9, 7, 10];
  const promedio = calcularPromedio(numeros);
  console.log("Arreglo:", numeros);
  console.log("Promedio:", promedio);

  console.log("\n2) Escritura de texto en archivo con fs");
  const texto = "Hola desde Node.js. Este archivo fue generado con fs.";
  const rutaArchivo = escribirTextoEnArchivo(texto, "hola.txt");
  const contenido = fs.readFileSync(rutaArchivo, "utf8");
  console.log("Archivo generado:", rutaArchivo);
  console.log("Contenido del archivo:", contenido);

  console.log("\n3) Problema extra: anagramas");
  const palabra1 = "roma";
  const palabra2 = "amor";
  console.log(`"${palabra1}" y "${palabra2}" son anagramas:`, sonAnagramas(palabra1, palabra2));
}

ejecutarEjercicios();
