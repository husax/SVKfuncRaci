<script lang="ts">
	import { Col, Container, Row, Button } from 'sveltestrap';
	import JXGBoard from './JsxBoard.svelte';
	import {brd} from '../tools/Almacen';
	import ElegirPolin from './ElegirPolin.svelte';
	import Tarjeta from './Tarjeta.svelte';
	import TutorRaices from './TutorRaices.svelte';
let boardAttributes = {
		axis: true,
		boundingbox: [-20, 10, 10, -15]
	};

//brd.set(null);
let jxgCajaId='cajaPolin';
let arrL=['x^3-3x+1', '5x^5-3x^2+1'];
let tarjeta: Tarjeta;
let isOpen= true;
let textosTarj=[
	['Tutoriales de polinomios',
	 '',
	'Actividades guiadas sobre raices y conceptos del cálculo Diferencial.'
	],
	['Cálculo con polinomios',
	 '', 
	'Actividades para determinar cualidades graficas de los polinomios. ' +
  'Por ejemplo: monotonia, concavidad, extremos comportamiento al infinito'
	]	
];
let tutoriales= false;
let isOpenTut=true;
let accionTutor= (e: MouseEvent) => {
	
	//carga jsxgraph
	//inicia actividad tutorial
	//o bien, abre otra página
	//esconde tarjetas
	isOpen=false;
	tutoriales=true;
}
</script>
<Container fluid>
	<Row>
		<Col sm={4}>
			<Tarjeta bind:this={tarjeta} {isOpen}
			textos={textosTarj[0]} >
				<Button id="entrar" color={"success"} on:click={accionTutor}>
					Entrar
				</Button>
			</Tarjeta>
		</Col>
		<Col sm={4}>
			<Tarjeta  {isOpen} textos={textosTarj[1]}>
				<Button id="entrar" color={"success"} on:click={accionTutor}>
					Entrar
				</Button>
			</Tarjeta>
		</Col>
	</Row>
	{#if tutoriales}
		<Row>
			<Col sm={4}>
				<TutorRaices/>
			</Col>
			<Col sm={8}>
				<JXGBoard {boardAttributes} {jxgCajaId} />
			</Col>
		</Row>
	{/if}	
</Container>

