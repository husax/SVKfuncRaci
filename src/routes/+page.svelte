<script lang="ts">
  import Cabeza from "./components/Cabeza.svelte";
  import Cuerpo from "./components/Cuerpo.svelte";
	import { MathQuillSetup } from "svelte-mathquill";
	import JSXSetup from "./components/JSXSetup.svelte";
  import { Styles } from "sveltestrap";
	import type {OptMenu, DatosHead} from "./tools/tipos";
	let datosH: DatosHead= {
		funcTipo: "Racionales",
		tarea: "",
		titMnu: "Funciones",
		opcMnu: [
			{
				href: "/polin",
				texto: "Polinomiales"
			},
			{
				href: "#home",
				texto: "Racionales"
			},
			{
				href: "#home",
				texto: "Radicales"
			}
		]
	};

</script>

<Styles />
<MathQuillSetup/>
<JSXSetup/>
<div>

  <Cabeza {datosH} />
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