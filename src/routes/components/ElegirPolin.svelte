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
</script>

<Card class="mb-3">
  <CardHeader>
    <CardTitle>Card title</CardTitle>
  </CardHeader>
  <CardBody>
    <CardSubtitle>Card subtitle</CardSubtitle>
    <CardText>
      Elige un polinomio de la lista o propon un polinomio
      <h4>Anchors</h4>
      <ListGroup>
        <ListGroupItem active tag="a" href="#" action>
          Active
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
  <CardFooter>Footer</CardFooter>
</Card>