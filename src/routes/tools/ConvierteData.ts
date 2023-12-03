/// convierte una cadena que representa un arreglo de números 
/// a un arreglo de numeros 
function ArrNum(cad: string | undefined) {
  if (cad !== undefined) {
    const len = cad.length;
    if (len === 0 || cad[0] !== '[' || cad[len - 1] !== ']' || cad === '[]') {
      return [];
    }
    const arreglo = cad.slice(1, len - 1).split(', ');
    return arreglo.map((x: string) => Number.parseFloat(x));
  }
  return new Array<number>();
}
//convierte cadena true a booleano
const cadBul = (cad: string) => cad.toLowerCase() === "true" ? true : false;

function calcExtremos(f: (x: number) => number, arr: number[]): number[] {
  if (arr.length === 0)
      return [-10, 10];
  const farr = arr.map(x => f(x));
  const extr = [Math.min(...farr), Math.max(...farr)];
  extr[0] = extr[0] >= 0 ? -extr[1] * 1.5 : extr[0] * 1.5;
  extr[0] = extr[0] > -10 ? -10 : extr[0];
  extr[1] = extr[1] <= 0 ? -extr[0] * 1.5 : extr[1] * 1.5;
  extr[1] = extr[1] < 10 ? 10 : extr[1];
  return extr;
}
function ArrNumToString(arr: number[], dig:number) {
  let cad = " ";
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      cad += `r<sub>${i + 1}</sub>= ${arr[i].toFixed(dig)}, `;
    }
    return cad.slice(0, cad.length - 2);
  }
  return "No tiene raices reales."
}
export { ArrNum, ArrNumToString, cadBul, calcExtremos };
