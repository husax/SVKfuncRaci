<script lang="ts">
	import { Col, Container, Row, Button } from 'sveltestrap';
	import JXGBoard from './JsxBoard.svelte';
	import {brd} from '../tools/Almacen';
	import ElegirPolin from './ElegirPolin.svelte';
	import Tarjeta from './Tarjeta.svelte';
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
	'Actividades guiadas sobre raices y conceptos del cálculo Diferencial.'
	],
	['Cálculo con polinomios', 
	'Actividades para determinar cualidades graficas de los polinomios. ' +
  'Por ejemplo: monotonia, concavidad, extremos comportamiento al infinito'
	]	
];
let tutoriales= false;
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
			Textos={textosTarj[0]} accion={accionTutor}/>
		</Col>
		<Col sm={4}>
			<Tarjeta  {isOpen} Textos={textosTarj[1]} accion={accionTutor}/>
		</Col>
		<!-- <Col sm={4}>
			<ElegirPolin arrLatex={arrL}/>
		</Col> -->
		{#if tutoriales}
			<Col sm={8}>
				<JXGBoard {boardAttributes} {jxgCajaId} />
			</Col>
		{/if}
		
	</Row>		
</Container>

