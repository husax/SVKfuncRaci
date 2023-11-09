<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle
  } from 'sveltestrap';
  import { ListGroup, ListGroupItem, Fade } from 'sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
	import Deslizador from './Deslizador.svelte';
	import type { DeslPr, GeomElem, funR, paramF } from '../tools/tipos';
	import { ConstruyeFunParFijo, Raices } from '../tools/TrazosPolinJSX';
	import TeXToLinealPyt from '../tools/TeXToLineal';
	import { InfijaAPolacaFR } from '../tools/InfAPolInv';
	import { brd } from '../tools/Almacen';
	import { BorraObjGraficos, GraficaRaices } from '../tools/TrazosJSXGraph';
	import Tarjeta from './Tarjeta.svelte';
  export let arrLatex: string[]= ['f(x)=x^2+4x+a', 'g(x)=x^3-3x+b'];
  //export let isOpen: boolean;

  let letraParam= "<strong><i>a</i></strong>"
  let textosCont= ["Revisa gráficamente cuántas raices reales tiene un polinomio."
                +" Elige un tipo de polinomio.",
                "Mueve el deslizador para observar cómo cambia el número"
                + " de raices de: ",
                "Cuando termines de explorar, oprime Continuar para responder" 
                + " algunas preguntas relacionadas con las raices.",
                "Escribe o elige un valor para el parámetro "+ letraParam +
                " donde se tengan 2 raices distintas. "+ letraParam + "= ",
                "Ahora dame el mayor intervalo de valores de "+ letraParam + 
                " donde se tengan 2 raices distintas."
              ]
  let textosTarj= ['Raices', 'Número de Raices', textosCont[0]];
  let textosResp= ['Correcto. Observa tu respuesta en la gráfica', ]

  let latex: string;
  let deslProps: DeslPr= {
    id: "a",
    min: "-5",
    max: "5",
    step:".1",
    value: "-2",
  }

  
  let fun: funR;
  let infpol: InfijaAPolacaFR;
  let f: GeomElem;
  let IsopenSeq= [ true, false, false];

  let ActualizaGraf= (infpol: InfijaAPolacaFR, desl: DeslPr) => {
    infpol.variables[desl.id]=Number.parseFloat(desl.value);
  }
  let accion=() => {
    return;
  }

  let pF: paramF;
  let resp1: string;

  const opcion= (e: MouseEvent) => {
    let ind= e.currentTarget.id;
    let cad=arrLatex[ind];
    IsopenSeq[0]=false;
    IsopenSeq[1]=true;
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

  const contyPreg= (e: MouseEvent) => {
    IsopenSeq[1]=false;
    IsopenSeq[2]=true;
    textosTarj[1]+=' de:';
    textosTarj[2]='';
  }

  const sigue= (e: MouseEvent) => {
    let r = Number.parseFloat(resp1)
    if (0 < r && r < 2 ) {
      console.log("Para ese valor hay dos raices");
      deslProps.value=resp1;
      deslProps= deslProps;
    }
  }

  function actualizaVal (e: Event): void {
    deslProps.value= e.target.value;
    resp1=deslProps.value;
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

<Tarjeta isOpen={IsopenSeq[0]} textos={textosTarj}>
  <ListGroup>
    {#each arrLatex as latex, ind }
      <ListGroupItem tag="button" id={ind.toString()} on:click={opcion} >
        <MathQuillStatic {latex} />
      </ListGroupItem>          
    {/each}
    <ListGroupItem tag="button" href="#" action >
      Otro Polinomio
    </ListGroupItem>
  </ListGroup>
</Tarjeta>
<Tarjeta isOpen={IsopenSeq[1]} textos={textosTarj}>
  <div class="centra">
    <MathQuillStatic {latex}/>
  </div>  
  <Deslizador valor={deslProps.value} {deslProps} {actualizaVal}/>
    {textosCont[2]}
  <Button class="separa" color="success" on:click={contyPreg}>Continuar</Button>
</Tarjeta>
<Tarjeta isOpen={IsopenSeq[2]} textos={textosTarj}>
  <div class="centra">
    <MathQuillStatic {latex}/>
  </div>
  <Deslizador valor={resp1} {deslProps} {actualizaVal}/>
    <label for="numraices">{@html textosCont[3]}
      <input id="numraices" type="number"
        min={deslProps.min} max={deslProps.max} 
        step={deslProps.step}
        bind:value={resp1}
        on:input={actualizaVal}
      />
    </label> 
    <div class="separa">
      <Button color="success" on:click={sigue}>Siguiente</Button>
    </div>
</Tarjeta>

<style>
  .centra {
    line-height: 2;
    display: inline-block;
    margin-left: 40px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .separa {
    margin-top: 1rem;
    display:flex;
    justify-content: end;
  }
</style>