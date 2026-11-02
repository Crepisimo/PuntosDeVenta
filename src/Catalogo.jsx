import React, {useEffect,useState} from 'react';
import {apiFetch,rpc,freshId} from './secureClient.jsx';
import './tablet.css';
const h=React.createElement;
const money=(v)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(v)||0);
const btn=(label,onClick,kind='light',disabled=false)=>h('button',{type:'button',className:'cat-btn '+kind,onClick,disabled},label);
const textField=(label,value,onChange,type='text',attrs={})=>h('label',{className:'cat-field'},h('span',null,label),h('input',{type,value,onChange:e=>onChange(e.target.value),...attrs}));
function blankProduct(){return {id:null,nombre:'',precio:'',categoria:'Bebidas',receta:[{id:'',c:''}]};}
function blankInsumo(){return {id:null,nombre:'',unidad:'g',minimo:'0',stock:'0'};}
export default function Catalogo({tienda,insumos=[],productos=[],onRefresh}){
 const [tab,setTab]=useState('productos');
 const [prod,setProd]=useState(blankProduct());
 const [ingredient,setIngredient]=useState(blankInsumo());
 const [editProd,setEditProd]=useState(false);
 const [editIns,setEditIns]=useState(false);
 const [saving,setSaving]=useState(false);
 const [msg,setMsg]=useState('');
 const [err,setErr]=useState('');
 const [search,setSearch]=useState('');
 const [stockMap,setStockMap]=useState({});
 const [insumoData,setInsumoData]=useState([]);
 async function reload(){
   const [products, ingredients, stock] = await Promise.all([
     apiFetch('app_catalogo_productos?select=*&tienda=eq.'+encodeURIComponent(tienda)+'&order=nombre.asc'),
     apiFetch('app_catalogo_insumos?select=*&tienda=eq.'+encodeURIComponent(tienda)+'&order=nombre.asc'),
     apiFetch('inventario?select=insumo_id,stock&tienda=eq.'+encodeURIComponent(tienda))
   ]);
   setInsumoData(ingredients||[]);
   setStockMap(Object.fromEntries((stock||[]).map(s=>[s.insumo_id,Number(s.stock)])));
   if(onRefresh)await onRefresh(products||[],ingredients||[]);
 }
 useEffect(()=>{reload().catch(e=>setErr('No se cargó el catálogo: '+e.message+'. Verifica que hayas ejecutado el SQL de catálogo.'));},[tienda]);
 function changeProd(k,v){setProd(p=>({...p,[k]:v}));}
 function changeLine(i,k,v){setProd(p=>({...p,receta:p.receta.map((r,j)=>j===i?{...r,[k]:v}:r)}));}
 function editProduct(p){setProd({id:p.id,nombre:p.nombre,precio:String(p.precio),categoria:p.categoria,receta:(p.receta||[]).map(r=>({id:r.id,c:String(r.c)}))});setTab('productos');setEditProd(true);setErr('');setMsg('');}
 function editIngredient(x){setIngredient({id:x.id,nombre:x.nombre,unidad:x.unidad,minimo:String(x.minimo),stock:String(stockMap[x.id]??0)});setEditIns(true);setTab('insumos');setErr('');setMsg('');}
 async function guarded(task){setSaving(true);setErr('');setMsg('');try{await task();await reload();setMsg('Cambios guardados correctamente en Supabase.');}catch(e){setErr(e.message);}finally{setSaving(false);}}
 async function saveProduct(){
  await guarded(async()=>{
    const lines=prod.receta.map(r=>({id:r.id,c:Number(r.c)}));
    if(!prod.nombre.trim()||!prod.categoria.trim()||!(Number(prod.precio)>0)||lines.length===0||lines.some(r=>!r.id||!Number.isFinite(r.c)||r.c<=0))throw new Error('Revisa el precio y todos los ingredientes de la receta.');
    await rpc('app_guardar_producto',{p_tienda:tienda,p_nombre:prod.nombre.trim(),p_precio:Number(prod.precio),p_categoria:prod.categoria.trim(),p_receta:lines,p_id:prod.id});
    setProd(blankProduct());setEditProd(false);
  });
 }
 async function saveIngredient(){
   await guarded(async()=>{
    if(!ingredient.nombre.trim()||!ingredient.unidad.trim()||Number(ingredient.minimo)<0)throw new Error('Revisa el nombre, la unidad y el mínimo.');
    await rpc('app_guardar_insumo',{p_tienda:tienda,p_nombre:ingredient.nombre.trim(),p_unidad:ingredient.unidad.trim(),p_minimo:Number(ingredient.minimo),p_id:ingredient.id});
    setIngredient(blankInsumo());setEditIns(false);
   });
 }
 async function updatePhysicalCount(){
   await guarded(async()=>{
     if(!ingredient.id)throw new Error('Primero guarda el ingrediente.');
     const target=Number(ingredient.stock);const actual=Number(stockMap[ingredient.id]||0);
     if(!Number.isFinite(target)||target<0)throw new Error('El conteo físico debe ser un número mayor o igual a cero.');
     const delta=target-actual;
     if(Math.abs(delta)>0.000001){
       if(!window.confirm('Ajustar '+ingredient.nombre+' de '+actual+' a '+target+' '+ingredient.unidad+'? Se registrará en el historial.'))return;
       await rpc('app_ajustar_delta',{p_id:freshId(),p_tienda:tienda,p_insumo:ingredient.id,p_delta:delta,p_motivo:'Conteo físico desde catálogo'});
     }
   });
 }
 const shownProducts=(productos||[]).filter(p=>p.activo!==false&&p.nombre.toLowerCase().includes(search.toLowerCase()));
 const allIngredients=insumoData.length?insumoData:insumos;
 const shownInsumos=allIngredients.filter(i=>i.nombre.toLowerCase().includes(search.toLowerCase()));
 return h('section',{className:'cat-page'},
  h('header',{className:'cat-head'},h('div',null,h('h1',null,'Productos y recetas'),h('p',null,'Administra tu menú, ingredientes y existencias desde la app · '+tienda)),
   h('div',{className:'cat-actions'},btn('Productos',()=>{setTab('productos');setSearch('');},tab==='productos'?'primary':'light'),btn('Ingredientes',()=>{setTab('insumos');setSearch('');},tab==='insumos'?'primary':'light'))),
  err&&h('div',{className:'cat-error',role:'alert'},err),
  msg&&h('div',{className:'cat-ok',role:'status'},msg),
  h('div',{className:'cat-grid'},
   h('div',{className:'cat-panel'},
    h('div',{className:'cat-title-row'},h('h2',null,tab==='productos'?'Productos existentes':'Ingredientes de la sucursal'),btn(tab==='productos'?'+ Nuevo producto':'+ Nuevo ingrediente',()=>{tab==='productos'?(setProd(blankProduct()),setEditProd(true)):(setIngredient(blankInsumo()),setEditIns(true));setErr('');setMsg('');},'primary')),
    h('input',{value:search,onChange:e=>setSearch(e.target.value),placeholder:'Buscar por nombre...',className:'cat-search'}),
    h('div',{className:'cat-list'},tab==='productos'?
      shownProducts.length?shownProducts.map(p=>h('div',{key:p.id,className:'cat-record'},h('div',null,h('b',null,p.nombre),h('small',null,p.categoria+' · '+(p.receta||[]).length+' ingredientes')),h('strong',null,money(p.precio)),btn('Editar',()=>editProduct(p)))):h('p',{className:'cat-muted'},'Todavía no hay productos nuevos guardados.'):
      shownInsumos.length?shownInsumos.map(i=>h('div',{key:i.id,className:'cat-record'},h('div',null,h('b',null,i.nombre),h('small',null,'Existencia '+Number(stockMap[i.id]||0)+' '+i.unidad+' · mínimo '+i.minimo)),btn('Editar',()=>editIngredient(i)))):h('p',{className:'cat-muted'},'Aún no hay insumos en el catálogo.'))
   ),
   h('div',{className:'cat-panel'},tab==='productos'?
     h(React.Fragment,null,h('h2',null,prod.id?'Editar producto':'Crear producto y receta'),
       h('p',{className:'cat-muted'},'Al cobrar, se descuentan de inventario las cantidades indicadas para cada unidad vendida.'),
       textField('Nombre del producto',prod.nombre,v=>changeProd('nombre',v)),
       h('div',{className:'cat-two'},textField('Precio de venta (MXN)',prod.precio,v=>changeProd('precio',v),'number',{min:0.01,step:0.01}),textField('Categoría',prod.categoria,v=>changeProd('categoria',v))),
       h('h3',null,'Ingredientes por unidad'),
       ...prod.receta.map((r,i)=>h('div',{key:i,className:'cat-recipe-line'},
         h('select',{value:r.id,onChange:e=>changeLine(i,'id',e.target.value),required:true},h('option',{value:''},'Selecciona un ingrediente'),...allIngredients.map(x=>h('option',{key:x.id,value:x.id},x.nombre+' ('+x.unidad+')'))),
         h('input',{type:'number',min:'0.000001',step:'any',value:r.c,onChange:e=>changeLine(i,'c',e.target.value),placeholder:'Cantidad'}),
         h('span',{className:'cat-unit'},allIngredients.find(x=>x.id===r.id)?.unidad||'unidad'),
         btn('×',()=>setProd(p=>({...p,receta:p.receta.length>1?p.receta.filter((_,j)=>j!==i):[{id:'',c:''}]})))
       )),
       btn('+ Agregar ingrediente',()=>setProd(p=>({...p,receta:[...p.receta,{id:'',c:''}]}))),
       h('div',{className:'cat-form-actions'},btn(saving?'Guardando...':'Guardar producto',saveProduct,'primary',saving),
         btn('Limpiar',()=>{setProd(blankProduct());setEditProd(false);setErr('');})),
       prod.id&&btn('Desactivar producto',()=>{
         if(!window.confirm('¿Ocultar este producto del punto de venta? Las ventas anteriores se conservarán.'))return;
         guarded(async()=>{await rpc('app_desactivar_producto',{p_id:prod.id});setProd(blankProduct());setEditProd(false);});
       },'danger',saving)
     ):
     h(React.Fragment,null,h('h2',null,ingredient.id?'Editar ingrediente':'Crear ingrediente'),
       h('p',{className:'cat-muted'},'Las cantidades de la receta deben estar en la unidad de inventario que elijas aquí.'),
       textField('Nombre',ingredient.nombre,v=>setIngredient(p=>({...p,nombre:v}))),
       h('div',{className:'cat-two'},
         textField('Unidad (g, ml, kg, L, pza)',ingredient.unidad,v=>setIngredient(p=>({...p,unidad:v}))),
         textField('Mínimo para alertas',ingredient.minimo,v=>setIngredient(p=>({...p,minimo:v})),'number',{min:0,step:'any'})),
       h('div',{className:'cat-form-actions'},btn(saving?'Guardando...':'Guardar ingrediente',saveIngredient,'primary',saving),btn('Limpiar',()=>{setIngredient(blankInsumo());setEditIns(false);})),
       ingredient.id&&h('div',{className:'cat-stock'},h('h3',null,'Conteo físico de inventario'),
         h('p',{className:'cat-muted'},'Existencia actual: '+Number(stockMap[ingredient.id]||0)+' '+ingredient.unidad),
         textField('Cantidad física actual',ingredient.stock,v=>setIngredient(p=>({...p,stock:v})),'number',{min:0,step:'any'}),
         btn('Guardar conteo y registrar ajuste',updatePhysicalCount,'primary',saving))
     ))
  )
 );
}
