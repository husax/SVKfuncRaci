import { ACadenaSinCeros } from "./Polinomio";

class Punto {
  // propiedades privadas
  #x: number;
  #y: number;
  constructor(x = 0, y = 0) {
    this.#x = x;
    this.#y = y;
  }

  get x(): number {
    return this.#x;
  }

  set x(xn: number) {
    this.#x = xn;
  }

  get y(): number {
    return this.#y;
  }

  set y(yn: number) {
    this.#y = yn;
  }

  copia(): Punto {
    return new Punto(this.x, this.y);
  }

  get norma(): number {
    return Math.hypot(this.x, this.y);
  }

  puntoMedio(p: Punto): Punto {
    return new Punto((p.x + this.x) / 2, (p.y + this.y) / 2);
  }
  toString(): string {
    return `(${this.x},${this.y})`;
  }

  distancia = (p: Punto) => 
              Math.hypot(this.x - p.x, this.y - p.y);
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
  suma(v: Vector) {
    return new Vector(v.x + this.x, v.y + this.y);
  }
  invAditivo() {
    return new Vector(-this.x, -this.y)
  }
  resta(v: Vector) {
    return this.suma(v.invAditivo());
  }

  pescalar(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  mxescalar(c: number) {
    return new Vector(c * this.x, c * this.y);
  }

  ortogonal() {
    return new Vector(-this.y, this.x);
  }

  unitario() {
    return this.mxescalar(1/this.norma);
  }

  prySobre(v: Vector) {
    const normav= v.norma;
    return v.mxescalar(this.pescalar(v)/(normav*normav));
  } 

  tostring(ndec=2) {
    const xs= ACadenaSinCeros(this.x, ndec);
    const ys= ACadenaSinCeros(this.y, ndec);
    return `(${xs}, ${ys})`;
  } 

}

export {Punto, Vector};