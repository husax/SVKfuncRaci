class Punto {
  // propiedades privadas
  #x;
  #y;
  constructor(x = 0, y = 0) {
    if (typeof x !== "number") {
      console.log("La coordenada x no es un numero");
      return;
    }
    if (typeof y !== "number") {
      console.log("La coordenada y no es un numero");
      return;
    }
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  set x(xn) {
    if (typeof xn !== "number") {
      console.log("La coordenada y dada no es un numero");
      return;
    }
    this.#x = xn;
  }

  get y() {
    return this.#y;
  }

  set y(yn) {
    if (typeof yn !== "number") {
      console.log("no es un numero");
      return;
    }
    this.#y = yn;
  }

  copia() {
    return new Punto(this.x, this.y);
  }

  norma() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  puntoMedio(p) {
    return new Punto((p.x + this.x) / 2, (p.y + this.y) / 2);
  }
  toString() {
    return `(${this.x},${this.y})`;
  }

  distancia = (p) =>
    Math.sqrt(
      (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
    );
}

class Vector extends Punto {
  constructor(x = 0, y = 0) {
    super(x, y);
  }

  copia() {
    return new Vector(this.x, this.y);
  }

  dir() {
    return Math.atan(this.y / this.x) * (180 / Math.PI);
  }
  suma(v) {
    return new Vector(v.x + this.x, v.y + this.y);
  }
  invAditivo() {
    return new Vector(-this.x, -this.y)
  }
  resta(v) {
    return this.suma(v.invAditivo());
  }

  pescalar(v) {
    return this.x * v.x + this.y * v.y;
  }

  mxescalar(c) {
    return new Vector(c * this.x, c * this.y);
  }
}

export {Punto, Vector};