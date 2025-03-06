<script lang="ts">
import {
  Collapse, 
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from '@sveltestrap/sveltestrap';
import type {OptMenu, DatosHead} from "../tools/tipos";

  interface Props {
    datosH: DatosHead;
  }

  let { datosH }: Props = $props();


let hayTitMnu= datosH.titMnu !== "";
console.log($state.snapshot(datosH));

let isOpen = $state(true);

const toggle= () => (isOpen = !isOpen);


function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }

</script>

<Navbar color="dark" dark expand="lg" container="fluid">
  <NavbarBrand href="#home">
    Funciones {datosH.funcTipo}: {datosH.tarea} 
  </NavbarBrand>
  <NavbarToggler on:click={toggle}/>
  <Collapse {isOpen} navbar expand="lg" on:update={handleUpdate}>
    <Nav  class="ms-auto" navbar>
      <NavItem>
        <NavLink href="/">Inicio</NavLink>
      </NavItem>
      {#if hayTitMnu}
        <Dropdown title={datosH.titMnu} nav inNavbar>
          <DropdownToggle nav caret>{datosH.titMnu}</DropdownToggle>
          <DropdownMenu end>
            {#each datosH.opcMnu as op }
              <DropdownItem href={op.href}>
                {op.texto}
              </DropdownItem>
            {/each}
            <!-- <DropdownItem divider/> -->
          </DropdownMenu>
        </Dropdown>
        
      {/if}
    </Nav>
  </Collapse>
</Navbar>

