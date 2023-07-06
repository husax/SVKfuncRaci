
import { Polinomio, FunRacional } from "./Polinomio";

type paresNumber = [number, number];
type funTipo= FunRacional | Polinomio;

class ParCadInt {
  #cad: string;
  #jerar: number;
  constructor(c: string, j: number) {
    this.#cad = c;
    this.#jerar = j;
  }

  get cad() {
    return this.#cad;
  }

  get jerar() {
    return this.#jerar;
  }

  set jerar(j: number) {
    this.#jerar = j;
  }
}

const isDigit= (c: string) => (c.length === 1 && /^\d/.test(c));

const isLetter= (c: string) => (c.length === 1 && /^[A-Za-z]/.test(c));

// enumeración para indicar caracteristicas aceptables 
// de nombres de variables
const enum nomVariables {
  Letra,
  LetrayDigitos,
  Palabra,
  PalabrayDigitos,
}

const enum oper {
  MasBin= 0,
  MenosBin= 1,
  Por= 2,
  Div= 3,
  Potencia= 4,
  MenosUnario= 5,
  FuncUnaria= 6,
  Variable= 7,
  Numero= 7,
  ParIzq= 8,
  ParDer= 9,
  MasUnario= 10, // no opera así que no le afecta la jerarquia
}

interface DicVariables {
  [index: string]: number;
}

class InfijaAPolaca {
  #balanceOp: number;
  #balancePar: number;
  #hayPari: boolean;
  #jerarquia: paresNumber[];
  #nuevaCad: boolean;
  #infija: string;
  #sepDec: string;
  #posicion: number;
  #postFija: ParCadInt[];
  #numError: number;  
  #tipoNomVarVigente: nomVariables;
  #variables: DicVariables;
  constructor(infija: string) {
    // Lleva cuenta de los operadores y operandos binarios:
    // Si es un operando lo incrementa en 1.
    // si es un operador lo disminuye en 1.
    // El menos unario no lo modifica. Las funciones cuentan como operadores.
    this.#balanceOp = 0;

    // LLeva cuenta de los pares de paréntesis:
    // Si es paréntesis izquierdo lo incrementa en 1.
    // si es paréntesis derecho lo decrementa en 1.
    //
    this.#balancePar = 0;

    // sirve para distinguir el menos unario del binario
    this.#hayPari = false;

    // define el orden de prioridad de los operadores y operandos. Uno para comparar
    // al entrar en la pila y otro para comparar al salir de la pila
    //                  '+'     '-'     '*'     '/'    '^'      '-'unario otros unarios
    this.#jerarquia = [
      [1, 2],   // '+'
      [1, 2],   // '-' binario
      [3, 4],   // '*'
      [3, 4],   // '/'
      [6, 5],   // '^'
      [8, 4],   // '-' unario
      [8, 7],   // funciones y otros unarios
      [9, 10],  // números y variables 
      [11, 0],  // '('
      [0, 0],   // ')'
    ];


    // Stack de trabajo para la conversión a notación polaca
    // this._pilaTrab= new Array();

    // La cadena que se va a procesar
    this.#infija = `(${infija})@`;

    // si se va a procesar otra cadena con la misma instancia
    // se hace true el booleano siguiente
    this.#nuevaCad = false;

    // Caracter asociado al separador decimal, según el país
    this.#sepDec = ".";

    // Posición del caracter a procesar.
    // Si hay error indica la posición del caracter con error.
    this.#posicion = 0;

    // Después de procesar contiene la expresión en notación polaca.
    // cada entrada del arreglo es un operador u operando
    this.#postFija = [];

    // Numero de error, si es que ocurre
    this.#numError = 0;

    // tipo de nombres de variables aceptables vigente
    // puede ser: una letra, Letra; una letra y dígitos, LetrayDigitos;
    // una palabra, Palabra; una palabra y dígitos, PalabrayDigitos
    this.#tipoNomVarVigente = nomVariables.Letra;

