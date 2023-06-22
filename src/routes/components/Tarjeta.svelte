<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Collapse
  } from 'sveltestrap';
  export let isOpen: boolean;
  export let Textos: Array<string>;
  export let accion: (e:MouseEvent) => void;
</script>
<Collapse {isOpen} >
  <Card class="mb-3" >
    <CardHeader>
      <CardTitle>{Textos[0]}</CardTitle>
    </CardHeader>
    <CardBody>
      <!-- <CardSubtitle>Gráfica</CardSubtitle> -->
      <CardText>
        {Textos[1]}
      </CardText>
      <Button color={"success"} on:click={accion} >Entrar</Button>
    </CardBody>
  </Card>
</Collapse>
