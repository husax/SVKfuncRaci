<script lang="ts">
  import { Col, Container, Image, Row } from "sveltestrap";
  import BarraNav from "./BarraNav.svelte";
  import type {OptMenu, DatosHead} from "../tools/tipos";
  let logoImg = "/logo.jpg";
  let opc: OptMenu[]= [{
    href: "",
    texto: "",
  }];
  export let datosH: DatosHead= {
    funcTipo: "",
		tarea: "",
		titMnu: "",
		opcMnu: opc,
  };
</script>

<Container fluid>
  <Row class="bg-light justify-content-between">
    <Col md="4">
      <Image src={logoImg} alt="logo" />
    </Col>
    <Col md="4" class="align-self-center font-italic">
      <h2 class="cinves-color">CalcVisual Web</h2>
    </Col>
    <Col md="4">
      <Image src={logoImg} alt="logo" />
    </Col>
  </Row>
  <Row>
    <Col>
      <BarraNav {datosH} />
    </Col>
  </Row>
</Container>

<style>
  .cinves-color {
    color: rgb(9, 122, 9);
  }
</style>
