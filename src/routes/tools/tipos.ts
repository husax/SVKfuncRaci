interface OptMenu {
  href: string;
  texto: string;
}

interface DatosHead {
  funcTipo: string;
	tarea: string;
	titMnu: string;
  opcMnu: OptMenu[];
}

export type {OptMenu, DatosHead}