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

let isOpen = false;

const toggle= () => (isOpen = !isOpen);

function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }

</script>

<Navbar class="navbar-dark bg-dark navbar-expand-lg">
  <NavbarBrand href="#home" class="text-white">
    Funciones Algebraicas:
  </NavbarBrand>
  <NavbarToggler on:click={toggle} class="me-2"  />
  <Collapse {isOpen} navbar expand="lg" on:update={handleUpdate}>
    <Nav  class="ms-auto text-light" navbar>
      <NavItem>
        <NavLink href="/">Inicio</NavLink>
      </NavItem>
      <Dropdown title="Funciones" nav inNavbar>
        <DropdownToggle nav caret>Funciones</DropdownToggle>
        <DropdownMenu end>
          <DropdownItem href="/polin">
            Polinomiales
          </DropdownItem>
          <DropdownItem href="#home">
            Racionales
          </DropdownItem>
          <DropdownItem href="#home">
            Radicales
          </DropdownItem>
          <DropdownItem divider/>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>

