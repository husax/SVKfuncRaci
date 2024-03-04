<script lang="ts">
	import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';

	export let isOpen: boolean;
	export let msg: string;
	export let headMsg: string;
	export let bgColor: string;
	const toggle = () => (isOpen = !isOpen);

	const dispatch = createEventDispatcher();

	$: colorBoton= bgColor.slice(3);

	function Cierra() {
		toggle();
		dispatch('cierra', {
			valor: false
		});
	}
</script>
<div>
	<Modal {isOpen} backdrop={false} {toggle}>
		<ModalHeader class={bgColor} toggle={Cierra}>{headMsg}</ModalHeader>
		<ModalBody>{msg}</ModalBody>
		<ModalFooter>
			<Button color={colorBoton} on:click={Cierra}>Cerrar</Button>
		</ModalFooter>
	</Modal>
</div>
