<script lang="ts">
import JXGBoard from './JsxBoard.svelte';
import {brd} from '../tools/Almacen';
let boardAttributes = {
		axis: true,
		boundingbox: [-20, 10, 10, -15]
	};

brd.set(null);
let jxgCajaId='cajaPolin';
</script>
<p>Aqui entro bien y veremos si sale</p>
<JXGBoard {boardAttributes} {jxgCajaId} />

