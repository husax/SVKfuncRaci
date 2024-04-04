<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
  import {Button } from '@sveltestrap/sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
  import Deslizador from '../../components/Deslizador.svelte';
  export let isOpen: boolean;
  export let textos: Array<string>;
</script>

<Tarjeta {isOpen} {textos}>
  <div class="centra">
    <MathQuillStatic {latex}/>
  </div>  
  <Deslizador valor={deslProps.value} {deslProps} {actualizaVal}/>
    {textosCont[2]}
  <Button class="separa" color="success" on:click={contyPreg}>Continuar</Button>
</Tarjeta>
