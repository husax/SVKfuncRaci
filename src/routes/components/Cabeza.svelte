<script lang="ts">
  import { Col, Container, Image, Row } from "sveltestrap";
  import BarraNav from "./BarraNav.svelte";
  let logoImg = "/logo.jpg";
  export let funcTipo: string; 
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
      <BarraNav {funcTipo} />
    </Col>
  </Row>
</Container>

<style>
  .cinves-color {
    color: rgb(9, 122, 9);
  }
</style>
