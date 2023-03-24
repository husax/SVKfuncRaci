<script lang="ts">
  import { InputGroup, InputGroupText, Button } from "sveltestrap";
  import { MathQuill, MathQuillStatic } from "svelte-mathquill";
  export let latex: string;
  export let disabled: boolean;

  function filtro(e: any) {
    const teclasEsp = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
      "Enter",
      "Insert",
      "Backspace",
      "Home",
      "End",
    ];
    const caracAcep = "0123456789x+-/*()=.sqrtpi";
    if (teclasEsp.indexOf(e.key) !== -1 || caracAcep.indexOf(e.key) !== -1) {
      return;
    }
    // impide que se realice la acción por defecto del evento
    e.preventDefault();
  }
  console.log(latex);
</script>

<InputGroup size="lg" class="mb-3">
  <InputGroupText id="basic-addon1">P(x) =</InputGroupText>
  {#if disabled}
    <MathQuillStatic {latex} />
  {:else}
    <MathQuill bind:latex={latex} />
  {/if}
  <Button color={"success"} size="sm" on:click>
    {disabled ? "Cambia función" : "Aceptar"}
  </Button>
</InputGroup>

