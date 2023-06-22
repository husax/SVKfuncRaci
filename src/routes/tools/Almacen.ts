import { writable } from 'svelte/store';
import Polinomio, { FunRacional } from './Polinomio';
import JXG from './jsxgraphcore.mjs';
// variable para referir al current board de JSXGraph
export const brd = writable(JXG.board);
// contiene la función de trabajo actual
export let funRac = writable(new FunRacional());
// la función actual en formato latex
//export let latexFun = writable("");
// variable para saber cuando mostrar o esconder el acordeón
export let muestra = writable(false);
// contiene las raices de la función como objeto del board
export let idRaices = writable([]);

export let idObjs = writable([]);
export let idFuns = writable([]);
export let animaTangId = writable(0);
