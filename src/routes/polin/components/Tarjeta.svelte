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
  export let isOpen: boolean;
  export let textos: Array<string>;
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
        <div>
          {@html textos[2]}
        </div>
        <slot>
        </slot>
      </CardText>
    </CardBody>
  </Card>
</Fade>

<style>
  .espaciado {
    line-height: 3;
    margin-bottom: 0.5rem;
  }
</style>