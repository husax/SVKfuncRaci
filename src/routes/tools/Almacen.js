import { writable } from 'svelte/store';
// variable para referir al current board de JSXGraph
export let brd = writable(null);
// arreglo de boards creados en diferentes páginas
export let boards = writable([]);
// indice del board vigente
export let currentBrd = writable(0);
// contiene la función de trabajo actual
export let funRac = writable({});
// la función actual en formato latex
//export let latexFun = writable("");
// variable para saber cuando mostrar o esconder el acordeón
export let muestra = writable(false);
// contiene las raices de la función como objeto del board
export let idRaices = writable([]);

export let idObjs = writable([]);
export let idFuns = writable([]);
export let animaTangId = writable(0);
