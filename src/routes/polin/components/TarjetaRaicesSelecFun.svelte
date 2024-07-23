<script lang="ts">
  import Tarjeta from './Tarjeta.svelte';
  import { ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
  export let isOpen: boolean;
  export let textos: Array<string>;
  export let arrLatex: Array<string>; //string[]= ['f(x)=x^2+4x+a', 'g(x)=x^3-3x+b'];
  export let opcion;

</script>

<Tarjeta {isOpen} {textos}>
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
