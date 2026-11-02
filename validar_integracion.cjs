const fs=require('fs'), vm=require('vm'), assert=require('assert');
const context={console,Date,Math,Intl,Number,Set,Map,Array,Object,JSON,parseFloat,parseInt,String,Boolean,Promise,window:{alert(msg){throw Error(msg)},imprimirTicket(){},setTimeout:()=>{}},setTimeout:()=>{},clearTimeout:()=>{},alert(){}};
context.imprimirTicket=()=>{};context.React={
 createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),
 useState:(v)=>[v,()=>{}],useRef:(v)=>({current:v}),useMemo:(f)=>f(),useEffect:()=>{},useCallback:(f)=>f
};
context.useState=context.React.useState;context.useMemo=context.React.useMemo;
context.apiFetch=async()=>[];context.rpc=async()=>{};context.freshId=()=>Math.random().toString();context.getCurrentStaff=()=>({nombre:'Cajero'});context.isAdmin=()=>true;
vm.createContext(context);
// Funciones de fecha reales compartidas con el POS (antes estaban omitidas en el mock).
let fechaCore=fs.readFileSync('src/corteCaja.mjs','utf8').replace(/^export /gm,'');
vm.runInContext(fechaCore,context,{filename:'corteCaja.mjs'});
let main=fs.readFileSync('src/POSCrepismoTichiAMB.jsx','utf8').replace(/^import .*;\s*$/gm,'').replace('export default function App','function App');
vm.runInContext(main,context,{filename:'POSCrepismoTichiAMB.jsx'});
// Impresora simulada: la prueba revisa datos y no hardware Bluetooth.
context.window.imprimirTicket=()=>{};
let ui=fs.readFileSync('src/POSUnificado.jsx','utf8').replace(/^import .*;\s*$/gm,'').replace('export default function POSUnificado','function POSUnificado');
vm.runInContext(ui,context,{filename:'POSUnificado.jsx'});
const c=context;
const menuCrep=vm.runInContext('grupoMenuCrep()',c);
const menuAmb=vm.runInContext('grupoMenuAmb()',c);
const menuTichi=vm.runInContext('grupoMenuTichi()',c);
for(const [key,menu] of [['Crepisimo',menuCrep],['AM-Burgers',menuAmb],['Tichi',menuTichi]]){
 assert(menu.length>=3, key+' falta categorías');
 assert(menu.every(g=>g.categorias.length && g.categorias.every(x=>x.productos.length)),key+' sin productos');
 console.log(key+': '+menu.length+' grupos, '+menu.reduce((n,g)=>n+g.categorias.reduce((k,c)=>k+c.productos.length,0),0)+' artículos originales');
}
const custom={id:'abc-123',tienda:'tichi',nombre:'Jarabe especial',precio:198,activo:true,receta:[{id:'ti_azucar',c:0.2}]};
const grupoCustom=vm.runInContext('grupoCustom',c);
assert(grupoCustom([custom]).categorias[0].productos[0].nombre==='Jarabe especial');
const descontar=vm.runInContext('descontarRecetaNueva',c);
let delta={};descontar({productoCatalogoId:custom.id,recetaSnapshot:custom.receta,nombre:custom.nombre},[custom],(id,x)=>delta[id]=x);
assert.equal(delta['ti_azucar'],0.2);
const POSUnificado=vm.runInContext('POSUnificado',c);
function flatten(tree,arr=[]){if(tree&&typeof tree==='object'&&!Array.isArray(tree)){arr.push(tree);for(const x of tree.children||[])flatten(x,arr);}return arr}
for(const marca of ['crepisimo','amburger','tichi']){
 const data={crepisimo:menuCrep,amburger:menuAmb,tichi:menuTichi}[marca];
 const props={marca,tiendaNombre:marca,grupos:data.concat([grupoCustom([custom])]),orden:[],setOrden:()=>{},onSeleccionar:()=>{},onCobrar:()=>{},onDescuento:()=>{},onGasto:()=>{},ventasPeriodo:0,efectivoPeriodo:0};
 const tree=POSUnificado(props);
 const nodes=flatten(tree);
 assert(nodes.some(x=>x.type==='aside'&&x.props.className==='posu-ticket'),marca+' no tiene ticket lateral');
 assert(nodes.filter(x=>x.props.className?.includes?.('posu-group')).length>=4,marca+' no tiene categorías visibles');
 assert(nodes.some(x=>x.type==='button'&&x.children.includes('Cobrar')),marca+' no tiene cobrar');
 console.log('UI '+marca+': '+nodes.length+' elementos renderizados, pedido lateral y cobro presentes');
}
function testBrand(fnName,brand){
 const state=[];let index=0;const calls=[];
 c.React.useState=c.useState=(init)=>{const i=index++;if(!(i in state))state[i]=typeof init==='function'?init():init;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v}];};
 c.React.useRef=(v)=>({current:v});
 const fn=vm.runInContext(fnName,c);
 const props={tiendaId:brand==='crepisimo'?'centro':brand==='amburger'?'amburger':'tichi',insumos:[],setInsumos:()=>{},onVenta:async(v,deltas)=>calls.push({v,deltas}),onGasto:async()=>{},ventas:[],gastos:[],productosNuevos:[{...custom,tienda:brand==='crepisimo'?'centro':brand==='amburger'?'amburger':'tichi'}]};
 function render(){index=0;return fn(props)}
 function child(t){return render().children.find(x=>x&&x.type===t)}
 // Components in React VDOM; they are descriptor, not invoked here
 const unif=render().children.find(x=>x&&typeof x.type==='function'&&x.type.name==='POSUnificado');
 assert(unif,brand+' no usó pantalla única');
 const p=unif.props;
 const spec=p.grupos.at(-1).categorias[0].productos[0];
 p.onSeleccionar(spec);
 let updated=render().children.find(x=>x&&typeof x.type==='function'&&x.type.name==='POSUnificado').props;
 assert.equal(updated.orden.length,1,brand+' no agregó producto nuevo');
 assert.equal(updated.orden[0].productoCatalogoId,custom.id,brand+' perdió referencia al catálogo');
 updated.onCobrar('efectivo');
 const tree=render();
 const modal=tree.children.find(x=>x&&x.props&&x.props.onConfirmar);
 assert(modal,brand+' no abrió modal de cobro');
 return modal.props.onConfirmar({metodo:'efectivo',netoRecibido:198,comisionClip:0,cambio:0,estadoPago:'pagado'}).then(()=>{
  assert.equal(calls.length,1,brand+' no guardó venta');
  assert(calls[0].deltas.some(d=>d.id==='ti_azucar'&&d.delta===-0.2),brand+' no descontó receta de producto nuevo');
  console.log('Venta '+brand+': inventario de producto dinámico descontado correctamente');
 });
}
(async()=>{
 await testBrand('POS','crepisimo');
 await testBrand('POSAmburger','amburger');
 await testBrand('POSTichi','tichi');
 console.log('TODAS LAS PRUEBAS DE INTEGRACIÓN TERMINADAS');
})().catch(e=>{console.error(e.stack);process.exitCode=1});
