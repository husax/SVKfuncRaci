import type JXG from './jsxgraphcore.mjs';
import type { Polinomio, FunRacional } from './Polinomio';
type GeomElem= typeof JXG.GeometryElement;
type funTipo= FunRacional | Polinomio;

interface OptMenu {
  href: string;
  texto: string;
}

interface DatosHead {
  funcTipo: string;
	tarea: string;
	titMnu: string;
  opcMnu: OptMenu[];
}

interface paramF {
  func: (x:number) => number;
  name: string;
  color: string;
  raices: number[];
  traza: boolean;
  idFuns: GeomElem[];
  idRaices: GeomElem[];
}

interface paramD {
  func: GeomElem;  // (x:number) => number;
  deriv: (x: number) => number;
  vxmin: number;
  vxmax: number;
  color: string;
  idObjs: GeomElem[];
}

export type {OptMenu, DatosHead, paramF, paramD, GeomElem, funTipo}