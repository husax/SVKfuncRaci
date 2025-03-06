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
  } from '@sveltestrap/sveltestrap';
  import { ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap';
  import { MathQuillStatic } from "svelte-mathquill";
  interface Props {
    arrLatex: string[];
  }

  let { arrLatex }: Props = $props();
</script>

<Card class="mb-3">
  <CardHeader>
    <CardTitle>Elige o propon un polinomio</CardTitle>
  </CardHeader>
  <CardBody>
    <CardSubtitle>Polinomios</CardSubtitle>
    <CardText>
      <ListGroup>
        {#each arrLatex as latex }
          <ListGroupItem tag="a" href="#" action>
            <MathQuillStatic {latex} />
          </ListGroupItem>          
        {/each}
        <ListGroupItem tag="a" href="#" action>
          Otro Polinomio
        </ListGroupItem>
      </ListGroup>
    </CardText>
  </CardBody>
</Card>