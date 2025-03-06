<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
  import {Button } from '@sveltestrap/sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
  import Deslizador from '../../components/Deslizador.svelte';
  import type { DeslPr, funEvent } from '../../tools/tipos';
  interface Props {
    isOpen: boolean;
    textos: Array<string>;
    otrosTextos: string;
    latex: string;
    deslProps: DeslPr;
    actualizaVal: funEvent;
    contyPreg: funEvent;
  }

  let {
    isOpen,
    textos,
    otrosTextos,
    latex,
    deslProps,
    actualizaVal,
    contyPreg
  }: Props = $props();

  //let resp1: string;
  

</script>

<Tarjeta {isOpen} {textos}>
  <div class="centra">
    <MathQuillStatic {latex}/>
  </div>  
  <Deslizador valor={deslProps.value} {deslProps} {actualizaVal}/>
  <div class="separa">
    {otrosTextos}
  </div>
  <div class="separa">
    <Button outline color="success" on:click={contyPreg}>Continuar</Button>
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
    margin-bottom: 1rem;
    display:flex;
    justify-content: end;
  }
</style>