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
  } from 'sveltestrap';
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
      <CardTitle>{textos[0]}</CardTitle>
    </CardHeader>
    <CardBody>
      <CardSubtitle>{textos[1]}</CardSubtitle>
      <CardText>
        <div>
          {textos[2]}
        </div>
        <slot>
        </slot>
      </CardText>
    </CardBody>
  </Card>
</Fade>
