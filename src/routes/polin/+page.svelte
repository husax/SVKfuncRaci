<script lang="ts">
  import Cabeza from "../components/Cabeza.svelte";
  import PolinCpo from "../components/PolinCpo.svelte";
  import { Styles } from "sveltestrap";
  import { MathQuillSetup } from "svelte-mathquill";
  import type {OptMenu} from "../tools/tipos";
	let opcMenu: OptMenu[]= [
		{
			href: "/polin",
			texto: "Raices"
		},
		{
			href: "#home",
			texto: "Tutoriales"
		},
	]
</script>

<Styles />
<MathQuillSetup />
<div>
  <Cabeza funcTipo="Polinomiales" {opcMenu}/>
	<PolinCpo />
</div>