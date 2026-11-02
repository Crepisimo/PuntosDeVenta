import React, {useMemo, useState} from 'react';
import './tablet.css';
import CorteDia from './CorteDia.jsx';
import {fechaCaja} from './corteCaja.mjs';

const el = React.createElement;
const peso = (n) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n)||0);

const TEMAS = {
  crepisimo:{principal:'#7936AD',oscuro:'#542184',suave:'#F3EAFA',acento:'#E172B3',nombre:'Crepísimo',simbolo:'🥞'},
  amburger:{principal:'#173D77',oscuro:'#102A51',suave:'#EAF1FB',acento:'#F47B20',nombre:'AM-Burgers',simbolo:'🍔'},
  tichi:{principal:'#267345',oscuro:'#175031',suave:'#E8F5EA',acento:'#59B875',nombre:'Tichi',simbolo:'🧴'}
};

const classes=(...v)=>v.filter(Boolean).join(' ');
function formatKey(item){
  return JSON.stringify([item.nombre,item.precio,item.detalle||'',item.paraLlevar||'',item.recetaKey||'',item.productoCatalogoId||'',item.recetaSnapshot||null,!!item.esPromo,!!item.esDescuento,!!item.esEnvio,!!item.esEmpleado,item.extraRec||null]);
}
/** Vista única de venta: solo cambia el tema y los productos; no guarda inventarios ni ventas. */
export default function POSUnificado({marca,tiendaId,tiendaNombre,grupos=[],orden=[],setOrden,onSeleccionar,onCobrar,onDescuento,onGasto,onPromociones,onEmpleado,onEnvio,exito,procesando,ventasPeriodo=0,efectivoPeriodo=0,fechaCorte,onCambiarFechaCorte,mostrarCorte,onAlternarCorte,datosCorte=[],ventasCorte=[],gastosCorte=[],alertas=[],soloNuevos=false}) {
  const tema=TEMAS[marca]||TEMAS.crepisimo;
  const gruposFiltrados = soloNuevos?grupos.filter(x=>x.id==='personalizados'):grupos;
  const [grupoActivo,setGrupoActivo]=useState(soloNuevos?'personalizados':(gruposFiltrados[0]?.id||''));
  const [subActivo,setSubActivo]=useState('');
  const [busqueda,setBusqueda]=useState('');
  const [verCombos,setVerCombos]=useState(false);
  const [confirmandoVaciar,setConfirmandoVaciar]=useState(false);
  const group=gruposFiltrados.find(x=>x.id===grupoActivo)||gruposFiltrados[0];
  const subcats=group?.categorias||[];
  const sub=(subcats.find(x=>x.id===subActivo)||subcats[0])||null;
  const all=useMemo(()=>gruposFiltrados.flatMap(g=>(g.categorias||[]).flatMap(c=>(c.productos||[]).map(p=>({...p,categoriaLabel:c.nombre,grupoLabel:g.nombre})))),[gruposFiltrados]);
  const texto=busqueda.trim().toLocaleLowerCase('es-MX');
  const visibles=texto?all.filter(p=>(p.nombre||'').toLocaleLowerCase('es-MX').includes(texto)):(sub?.productos||[]);
  const total=Math.max(0,orden.reduce((s,i)=>s+(Number(i.precio)||0),0));
  const articulos=orden.length;
  const gruposPedido=[]; const m=new Map();
  orden.forEach((item)=>{
    const k=formatKey(item);
    if(!m.has(k)){const g={key:k,item,cantidad:0,importe:0};m.set(k,g);gruposPedido.push(g);}
    const g=m.get(k);g.cantidad++;g.importe+=Number(item.precio)||0;
  });
  function quitarUno(key){setOrden(prev=>{let eliminado=false;return prev.filter(i=>{if(!eliminado&&formatKey(i)===key){eliminado=true;return false;}return true;});});}
  function agregarUno(item){setOrden(prev=>prev.concat([{...item,id:Date.now()+Math.random()}]));}
  function cambiarGrupo(id){setGrupoActivo(id);setSubActivo('');setBusqueda('');setVerCombos(false);}
  function cambiarFecha(d){if(!onCambiarFechaCorte)return;const x=new Date((fechaCorte||'2026-01-01')+'T12:00:00');x.setDate(x.getDate()+d);const y=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');onCambiarFechaCorte(y);}

  return el('div',{className:'posu',style:{'--pos-primary':tema.principal,'--pos-dark':tema.oscuro,'--pos-soft':tema.suave,'--pos-accent':tema.acento}},
    exito && el('div',{className:'posu-toast',role:'status'},'Venta registrada'),
    el('div',{className:'posu-head'},
      el('div',{className:'posu-brand'},el('span',{className:'posu-mark','aria-hidden':true},tema.simbolo),el('div',null,el('div',{className:'posu-brand-name'},tema.nombre),el('div',{className:'posu-brand-sub'},tiendaNombre))),
      el('div',{className:'posu-head-right'},el('span',{className:'posu-date'},new Date().toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})),el('span',{className:'posu-head-hint'},'Punto de venta'))
    ),
    el('div',{className:'posu-columns'},
      el('main',{className:'posu-main'},
        el('section',{className:'posu-groups','aria-label':'Categorías principales'},
          gruposFiltrados.map(g=>el('button',{key:g.id,type:'button',className:classes('posu-group',group?.id===g.id&&'active'),onClick:()=>cambiarGrupo(g.id)},el('span',{className:'posu-group-icon'},g.emoji||'●'),el('span',null,g.nombre)))
        ),
        el('div',{className:'posu-subcats'},
          !texto&&subcats.length>1&&subcats.map(c=>el('button',{key:c.id,type:'button',className:classes('posu-sub',sub?.id===c.id&&'active'),onClick:()=>setSubActivo(c.id)},c.nombre))
        ),
        el('div',{className:'posu-actions'},
          onPromociones&&el('button',{type:'button',className:'posu-chip',onClick:()=>setVerCombos(v=>!v)},'🎉 '+(marca==='amburger'?'Combos':'Promociones')),
          el('button',{type:'button',className:'posu-chip',onClick:onDescuento},'🏷 Descuento'),
          onEmpleado&&el('button',{type:'button',className:'posu-chip',onClick:onEmpleado},'👤 Empleado'),
          onEnvio&&el('button',{type:'button',className:'posu-chip',onClick:onEnvio},'🚚 Envío'),
          el('button',{type:'button',className:'posu-chip',onClick:onGasto},'+ Gasto')
        ),
        el('section',{className:'posu-products'},
          el('div',{className:'posu-products-top'},
            el('div',null,el('h2',null,verCombos?'Promociones':texto?'Resultados de búsqueda':(sub?.nombre||'Productos')),el('p',null,verCombos?'Selecciona la promoción que deseas agregar':texto?visibles.length+' resultados':'Toca un producto para agregarlo al pedido')),
            !verCombos&&el('input',{type:'search',value:busqueda,onChange:e=>setBusqueda(e.target.value),className:'posu-search',placeholder:'Buscar en todo el menú…','aria-label':'Buscar productos'})
          ),
          verCombos&&onPromociones?el('div',{className:'posu-product-grid'},
            onPromociones.map(p=>el('button',{key:p.id||p.nombre,type:'button',className:'posu-product-card',onClick:()=>onSeleccionar(p)},
              el('div',{className:'posu-card-icon'},p.emoji||'🎉'),el('strong',null,p.nombre),el('span',{className:'posu-card-meta'},'Combo / promoción'),el('span',{className:'posu-card-plus'},'+')))
          ):visibles.length?el('div',{className:'posu-product-grid'},visibles.map((p,i)=>el('button',{key:(p.id||p.nombre)+'-'+i,type:'button',className:'posu-product-card',onClick:()=>onSeleccionar(p)},
            el('div',{className:'posu-card-icon'},p.emoji||'✦'),el('strong',null,p.nombre),el('span',{className:'posu-card-meta'},p.categoriaLabel||''),el('div',{className:'posu-card-bottom'},el('span',{className:'posu-card-price'},Number(p.precio)>0?peso(p.precio):'Elegir opciones'),el('span',{className:'posu-card-plus'},'+'))
          ))):el('div',{className:'posu-empty-results'},texto?'No hay productos con ese nombre.':'Esta categoría todavía no tiene productos.')
        )
      ),
      el('aside',{className:'posu-ticket','aria-label':'Pedido actual'},
        el('div',{className:'posu-ticket-head'},el('div',null,el('h2',null,'Pedido'),el('small',null,articulos===1?'1 artículo':articulos+' artículos')),el('button',{className:'posu-delete-all',type:'button',disabled:!articulos,onClick:()=>{if(!confirmandoVaciar){setConfirmandoVaciar(true);return;}setOrden([]);setConfirmandoVaciar(false);},title:'Vaciar pedido'},confirmandoVaciar?'Confirmar':'🗑')),
        confirmandoVaciar&&el('button',{type:'button',className:'posu-cancel-clear',onClick:()=>setConfirmandoVaciar(false)},'Cancelar vaciado'),
        el('div',{className:'posu-ticket-items'},gruposPedido.length?gruposPedido.map(g=>el('div',{key:g.key,className:'posu-line'},
          el('div',{className:'posu-line-top'},el('strong',null,g.item.nombre),el('b',null,peso(g.importe))),
          (g.item.detalle||g.item.paraLlevar)&&el('div',{className:'posu-line-note'},[g.item.detalle,g.item.paraLlevar].filter(Boolean).join(' · ')),
          el('div',{className:'posu-line-controls'},el('div',{className:'posu-qty'},
            el('button',{type:'button',onClick:()=>quitarUno(g.key),'aria-label':'Quitar uno'},'−'),el('span',null,g.cantidad),
            el('button',{type:'button',disabled:!!(g.item.esPromo||g.item.esDescuento||g.item.esEnvio),onClick:()=>agregarUno(g.item),'aria-label':'Agregar uno'},'+')),
            el('button',{type:'button',className:'posu-remove-line',onClick:()=>quitarUno(g.key)},'Quitar')
          )
        )):el('div',{className:'posu-ticket-empty'},el('span',null,'🛒'),el('strong',null,'Aún no hay productos'),el('small',null,'Selecciona un producto de la izquierda.'))),
        el('div',{className:'posu-bottom'},
          el('div',{className:'posu-subtotal'},el('span',null,'Subtotal'),el('strong',null,peso(total))),
          el('div',{className:'posu-total'},el('span',null,'Total'),el('strong',null,peso(total))),
          el('button',{type:'button',className:'posu-charge',disabled:!articulos||procesando,onClick:()=>onCobrar('')},procesando?'Procesando…':'Cobrar'),
          el('div',{className:'posu-pay-quick'},el('button',{type:'button',disabled:!articulos||procesando,onClick:()=>onCobrar('efectivo')},'💵 Efectivo'),el('button',{type:'button',disabled:!articulos||procesando,onClick:()=>onCobrar('clip')},'💳 Clip')),
          el('div',{className:'posu-day-short'},el('div',null,el('span',null,'Ventas · '+(fechaCorte||'fecha actual')),el('b',null,peso(ventasPeriodo))),el('div',null,el('span',null,'Efectivo neto · '+(fechaCorte||'fecha actual')),el('b',null,peso(efectivoPeriodo)))),
          onAlternarCorte&&el('button',{type:'button',className:'posu-corte-toggle',onClick:onAlternarCorte},mostrarCorte?'Ocultar corte':'Ver corte del día'),
          alertas.length>0&&el('div',{className:'posu-alert'},'⚠️ '+alertas.length+' insumos con existencias bajas')
        )
      )
    ),
    mostrarCorte&&el(CorteDia,{
      marca,tienda:tiendaId||marca,fecha:fechaCorte||fechaCaja(new Date()),
      ventas:ventasCorte,gastos:gastosCorte,
      onFecha:onCambiarFechaCorte,onCerrar:onAlternarCorte
    })
  );
}