    // contiene una lista de variables y parámetros, no los distingue,
    // identificados al convertir la expresión.
    // almacena pares: nombre de variable y valor
    // de entrada contiene a PI y a e y sus valores correspondientes
    this.#variables = {
      Pi: Math.PI,
      e: Math.E,
    };
  }

  static errores: string[];
  static #nerr: number;

  get balancePar() {
    return this.#balancePar;
  }

  get balanceOp() {
    return this.#balanceOp;
  }

  set balanceOp(valor: number) {
    this.#balanceOp = valor;
  }

  get hayPari() {
    return this.#hayPari;
  }

  set hayPari(bo: boolean) {
    this.#hayPari = bo;
  }

  get jerarquia() {
    return this.#jerarquia;
  }

  get sepDec() {
    return this.#sepDec;
  }

  set sepDec(cad: string) {
    this.#sepDec = cad;
  }

  get infija() {
    return this.#infija;
  }

  set infija(cad: string) {
    this.#infija = `(${cad})@`;
    this.#nuevaCad = true;
  }

  get postFija() {
    return this.#postFija;
  }

  get numError() {
    return this.#numError;
  }

  set numError(valor: number) {
    this.#numError = valor;
  }
  
  static get nErr() {
    return InfijaAPolaca.#nerr;
  }

  static set nErr(valor: number) {
    InfijaAPolaca.#nerr = valor;
  }
  get posicion() {
    return this.#posicion;
  }

  get tipoNomVarVigente() {
    return this.#tipoNomVarVigente;
  }

  set tipoNomVarVigente(tipoNomVar: nomVariables) {
    this.#tipoNomVarVigente = tipoNomVar;
  }

  get variables() {
    return this.#variables;
  }

  // Identifica un token
  // entrega el token identificado, como un par (objeto ParCadInt:
  // la cadena con el token
  // el tipo de token,
  // si el tipo es negativo es que hubo un error al identificarlo y entrega el número de error
  leeToken(): ParCadInt {
    const c = this.#infija[this.posicion];
    if (c === "@") {
      return new ParCadInt(c, 0);
    }
    if (
      isDigit(c) ||
      c === this.#sepDec ||
      this.posibleNumSignado(this.posicion)
    ) {
      return this.identificaNum(this.posicion);
    }
    if (isLetter(c)) {
      return this.identificaVaroFun(c);
    }
    return this.identificaOper(c);
  }

  // Convierte la cadena que recibe a notación polaca inversa
  // entrega cero si no hubo error o el número de error correspondiente.
  // La expresión en notación polaca queda en la propiedad postFija
  InfAPol(): number {
    let jerEnt: number;

    const pilaTrab: ParCadInt[]= [];
    // this.infija = '(' + cadena + ')@'; esto se hace en el constructor
    let par = this.preProcesa();
    if (par.jerar < 0) {
      this.numError = par.jerar;
      return this.numError;
    }
    if (this.#nuevaCad) {
      this.#posicion = 0;
      this.#balanceOp = 0;
      this.#balancePar = 0;
      this.#numError = 0 ;
      this.#variables = {
        Pi: Math.PI,
        e: Math.E,
      };
      this.#postFija = [];
    }
    if (this.infija.length === 3) {
      // solo contiene los caracteres agregados
      this.numError = -2;
      return this.numError; // error: no hay cadena a procesar
    }
    while (this.posicion < this.infija.length) {
      par = this.leeToken();
      const ind = par.jerar;
      if (ind < 0) {
        this.numError = ind;
        return this.numError;
      }
      if (ind === 10) {
        // es un masunario , lo obvia
        break;
      }
      if (par.cad === "@") {
        if (this.balancePar > 0) {
          this.numError = -11; // faltan paréntesis derechos
          return this.numError;
        }
        return 0; // no hay error y sale por aquí numError ya es 0
      }
      par.jerar = this.jerarquia[ind][1];
      if (pilaTrab.length === 0) {
        pilaTrab.push(par);
      } 
      else {
        jerEnt = this.jerarquia[ind][0];
        while (
          pilaTrab.length > 0 &&
          jerEnt <= pilaTrab[pilaTrab.length - 1].jerar )
        {
          const parPila = pilaTrab.pop();
          if (parPila !== undefined) {
            if (parPila.jerar === jerEnt) {
              break;
            } 
            if (parPila.cad === "-" && parPila.jerar === 4) {
              parPila.jerar = 7;
            }
            this.postFija.push(parPila);
          }
        }
        if (jerEnt !== 0) {
          pilaTrab.push(par);
        }  
      }
    }
    // nunca sale por aqui porque cuando encuentra la 
    // @ agregada termina ahi
    return 0;
  }
    

  // Funcion que se encarga de identificar un número
  // entrega un ParCadInt
  identificaNum(pos: number): ParCadInt {
    const rex = /[+-]?\d+(?:\.\d*)?(?:e[+-]?\d+)?|[+-]?\.\d*(?:e[+-]?\d+)?/gi;
    rex.lastIndex = pos;
    const partes = rex.exec(this.infija);
    let cadNum: string;
    if (partes !== null) {
      cadNum = partes[0];
      this.#posicion = rex.lastIndex;
      this.#hayPari = false;
      const num = Number.parseFloat(cadNum);
      if (Number.isFinite(num)) {
        if (++this.#balanceOp > 1) {
          this.#posicion -= cadNum.length;
          return new ParCadInt(cadNum, -6); // hay dos operandos seguidos, falta un operador o '('
        }
        this.prodImplicito();
        if (cadNum[0] === "+") {
          cadNum = cadNum.slice(1);
        }
        // !! sí fue un número
        return new ParCadInt(cadNum, oper.Numero); 
      }
      if (Number.isNaN(num)) {
        // error: un punto solo (signado o no) no representa un número
        return new ParCadInt(cadNum, -3);
      }
      // error: es un número que solo se puede representar como  +/- infinito
      return new ParCadInt(cadNum, -5);
    }
    return new ParCadInt("", -19);
  }

  // funcion de apoyo a leeToken para ver si es el inicio de un número signado
  posibleNumSignado(pos: number) :boolean {
    const rex = /^[+-][0-9.]/;
    const subcad = this.infija.slice(pos, pos + 2);
    if (this.hayPari) {
      return rex.test(subcad);
    }
    return false;
  }

  // Se encarga de identificar el nombre de una función o bien una variable
  // entrega un ParCadInt
  identificaVaroFun(c: string) : ParCadInt {
    const nombresFunc = [
      "sin",
      "cos",
      "tan",
      "cot",
      "sec",
      "csc",
      "sqrt",
      "abs",
      "exp",
      "ln",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "asinh",
      "acosh",
      "atanh",
    ];
    
    let nom = "";
    this.hayPari = false;
    let cLocal = c;
    while (isLetter(cLocal)) {
      nom += cLocal;
      cLocal = this.infija[++this.#posicion];
    }
    // this.posicion--;
    this.#balanceOp++;
    if (this.balanceOp > 1) {
      this.#posicion -= nom.length;
      return new ParCadInt(nom, -6); // error: hay dos operandos seguidos, falta un operador
    }
    const indice = nombresFunc.indexOf(nom);
    if (indice !== -1) {
      this.#balanceOp--;
      if (cLocal !== "(") {
        // error: el argumento de la función debe ir entre paréntesis
        return new ParCadInt(nom, -12);
      }
      return new ParCadInt(nombresFunc[indice], oper.FuncUnaria);
    }
    return this.identificaVar(nom, cLocal);
  }

  // Identifica una variable.
  // discrimina segun las caracteristicas permitidas para los nombres de variables
  identificaVar(nom: string, c: string): ParCadInt {
    if (nom === "Pi" || nom === "e") {
      this.prodImplicito();
      return new ParCadInt(nom, oper.Variable);
    }
    let nomLocal: string = nom;
    let cLocal = c;
    switch (this.tipoNomVarVigente) {
      case nomVariables.Letra:
        if (nom.length > 1) {
          // error: Sólo acepto nombre de variables o parámetros de una letra
          return new ParCadInt(nom, -13);
        }
        if (isDigit(c)) {
          // error: no se aceptan nombre de variables o parámetros con dígitos.
          // o falta un operador.
          return new ParCadInt(nom, -14);
        }
        break;
      case nomVariables.LetrayDigitos:
        if (nom.length > 1) {
          // error: Sólo acepto nombre de variables o parámetros de una letra,
          // opcionalmente seguida de dígitos
          return new ParCadInt(nom, -15);
        }
        while (isDigit(c)) {
          nomLocal += cLocal;
          cLocal = this.infija[++this.#posicion];
        }
        break;
      case nomVariables.Palabra:
        if (isDigit(c)) {
          // error: no se aceptan nombre de variables o parámetros
          // con dígitos o falta un operador.
          return new ParCadInt(nom, -14);
        }
        break;
      case nomVariables.PalabrayDigitos:
        while (isDigit(c)) {
          nomLocal += cLocal;
          cLocal = this.infija[++this.#posicion];
        }
        break;
      default:
        // error: ocurrio un error inesperado, al identificar una variable
        return new ParCadInt(nom, -16);
    }
    // si no existe el elemento lo crea, si ya existe, esto no agrega nada
    this.variables[nomLocal] = 0.0;
    this.prodImplicito();
    return new ParCadInt(nomLocal, oper.Variable);
  }

  // Identifica un operador
  // entrega un ParCadInt
  identificaOper(c: string) : ParCadInt {
    const operadores = "+-*/^#&#()";
    const ind = operadores.indexOf(c);
    this.#posicion++;
    if (ind !== -1) {
      switch (ind) {
        case oper.MasBin: // signo +
          if (this.hayPari) {
            // es un mas unario, se regresa una jerarquia especial para obviarlo
            this.hayPari = false;
            return new ParCadInt(c, oper.MasUnario);
          }
          if (--this.#balanceOp < 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -7); // error: hay dos operadores seguidos
          }
          return new ParCadInt(c, oper.MasBin); // operador binario
        // break;
        case oper.MenosBin: // signo -
          if (this.hayPari) {
            this.#hayPari = false;
            return new ParCadInt(c, oper.MenosUnario);
          }
          if (--this.balanceOp < 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -7); // error: hay dos operadores seguidos
          }
          return new ParCadInt(c, oper.MenosBin); // operador binario
        case oper.ParIzq:
          this.#hayPari = true;
          if (this.balanceOp > 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -9); // error: falta un operador antes del paréntesis izq
          }
          this.#balancePar++;
          return new ParCadInt(c, oper.ParIzq); 
        case oper.ParDer:
          this.#hayPari = false;
          this.#balancePar--;
          if (this.balanceOp === 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -10); // error: falta un operando antes del paréntesis Der
          }
          if (this.balancePar < 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -8); // error: paréntesis derechos de más
          }
          this.prodImplicito();
          return new ParCadInt(c, oper.ParDer); 
        case oper.Por:
        case oper.Div:
        case oper.Potencia:
          this.#hayPari = false;
          if (--this.#balanceOp < 0) {
            this.#posicion -= 2;
            return new ParCadInt(c, -7); // error: hay dos operadores seguidos
          }
          return new ParCadInt(c, ind); // termina sin error
        default:
          return new ParCadInt(c, -1); // error: algo extraño paso hay un caracter inválido
      }
    }
    return new ParCadInt(c, -1); // error: hay un caracter inválido
  }

  // Identifica errores por aparicion de dos operadores seguidos.
  // también reduce a un solo punto cuando hay mas de uno seguido en la cadena, sin marcar error
  // inserta el signo * entre ) y ( contigüos
  preProcesa() {
    let rex = /\.{2,}/g;
    this.#infija = this.infija.replace(rex, "."); // esto si acaso generara un aviso, no error
    rex = /[+\-*/^]{2,}/g; // /\+{2,}|\+-/g;
    rex.lastIndex = 0;
    const partes = rex.exec(this.infija);
    if (partes !== null && rex.lastIndex > 0) {
      const cad= this.infija.substring(
                rex.lastIndex - partes[0].length, 2);
      return new ParCadInt(cad, -7);
    }
    rex = /\)\(/g;
    this.#infija = this.infija.replace(rex, ")*(");
    return new ParCadInt("", 0);
  }

  // inserta el signo * cuando aplica
  prodImplicito() {
    const c = this.infija[this.posicion];
    if (isLetter(c) || c === "(") {
      this.#infija = `${this.infija.slice(
        0,
        this.posicion
      )}*${this.infija.slice(this.posicion)}`;
    }
  }

  // Evalua la expresión dada en notación polaca inversa en el parámetro: postfija
  // con los valores que tengan al momento las variables o parámetros identificadas como tales
  // almacenadas en el parámetro: variables
  // postFija: un arreglo de pares de tipo ParCadInt
  // variables: un objeto JSON, donde la propiedad es el nombre de la variable y su valor es
  // el valor de la propiedad.
  // entrega un número como resultado o undefined si ocurre un error
  // el número de error lo entrega en la propiedad numError
  static Eval(postFija: ParCadInt[], variables: DicVariables) {
    let numero;
    let oper1;
    let oper2;
    let par;
    const pilaCalc: number[] = [];
    for (let i = 0; i < postFija.length; i++) {
      par = postFija[i];
      switch (par.jerar) {
        case 2: // operadores + o - binarios
        case 4: // operadores * o /
        case 5: // operador ^
          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();
          if (oper1 === undefined || oper2 === undefined ) {
            InfijaAPolaca.#nerr = -20; // error: se perdio un operando
            return undefined; 
          }
          pilaCalc.push(InfijaAPolaca.operaBin(oper1, oper2, par.cad));
          break;
        case 7: // operador unario
          oper1 = pilaCalc.pop();
          if (oper1 !== undefined) {
            pilaCalc.push(InfijaAPolaca.operaUnario(oper1, par.cad));  
          }
          else {
            InfijaAPolaca.#nerr = -20; // error: se perdio un operando
            return undefined;
          }
          break;
        case 10: // número o variable
          numero = parseFloat(par.cad);
          if (Number.isNaN(numero)) {
            // entonces es una variable
            numero = variables[par.cad];
          }
          pilaCalc.push(numero);
          break;
        default:
          break;
      }
    }
    if (pilaCalc.length > 1) {
      InfijaAPolaca.#nerr = -20; // error: sobraron operandos al evaluar!!!
      return undefined;
    }
    InfijaAPolaca.#nerr = 0;
    return pilaCalc.pop();
  }

  
  // calcula las operaciones algebraicas binarias
  // opndo1 y opndo2 estan en el orden de salida del stack
  // por eso se operan en orden inverso cuando no es simétrica la operación
  static operaBin(opndo1: number, opndo2: number, operador: string) {
    switch (operador) {
      case "+":
        return opndo2 + opndo1;
      case "-":
        return opndo2 - opndo1;
      case "*":
        return opndo2 * opndo1;
      case "/":
        return opndo2 / opndo1;
      case "^":
        return opndo2 ** opndo1;
      default:
        return 0; // es un operador inválido, a este nivel no pasa esto
    }
  }

  // evaluación ffde funciones unarias y menos unario
  
  static operaUnario( opndo: number, operador: string) {
    switch (operador) {
      case "-":
          return -opndo;
        break;
      case "sin":
        return Math.sin(opndo);
        break;
      case "cos":
        return Math.cos(opndo);
        break;
      case "tan":
        return Math.tan(opndo);
        break;
      case "cot":
        return 1/Math.tan(opndo);
        break;
      case "sec":
        return 1/Math.cos(opndo);
        break;
      case "csc":
        return 1/Math.sin(opndo);
        break;
      case "sqrt":
        return Math.sqrt(opndo);
        break;
      case "abs":
        return Math.abs(opndo);
        break;
      case "exp":
        return Math.exp(opndo);
        break;
      case "ln":
        return Math.log(opndo);
        break;
      case "asin":
        return Math.asin(opndo);
        break;
      case "acos":
        return Math.acos(opndo);
        break;
      case "atan":
        return Math.acos(opndo);
        break;  
      case "sinh":
        return Math.sinh(opndo);
        break;
      case "cosh":
        return Math.cosh(opndo);
        break;
      case "tanh":
        return Math.tanh(opndo);
        break;  
      case "asinh":
        return Math.asinh(opndo);
        break;
      case "acosh":
        return Math.acosh(opndo);
        break;
      case "atanh":
        return Math.atanh(opndo);
        break;  
      default:
        return opndo;
        break;
    }
  }

  static IniciaErrores(): void {
    InfijaAPolaca.errores= new Array(50).fill("");
    InfijaAPolaca.errores[0] = "";
    InfijaAPolaca.errores[1] = "Hay un caracter inválido.";
    InfijaAPolaca.errores[2] = "No hay expresión a procesar.";
    InfijaAPolaca.errores[3] =
      "Un separador(punto) decimal, signado o no, no representa un número.";
    InfijaAPolaca.errores[4] =
      "Un número no puede tener dos separadores(puntos) decimales.";
    InfijaAPolaca.errores[5] =
      "Es un número pero sólo se puede representar por +/- infinito internamente.";
    InfijaAPolaca.errores[6] = "Hay dos operandos seguidos, falta un operador.";
    InfijaAPolaca.errores[7] =
      "Hay dos operadores seguidos, falta un número, una variable o una función.";
    InfijaAPolaca.errores[8] = "La expresión tiene paréntesis derechos de más";
    InfijaAPolaca.errores[9] =
      "Falta un operador antes del parentesis izquierdo.";
    InfijaAPolaca.errores[10] = "Falta un operando (número o variable).";
    InfijaAPolaca.errores[11] = "Faltan paréntesis derechos.";
    InfijaAPolaca.errores[12] =
      "El argumento de una función debe ir entre paréntesis";
    InfijaAPolaca.errores[13] = "Sólo se aceptan variables de una letra.";
    InfijaAPolaca.errores[14] =
      "Después de una variable no acepto un número. Indica la operación explícitamente.";
    InfijaAPolaca.errores[15] =
      "Las variables sólo pueden consistir de una letra opcionalmente seguida de dígitos.";
    InfijaAPolaca.errores[16] =
      "Ocurrio un error inesperado al identificar una variable!!!";
    InfijaAPolaca.errores[17] =
      'No acepto parámetros o más de una variable, denotada por la letra "x".';
    InfijaAPolaca.errores[18] = 'Sólo acepto la variable "x".';
    InfijaAPolaca.errores[19] = "Esperaba un identificar un número y no fue número";
    InfijaAPolaca.errores[20] = "Se perdió un operando";
    InfijaAPolaca.errores[21] = "Sobraron operandos al evaluar";
    InfijaAPolaca.errores[22] = "Esperaba un número entero";
    InfijaAPolaca.errores[23] =
      "El resultado de la operación no es un término lineal";
    InfijaAPolaca.errores[24] =
      "División entre cero. el resultado no es un número";
    InfijaAPolaca.errores[25] =
      'Falta el signo igual "=" para que sea una ecuación';
    InfijaAPolaca.errores[26] = "Debe haber una expresión antes del signo =";
    InfijaAPolaca.errores[27] = "Debe haber una expresión después del signo =";
    InfijaAPolaca.errores[28] =
      "No puede haber más de un igual en una ecuación";
    InfijaAPolaca.errores[29] = "Hay un eperador invalido."
    InfijaAPolaca.errores[30] = "Hay más de una variable en la expresión";
    InfijaAPolaca.errores[31] =
      "El exponente debe ser una constante. No se obtiene una función racional";  
  }
}

// esta clase solo agrega la evaluación como funcion Racional
class InfijaAPolacaFR extends InfijaAPolaca {

  constructor (infija: string) {
    super(infija);
  }

  // Evalua la expresión dada en notación polaca inversa en el parámetro: postfija
  // con los valores que tengan al momento las variables o parámetros identificadas como tales
  // almacenadas en el parámetro: variables
  // postFija: un arreglo de pares de tipo ParCadInt
  // variables: un objeto JSON, donde la propiedad es el nombre de la variable y 
  // su valor es el valor de la propiedad.
  // entrega una funcion polinomial, o una funcion racional según sea el caso
  // el número de error lo entrega en la propiedad numError
  static EvalFuncRac(postFija: ParCadInt[], variables: DicVariables) 
                      : funTipo | undefined {
    let numero;
    let oper1;
    let oper2;
    let par;
    const nomvar = Object.keys(variables);
    let variable = nomvar.length > 2 ? nomvar[2] : "";
    const pilaCalc: funTipo[] = [];
    let result: funTipo | undefined;
    postFija.forEach((pf: ParCadInt) => {
      let pol;
      par = pf;
      switch (par.jerar) {
        case 2: // operadores + o - binarios
        case 4: // operadores * o /
          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();
          if (oper1 !== undefined && oper2 !== undefined) {
            result=InfijaAPolacaFR.operaBinFun(oper1, oper2, par.cad);
            if (result === undefined) {
              return undefined;
            }
            pilaCalc.push(result);
;          }
          else {
            InfijaAPolaca.nErr = -20; // error: se perdio un operando
            return undefined;
          }
          break;
        case 5: // operador ^
          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();
          if (oper1 !== undefined && oper2 !== undefined) {
            if (!oper1.esConstante) {
              InfijaAPolaca.nErr = -31; // el exponente debe ser una constante
              return undefined;
            }
            result=InfijaAPolacaFR.operaBinFun(oper1, oper2, par.cad);
            if (result === undefined) {
              return undefined;
            }
            pilaCalc.push(result);
          }
          else {
            InfijaAPolaca.nErr = -20; // error: se perdio un operando
            return undefined;
          }
          break;
        case 7: // operador unario, signo -, aqui no hay funciones      
          oper1 = pilaCalc.pop();
          if (oper1 !== undefined) {
            pilaCalc.push(oper1.ProductoPorN(-1));
          }
          else {
            InfijaAPolaca.nErr = -20; // error: se perdio un operando
            return undefined;
          }
          break;
        case 10: // número o variable
          numero = parseFloat(par.cad);
          if (Number.isNaN(numero)) {
            // es una variable
            if (variable === "") {
              variable = par.cad;
            } else if (variable !== par.cad) {
              InfijaAPolaca.nErr = -30; // error: hay más de una variable en la expresión.
              return undefined;
            }
            pol = Polinomio.Monomio(1, 1, variable);
          } else {
            pol = Polinomio.Monomio(numero, 0, variable);
          }
          pilaCalc.push(pol);
          break;
        default:
          break;
        }
    });
    if (pilaCalc.length > 1) {
      InfijaAPolaca.nErr = -21; // error: sobraron operandos al evaluar!!!
      return undefined;
    }
    InfijaAPolaca.nErr = 0;
    return pilaCalc.pop();
  }

  static operaBinFun(opd1 : funTipo,
                     opd2 : funTipo,
                     operador: string): funTipo | undefined {
    switch (operador) {
      case "+": 
        if (!opd2.esPolinomio && !opd1.esPolinomio) {

          return opd2.Suma(opd1 as FunRacional);          
        }
        if (!opd2.esPolinomio && opd1.esPolinomio) {
          return opd2.Suma(new FunRacional(opd1));
        }
        if (opd2.esPolinomio && !opd1.esPolinomio) {
          return opd1.Suma(new FunRacional(opd2));
        }   
        return (opd2 as Polinomio).Suma(opd1 as Polinomio);
      // break;
      case "-": // falta el caso funRac - Polin
      if (!opd2.esPolinomio && !opd1.esPolinomio) {
        return opd2.Resta(opd1 as FunRacional);          
      }
      if (!opd2.esPolinomio && opd1.esPolinomio) {
        return opd2.Resta(new FunRacional(opd1));
      }
      if (opd2.esPolinomio && !opd1.esPolinomio) {
        return (new FunRacional(opd2)).Resta(opd1 as FunRacional);
      }
      return (opd2 as Polinomio).Resta(opd1);
      // break;
      case "*":
        if (!opd2.esPolinomio && !opd1.esPolinomio) {
          return opd2.Producto(opd1 as FunRacional);          
        }
        if (!opd2.esPolinomio && opd1.esPolinomio) {
          return opd2.Producto(new FunRacional(opd1));
        }
        if (opd2.esPolinomio && !opd1.esPolinomio) {
          return opd1.Producto(new FunRacional(opd2));
        }
        return (opd2 as Polinomio).Producto(opd1);
      // break;
      case "/":
        if (opd1.esConstante) {
          return opd2.ProductoPorN(1 / opd1.coefs[0]);
        }
        if (opd2.esPolinomio && opd1.esPolinomio) {
          return new FunRacional(opd2, opd1);
        }
        if (!opd2.esPolinomio && opd1.esPolinomio) {
          return opd2.Cociente(new FunRacional(opd1));
        }
        if (opd2.esPolinomio && !opd1.esPolinomio) {
          return (new FunRacional(opd2)).Cociente(opd1 as FunRacional);
        }
        return opd2.Cociente(opd1 as FunRacional);
      // break;
      case "^":
          return opd2.Potencia(opd1.coefs[0]);
      break;
      default:
        InfijaAPolacaFR.nErr= -29; // error: Hay un operador inválido 
        return undefined;
        break;
    }
  }
}
/*
  // Evalua la expresión en notación polaca inversa dada en el parámetro: postfija
  // supone una expresion sin variables y entregara como resultado
  // un objeto de tipo fraccion como se define el Fracciones.js
  // postFija: un arreglo de pares de tipo ParCadInt
  // entrega un objeto de tipo fraccion o undefined si ocurre un error
  // el número de error lo entrega en la propiedad numError
  EvalFracciones(postFija) {
    let numero;
    let oper1;
    let oper2;
    let par;
    const pilaCalc = [];
    for (let i = 0; i < postFija.length; i++) {
      par = postFija[i];
      switch (par.jerar) {
        case 2: // operadores + o - binarios
        case 4: // operadores * o /
        case 5: // operador ^
          if (pilaCalc.length < 2) {
            this.numError = -20; // error: se perdio un operando
            return undefined;
          }
          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();
          pilaCalc.push(InfijaAPolaca.operaBinFraccion(oper1, oper2, par.cad));
          break;
        case 7: // operador menos unario
          if (pilaCalc.length === 0) {
            this.numError = -20; // error: se perdio un operando
            return undefined;
          }
          oper1 = pilaCalc.pop();
          pilaCalc.push(oper1.invAd()); //
          break;
        case 10: // número
        // eslint-disable-next-line
          numero = parseInt(par.cad);
          if (Number.isNaN(numero)) {
            this.numError = -22; // error: se perdio un operando
            return undefined;
          }
          pilaCalc.push(new Fraccion(numero));
          break;
        default:
          break;
      }
    }
    if (pilaCalc.length > 1) {
      this.numError = -21; // error: sobraron operandos al evaluar!!!
      return undefined;
    }
    this.numError = 0;
    return pilaCalc.pop();
  }

  EvalLineales(postFija) {
    let numero;
    let oper1;
    let oper2;
    let par;
    const pilaCalc = [];
    for (let i = 0; i < postFija.length; i++) {
      par = postFija[i];
      switch (par.jerar) {
        case 2: // operadores + o - binarios
          if (pilaCalc.length < 2) {
            this.numError = -20; // error: se perdio un operando
            return undefined;
          }
          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();

          if (oper1.isFraccion && oper2.isFraccion) {
            pilaCalc.push(
              InfijaAPolaca.operaBinFraccion(oper1, oper2, par.cad)
            );
          } else {
            if (oper1.isFraccion) {
              oper1 = new Lineal(new Fraccion(0, 1), oper1);
            } else if (oper2.isFraccion) {
              oper2 = new Lineal(new Fraccion(0, 1), oper2);
            }

            // pilaCalc.push(InfijaAPolaca.operaBinLineal(oper1, oper2, par.cad));

            if (par.cad === "+") {
              let resul = oper2.suma(oper1);
              if (resul.isFraccion) {
                pilaCalc.push(resul.ti);
              } else {
                pilaCalc.push(resul);
              }
            } else {
              let resul = oper2.resta(oper1);
              if (resul.isFraccion) {
                pilaCalc.push(resul.ti);
              } else {
                pilaCalc.push(resul);
              }
            }
          }

          break;

        case 4: // operadores * o /
          if (pilaCalc.length < 2) {
            this.numError = -20; // error: se perdio un operando
            return undefined;
          }

          oper1 = pilaCalc.pop();
          oper2 = pilaCalc.pop();

          //Caso operador "*"

          if (par.cad === "*") {
            if (oper1.isFraccion && oper2.isFraccion) {
              pilaCalc.push(
                InfijaAPolaca.operaBinFraccion(oper1, oper2, par.cad)
              );
            } else if (oper1.isFraccion) {
              let resul = oper2.multiesc(oper1);
              if (resul.isFraccion) {
                pilaCalc.push(resul.ti); // el coef de x es cero guarda solo la fraccion
              } else {
                pilaCalc.push(resul);
              }
            } else if (oper2.isFraccion) {
              let resul = oper1.multiesc(oper2);
              if (resul.isFraccion) {
                pilaCalc.push(resul.ti); // el coef de x es cero guarda solo la fraccion
              } else {
                pilaCalc.push(resul);
              }
            } else {
              this.numError = -23; // error el resultado de la operación no es un termino lineal
              return undefined;
            }
          }

          //Caso operador "/"
          else {
            if (oper1.isFraccion && oper2.isFraccion) {
              let resul = InfijaAPolaca.operaBinFraccion(oper1, oper2, par.cad);
              if (resul.isFraccion) {
                pilaCalc.push(resul);
              } else {
                this.numError = -24; // error: división entre cero. no es un número
                return undefined;
              }
            } else if (oper1.isFraccion) {
              oper1 = oper1.reciproco();
              if (oper1.isFraccion) {
                pilaCalc.push(oper2.multiesc(oper1));
              } else {
                this.numError = -24; // error: división entre cero. no es un número
                return undefined;
              }
            } else if (oper2.isFraccion) {
              this.numError = -23; // error el resultado de la operación no es un termino lineal
              return undefined;
            } else {
              if (oper1.isMultiplo(oper2)) {
                pilaCalc.push(oper2.cx.cociente(oper1.cx));
              } else {
                this.numError = -23; // error el resultado de la operación no es un termino lineal
                return undefined;
              }
            }
          }

          break;

        case 7: // operador menos unario
          if (pilaCalc.length === 0) {
            this.numError = -20; // error: se perdio un operando
            return undefined;
          }
          oper1 = pilaCalc.pop();
          if (oper1.isFraccion) {
            pilaCalc.push(oper1.invAd());
          } else if (oper1.isLineal) {
            pilaCalc.push(new Lineal(oper1.cx.invAd(), oper1.invAd()));
          }
          //
          break;
        case 10: // número
          numero = Number.parseFloat(par.cad);
          if (Number.isNaN(numero)) {
            pilaCalc.push(new Lineal(new Fraccion(1, 1), new Fraccion(0, 1)));
          } else {
            // eslint-disable-next-line
            let numInt = Number.parseInt(par.cad);
            if (numInt === numero) {
              pilaCalc.push(new Fraccion(numInt));
            } else {
              pilaCalc.push(new Fraccion(numero, true));
            }
          }
          break;
        default:
          break;
      }
    }
    if (pilaCalc.length > 1) {
      this.numError = -21; // error: sobraron operandos al evaluar!!!
      return undefined;
    }
    this.numError = 0;
    return pilaCalc.pop();
  }

  // calcula las operaciones aritméticas binarias como fraccion
  // opndo1 y opndo2 estan en el orden de salida del stack
  // por eso se operan en orden inverso cuando no es simétrica la operación
  static operaBinFraccion(opndo1, opndo2, operador) {
    switch (operador) {
      case "+":
        return opndo2.suma(opndo1).reduce();
      case "-":
        return opndo2.resta(opndo1).reduce();
      case "*":
        return opndo2.producto(opndo1).reduce();
      case "/":
        return opndo2.cociente(opndo1).reduce();
      // case '^':
      // se supone que el exponente es un entero
      // return opndo2.potencia(opndo1.n);
      default:
        return 0; // es un operador inválido, a este nivel no pasa esto
    }
  }

  
}
*/
export  {InfijaAPolaca, InfijaAPolacaFR};
