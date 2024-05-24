<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
  import { Button, ListGroup, ListGroupItem} from '@sveltestrap/sveltestrap';
  import {Icon} from "svelte-icons-pack";
  import {IoCheckmarkCircle, IoCloseCircle, IoAlertCircle} from "svelte-icons-pack/io"
  import { MathQuillStatic } from "svelte-mathquill";
	import Deslizador from '../../components/Deslizador.svelte';
  import type { DeslPr, funEvent, paramF } from '../../tools/tipos';
  import { resp1, resp2} from "../../tools/Almacen";
  
  export let isOpen: boolean;
  export let textos: Array<string>;
  export let otrosTextos: Array<string>;
  export let latex: string;
  export let deslProps: DeslPr;
  //export let resp1: string;
  export let actualizaVal: funEvent  
  //export let evalyPreg: funEvent;

  const colores= ['primary', 'secondary', 'primary'];

  let esvisible=false;
  let acierto= [false, false, false];

  const evalua= (e: Event) => {
    //let r = Number.parseFloat($resp1)
    const dosRaices= deslProps.id === "a" ? true : false;
    if (dosRaices) {
      for (let i = 0; i < $resp1.length; i++) {
        let r= $resp1[i];
        switch (i) {
          case 0:
            acierto[0]= r < 4 ? true: false;
            break;
          case 1:
            acierto[1]= r === 4 ? true: false;
            break;
          case 2:
            acierto[2]= r > 4 ? true: false;
            break;
          default:
              // no entra aqui;
            break;
        }
      }
      esvisible= true;
    }
  }

  const siAcepta= () => {alert("Si acepta click")};

  // bind:value={deslProps.value} attrib cortado
	
</script>

<Tarjeta {isOpen} {textos}>
  <div class="centra">
    <MathQuillStatic {latex}/>
  </div>
  <Deslizador valor={deslProps.value} {deslProps} {actualizaVal}/>
  <div class="separa">
    <ListGroup numbered class="conMargen">
      {#each otrosTextos as texto, ind}
        <ListGroupItem color={colores[ind]} >
          {@html texto}
          <input id="raicesDif" type="number"
            min={deslProps.min} max={deslProps.max} 
            step={deslProps.step}
            bind:value={$resp1[ind]}
          />
          <div class={esvisible ? "muestra" : "esconde"}>
            <Button outline color="light" size="sm" on:click={siAcepta} > 
              <Icon src={acierto[ind] ? IoCheckmarkCircle : IoCloseCircle} 
                color={acierto[ind] ? "green" : "red"} size="2em"/>
              <!-- <Icon src={IoAlertCircle} color="green" size="1.5em"/>
              <Icon src={IoCloseCircle} color="green" size="1.5em"/>
              <Icon src={IoCheckmarkCircle} color="green" size="1.5em"/> -->
            </Button>
          </div>  
        </ListGroupItem>  
      {/each}
    </ListGroup> 
  </div>
  <div class="separa">
    <Button outline color="success" on:click={evalua}>Evalua</Button>
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
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    display:flex;
    justify-content: flex-end;
  }
  .esconde {
    display: inline-block;
    visibility: hidden;
  }
  .muestra {
    display: inline-block;
    visibility: visible;
  }

</style>