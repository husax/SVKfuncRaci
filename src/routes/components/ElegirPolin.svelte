<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle
  } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { MathQuillStatic, MathQuill } from "svelte-mathquill";
  export let latex: string;
</script>

<Card class="mb-3">
  <CardHeader>
    <CardTitle>Elige un polinomio o propon un polinomio</CardTitle>
  </CardHeader>
  <CardBody>
    <CardSubtitle>Polinomios</CardSubtitle>
    <CardText>
      <ListGroup>
        <ListGroupItem tag="a" href="#" action>
          <MathQuillStatic {latex} />
        </ListGroupItem>
        <ListGroupItem tag="a" href="#" action>Bravo</ListGroupItem>
        <ListGroupItem tag="a" href="#" action>
          Charlie
        </ListGroupItem>
        <ListGroupItem tag="a" href="#" action>Delta</ListGroupItem>
        <ListGroupItem disabled tag="a" href="#" action>
          Disabled
        </ListGroupItem>
      </ListGroup>
    </CardText>
    <Button>Button</Button>
  </CardBody>
</Card>