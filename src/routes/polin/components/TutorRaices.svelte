<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
	import TarjetaRaicesSelecFun from './TarjetaRaicesSelecFun.svelte';
	import TarjetaDeslizaPar from './TarjetaDeslizaPar.svelte';
  import {
    Button
  } from '@sveltestrap/sveltestrap';
	import type { DeslPr, GeomElem, funR, paramF } from '../../tools/tipos';
	import { ConstruyeFunParFijo, Raices } from '../../tools/TrazosPolinJSX';
	import TeXToLinealPyt from '../../tools/TeXToLineal';
	import { InfijaAPolacaFR } from '../../tools/InfAPolInv';
	import { brd, resp1 } from '../../tools/Almacen';
	import { BorraObjGraficos, GraficaRaices } from '../../tools/TrazosJSXGraph';
	import TarjetaPreguntaRaices from './TarjetaPreguntaRaices.svelte';
	
  //export let isOpen: boolean;


  let latex: string = $state();
  let arrLatex: string[]= ['f(x)=x^2+4x+a', 'g(x)=x^3-3x+b'];
  let deslProps: DeslPr= $state({
    id: "a",
    min: "-5",
    max: "5",
    step:".1",
    value: "-2",
  })


  let textosCont= $state(["Revisa gráficamente cuántas raices reales tiene un polinomio."
                + "<br> Elige un tipo de polinomio.",
                "Mueve el deslizador para observar cómo cambia el número"
                + " de raices de: ",
                "Cuando termines de explorar, oprime Continuar para responder" 
                + " algunas preguntas relacionadas con las raices.",
                "Escribe un valor para el parámetro @a " +
                "donde se tengan @n raices distintas. @a = ", 
                "Escribe un valor para el parámetro @a" + 
                " donde haya una raíz doble. @a = ",
                "Escribe un valor para el parámetro @a" + 
                " donde no tenga raices reales. @a = ",
                "Ahora dame el mayor intervalo de valores de @a" + 
                " donde se tengan @n raices distintas."
              ]);
  let textosTarj= $state(['Raices', 'Número de Raices', textosCont[0]]);
  const guardaTT= textosTarj.slice();
  const guardaTC= textosCont.slice();
  let textosMult: Array<string> = $state();
  
  let fun: funR;
  let infpol: InfijaAPolacaFR;
  let f: GeomElem;
  let IsOpenSeq= $state([ true, false, false]);


  let pF: paramF;

  const opcion= (e: MouseEvent) => {
    let ind= e.currentTarget.id;
    let cad=arrLatex[ind];
    IsOpenSeq[0]=false;
    IsOpenSeq[1]=true;
    textosTarj[2]=textosCont[1];
    latex= cad;
    cad= cad.split('=')[1]; // lo que esta despues del igual
    cad= TeXToLinealPyt.insertaAster(cad);
    deslProps.id= ind === "0"? "a" : "b";
    infpol=ConstruyeFunParFijo(cad, deslProps);
    let funRac=InfijaAPolacaFR.EvalFuncRac(infpol.postFija, infpol.variables);
    let coefs= new Array<number>;
    if (funRac !== undefined) {
      coefs= funRac.coefs;  
    }
    fun= (x: number) => {
        infpol.variables["x"]=x;
        return InfijaAPolacaFR.Eval(infpol.postFija, infpol.variables);
      }
    pF={
      func: fun,
      name: "f(x)",
      color: "red",
      raices: Raices(coefs),
      traza: false,
      idFuns: [],
      idRaices:[],
    };  
    BorraObjGraficos($brd, pF);
    pF.idFuns.push($brd.create('functiongraph', [fun]));
    GraficaRaices($brd, pF);
  }

  const contyPreg= (e: Event): void => {
    IsOpenSeq[1]=false;
    IsOpenSeq[2]=true; 
    textosTarj[2]='';
    const nomParam= "<strong><i>" +  deslProps.id + "</i></strong>";
    const numRaices= deslProps.id === "a" ? "2" : "3"; 
    textosCont[3]=textosCont[3].replaceAll("@a", nomParam);
    textosCont[3]=textosCont[3].replaceAll("@n", numRaices);
    textosCont[4]=textosCont[4].replaceAll("@a", nomParam);
    textosCont[5]=textosCont[5].replaceAll("@a", nomParam);
    if (deslProps.id !== "a") {
      textosCont[4]=textosCont[4].replace("doble.",
                                           "doble y una raiz simple.");
      textosCont[5]=textosCont[5].replace("no tenga raices reales.",
                                           "tenga una raiz real.");
    }
    textosMult= textosCont.slice(3, 6);
  }

  function actualizaVal (e: Event): void {
    deslProps.value= e.target.value;
    //resp1=deslProps.value;
    infpol.variables[deslProps.id]=Number.parseFloat(deslProps.value);
    let funRac=InfijaAPolacaFR.EvalFuncRac(infpol.postFija, infpol.variables);
    let coefs= new Array<number>;
    if (funRac !== undefined) {
      coefs= funRac.coefs;  
    }
    pF.raices= Raices(coefs);
    BorraObjGraficos($brd, pF);
    pF.idFuns.push($brd.create('functiongraph', [fun]));
    GraficaRaices($brd, pF);
  }

  function regresa () {
    IsOpenSeq[2]=false;
    IsOpenSeq[0]=true;
    textosTarj= guardaTT.slice();
    textosCont= guardaTC.slice();
    BorraObjGraficos($brd, pF);
    //IsOpenSeq= IsOpenSeq;

  }

</script>

  <TarjetaRaicesSelecFun isOpen={IsOpenSeq[0]} textos={textosTarj} {arrLatex} {opcion} />
  <TarjetaDeslizaPar isOpen={IsOpenSeq[1]} textos={textosTarj} otrosTextos={textosCont[2]}
                    {latex} {deslProps} {actualizaVal} {contyPreg} />
  <TarjetaPreguntaRaices {IsOpenSeq} textos={textosTarj} otrosTextos={textosMult}
                    {latex} {deslProps} {actualizaVal} {regresa}/>

