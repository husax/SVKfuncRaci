<script lang="ts">
	import {
		brd,
		funRac,
		//latexFun,
		muestra,
		idRaices,
		idObjs,
		idFuns,
		animaTangId,
	} from '../tools/Almacen';
	import { Col, Container, Row, Button } from 'sveltestrap';
	import { onDestroy} from 'svelte';
	import CajaMath from './CajaMath.svelte';
	import MsgModal from './MsgModal.svelte';
	import JXGBoard from './JsxBoard.svelte';
	import Acordeon from './Acordeon.svelte';

	import TeXToLinealPyt from '../tools/TeXToLineal';
	import {InfijaAPolacaFR} from '../tools/InfAPolInv';
	import { ArrNum, ArrNumToString, cadBul, calcExtremos } from '../tools/ConvierteData';
	import {
		GraficaNueva,
		GraficaRaices,
		BorraGrafDer,
		BorraRectaTang,
		AnimaRT
	} from '../tools/TrazosJSXGraph';
	import { items } from '../tools/datosItems';
	import type { Polinomio, FunRacional } from '../tools/Polinomio';
	import type {paramF, paramD, GeomElem, funTipo} from '../tools/tipos';

	interface cadyLatex {
		expr: string;
		latex: string;
	}

	interface raicesFun {
		rfun: number[];
		rder1: number[];
		rder2: number[];
	}

	interface dataSym {
		racional: string;
		polinomio?: cadyLatex;
		polNum?: cadyLatex;
		polDen?: cadyLatex;
		derivada: cadyLatex;
		derivada2: cadyLatex;
		raices: {
			rfun: string;
			rder1: string;
			rder2: string;
		};
		polos?: string;
		remov?: string;
		polosRaicesyDer?: string; 
		ventanaX: string;
		error?: string;
	}

	interface dataEnJs {
		racional: boolean;
		polinomio?: cadyLatex;
		polNum?: cadyLatex;
		polDen?: cadyLatex;
		derivada: cadyLatex;
		derivada2: cadyLatex;
		raices: raicesFun;
		polos?: number[];
		remov?: number[];
		polosRaicesyDer?: number[]; 
		ventanaX: number[];
		ventanaY?: number[];
	}

	let latex = '\\frac{x^3-3x+1}{x^2-4}';
	let msg = '';
	let headMsg="";
	let bgColor="bg-danger"
	let disabled;

	muestra.subscribe((valor) => (disabled = valor));

	let datosSympy: dataEnJs= {
		racional: false,
		derivada: {expr: "", latex: "",},
		derivada2: { expr: "", latex: "",},
		raices: { rfun: new Array<number>,
							rder1: new Array<number>,
							rder2: new Array<number>,
						},	 
		ventanaX: new Array<number>,
	};

	let open = false;
	let boardAttributes = {
		axis: true,
		boundingbox: [-20, 10, 10, -15]
	};

	let jxgCajaId='cajaInicio';

	let paramFunc: paramF= {
		func: (x) => 0, // 
		name: "",
		color: "",
		raices: new Array<number>,
		traza: false,
		idFuns: new Array<number>,
		idRaices: new Array<GeomElem>,
	};

	onDestroy( () => {
  	console.log("destruyó componente Cuerpo");
		muestra.set(false);
	});


	const handleClick = () => {
		if (!$muestra) {
			//$latexFun= latex;
			console.log(latex);
			muestra.update(() => Acepta());
			console.log('animaTangId vale ' + $animaTangId);
		} else {
			BorraRectaTang();
			BorraGrafDer();
			console.log('animaTangId vale antes' + $animaTangId);
			if ($animaTangId !== 0) {
				window.cancelAnimationFrame($animaTangId);
				animaTangId.set(0);
			}
			console.log('animaTangId vale ' + $animaTangId);
			muestra.update((valor) => !valor);
		}
	};

	const ChecaHuecos = (cad: string) => {
		let reg = /\*\*\(\)/g;
		if (cad.match(reg) !== null) {
			return 'Hay una casilla de exponente vacia';
		}
		reg = /\/\(\)/;
		if (cad.match(reg) !== null) {
			return 'Hay un cociente indicado pero falta el denominador';
		}
		reg = /\(\)\//;
		if (cad.match(reg) !== null) {
			return 'Hay un cociente indicado pero falta el numerador';
		}
		return '';
	};

	function toggle() {
		open = !open;
	}

	function Acepta() {
		console.log(latex);
		let cadFun = latex;
		//latexFun.subscribe((valor) => (latex = valor));
		let cadpyt = TeXToLinealPyt.TexToPyt(cadFun, true);
		let cad = TeXToLinealPyt.TexToPyt(cadFun, false);
		let cadFunRac;
		let ventanaY;
		msg = ChecaHuecos(cadpyt);
		if (msg !== '') {
			headMsg="Expresión inválida";
			open = !open;
			disabled = true;
			return false;
		}
		let procesaInfija = new InfijaAPolacaFR(cad);
		procesaInfija.InfAPol();
		if (procesaInfija.numError !== 0) {
			open = !open;
			headMsg="Expresión inválida";
			msg = InfijaAPolacaFR.errores[-procesaInfija.numError];
			return false;
		}
		funRac.set(InfijaAPolacaFR.EvalFuncRac(procesaInfija.postFija,
		 procesaInfija.variables));
		 
		if ($funRac === undefined) {
			open=!open;
			headMsg="Expresión inválida";
			msg=InfijaAPolacaFR.errores[- InfijaAPolacaFR.nErr];
			return false;
		}
		if ($funRac.esPolinomio) {
			cadFunRac = $funRac.toString();
		}
		else {
			cadFunRac = ($funRac as FunRacional).numP.toString() + ',' +
			($funRac as FunRacional).denomP.toString();
		}
		const url = 'http://127.0.0.1:5000/api/v1/polynomial/properties/' + cadFunRac;
		const respPromesa = fetch(url, { method: 'GET', mode: 'cors' });
		respPromesa.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
				return false;
			}
			response.json().then((data: dataSym) => {
				datosSympy.racional = cadBul(data.racional);
				datosSympy.raices.rfun = ArrNum(data.raices.rfun);
				datosSympy.raices.rder1 = ArrNum(data.raices.rder1);
				datosSympy.raices.rder2 = ArrNum(data.raices.rder2);
				datosSympy.derivada=data.derivada;
				datosSympy.derivada2=data.derivada2;
				if (datosSympy.racional) {
					datosSympy.polNum= data.polNum;
					datosSympy.polDen= data.polDen;
					datosSympy.polos=ArrNum(data.polos);
					datosSympy.remov = ArrNum(data.remov);
				}
				datosSympy.ventanaX = ArrNum(data.ventanaX);
				console.log(datosSympy);
				console.log(datosSympy.derivada.latex);
				datosSympy.derivada.latex = "P'\\left(x\\right)=" + datosSympy.derivada.latex;
				console.log(datosSympy.derivada.latex);
				ventanaY = calcExtremos((x: number) =>
									 (<funTipo>$funRac).Evalua(x), datosSympy.raices.rder1);
				boardAttributes = {
					axis: true,
					boundingbox: [datosSympy.ventanaX[0], ventanaY[1] * 1.1,
					datosSympy.ventanaX[1], ventanaY[0] * 1.1]
				};
				paramFunc.func = (x: number) => (<funTipo>$funRac).Evalua(x);
				paramFunc.name = 'P';
				paramFunc.color = 'green';
				paramFunc.idFuns = $idFuns;
				idFuns.set(GraficaNueva($brd, paramFunc));
				if (datosSympy.raices.hasOwnProperty('rfun')) {
					items[0].contenido = ArrNumToString(datosSympy.raices.rfun, 3);
					paramFunc.raices = datosSympy.raices.rfun;
					paramFunc.idRaices = new Array<GeomElem>;
				}
				if (datosSympy.hasOwnProperty('polos')) {
					items[1].contenido = ArrNumToString(datosSympy.polos, 3);
				}
				if (datosSympy.hasOwnProperty('derivada')) {
					items[4].contenido = datosSympy.derivada.latex;
				}
 
			});
		});
		return true;
	}

	InfijaAPolacaFR.IniciaErrores();

	const ActualizaGraf = (item: number) => {
		console.log(item);
		if (item === 0 && datosSympy.raices.hasOwnProperty('rfun')) {
			if (paramFunc.raices.length === 0) {
				$idRaices = new Array<GeomElem>;
				return;
			}
			$idRaices = GraficaRaices($brd, paramFunc);
		} else if (item === 1) {
			//BorraGrafDer();
			//BorraRectaTang();
		}
	};

	const animaRectaTang = () => {
		const param: paramD = {
			func: $idFuns[0],
			deriv: (x: number) => (<funTipo>$funRac).Derivada().Evalua(x),
			vxmin: datosSympy.ventanaX[0],
			vxmax: datosSympy.ventanaX[1],
			color: 'blue',
			idObjs: $idObjs
		};
		AnimaRT($brd, param);
	};
</script>

<MsgModal isOpen={open} {headMsg} {msg} on:cierra={toggle} {bgColor}/>
<Container fluid>
	<Row>
		<Col sm={4}>
			<CajaMath bind:latex disabled={$muestra} on:click={handleClick} />
			<Acordeon {items} {ActualizaGraf} muestra={$muestra} {animaRectaTang} />
		</Col>
		<Col sm={8}>
			<JXGBoard {boardAttributes} {jxgCajaId}/>
		</Col>
	</Row>
</Container>
