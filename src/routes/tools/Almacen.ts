import { writable } from 'svelte/store';
import type {Polinomio, FunRacional } from './Polinomio';
import type JXG from './jsxgraphcore.mjs';
import type { GeomElem } from './tipos';
// variable para referir al current board de JSXGraph
export const brd = writable<typeof JXG.board>();
// contiene la función de trabajo actual
type IDTiposFun= FunRacional | Polinomio | undefined; 
export const funRac = writable<IDTiposFun>();
// la función actual en formato latex
//export let latexFun = writable("");
// variable para saber cuando mostrar o esconder el acordeón
export const muestra = writable(false);
// contiene las raices de la función como objeto del board
export const idRaices = writable<GeomElem>();
export const idObjs = writable([]);
export const idFuns = writable([]);
export const animaTangId = writable(0);
export const resp1= writable([2,2,2]);
export const resp2= writable(2);