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
} from 'sveltestrap';
import type {OptMenu, DatosHead} from "../tools/tipos";

export let datosH: DatosHead;


let hayTitMnu= datosH.titMnu !== "";

let isOpen = false;

const toggle= () => (isOpen = !isOpen);


function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }

</script>

<Navbar class="navbar-dark bg-dark navbar-expand-lg">
  <NavbarBrand href="#home" class="text-white">
    Funciones {datosH.funcTipo}: {datosH.tarea} 
  </NavbarBrand>
  <NavbarToggler on:click={toggle} class="me-2"  />
  <Collapse {isOpen} navbar expand="lg" on:update={handleUpdate}>
    <Nav  class="ms-auto text-light" navbar>
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

