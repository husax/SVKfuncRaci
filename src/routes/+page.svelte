<script lang="ts">
  import Cabeza from "./components/Cabeza.svelte";
  import Cuerpo from "./components/Cuerpo.svelte";
	import { MathQuillSetup } from "svelte-mathquill";
	import JSXSetup from "./components/JSXSetup.svelte";
  import { Styles } from "@sveltestrap/sveltestrap";
	import type { DatosHead, OptMenu } from "./tools/tipos";
	const opc: OptMenu[] = [
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
		];
	const datosH: DatosHead= {
		funcTipo: "Racionales",
		tarea: "",
		titMnu: "Funciones",
		opcMnu: opc
		/* [
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
		] */
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