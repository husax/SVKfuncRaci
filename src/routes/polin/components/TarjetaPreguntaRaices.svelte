<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
  import { Button, ListGroup, ListGroupItem, Tooltip} from '@sveltestrap/sveltestrap';
  import {Icon} from "svelte-icons-pack";
  import {IoCheckmarkCircle, IoCloseCircle, IoAlertCircle} from "svelte-icons-pack/io"
  import { MathQuillStatic } from "svelte-mathquill";
	import Deslizador from '../../components/Deslizador.svelte';
  import type { DeslPr, funEvent, paramF } from '../../tools/tipos';
  import { resp1} from "../../tools/Almacen";
  
  //export let isOpen: boolean;
  interface Props {
    IsOpenSeq: Array<boolean>;
    textos: Array<string>;
    otrosTextos: Array<string>;
    latex: string;
    deslProps: DeslPr;
    actualizaVal: funEvent;
    regresa: any;
  }

  let {
    IsOpenSeq,
    textos,
    otrosTextos,
    latex,
    deslProps,
    actualizaVal,
    regresa
  }: Props = $props();

  const colores= ['primary', 'secondary', 'primary'];

  let esvisible=$state(false);
  let acierto= $state(new Array<boolean>);
  const tips=["¡muy bien!",
              "mueve el deslizador al valor que propones para ver las raíces"
            ];
  let txtboton=$state("Evalua");

  const evalua= (e: Event) => {
    if (e.currentTarget.innerText === "Continua") {
      //alert("adonde vamos");
      regresa();
      acierto= [false, false, false];
      esvisible=false;
      txtboton= "Evalua";
      resp1.set([0,0,0]);
      return;
    }
    const dosRaices= deslProps.id === "a" ? true : false;
    const raizDoble= dosRaices ? 4 : 2;
    acierto= $resp1.map(function (elem, i) {
      let r= dosRaices ? elem : Math.abs(elem);
      // el arreglo tiene 3 elementos, sólo son 3 preguntas;
      return i === 0 ? r < raizDoble : (i === 1 ? r === raizDoble : r > raizDoble);
    });
    esvisible= true;
    txtboton= acierto.every((cv) => cv) ? "Continua" : "Evalua";
    /* if (acierto.every((cv) => cv)) {
      txtboton="Continua";
    } */
    return;
  }

  //const siAcepta= () => {alert("Si acepta click")};

  // bind:value={deslProps.value} attrib cortado
	
</script>

<Tarjeta isOpen={IsOpenSeq[2]} {textos}>
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
            <Button id={`btn${ind}`} outline color="light" size="sm" > 
              <Icon src={acierto[ind] ? IoCheckmarkCircle : IoCloseCircle} 
                color={acierto[ind] ? "green" : "red"} size="2em"/>
              <!-- <Icon src={IoAlertCircle} color="green" size="1.5em"/> -->
            </Button>
            <Tooltip target={`btn${ind}`} placement="right">
              {acierto[ind] ? tips[0] : tips[1]}
            </Tooltip>
          </div>  
        </ListGroupItem>  
      {/each}
    </ListGroup> 
  </div>
  <div class="separa">
    <Button outline color="success" on:click={evalua}>{txtboton}</Button>
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