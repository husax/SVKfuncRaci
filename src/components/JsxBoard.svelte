<script>
import { onMount, beforeUpdate} from 'svelte';
import { brd } from '../tools/Almacen.js';

export let boardAttributes= {
  axis: true,
  boundingbox: [-10, 10, 10, -10]
};
let jxgCaja='jxgbox';

onMount( () => {
  let board= JXG.JSXGraph.initBoard(jxgCaja, boardAttributes);
  brd.set(board);
});

beforeUpdate(() => {
  if ($brd !== null) {
    $brd.setBoundingBox(boardAttributes.boundingbox);
  }
});

export {brd};
</script>
<div id={jxgCaja} class="jxgbox" ></div>

<style>
  div {
    width: 100%;
    height: 45em;
    border: 3px solid green;
  }
</style>