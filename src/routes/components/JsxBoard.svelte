<script lang="ts">
import { onMount, beforeUpdate} from 'svelte';
import { brd, boards, currentBrd } from '../tools/Almacen.js';

export let boardAttributes= {
  axis: true,
  boundingbox: [-10, 10, 10, -10]
};
export let jxgCajaId: string;

onMount( () => {
  let board= JXG.JSXGraph.initBoard(jxgCajaId, boardAttributes);
  currentBrd.update(() => $boards.push(board));
  brd.set(board);
});

beforeUpdate(() => {
  if ($brd !== null) {
    $brd.setBoundingBox(boardAttributes.boundingbox);
  }
});

export {brd};
</script>
<div id={jxgCajaId} class="jxgbox" ></div>

<style>
  div {
    width: 100%;
    height: 45em;
    border: 3px solid green;
  }
</style>