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
  export let arrLatex: string[]= ['f(x)=x^2+4x+a', 'g(x)=x^3-3x+b'];
  export let isOpen: boolean;

  let textosTarj= ["Revisa gráficamente cuántas raices reales tiene un polinomio."
                +" Elige un tipo de polinomio.",
                "Mueve el deslizador para observar cómo cambia el número"
                + " de raices de: ",
                "Cuando termines de explorar, oprime continuar para responder" 
                + " algunas preguntas relacionadas con las raices."]

  let latex: string;
  const deslProps: DeslPr= {
    id: "a",
    min: "-5",
    max: "5",
    step:".1",
    value: "-2",
  }

  
  let fun: funR;
  let infpol: InfijaAPolacaFR;
  let f: GeomElem;

  let ActualizaGraf= (infpol: InfijaAPolacaFR, desl: DeslPr) => {
    infpol.variables[desl.id]=Number.parseFloat(desl.value);
  }
  let accion=() => {
    return;
  }

  let pF: paramF;

  const opcion= (e: MouseEvent) => {
    let ind= e.currentTarget.id;
    let cad=arrLatex[ind];
    isOpen=false;
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

function actualizaVal () {
  deslProps.value= this.value;
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

<Card class="mb-3">
  <CardHeader>
    <CardTitle>Raices</CardTitle>
  </CardHeader>
  <CardBody>
    <CardSubtitle>Polinomios</CardSubtitle>
    <CardText>
       
      <Fade {isOpen}>
        {textosTarj[0]}
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
      </Fade>
      <Fade isOpen={!isOpen} >
        <div class="mezcla">
          {textosTarj[1]}
          <MathQuillStatic {latex}/>
        </div>  
        <Deslizador {deslProps} {infpol} {actualizaVal}/>
        <CardText>
          {textosTarj[2]}
        </CardText>
        <Button color="success">Continuar</Button>
      </Fade>
    </CardText>
    
  </CardBody>
</Card>

<style>
  .mezcla {
    line-height: 1.6;
    display: inline-block;
    margin-left: 10px;
  }
</style>