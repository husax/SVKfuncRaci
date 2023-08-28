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
  export let Textos: Array<string>;
  export let accion: (e:MouseEvent) => void;

  onDestroy( () => {
  console.log("destruyó componente Tarjeta");
  });


</script>
<Fade {isOpen} >
  <Card class="mb-3" >
    <CardHeader>
      <CardTitle>{Textos[0]}</CardTitle>
    </CardHeader>
    <CardBody>
      <!-- <CardSubtitle>Gráfica</CardSubtitle> -->
      <CardText>
        {Textos[1]}
      </CardText>
      <Button id="entrar" color={"success"} on:click={accion} >Entrar</Button>
    </CardBody>
  </Card>
</Fade>
