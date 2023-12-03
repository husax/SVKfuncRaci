<script lang="ts">
import type { DeslPr } from "../tools/tipos";
//import { brd } from '../tools/Almacen';
//import { Raices } from '../tools/TrazosPolinJSX';
//import { BorraObjGraficos, GraficaRaices } from '../tools/TrazosJSXGraph';
export let valor: string;
export let deslProps: DeslPr;
export let actualizaVal: (e: Event) => void;

$: etiq= deslProps.id+"="+valor;




</script>


<label for={deslProps.id}>
  <input class="entrada"
    type="range" 
    id= {deslProps.id}
    min={deslProps.min}
    max={deslProps.max}
    step={deslProps.step}
    value={valor}
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
