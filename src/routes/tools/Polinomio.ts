// convierte un numero a cadena con toFixed pero
// si tiene ceros en la cola o es entero no pone los ceros
function ACadenaSinCeros(n: number, dig: number): string {
  const d = Math.floor(dig);
  if (Number.isInteger(n)) {
      return n.toString();
  }
  let cad = n.toFixed(d);
  while (cad[cad.length - 1] === "0") {
      cad = cad.slice(0, cad.length - 1);
  }
  if (cad[cad.length - 1] === ".") {
      cad = cad.slice(0, cad.length - 1);
  }
  return cad;
}

class Polinomio {
  #coefs;
  #var;
  #raices: number[];
  constructor(arr: number[], v = "x") {
    this.#var = v;
    this.#raices = [];
    let gr = arr.length - 1;
    while (arr[gr] === 0) {
      gr--;
    }
    if (gr < 0) {
      this.#coefs = [0];
    }
    else {
      this.#coefs = arr.slice(0, ++gr);
    }
  }
  // propiedades no modificables
  get grado(): number {
    return this.#coefs.length - 1;
  }
  get var() : string {
    return this.#var;
  }
  set var(v) {
    this.#var = v;
  }
  get coefs() : number[]{
    return this.#coefs.slice();
  }
  get raices(): number[] {
    return this.#raices.slice();
  }
  set raices(raicesnv) {
    this.#raices = raicesnv.slice();
  }
  get esMonico() : boolean {
    return this.#coefs[this.grado] === 1 ? true : false;
  }
  get esPolinomio(): boolean {
    return true;
  }
  get esConstante(): boolean {
    return this.grado === 0;
  }
  // metodo estatico para construir un polinomio con un solo dato
  // crea un polinomio con un único término
  // el monomio ai*x^ind
  static Monomio(ai: number, ind: number, v = "x"): Polinomio {
    const pot = Math.floor(ind);
    const mon = new Array(pot + 1);
    mon.fill(0);
    mon[pot] = ai;
      return new Polinomio(mon, v);
  }
  // suma del polinomio que llama con otro polinomio q
  Suma(q: Polinomio) : Polinomio{
    if (this.grado >= q.grado) {
      const s = this.coefs;
      for (let i = 0; i < q.#coefs.length; i++) {
        s[i] += q.#coefs[i];
      }
      return new Polinomio(s, this.var);
    }
    const s = q.coefs;
    for (let i = 0; i < this.#coefs.length; i++) {
      s[i] += this.#coefs[i];
    }
    return new Polinomio(s, this.var);
  }

  Producto(q: Polinomio) : Polinomio {
    const s = new Array(this.grado + q.grado + 1).fill(0);
    for (let i = 0; i <= this.grado; i++) {
      for (let j = 0; j <= q.grado; j++) {
        s[i + j] += this.#coefs[i] * q.#coefs[j];
      }
    }
    return new Polinomio(s, this.var);
  }

  ProductoPorN(n: number) : Polinomio {
    const s = this.coefs;
    for (let i = 0; i < s.length; i++) {
      s[i] *= n;
    }
    return new Polinomio(s, this.var);
  }

  InversoAd() : Polinomio {
    const s = this.coefs;
    for (let i = 0; i < s.length; i++) {
      s[i] *= -1;
    }
    return new Polinomio(s, this.var);
  }

  Resta(q: Polinomio): Polinomio {
    return this.Suma(q.InversoAd());
  }

