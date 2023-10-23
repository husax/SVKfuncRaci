<script lang="ts">
import type { DeslPr, GeomElem, funR, paramF } from "../tools/tipos";
import { InfijaAPolacaFR } from "../tools/InfAPolInv";
import { brd } from '../tools/Almacen';
import { Raices } from '../tools/TrazosPolinJSX';
import { BorraObjGraficos, GraficaRaices } from '../tools/TrazosJSXGraph';
export let deslProps: DeslPr;
export let infpol: InfijaAPolacaFR;
export let actualizaVal: (e: Event) => void;
let f: GeomElem;
let fun: funR= (x: number) => {
        infpol.variables["x"]=x;
        return InfijaAPolacaFR.Eval(infpol.postFija, infpol.variables);
      };

$: etiq= deslProps.id+"="+deslProps.value;




</script>


<label for={deslProps.id}>
  <input class="entrada"
    type="range" 
    id= {deslProps.id}
    min={deslProps.min}
    max={deslProps.max}
    step={deslProps.step}
    value={deslProps.value}
    on:input={actualizaVal}
  />
  {etiq}
</label>

<style>
  .entrada {
    background-color: rgb(76, 207, 146);
    width: 70%;
  }
  label {
    margin-left: 10px;
    width: 100%;
    font-size: 1.2rem;
    font-style: italic;
  }
</style>
