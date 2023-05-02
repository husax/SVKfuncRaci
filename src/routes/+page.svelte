<script lang="ts">
  import Cabeza from "./components/Cabeza.svelte";
  import Cuerpo from "./components/Cuerpo.svelte";
	import { MathQuillSetup } from "svelte-mathquill";
	import JSXSetup from "./components/JSXSetup.svelte";
  import { Styles } from "sveltestrap";
	import type {OptMenu} from "./tools/tipos";
	let opcMenu: OptMenu[]= [
		{
			href: "/polin",
			texto: "Polinomio"
		},
		{
			href: "#home",
			texto: "Racionales"
		},
		{
			href: "#home",
			texto: "Radicales"
		},
	];

</script>

<Styles />
<MathQuillSetup/>
<JSXSetup/>
<div>

  <Cabeza funcTipo="Racionales" {opcMenu} />
	<Cuerpo />
</div>

<style>
  /*
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
*/
</style>