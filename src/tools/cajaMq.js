
//import MathQuill from 'mathquill-node';

const MQ=MathQuill.getInterface(2);
function MField(c, config) {
  return MQ.MathField(c, config);;
} 

function StaticMath(c) {
  return MQ.StaticMath(c);
}
export { StaticMath, MField};