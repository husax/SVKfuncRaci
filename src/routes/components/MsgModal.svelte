<script lang="ts">
	import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;
	export let msg: string;
	const toggle = () => (open = !open);

	const dispatch = createEventDispatcher();

	function Cierra() {
		toggle();
		dispatch('cierra', {
			valor: false
		});
	}
</script>
<div>
	<Modal isOpen={open} backdrop={false} {toggle}>
		<ModalHeader class="bg-danger" toggle={Cierra}>Expresión inválida</ModalHeader>
		<ModalBody>{msg}</ModalBody>
		<ModalFooter>
			<Button color="danger" on:click={Cierra}>Cerrar</Button>
		</ModalFooter>
	</Modal>
</div>
