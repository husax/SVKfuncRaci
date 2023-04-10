<script lang="ts">
  import Cabeza from "../components/Cabeza.svelte";
  import PolinCpo from "../components/PolinCpo.svelte";
  import { Styles } from "sveltestrap";
  import { MathQuillSetup } from "svelte-mathquill";
</script>

<Styles />
<MathQuillSetup />
<div>
  <Cabeza funcTipo="Polinomiales"/>
	<PolinCpo />
</div>