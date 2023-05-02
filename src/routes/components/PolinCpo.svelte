<script lang="ts">
	import { Col, Container, Row, Button } from 'sveltestrap';
	import JXGBoard from './JsxBoard.svelte';
	import {brd} from '../tools/Almacen';
	import ElegirPolin from './ElegirPolin.svelte';
let boardAttributes = {
		axis: true,
		boundingbox: [-20, 10, 10, -15]
	};

//brd.set(null);
let jxgCajaId='cajaPolin';
let arrL=['x^3-3x+1', '5x^5-3x^2+1'];
</script>
<Container fluid>
	<Row>
		<Col sm={4}>
			<ElegirPolin arrLatex={arrL}/>
		</Col>
		<!-- <Col sm={8}>
			<JXGBoard {boardAttributes} {jxgCajaId} />
		</Col> -->
	</Row>		
</Container>

