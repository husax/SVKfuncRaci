import { Punto } from "./vector";
import { brd, idObjs, idFuns, animaTangId } from "./Almacen";

const GraficaNueva = (brd, param) => {
  brd.suspendUpdate();
  BorraObjGraficos(brd, param);
  const fun1 = brd.create("functiongraph", [param.func], {
    strokewidth: 2,
    name: param.name,
    strokeColor: param.color,
  });
  brd.unsuspendUpdate();
  param.idFuns.push(fun1);
  return param.idFuns.slice();
};

const EliminaMultiples = (arr) => {
  let rzant = null;
  const result = [];
  arr.forEach((elem) => {
    if (elem !== rzant) {
      result.push(elem);
    }
    rzant = elem;
  });
  return result;
};

const YaTrazadas = (r, p) => {
  const pant = p.idRaices;
  const rcoor = pant.map((valor) => valor.coords.usrCoords[1]);
  if (rcoor.length === 0) {
    return false;
  }
  for (let i = 0; i < rcoor.length; i++) {
    if (r[i] !== rcoor[i]) {
      return false;
    }
  }
  return true;
};

const GraficaRaices = (brd, param) => {
  const raices = EliminaMultiples(param.raices);
  if (YaTrazadas(raices, param)) {
    return param.idRaices;
  }
  brd.suspendUpdate();
  const ptos = raices.map((raiz, ind) => {
    return brd.create("point", [raiz, param.func(raiz)], {
      name: `r_${ind + 1}`,
      face: "x",
      fixed: true,
    });
  });
  brd.unsuspendUpdate();
  param.idRaices = ptos;
  return param.idRaices; // ver esto
};

const BorraObjGraficos = (brd, param) => {
  brd.suspendUpdate();
  while (param.idFuns.length > 0) {
    brd.removeObject(param.idFuns.pop().id, false);
  }
  param.idRaices.forEach((pto) => {
    brd.removeObject(pto.id, false);
  });
  brd.unsuspendUpdate();
};

const BorraRectaTang = () => {
  let objs;
  let board;
  idObjs.subscribe((valor) => {
    objs = valor;
  });
  brd.subscribe((b) => {
    board = b;
  });
  const unsuscribe = animaTangId.subscribe((id) => {
    window.cancelAnimationFrame(id);
    console.log(id);
  });
  while (objs.length > 0) {
    board.removeObject(objs.pop().id, false);
  }
  unsuscribe();
  animaTangId.update(() => 0);
};

const BorraGrafDer = () => {
  let funs;
  let board;
  idFuns.subscribe((valor) => {
    funs = valor;
  });
  brd.subscribe((b) => {
    board = b;
  });
  if (funs.length > 1) {
    board.removeObject(funs.pop().id, false);
  }
};

const AgregaGrafica = (brd, param) => {
  brd.suspendUpdate();
  let fun1 = brd.create("functiongraph", [param.func], {
    strokewidth: 2,
    name: param.name,
    strokecolor: param.color,
  });
  param.idFuns.push(fun1);
  brd.unsuspendUpdate();
  return param.idFuns;
};

// convierte puntos en pixeles a puntos en el sistema de coordenadas de brd
// recibe un punto o un arreglo de puntos.
const DesdePixeles = (pto, brd) => {
  if (typeof pto.x === "number") {
    let [xmin, ymax, xmax, ymin] = brd.getBoundingBox();
    let pixXUnidad = new Punto(
      brd.canvasWidth / (xmax - xmin),
      brd.canvasHeight / ymax - ymin
    );
    const escala = new Punto(pto.x / pixXUnidad.x, -pto.y / pixXUnidad.y);
    return new Punto(escala.x + xmin, escala.y + ymax);
  }
  if (Array.isArray(pto)) {
    return pto.map((p) => DesdePixeles(p, brd));
  }
};

const xInicialGlider = (brd, func) => {
  const ptosInter = DesdePixeles([new Punto(0, 0), new Punto(30, 0)], brd);
  const seg = ptosInter[1].x - ptosInter[0].x;
  let vy;
  let [xini, ymax, xmax, ymin] = brd.getBoundingBox();
  let xmed = (xmax - xini) / 2;
  do {
    xini += seg;
    vy = func.Y(xini);
  } while ((vy <= ymin || vy >= ymax) && xini < xmax);
  return {
    xini: xini < xmax ? xini : xmed,
    seg: seg,
  };
};

const AnimaRT = (brd, param) => {
  let pg = param.idObjs[0];
  let { xini } = xInicialGlider(brd, param.func);
  let xfin = param.vxmax;
  let inicio = null;
  let incr = (xfin - xini) / 300;
  //pg.setGliderPosition(xini);
  function animaGlider(timestamp) {
    if (!inicio) {
      inicio = timestamp;
    }
    if (pg.X() >= xfin) {
      pg.setGliderPosition(xini);
      animaTangId.set(0);
    } else {
      if (timestamp - inicio > 50) {
        pg.setGliderPosition(pg.X() + incr);
        inicio = timestamp;
      }
      animaTangId.update(() => requestAnimationFrame(animaGlider));
    }
  }
  animaTangId.update(() => requestAnimationFrame(animaGlider));
};

const MuestraRT = (brd, param) => {
  let objCreados = [];
  let { xini, seg } = xInicialGlider(brd, param.func);
  let pg = brd.create("glider", [xini, param.func.Y(xini), param.func], {
    name: "",
    size: 3,
    fillColor: param.color,
    strokeColor: param.color,
    face: "[]",
  });
  const df = param.deriv;
  const rt = (x) => df(pg.X()) * (x - pg.X()) + pg.Y();
  const pga = brd.create(
    "point",
    [() => pg.X() - seg, () => rt(pg.X() - seg)],
    {
      name: "",
      size: 1,
      visible: true,
    }
  );
  const pgb = brd.create(
    "point",
    [() => pg.X() + seg, () => rt(pg.X() + seg)],
    {
      name: "",
      size: 1,
      visible: true,
    }
  );
  const stang = brd.create("segment", [pga, pgb], {
    strokeColor: "red",
    strokeWidth: 1,
  });
  const pend = brd.create(
    "text",
    [
      () => pg.X() + seg / 2,
      () => pg.Y(),
      () => `P'(${pg.X().toFixed(2)}) = ${df(pg.X()).toFixed(2)}`,
    ],
    { anchorY: "middle" }
  );
  objCreados.push(pg, pga, pgb, stang, pend);
  return objCreados;
};

export {
  GraficaNueva,
  GraficaRaices,
  AgregaGrafica,
  BorraObjGraficos,
  BorraGrafDer,
  BorraRectaTang,
  MuestraRT,
  AnimaRT,
};
