<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Fade,
  } from '@sveltestrap/sveltestrap';
  import {onDestroy} from 'svelte';
  interface Props {
    isOpen: boolean;
    textos: Array<string>;
    children?: import('svelte').Snippet;
  }

  let { isOpen, textos, children }: Props = $props();
  //export let accion: (e:MouseEvent) => void;

  onDestroy( () => {
  console.log("destruyó componente Tarjeta");
  });


</script>
<Fade {isOpen} >
  <Card class="mb-3" >
    <CardHeader>
        <CardTitle >{textos[0]}</CardTitle> 
    </CardHeader>
    <CardBody>
      <CardSubtitle>
        <div class="espaciado">
          {textos[1]}
        </div>
      </CardSubtitle>
      <CardText>
        <div class="espaciado">
          {@html textos[2]}
        </div>
        {#if children}{@render children()}
        {/if} 
      </CardText>
    </CardBody>
  </Card>
</Fade>

<style>
  .espaciado {
    line-height: 1.5;
    padding-bottom: 0.5rem;
  }
</style>