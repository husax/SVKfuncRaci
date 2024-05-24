<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
	import TarjetaRaicesSelecFun from './TarjetaRaicesSelecFun.svelte';
  import MsgModal from '../../components/MsgModal.svelte';
	import TarjetaDeslizaPar from './TarjetaDeslizaPar.svelte';
  import {
    Button
  } from '@sveltestrap/sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
	import Deslizador from '../../components/Deslizador.svelte';
	import type { DeslPr, GeomElem, funR, paramF } from '../../tools/tipos';
	import { ConstruyeFunParFijo, Raices } from '../../tools/TrazosPolinJSX';
	import TeXToLinealPyt from '../../tools/TeXToLineal';
	import { InfijaAPolacaFR } from '../../tools/InfAPolInv';
	import { brd, resp1 } from '../../tools/Almacen';
	import { BorraObjGraficos, GraficaRaices } from '../../tools/TrazosJSXGraph';
	import TarjetaPreguntaRaices from './TarjetaPreguntaRaices.svelte';
	
  export let arrLatex: string[]= ['f(x)=x^2+4x+a', 'g(x)=x^3-3x+b'];
  //export let isOpen: boolean;


  let latex: string;
  let deslProps: DeslPr= {
    id: "a",
    min: "-5",
    max: "5",
    step:".1",
    value: "-2",
  }


  let textosCont= ["Revisa gráficamente cuántas raices reales tiene un polinomio."
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
              ];
  let textosTarj= ['Raices', 'Número de Raices', textosCont[0]];
  let textosResp= ['Correcto. Observa tu respuesta en la gráfica', ];
  let textosMult: Array<string>;
  
  let fun: funR;
  let infpol: InfijaAPolacaFR;
  let f: GeomElem;
  let IsOpenSeq= [ true, false, false, false];

  let ActualizaGraf= (infpol: InfijaAPolacaFR, desl: DeslPr) => {
    infpol.variables[desl.id]=Number.parseFloat(desl.value);
  }
  let accion=() => {
    return;
  }

  let pF: paramF;
  //let resp1="2";
  let mensaje="";
  let headMsg="";
  let bgColor="";

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
    textosTarj[1]+=' de:';  
    textosTarj[2]='';
    const nomParam= "<strong><i>" +  deslProps.id + "</i></strong>";
    const numRaices= deslProps.id === "a" ? "2" : "3"; 
    textosCont[3]=textosCont[3].replaceAll("@a", nomParam);
    textosCont[3]=textosCont[3].replaceAll("@n", numRaices);
    textosCont[4]=textosCont[4].replaceAll("@a", nomParam);
    textosCont[5]=textosCont[5].replaceAll("@a", nomParam);
    textosMult= textosCont.slice(3, 6);
  }

  const evalyPreg= (e: Event) => {
    //let r = Number.parseFloat($resp1)
    let r= $resp1[0];
    const dosRaices= deslProps.id === "a" ? true : false;
    if (dosRaices) {
      if (-5 < r && r < 4 ) {
        mensaje="¡Efectivamente! Para ese valor del parámetro hay dos raices.";
        headMsg="Respuesta Correcta";
        bgColor="bg-success";
      } else {
        if (r=== 4) {
          mensaje="En este caso hay una sola raíz aunque es doble. Inténtalo de nuevo";
          headMsg="Revisa la pregunta";
          bgColor="bg-warning";
        } else {
          mensaje="Para este valor del parámetro no hay raices. Inténtalo de nuevo.";
          headMsg="Observa bien la Gráfica";
          bgColor="bg-danger";
        }
      }
      deslProps.value=$resp1[0].toString();
      deslProps= deslProps;
      IsOpenSeq[3]=true;
    } else {
      if (-2 < r && r < 2 ) {
        console.log("Efectivamente para ese valor hay tres raices");
        deslProps.value=$resp1.toString();
        deslProps= deslProps;
      }  
    }
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

</script>

  <TarjetaRaicesSelecFun isOpen={IsOpenSeq[0]} textos={textosTarj} {opcion} />
  <TarjetaDeslizaPar isOpen={IsOpenSeq[1]} textos={textosTarj} otrosTextos={textosCont[2]}
                    {latex} {deslProps} {actualizaVal} {contyPreg} />
  <TarjetaPreguntaRaices isOpen={IsOpenSeq[2]} textos={textosTarj} otrosTextos={textosMult}
                    {latex} {deslProps} {actualizaVal} />

  <MsgModal isOpen={IsOpenSeq[3]} headMsg={headMsg} msg={mensaje} {bgColor}/>
