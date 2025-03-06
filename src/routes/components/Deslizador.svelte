<script lang="ts">
import type { DeslPr } from "../tools/tipos";
  interface Props {
    valor: string;
    deslProps: DeslPr;
    actualizaVal: (e: Event) => void;
  }

  let { valor, deslProps, actualizaVal }: Props = $props();

let etiq= $derived(deslProps.id+"="+valor);




</script>


<label for={deslProps.id}>
  <input class="entrada"
    type="range" 
    id= {deslProps.id}
    min={deslProps.min}
    max={deslProps.max}
    step={deslProps.step}
    value={valor}
    oninput={actualizaVal}
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