  Copia() {
    return new Polinomio(this.#coefs, this.var);
  }

  Potencia(n: number): Polinomio {
    let s = this.Copia();
    if (Number.isInteger(n)) {
      for (let i = 1; i < n; i++) {
        s = s.Producto(this);
      }
    }
    return s;
  }

  Cociente(q: Polinomio): Polinomio {
      if (this.grado < q.grado) {
          return new Polinomio([0], this.var);
      }
      let r = this.Copia();
      const grs = r.grado - q.grado;
      const coc = Polinomio.Monomio(r.coefs[r.grado] / q.coefs[q.grado], grs, r.var);
      r = r.Resta(coc.Producto(q));
      return coc.Suma(r.Cociente(q));
  }

  Residuo(q: Polinomio): Polinomio {
    if (this.grado < q.grado) {
      return this.Copia(); // en este caso el residuo es el dividendo
    }
    let r = this.Copia();
    const cm = Polinomio.Monomio(r.coefs[r.grado]/q.coefs[q.grado],
      r.grado - q.grado);
    r = r.Resta(cm.Producto(q));
    return r.Residuo(q);
  }

  Evalua(x: number): number {
    let pdeX = 0;
    for (let i = this.grado; i >= 0; i--) {
      pdeX = pdeX * x + this.#coefs[i];
    }
      return pdeX;
  }

  toString(): string {
    let cad = "";
    let signo = "";
    this.#coefs.forEach((c, i) => {
      c = this.#coefs[i];
      if (c !== 0) {
        signo = c > 0 ? "+" : "-";
        c = Math.abs(c);
        cad += signo;
        if (i === 0) {
          cad += ACadenaSinCeros(c, 4);
        }
        else {
          cad += c === 1 ? this.var : ACadenaSinCeros(c, 5) + "*" + this.var;
          cad += i > 1 ? "**" + i.toString() : "";
        }
      }
    });
    if (cad === "") {
        cad = "0";
    }
    else if (cad[0] === "+") {
      cad = cad.slice(1);
    }
    return cad;
  }

  Derivada(): Polinomio {
    const dif: number[] = [];
    for (let i = 0; i < this.grado; i++) {
      dif[i] = (i + 1) * this.#coefs[i + 1];
    }
    return new Polinomio(dif, this.var);
  }
}

class FunRacional extends Polinomio {
  #denomP;
  constructor(nP: Polinomio, dP = Polinomio.Monomio(1, 0)) {
    super(nP.coefs, nP.var);
    this.#denomP = dP.Copia();
    this.#denomP.var = this.var;
  }

  get numP(): Polinomio {
    return super.Copia();
  }

  get denomP(): Polinomio {
    return this.#denomP.Copia();
  }

  get PuedeVerseComoPolinomio(): boolean {
    return this.denomP.esConstante;
  }

  get esPolinomio(): boolean {
    return false;
  }

  Suma(r: FunRacional) {
    const denc = this.denomP.Producto(r.denomP);
    const num = this.numP.Producto(r.denomP);
    return new FunRacional(num.Suma(r.numP.Producto(this.denomP)), denc);
  }

  InversoAd(): FunRacional {
    return new FunRacional(this.numP.InversoAd(), this.denomP);
  }

  Resta(r: FunRacional): FunRacional {
    return this.Suma(r.InversoAd());
  }

  Producto(r: FunRacional): FunRacional {
    return new FunRacional(this.numP.Producto(r.numP), this.denomP.Producto(r.denomP));
  }

  ProductoPorN(n: number): FunRacional{
    return new FunRacional(this.numP.ProductoPorN(n), this.denomP);
  }

  Cociente(r: FunRacional): FunRacional {
    return new FunRacional(this.numP.Producto(r.denomP), this.denomP.Producto(r.numP));
  }

  Potencia(n: number): FunRacional {
    return new FunRacional(this.numP.Potencia(n), this.denomP.Potencia(n));
  }

  Derivada(): FunRacional {
    let numDer = this.numP.Derivada().Producto(this.denomP);
    numDer = numDer.Resta(this.numP.Producto(this.denomP.Derivada()));
    return new FunRacional(numDer, this.denomP.Producto(this.denomP));
  }

  Evalua(x: number): number {
    /* if (this.numP.Evalua(x) === 0 && this.denomP.Evalua(x) === 0) {
      const divComun= new Polinomio([-x, 1]);
      const num= this.numP.Cociente(divComun);
      const denom= this.denomP.Cociente(divComun);
      return new FunRacional(num, denom).Evalua(x);
    } */
    return this.numP.Evalua(x) / this.denomP.Evalua(x);
  }
  toString() {
    if (this.PuedeVerseComoPolinomio) {
      return this.numP.toString();
    }
    return this.numP.toString() + "/" + this.denomP.toString();
  }
}

export { ACadenaSinCeros, Polinomio, FunRacional };
