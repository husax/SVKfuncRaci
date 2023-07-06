/*
  Convierte una cadena laTeX algebaica simple a lineal
con la notación de Python.
En Python el símbolo de exponenciación es ** en lugar de ^
el resto de los operadores son aritmeticos son +, -, *, /
Deja los nombres de las funciones en la forma estandar : sqrt, sin, cos, etc.
 */
class TeXToLinealPyt {
  static fracToDiag(cad: string) {
    const cadPyt = cad.replace(/}{/g, "}/{");
    return cadPyt.replace(/\\frac/g, "");
  }

  static llavesAParen(cad: string) {
    const cadPyt = cad.replace(/{/g, "(");
    return cadPyt.replace(/}/g, ")");
  }

  static puntoPorAster(cad: string) {
    return cad.replace(/\\cdot/g, "*");
  }

  static quitaEtiqParen(cad: string) {
    return cad.replace(/\\left|\\right/g, "");
  }

  static insertaAster(cad: string) {
    const re = /[0-9.a-z][(x]|\)[0-9.a-z(]|[0-9.a-z]\[/gi;
    return cad.replace(re, (cadena) => cadena[0] + "*" + cadena[1]);
  }

  static bloqueaFun(cad: string) {
    const re = /\\sqrt|\\sin|\\cos|\\tan|\\ctg|\\sec/g;
    return cad.replace(re, (cadena) => "[" + cadena.substring(1) + "]");
  }

  static quitaBloq(cad: string) {
    return cad.replace(/[[\]]/g, "");
  }

  static signoPot(cad: string) {
    return cad.replace(/\^/g, "**");
  }

  static quitaSpace(cad: string) {
    return cad.replace(/ /g, "");
  }

  static TexToPyt(cad: string, sgnPot: boolean) {
    let cadpyt = TeXToLinealPyt.fracToDiag(cad);
    cadpyt = TeXToLinealPyt.llavesAParen(cadpyt);
    cadpyt = TeXToLinealPyt.quitaEtiqParen(cadpyt);
    cadpyt = TeXToLinealPyt.puntoPorAster(cadpyt);
    cadpyt = TeXToLinealPyt.bloqueaFun(cadpyt);
    cadpyt = TeXToLinealPyt.insertaAster(cadpyt);
    cadpyt = TeXToLinealPyt.insertaAster(cadpyt); // requiere doble paso para casos como )x(
    cadpyt = TeXToLinealPyt.quitaBloq(cadpyt);
    if (sgnPot) {
      cadpyt = TeXToLinealPyt.signoPot(cadpyt);
    }
    cadpyt = TeXToLinealPyt.quitaSpace(cadpyt);
    return cadpyt;
  }
}

export default TeXToLinealPyt;
