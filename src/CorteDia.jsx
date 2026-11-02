import React, {useState} from 'react';
import {resumenCaja,metodoGasto,etiquetaGasto,ZONA_CAJA,fechaCaja} from './corteCaja.mjs';
import './corteDia.css';
const e=React.createElement;
const peso=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n)||0);
const fechaHora=ts=>{try{return new Intl.DateTimeFormat('es-MX',{timeZone:ZONA_CAJA,hour:'2-digit',minute:'2-digit'}).format(new Date(ts));}catch{return '--:--';}};
const etiquetaMedio=m=>({efectivo:'Efectivo',tarjeta:'Tarjeta',transferencia:'Transferencia',sin_especificar:'Sin especificar',otro:'Otro medio'})[m]||m;
export default function CorteDia({marca,tienda,fecha,onFecha,ventas,gastos,onCerrar}){
  const [fondo,setFondo]=useState('');
  const [contado,setContado]=useState('');
  const r=resumenCaja(ventas,gastos,tienda,fecha);
  const valido=v=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=0;
  const esperado=valido(fondo)?Number(fondo)+r.efectivoNeto:null;
  const diferencia=esperado!==null&&valido(contado)?Math.round((Number(contado)-esperado)*100)/100:null;
  const cambiar=d=>{const x=new Date(fecha+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+d);onFecha(x.toISOString().slice(0,10));};
  function descargarCsv(){
    const filas=[['Fecha','Hora','Tipo','Descripcion','Metodo','Importe'],...r.gastos.map(g=>[fecha,fechaHora(g.timestamp),'Gasto',etiquetaGasto(g),etiquetaMedio(metodoGasto(g)),Number(g.monto)||0])];
    const texto=filas.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const blob=new Blob(['\uFEFF',texto],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`gastos_${tienda}_${fecha}.csv`;link.click();URL.revokeObjectURL(url);
  }
  function cifra(titulo,valor,nota){return e('div',{className:'corte-card'},e('small',null,titulo),e('strong',null,peso(valor)),nota&&e('span',null,nota));}
  function linea(nombre,valor){return e('div',{className:'corte-linea',key:nombre},e('span',null,nombre),e('b',null,peso(valor)));}
  return e('div',{className:'corte-backdrop',onClick:onCerrar},
    e('section',{className:'corte-dialog',role:'dialog','aria-modal':'true','aria-label':'Corte de caja',onClick:ev=>ev.stopPropagation()},
      e('header',{className:'corte-header'},e('div',null,e('h2',null,'Corte de caja'),e('p',null,'Consulta de movimientos · '+tienda+' · no registra cierre de turno')),e('button',{type:'button',onClick:onCerrar,'aria-label':'Cerrar'},'✕')),
      e('div',{className:'corte-datebar'},e('button',{type:'button',onClick:()=>cambiar(-1)},'‹ Día anterior'),e('input',{type:'date',value:fecha,max:fechaCaja(new Date()),onChange:ev=>onFecha(ev.target.value)}),e('button',{type:'button',onClick:()=>cambiar(1),disabled:fecha>=fechaCaja(new Date())},'Día siguiente ›')),
      e('div',{className:'corte-scroll'},
        e('div',{className:'corte-kpis'},cifra('Ventas vigentes',r.ventasBrutas,r.tickets+' tickets'),cifra('Gastos de caja',r.gastosTotales,r.gastos.length+' movimientos'),cifra('Efectivo neto',r.efectivoNeto,'Sin fondo inicial ni ajustes')),
        e('div',{className:'corte-sections'},
          e('div',{className:'corte-panel'},e('h3',null,'Ventas por forma de pago'),
            linea('Efectivo',r.efectivoVentas),linea('Transferencias',r.transferencias),linea('Clip bruto',r.clipBruto),linea('Comisión Clip estimada',r.clipComision),linea('Clip neto estimado',r.clipNeto),r.otrosMetodos!==0&&linea('Otros / plataformas',r.otrosMetodos),
            e('p',{className:'corte-note'},'El neto Clip no implica que el banco ya haya depositado. Las ventas reembolsadas quedan fuera del total de ventas vigentes.')
          ),
          e('div',{className:'corte-panel'},e('h3',null,'Salidas por forma de pago'),
            linea('Pagadas en efectivo',r.gastosEnEfectivo),linea('Pagadas con otros medios',r.gastosConOtroMedio),r.movimientosSinMetodo>0&&linea('Sin forma de pago registrada',r.gastosSinMetodo),linea('Total de gastos',r.gastosTotales),
            r.movimientosSinMetodo>0&&e('p',{className:'corte-warning'},`${r.movimientosSinMetodo} movimiento(s) sin forma de pago. No se descuentan del efectivo hasta aclararlos.`)
          )
        ),
        e('section',{className:'corte-panel'},
          e('details',null,
            e('summary',{style:{fontWeight:800,cursor:'pointer',color:'#173D77'}},`Ver ${r.ventas.length} venta(s) sumadas del ${fecha} · ${peso(r.ventasBrutas)}`),
            r.ventas.length?e('div',{className:'corte-gastos'},r.ventas.map((v,i)=>e('div',{className:'corte-gasto',key:v._dbId||v.timestamp+'-'+i},
              e('div',null,e('strong',null,`${v.metodo||'Sin método'} · ${fechaHora(v.timestamp)}`),e('small',null,(v.items||[]).map(it=>it.nombre).slice(0,3).join(', ')||'Venta registrada')),
              e('b',null,peso(v.total))
            ))):e('p',{className:'corte-empty'},'Sin ventas para este día y sucursal.')
          )
        ),
        e('section',{className:'corte-panel'},e('div',{className:'corte-section-head'},e('h3',null,'Detalle de cada gasto'),e('button',{type:'button',onClick:descargarCsv,disabled:r.gastos.length===0},'Exportar CSV')),
          r.gastos.length?e('div',{className:'corte-gastos'},r.gastos.slice().sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp)).map((g,i)=>e('div',{className:'corte-gasto',key:g._dbId||i},
            e('div',null,e('strong',null,etiquetaGasto(g)),e('small',null,`${fechaHora(g.timestamp)} · ${etiquetaMedio(metodoGasto(g))}`)),e('b',null,peso(g.monto))
          ))):e('p',{className:'corte-empty'},'No hay gastos de caja registrados para esta sucursal y fecha.')
        ),
        e('section',{className:'corte-panel'},e('h3',null,'Comprobación de efectivo (opcional)'),
          e('p',{className:'corte-note'},'El fondo inicial y el efectivo contado se usan solo para esta comprobación. No se guardan como cierre real.'),
          e('div',{className:'corte-inputs'},e('label',null,'Fondo inicial',e('input',{type:'number',inputMode:'decimal',min:0,value:fondo,onChange:ev=>setFondo(ev.target.value),placeholder:'$ 0.00'})),e('label',null,'Efectivo contado',e('input',{type:'number',inputMode:'decimal',min:0,value:contado,onChange:ev=>setContado(ev.target.value),placeholder:'$ 0.00'}))),
          esperado!==null&&linea('Efectivo esperado',esperado),diferencia!==null&&e('div',{className:'corte-diferencia'},linea(diferencia===0?'Sin diferencia':diferencia<0?'Faltante':'Sobrante',diferencia)),
          e('p',{className:'corte-note'},'Este cálculo excluye gastos sin método de pago y no incluye entradas o retiros de caja que no se hayan registrado en el sistema.')
        )
      ),e('footer',{className:'corte-footer'},e('button',{type:'button',onClick:onCerrar},'Cerrar consulta'))
    )
  );
}
