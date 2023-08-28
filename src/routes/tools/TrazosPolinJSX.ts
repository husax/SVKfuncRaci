import type {DeslPr } from "./tipos";
import { InfijaAPolacaFR } from "./InfAPolInv";


function ConstruyeFunParFijo(cad: string, desl: DeslPr) {
  const infpol= new InfijaAPolacaFR(cad);
  infpol.InfAPol();
  if (Object.keys(infpol.variables).length > 3) {
      infpol.variables[desl.id]=Number.parseFloat(desl.value);
  }
  return infpol;
}

function CasoIreducible(c:number[]): number[] {
  const p=c[1];
  const q=c[0];
  const Cos3A=-q/(2*Math.sqrt(-p*p*p/27));
  const n= Math.sqrt(-4*p/3);
  const ang3A= Math.acos(Cos3A);
  const r=[
    n*Math.cos(ang3A/3),
    n*Math.cos(ang3A/3+ 2*Math.PI/3),
    n*Math.cos(ang3A/3+ 4*Math.PI/3)
  ]
  return r;
}

function RaicesVieta(coefs:number[]) : number[] {
  const r= new Array<number>;
  let c= new Array<number>;
  if (coefs[2] !== 0) {
    const b=coefs[2];
    c= [
      coefs[0]-b*coefs[1]/3+2*b*b*b/27,
      coefs[1]-b*b/3,
      0,
      1
    ]
  }
  else {
    c= coefs.slice();
  }
  const p= c[1];
  const q= c[0];  
  const R= (p/3)**3 + (q/2)**2;
  if (R > 0) {
    let rA=Math.sqrt(R);
    const rB= -q/2 - rA;
    rA-=q/2;
    const A= rA >=0 ? rA**(1/3) : -((-rA)**(1/3));
    const B= rB >=0 ? rB**(1/3) : -((-rB)**(1/3));
    r[0]= A + B;
    return r;        
  }
  if (R===0) {
    return [-q, q/2, q/2];
  }
  return CasoIreducible(c); 
}

function Raices(coefs: number[]) : number[] {
  let r= new Array<number>;
  let d: number;  
  switch (coefs.length) {
    case 0:
      break;
    case 1:
      if (coefs[0] !== 0) {
        r[0]=0;
      }
      break;
    case 2:
      r[0]= - coefs[0]/coefs[1];
      break;
    case 3:
      d= coefs[1]*coefs[1]- 4*coefs[2]*coefs[0];
      if (d >= 0) {
        r[0]= (-coefs[1] + Math.sqrt(d))/(2*coefs[2]);
        r[1]= (-coefs[1] - Math.sqrt(d))/(2*coefs[2]);
        r= r.sort((a,b) => a - b);
      } 
      break;
      case 4:
        r=RaicesVieta(coefs);
        r= r.sort((a,b) => a - b);
      break;
    default:
      break;
  }
  return r;
}

export {ConstruyeFunParFijo, Raices} 