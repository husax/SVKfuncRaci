<script lang="ts">
	import { onDestroy} from "svelte";
  import Cabeza from "../components/Cabeza.svelte";
  import PolinCpo from "../components/PolinCpo.svelte";
  import { Styles } from "sveltestrap";
  import { MathQuillSetup } from "svelte-mathquill";
	import JSXSetup from "../components/JSXSetup.svelte";
  import type {OptMenu, DatosHead} from "../tools/tipos";

	let datosH: DatosHead= {
		funcTipo: "Polinomiales",
		tarea: "",
		titMnu: "",
		opcMnu: [],
	}
	onDestroy( () => {
  console.log("destruyó componente page.svelte de polin");
});

</script>

<Styles />
<MathQuillSetup />
<JSXSetup/>
<div>
  <Cabeza {datosH}/>
	<PolinCpo />
</div>