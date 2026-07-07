// build 4 - julio 2026
import React, { useState } from "react";

var CLIP_RATE = 0.04176;
var VEGETAL_EXTRA = 20;
var PIN = "151118";
var PIN_REEMBOLSO = "151118";
var META_MP = 0.32;

function fmt(n){return new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n||0);}
function fmtC(n,u){return parseFloat(Number(n).toFixed(2))+" "+u;}
function fmtFecha(ts){var d=new Date(ts);return d.toLocaleDateString("es-MX",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});}
function hoy(){
  var d=new Date();
  var yyyy=d.getFullYear();
  var mm=("0"+(d.getMonth()+1)).slice(-2);
  var dd=("0"+d.getDate()).slice(-2);
  return yyyy+"-"+mm+"-"+dd;
}
function oz(n){return n*30;}
function pp(n){return n*0.33*30;}

var C={
  dark:"#7936AD",
  green:"#E172B3",greenL:"#FFD9EE",
  teal:"#52ABD8",tealL:"#E1F8FF",
  orange:"#D34633",
  red:"#D34633",redL:"#FFDCDC",
  purple:"#7936AD",purpleL:"#EFE3FF",
  indigo:"#52ABD8",indigoL:"#C3E9FC",
  amber:"#EFC42E",amberL:"#FFF2CF",
  white:"#ffffff",slate:"#2E4057",
};

var INSUMOS_INIT=[
  {id:"vaso_18oz",nombre:"Vasos 18oz",unidad:"pza",minimo:250},
  {id:"tapa_domo",nombre:"Tapas domo",unidad:"pza",minimo:250},
  {id:"popote",nombre:"Popotes",unidad:"pza",minimo:250},
  {id:"vaso_carton",nombre:"Vasos de carton",unidad:"pza",minimo:20},
  {id:"tapa_carton",nombre:"Tapas vaso carton",unidad:"pza",minimo:20},
  {id:"caja_crepa",nombre:"Cajas crepa individual",unidad:"pza",minimo:200},
  {id:"papel_alim",nombre:"Papel grado alimenticio",unidad:"pza",minimo:200},
  {id:"bolsa_papel",nombre:"Bolsas de papel",unidad:"pza",minimo:20},
  {id:"servilleta",nombre:"Servilletas",unidad:"pza",minimo:100},
  {id:"leche_deslac",nombre:"Leche deslactosada",unidad:"ml",minimo:4000},
  {id:"leche_vegetal",nombre:"Leche vegetal",unidad:"ml",minimo:960},
  {id:"leche_masa",nombre:"Leche para masa",unidad:"L",minimo:4},
  {id:"crema_lyncott",nombre:"Crema Lyncott",unidad:"g",minimo:300},
  {id:"crema_batida",nombre:"Crema batida",unidad:"g",minimo:500},
  {id:"philadelphia",nombre:"Philadelphia",unidad:"g",minimo:1050},
  {id:"mozzarella",nombre:"Mozzarella",unidad:"g",minimo:400},
  {id:"yogurt",nombre:"Yogurt natural",unidad:"g",minimo:600},
  {id:"cafe_grano",nombre:"Cafe en grano",unidad:"g",minimo:1000},
  {id:"base_neutra",nombre:"Base neutra (frappe)",unidad:"ml",minimo:960},
  {id:"base_cristal",nombre:"Base cristal",unidad:"ml",minimo:960},
  {id:"base_horchata",nombre:"Base de horchata",unidad:"ml",minimo:480},
  {id:"jar_manzana",nombre:"Jarabe manzana verde",unidad:"ml",minimo:480},
  {id:"jar_mora",nombre:"Jarabe mora azul",unidad:"ml",minimo:960},
  {id:"jar_fresa",nombre:"Jarabe de fresa",unidad:"ml",minimo:960},
  {id:"jar_mango",nombre:"Jarabe de mango",unidad:"ml",minimo:480},
  {id:"jar_sandia",nombre:"Jarabe de sandia",unidad:"ml",minimo:480},
  {id:"jar_pina",nombre:"Jarabe de pina",unidad:"ml",minimo:480},
  {id:"jar_chocolate",nombre:"Jarabe de chocolate",unidad:"ml",minimo:480},
  {id:"jar_coco",nombre:"Jarabe de coco",unidad:"ml",minimo:480},
  {id:"jar_banana",nombre:"Jarabe de banana",unidad:"ml",minimo:480},
  {id:"jar_avellana",nombre:"Jarabe de avellana",unidad:"ml",minimo:480},
  {id:"jar_caramelo",nombre:"Jarabe de caramelo",unidad:"ml",minimo:480},
  {id:"jar_limon",nombre:"Jarabe de limon",unidad:"ml",minimo:480},
  {id:"jar_frutos_rojos",nombre:"Jarabe frutos rojos",unidad:"ml",minimo:480},
  {id:"jar_cereza",nombre:"Jarabe de cereza",unidad:"ml",minimo:480},
  {id:"jar_taro",nombre:"Jarabe de taro",unidad:"ml",minimo:480},
  {id:"perlas_manzana",nombre:"Perlas manzana verde",unidad:"g",minimo:600},
  {id:"perlas_mora",nombre:"Perlas mora azul",unidad:"g",minimo:600},
  {id:"perlas_fresa",nombre:"Perlas de fresa",unidad:"g",minimo:600},
  {id:"perlas_mango",nombre:"Perlas de mango",unidad:"g",minimo:600},
  {id:"choc_polvo",nombre:"Chocolate en polvo",unidad:"g",minimo:480},
  {id:"matcha",nombre:"Matcha",unidad:"g",minimo:15},
  {id:"harina",nombre:"Harina",unidad:"g",minimo:760},
  {id:"azucar_masa",nombre:"Azucar para masa",unidad:"g",minimo:240},
  {id:"tisana_frutos",nombre:"Tisana de frutos rojos",unidad:"g",minimo:42},
  {id:"nibs_cacao",nombre:"Nibs de cacao",unidad:"g",minimo:40},
  {id:"fresa",nombre:"Fresa natural",unidad:"g",minimo:500},
  {id:"mango",nombre:"Mango",unidad:"g",minimo:500},
  {id:"platano",nombre:"Platano",unidad:"pza",minimo:2},
  {id:"pina",nombre:"Pina natural",unidad:"g",minimo:500},
  {id:"pina_almibar",nombre:"Pina en almibar",unidad:"pza",minimo:8},
  {id:"durazno_almibar",nombre:"Durazno en almibar",unidad:"pza",minimo:8},
  {id:"oreo",nombre:"Galleta Oreo",unidad:"g",minimo:1000},
  {id:"brownie",nombre:"Brownie",unidad:"g",minimo:300},
  {id:"kinder_delice",nombre:"Kinder Delice",unidad:"pza",minimo:8},
  {id:"gansito",nombre:"Gansito",unidad:"pza",minimo:8},
  {id:"tejate",nombre:"Tejate",unidad:"g",minimo:450},
  {id:"nutella",nombre:"Nutella",unidad:"g",minimo:1000},
  {id:"lechera",nombre:"Lechera",unidad:"g",minimo:200},
  {id:"cajeta",nombre:"Cajeta",unidad:"g",minimo:200},
  {id:"almendra",nombre:"Almendra",unidad:"g",minimo:200},
  {id:"nuez",nombre:"Nuez",unidad:"g",minimo:400},
  {id:"mermelada_fresa",nombre:"Mermelada de fresa",unidad:"g",minimo:200},
  {id:"mermelada_zarza",nombre:"Mermelada de zarzamora",unidad:"g",minimo:200},
  {id:"mermelada_temp",nombre:"Mermelada de temporada",unidad:"g",minimo:200},
  {id:"salsa_chocolate",nombre:"Salsa de chocolate",unidad:"ml",minimo:300},
  {id:"valentina",nombre:"Valentina",unidad:"ml",minimo:300},
  {id:"bufalo",nombre:"Bufalo",unidad:"ml",minimo:300},
  {id:"salsa_tomate",nombre:"Salsa de tomate",unidad:"g",minimo:300},
  {id:"especias_ital",nombre:"Especias italianas",unidad:"g",minimo:20},
  {id:"jamon",nombre:"Jamon",unidad:"g",minimo:200},
  {id:"pepperoni",nombre:"Pepperoni",unidad:"g",minimo:300},
  {id:"champi",nombre:"Champinones",unidad:"g",minimo:90},
  {id:"mant_masa",nombre:"Mantequilla para masa",unidad:"g",minimo:180},
  {id:"liquido_amarillo",nombre:"Liquido amarillo",unidad:"g",minimo:100},
  {id:"agua_mineral",nombre:"Agua mineral",unidad:"ml",minimo:4000},
  {id:"agua_natural",nombre:"Agua natural",unidad:"L",minimo:40},
  {id:"hielo",nombre:"Hielo",unidad:"kg",minimo:10},
  {id:"monk_fruit",nombre:"Monk Fruit",unidad:"sobres",minimo:10},
  {id:"chamoy",nombre:"Chamoy",unidad:"g",minimo:300},
  {id:"tajin",nombre:"Tajin",unidad:"g",minimo:159},
  {id:"coco_rayado",nombre:"Coco rayado",unidad:"g",minimo:10},
  {id:"tapioca",nombre:"Tapioca",unidad:"pza",minimo:5},
];

var MB=[
  {id:"harina",c:760/21},{id:"azucar_masa",c:240/21},
  {id:"leche_masa",c:2/21},{id:"mant_masa",c:90/21},
  {id:"liquido_amarillo",c:20/21},{id:"caja_crepa",c:1},{id:"papel_alim",c:1},
];

var R={
  "Oreo":[{id:"leche_deslac",c:118.3},{id:"oreo",c:59.1},{id:"choc_polvo",c:8.9},{id:"base_neutra",c:29.6},{id:"hielo",c:295.7},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Mango-Taro":[{id:"leche_deslac",c:118.3},{id:"jar_mango",c:118.3},{id:"mango",c:29.6},{id:"base_neutra",c:29.6},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Chocolate":[{id:"leche_deslac",c:118.3},{id:"choc_polvo",c:44.4},{id:"base_neutra",c:29.6},{id:"hielo",c:295.7},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Capuchino Regular":[{id:"leche_deslac",c:88.7},{id:"cafe_grano",c:59.1},{id:"base_neutra",c:59.1},{id:"hielo",c:295.7},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Capuchino Cajeta":[{id:"leche_deslac",c:88.7},{id:"cafe_grano",c:59.1},{id:"base_neutra",c:29.6},{id:"jar_caramelo",c:118.3},{id:"hielo",c:295.7},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Capuchino Banana":[{id:"leche_deslac",c:88.7},{id:"cafe_grano",c:59.1},{id:"base_neutra",c:29.6},{id:"jar_banana",c:118.3},{id:"hielo",c:295.7},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Brownie":[{id:"leche_deslac",c:118.3},{id:"brownie",c:73.9},{id:"jar_chocolate",c:59.1},{id:"base_neutra",c:29.6},{id:"choc_polvo",c:14.8},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Moca F":[{id:"leche_deslac",c:88.7},{id:"cafe_grano",c:59.1},{id:"jar_chocolate",c:29.6},{id:"base_neutra",c:38.4},{id:"choc_polvo",c:29.6},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Pina Colada":[{id:"leche_deslac",c:118.3},{id:"jar_pina",c:29.6},{id:"pina",c:29.6},{id:"jar_coco",c:118.3},{id:"base_neutra",c:29.6},{id:"coco_rayado",c:2},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "3 Leches":[{id:"lechera",c:44.4},{id:"cafe_grano",c:44.4},{id:"hielo",c:147.9},{id:"leche_deslac",c:236.6},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Caramelo":[{id:"hielo",c:147.9},{id:"leche_deslac",c:266.2},{id:"jar_caramelo",c:88.7},{id:"cafe_grano",c:44.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Avellana":[{id:"hielo",c:147.9},{id:"leche_deslac",c:266.2},{id:"jar_avellana",c:88.7},{id:"cafe_grano",c:44.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Latte Frio":[{id:"cafe_grano",c:44.4},{id:"hielo",c:236.6},{id:"leche_deslac",c:236.6},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Moca CF":[{id:"cafe_grano",c:44.4},{id:"choc_polvo",c:20.7},{id:"jar_chocolate",c:29.6},{id:"hielo",c:147.9},{id:"leche_deslac",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Americano":[{id:"cafe_grano",c:59.1},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Espresso":[{id:"cafe_grano",c:59.1},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Capuchino CC":[{id:"cafe_grano",c:44.4},{id:"leche_deslac",c:266.2},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Latte":[{id:"cafe_grano",c:29.6},{id:"leche_deslac",c:266.2},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Moca CC":[{id:"cafe_grano",c:38.4},{id:"choc_polvo",c:29.6},{id:"leche_deslac",c:266.2},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Chocolate CC":[{id:"leche_deslac",c:266.2},{id:"choc_polvo",c:266.2},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Latte Sin Azucar":[{id:"leche_vegetal",c:236.6},{id:"monk_fruit",c:1},{id:"cafe_grano",c:44.4},{id:"hielo",c:118.3},{id:"vaso_carton",c:1},{id:"tapa_carton",c:1}],
  "Fresa Platano":[{id:"yogurt",c:88.7},{id:"leche_deslac",c:29.6},{id:"base_neutra",c:29.6},{id:"fresa",c:59.1},{id:"platano",c:0.5},{id:"jar_fresa",c:29.6},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Mango Durazno":[{id:"yogurt",c:88.7},{id:"leche_deslac",c:29.6},{id:"base_neutra",c:29.6},{id:"mango",c:59.1},{id:"durazno_almibar",c:1},{id:"jar_mango",c:44.4},{id:"hielo",c:266.2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Slush Fresa":[{id:"agua_mineral",c:147.9},{id:"base_cristal",c:29.6},{id:"fresa",c:59.1},{id:"jar_fresa",c:147.9},{id:"hielo",c:266.2},{id:"chamoy",c:20},{id:"tajin",c:4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Slush Mango":[{id:"agua_mineral",c:147.9},{id:"base_cristal",c:29.6},{id:"mango",c:59.1},{id:"jar_mango",c:118.3},{id:"hielo",c:266.2},{id:"chamoy",c:20},{id:"tajin",c:4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Slush Pina":[{id:"agua_mineral",c:147.9},{id:"base_cristal",c:29.6},{id:"pina",c:59.1},{id:"jar_pina",c:118.3},{id:"hielo",c:266.2},{id:"chamoy",c:20},{id:"tajin",c:4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Pink Lemonade":[{id:"jar_fresa",c:pp(6)},{id:"perlas_fresa",c:oz(1)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Manzana Verde":[{id:"jar_manzana",c:pp(6)},{id:"perlas_manzana",c:oz(1)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Mora Azul":[{id:"jar_mora",c:pp(6)},{id:"perlas_mora",c:oz(1)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Soda Fresa":[{id:"jar_fresa",c:pp(6)},{id:"perlas_fresa",c:oz(1)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Soda Mango":[{id:"jar_mango",c:pp(6)},{id:"perlas_mango",c:oz(1)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Soda Frutos Rojos":[{id:"jar_frutos_rojos",c:oz(2)},{id:"hielo",c:oz(6)},{id:"perlas_fresa",c:oz(1)},{id:"agua_mineral",c:oz(8)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Sandia":[{id:"jar_sandia",c:pp(6)},{id:"agua_mineral",c:oz(10)},{id:"hielo",c:177.4},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Matchata":[{id:"base_horchata",c:oz(2)},{id:"leche_deslac",c:oz(6)},{id:"matcha",c:3},{id:"agua_natural",c:0.03},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Nube Tejate":[{id:"tejate",c:oz(3)},{id:"leche_deslac",c:oz(6)},{id:"hielo",c:oz(10)},{id:"base_neutra",c:oz(2)},{id:"nibs_cacao",c:2},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Mango Pop":[{id:"jar_coco",c:pp(4)},{id:"jar_mango",c:pp(1)},{id:"perlas_mango",c:oz(1)},{id:"mango",c:oz(1)},{id:"agua_mineral",c:oz(9)},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "Berry Chill":[{id:"tisana_frutos",c:14},{id:"agua_natural",c:0.39},{id:"vaso_18oz",c:1},{id:"tapa_domo",c:1},{id:"popote",c:1}],
  "DLiss":MB.concat([{id:"philadelphia",c:35},{id:"fresa",c:70},{id:"kinder_delice",c:1},{id:"nuez",c:15},{id:"nutella",c:15}]),
  "Ok":MB.concat([{id:"philadelphia",c:35},{id:"fresa",c:70},{id:"gansito",c:1},{id:"nutella",c:15}]),
  "Pink L":MB.concat([{id:"philadelphia",c:35},{id:"fresa",c:70},{id:"platano",c:0.5},{id:"almendra",c:15},{id:"lechera",c:10}]),
  "Pink C":MB.concat([{id:"philadelphia",c:35},{id:"fresa",c:70},{id:"platano",c:0.5},{id:"almendra",c:15},{id:"cajeta",c:15}]),
  "Cake Fresa":MB.concat([{id:"philadelphia",c:35},{id:"fresa",c:70},{id:"nuez",c:15},{id:"lechera",c:10},{id:"crema_batida",c:30}]),
  "Cake Durazno":MB.concat([{id:"philadelphia",c:35},{id:"durazno_almibar",c:1},{id:"nuez",c:15},{id:"lechera",c:10},{id:"crema_batida",c:30}]),
  "Chocolatisima":MB.concat([{id:"nutella",c:45},{id:"brownie",c:40},{id:"nuez",c:15}]),
  "Pepperonisima":MB.concat([{id:"philadelphia",c:35},{id:"jamon",c:25},{id:"pepperoni",c:25},{id:"mozzarella",c:40}]),
  "Hawaii":MB.concat([{id:"philadelphia",c:35},{id:"jamon",c:25},{id:"pina_almibar",c:1},{id:"mozzarella",c:40}]),
  "Crepizzima":MB.concat([{id:"salsa_tomate",c:30},{id:"especias_ital",c:0.5},{id:"pepperoni",c:25},{id:"champi",c:30},{id:"mozzarella",c:40}]),
  "__crepisima__":MB,
  "Tapioca":[{id:"tapioca",c:1}],
  "DLiss":       [{id:"fresa",c:55},{id:"philadelphia",c:35},{id:"nuez",c:12},{id:"kinder_delice",c:1},{id:"nutella",c:20}],
  "Ok":          [{id:"fresa",c:55},{id:"philadelphia",c:35},{id:"gansito",c:1},{id:"nutella",c:20}],
  "Pink L":      [{id:"fresa",c:55},{id:"philadelphia",c:35},{id:"almendra",c:12},{id:"platano",c:0.5},{id:"lechera",c:20}],
  "Pink C":      [{id:"fresa",c:55},{id:"philadelphia",c:35},{id:"almendra",c:12},{id:"platano",c:0.5},{id:"cajeta",c:20}],
  "Cake Fresa":  [{id:"fresa",c:55},{id:"philadelphia",c:35},{id:"nuez",c:12},{id:"lechera",c:10},{id:"crema_batida",c:15}],
  "Cake Durazno":[{id:"durazno_almibar",c:1},{id:"philadelphia",c:35},{id:"nuez",c:12},{id:"lechera",c:10},{id:"crema_batida",c:15}],
  "Chocolatisima":[{id:"nutella",c:35},{id:"brownie",c:50},{id:"nuez",c:12},{id:"nutella",c:20}],
  "Pepperonisima":[{id:"philadelphia",c:35},{id:"mozzarella",c:40},{id:"jamon",c:70},{id:"pepperoni",c:50}],
  "Hawaii":      [{id:"philadelphia",c:35},{id:"mozzarella",c:40},{id:"jamon",c:70},{id:"pina_almibar",c:1}],
  "Crepizzima":  [{id:"mozzarella",c:40},{id:"pepperoni",c:50},{id:"salsa_tomate",c:35},{id:"champi",c:20}],
};

var MENU=[
  {id:"frappes",nombre:"Frappés",emoji:"🥤",precio:70,tipo:"leche",prods:["Oreo","Mango-Taro","Chocolate","Capuchino Regular","Capuchino Cajeta","Capuchino Banana","Brownie","Moca F","Pina Colada"]},
  {id:"cafe_frio",nombre:"Café Frío",emoji:"🧋",precio:65,tipo:"leche",prods:["3 Leches","Caramelo","Avellana","Moca CF","Latte Frio"]},
  {id:"cafe_cal",nombre:"Café Caliente",emoji:"☕",precio:null,tipo:"leche_sel",prods:[{n:"Americano",p:40,sin:true},{n:"Espresso",p:30,sin:true},{n:"Capuchino CC",p:50},{n:"Latte",p:50},{n:"Moca CC",p:50},{n:"Chocolate CC",p:50}]},
  {id:"latte_sin",nombre:"Latte Sin Azúcar",emoji:"🍵",precio:70,tipo:"simple",prods:["Latte Sin Azucar"]},
  {id:"crepas_d",nombre:"Crepas Dulces",emoji:"🥞",precio:85,tipo:"crepa_fija",prods:[{n:"DLiss",lbl:"D'Liss"},{n:"Ok",lbl:"Ok!"},{n:"Pink",lbl:"Pink",op:["Lechera","Cajeta"],opLbl:"Untable",claves:{"Lechera":"Pink L","Cajeta":"Pink C"}},{n:"Cake",lbl:"Cake",op:["Fresa Natural","Durazno en Almibar"],opLbl:"Relleno",claves:{"Fresa Natural":"Cake Fresa","Durazno en Almibar":"Cake Durazno"}},{n:"Chocolatisima",lbl:"Chocolatísima"}]},
  {id:"crepas_s",nombre:"Crepas Saladas",emoji:"🥙",precio:85,tipo:"crepa_sal",prods:["Pepperonisima","Hawaii","Crepizzima"]},
  {id:"smoothies",nombre:"Smoothies",emoji:"🍓",precio:75,tipo:"simple",prods:["Fresa Platano","Mango Durazno"]},
  {id:"slush",nombre:"Slush",emoji:"🧊",precio:65,tipo:"simple",prods:["Slush Fresa","Slush Mango","Slush Pina"]},
  {id:"sodas",nombre:"Sodas Italianas",emoji:"🫧",precio:45,tipo:"simple",prods:["Pink Lemonade","Manzana Verde","Mora Azul","Soda Fresa","Soda Mango","Sandia","Soda Frutos Rojos"]},
  {id:"temporada",nombre:"Beb. Temporada",emoji:"✨",precio:null,tipo:"variable",prods:[{n:"Matchata",p:95},{n:"Nube Tejate",p:75},{n:"Mango Pop",p:65},{n:"Berry Chill",p:70}]},
  {id:"crepisimas",nombre:"Crepisimas",emoji:"🫔",precio:null,tipo:"builder",prods:[]},
  {id:"extras",nombre:"Extras",emoji:"⭐",precio:null,tipo:"simple",prods:[{n:"Tapioca",lbl:"Tapioca",precio:20}]},
];

// ── AM-BURGER DATA ──────────────────────────────────────
var INSUMOS_AMB=[
  {id:"amb_carne",nombre:"Carne angus",unidad:"g",minimo:3000},
  {id:"amb_salchicha",nombre:"Salchicha",unidad:"pza",minimo:10},
  {id:"amb_tocino",nombre:"Tocino",unidad:"g",minimo:1000},
  {id:"amb_pan_parrillero",nombre:"Pan parrillero",unidad:"pza",minimo:20},
  {id:"amb_pan_brioche",nombre:"Pan brioche",unidad:"pza",minimo:12},
  {id:"amb_pan_hotdog",nombre:"Pan hotdog",unidad:"pza",minimo:10},
  {id:"amb_q_americano",nombre:"Queso americano",unidad:"rebanada",minimo:30},
  {id:"amb_q_manchego",nombre:"Queso manchego",unidad:"rebanada",minimo:15},
  {id:"amb_lechuga",nombre:"Lechuga",unidad:"porcion",minimo:20},
  {id:"amb_tomate",nombre:"Tomate",unidad:"g",minimo:500},
  {id:"amb_cebolla",nombre:"Cebolla",unidad:"pza",minimo:5},
  {id:"amb_aguacate",nombre:"Aguacate",unidad:"pza",minimo:4},
  {id:"amb_limon",nombre:"Limon",unidad:"g",minimo:120},
  {id:"amb_pina_almibar",nombre:"Pina en almibar",unidad:"rebanada",minimo:5},
  {id:"amb_chile_jalapeno",nombre:"Chile jalapeno",unidad:"g",minimo:1000},
  {id:"amb_mayonesa",nombre:"Mayonesa",unidad:"g",minimo:500},
  {id:"amb_catsup",nombre:"Catsup",unidad:"g",minimo:300},
  {id:"amb_mostaza",nombre:"Mostaza",unidad:"g",minimo:100},
  {id:"amb_pepinillo",nombre:"Pepinillos",unidad:"g",minimo:200},
  {id:"amb_liq_pepinillo",nombre:"Liquido de pepinillo",unidad:"ml",minimo:50},
  {id:"amb_ajo_polvo",nombre:"Ajo en polvo",unidad:"g",minimo:50},
  {id:"amb_refresco",nombre:"Refresco",unidad:"pza",minimo:5},
  {id:"amb_horchata",nombre:"Agua de horchata",unidad:"pza",minimo:5},
  {id:"amb_jamaica",nombre:"Agua de jamaica",unidad:"pza",minimo:5},
  {id:"amb_agua_bot",nombre:"Agua embotellada",unidad:"pza",minimo:5},
  {id:"amb_papas",nombre:"Papas a la francesa",unidad:"g",minimo:3000},
  {id:"amb_vaso_papas",nombre:"Vaso para papas",unidad:"pza",minimo:25},
  {id:"amb_lemonpepper",nombre:"Lemon pepper",unidad:"g",minimo:100},
  {id:"amb_sal",nombre:"Sal",unidad:"g",minimo:200},
  {id:"amb_aceite",nombre:"Aceite para freir",unidad:"L",minimo:5},
  {id:"amb_mantequilla",nombre:"Mantequilla",unidad:"g",minimo:90},
  {id:"amb_agua_natural",nombre:"Agua natural",unidad:"ml",minimo:300},
  {id:"amb_papel_termico",nombre:"Papel termico",unidad:"pza",minimo:50},
  {id:"amb_bolsa_papel",nombre:"Bolsa de papel",unidad:"pza",minimo:10},
  {id:"amb_guacamole",nombre:"Guacamole",unidad:"g",minimo:500},
  {id:"amb_chicharron_jal",nombre:"Chicharron jalapeño",unidad:"g",minimo:300},
  {id:"amb_aderezo",nombre:"Aderezo especial",unidad:"g",minimo:300},
  {id:"amb_cebolla_caramelizada",nombre:"Cebolla caramelizada",unidad:"g",minimo:200},
];
function mkInsumosAmb(){return INSUMOS_AMB.map(function(i){return Object.assign({},i,{stock:0});});}

var AD=[
  {id:"amb_mayonesa",c:24.603},{id:"amb_pepinillo",c:3.175},{id:"amb_liq_pepinillo",c:0.476},
  {id:"amb_mostaza",c:0.794},{id:"amb_catsup",c:0.952},{id:"amb_ajo_polvo",c:0.079},
];
var GU=[
  {id:"amb_aguacate",c:0.08},{id:"amb_limon",c:2.4},{id:"amb_agua_natural",c:6},{id:"amb_sal",c:0.8},
];
var PP=[
  {id:"amb_papas",c:150},{id:"amb_lemonpepper",c:2.5},{id:"amb_sal",c:2.5},{id:"amb_aceite",c:0.05},
,{id:"amb_vaso_papas",c:1}];
var BP=[{id:"amb_pan_parrillero",c:1},{id:"amb_carne",c:100}];
var BB=[{id:"amb_pan_brioche",c:1},{id:"amb_carne",c:100}];

var R_AMB={
  "Chaoo":BP.concat([{id:"amb_q_americano",c:1},{id:"amb_q_manchego",c:1},{id:"amb_chile_jalapeno",c:50},{id:"amb_lechuga",c:1}]).concat(GU).concat([{id:"amb_papel_termico",c:1}]),
  "Patrona":BP.concat(AD).concat([{id:"amb_q_americano",c:1},{id:"amb_tocino",c:30},{id:"amb_salchicha",c:1},{id:"amb_tomate",c:66},{id:"amb_lechuga",c:1}]).concat([{id:"amb_papel_termico",c:1}]),
  "Piniazo":BP.concat(AD).concat([{id:"amb_q_americano",c:1},{id:"amb_pina_almibar",c:1},{id:"amb_cebolla",c:0.25},{id:"amb_lechuga",c:1}]).concat([{id:"amb_papel_termico",c:1}]),
  "Light":BP.concat(AD).concat([{id:"amb_q_americano",c:1},{id:"amb_tomate",c:66},{id:"amb_lechuga",c:1}]).concat([{id:"amb_papel_termico",c:1}]),
  "Pica Pica":BB.concat(AD).concat([{id:"amb_q_americano",c:1},{id:"amb_tocino",c:30},{id:"amb_chile_jalapeno",c:50}]).concat([{id:"amb_papel_termico",c:1}]),
  "Caramel":BB.concat([{id:"amb_q_americano",c:1},{id:"amb_tocino",c:30},{id:"amb_cebolla",c:0.15}]).concat([{id:"amb_papel_termico",c:1}]),
  "Que Eso":BB.concat([{id:"amb_q_manchego",c:1},{id:"amb_q_americano",c:1},{id:"amb_tocino",c:30}]).concat([{id:"amb_papel_termico",c:1}]),
  "Mega":[{id:"amb_pan_hotdog",c:1},{id:"amb_salchicha",c:1},{id:"amb_chile_jalapeno",c:50},{id:"amb_tocino",c:30},{id:"amb_tomate",c:66},{id:"amb_cebolla",c:0.15}].concat(GU).concat([{id:"amb_papel_termico",c:1}]),
  "Jochis":[{id:"amb_pan_hotdog",c:1},{id:"amb_salchicha",c:1},{id:"amb_q_manchego",c:1},{id:"amb_tocino",c:30},{id:"amb_tomate",c:66},{id:"amb_cebolla",c:0.15},{id:"amb_papel_termico",c:1},{id:"amb_papel_termico",c:1}],
  "Plano":[{id:"amb_pan_hotdog",c:1},{id:"amb_salchicha",c:1},{id:"amb_tomate",c:66},{id:"amb_cebolla",c:0.15},{id:"amb_papel_termico",c:1}],
  "Papas":PP,
  "Bebida":[{id:"amb_refresco",c:1}],
  "Horchata":[{id:"amb_horchata",c:1}],
  "Jamaica":[{id:"amb_jamaica",c:1}],
  "Agua Bot":[{id:"amb_agua_bot",c:1}],
  "Extra Queso":    [{id:"amb_q_americano",c:1}],
  "Extra Tocino":   [{id:"amb_tocino",c:30}],
  "Extra Carne":    [{id:"amb_carne",c:100}],
  "Extra Guacamole":[{id:"amb_aguacate",c:0.08},{id:"amb_limon",c:2.4}]
}

var MENU_AMB=[
  {id:"hamburguesas",nombre:"Hamburguesas",emoji:"🍔",precio:null,tipo:"amb_burg",
   prods:[
     {n:"Chaoo",p:115},{n:"Patrona",p:120},{n:"Piniazo",lbl:"Piñazo",p:120},
     {n:"Light",p:99},{n:"Pica Pica",p:115},{n:"Caramel",p:110},{n:"Que Eso",lbl:"+Que Eso",p:115},
   ]},
  {id:"hotdogs",nombre:"Hot Dogs",emoji:"🌭",precio:null,tipo:"amb_hd",
   prods:[{n:"Mega",p:65},{n:"Jochis",p:70},{n:"Plano",p:55}]},
  {id:"papas",nombre:"Orden Papas Fritas",emoji:"🍟",precio:30,tipo:"amb_simple",
   prods:["Papas"]},
  {id:"bebidas",nombre:"Bebidas",emoji:"🥤",precio:30,tipo:"amb_beb",
   prods:[{n:"Bebida",lbl:"Refresco",rk:"Bebida"},{n:"Horchata",lbl:"Horchata",rk:"Horchata"},{n:"Jamaica",lbl:"Jamaica",rk:"Jamaica"},{n:"Agua Bot",lbl:"Agua Embotellada",rk:"Agua Bot"}]},
];

var EXTRAS_AMB=[
  {n:"Extra Queso Americano",precio:15,rec:[{id:"amb_q_americano",c:1}]},
  {n:"Extra Queso Manchego",precio:15,rec:[{id:"amb_q_manchego",c:1}]},
  {n:"Extra Tocino",precio:15,rec:[{id:"amb_tocino",c:30}]},
  {n:"Extra Carne",precio:40,rec:[{id:"amb_carne",c:100}]},
  {n:"Extra Guacamole",precio:20,rec:GU},
];

var PROMOS_AMB=[
  {id:"combo_simple",nombre:"Combo +Papas +Bebida",emoji:"🍟",tipo:"amb_combo_simple"},
  {id:"combo_2x2",nombre:"Combo 2en2 - $229",emoji:"2️⃣",tipo:"amb_combo_2x2"},
  {id:"combo_todo",nombre:"Pa Toderrimos - $499",emoji:"🎉",tipo:"amb_combo_todo"},
];

var PROMOS=[
  {id:"promo_cafe",nombre:"Lunes: 2x1 Cafes Calientes",emoji:"☕",tipo:"2x1_cafe"},
  {id:"promo_sodas",nombre:"Martes: 2 Sodas por $79",emoji:"🫧",tipo:"2sodas"},
  {id:"promo_cap",nombre:"Miercoles: 2 Capuchinos por $99",emoji:"🥤",tipo:"2capuchinos"},
  {id:"promo_crepas",nombre:"Jueves: 2 Crepisimas por $95",emoji:"🥞",tipo:"2crepisimas"},
  {id:"promo_combo",nombre:"Combo Amiguisimo $115",emoji:"🎉",tipo:"combo_amiguisimo"},
];

var CAFES_CAL=["Americano","Espresso","Capuchino CC","Latte","Moca CC","Chocolate CC"];
var PRECIOS_CAFE={"Americano":40,"Espresso":30,"Capuchino CC":50,"Latte":50,"Moca CC":50,"Chocolate CC":50};
var CAPUCHINOS=["Capuchino Regular","Capuchino Cajeta","Capuchino Banana"];
var SODAS_LIST=["Pink Lemonade","Manzana Verde","Mora Azul","Soda Fresa","Soda Mango","Sandia"];
var CREPAS_FIJAS_D=[{n:"DLiss",lbl:"D'Liss"},{n:"Ok",lbl:"Ok!"},{n:"Pink",lbl:"Pink",op:["Lechera","Cajeta"],opLbl:"Untable",claves:{"Lechera":"Pink L","Cajeta":"Pink C"}},{n:"Cake",lbl:"Cake",op:["Fresa Natural","Durazno en Almibar"],opLbl:"Relleno",claves:{"Fresa Natural":"Cake Fresa","Durazno en Almibar":"Cake Durazno"}},{n:"Chocolatisima",lbl:"Chocolatísima"}];
var CREPAS_FIJAS_S=[{n:"Pepperonisima",lbl:"Pepperonísima"},{n:"Hawaii",lbl:"Hawaii"},{n:"Crepizzima",lbl:"Crepizzíma"}];

var CD_UNTABLE_MP={"Merm. Fresa":{id:"mermelada_fresa",c:35},
  "Merm. Zarzamora":{id:"mermelada_zarza",c:35},
  "Merm. Temporada":{id:"mermelada_temp",c:35},
  "Nutella":{id:"nutella",c:35},
  "Philadelphia":{id:"philadelphia",c:35}};
var CD_RELLENO_MP={"Fresa Natural":{id:"fresa",c:55},
  "Platano":{id:"platano",c:0.5},
  "Pina en Almibar":{id:"pina_almibar",c:1},
  "Kinder Delice":{id:"kinder_delice",c:1},
  "Gansito":{id:"gansito",c:1},
  "Galleta Oreo":{id:"oreo",c:50},
  "Durazno en Almibar":{id:"durazno_almibar",c:1},
  "Jamon":{id:"jamon",c:70},
  "Pepperoni":{id:"pepperoni",c:50},
  "Mozzarella":{id:"mozzarella",c:40},
  "Champinones":{id:"champi",c:20}};
var CD_TOPPING_MP={"Salsa Chocolate":{id:"salsa_chocolate",c:20},
  "Nutella":{id:"nutella",c:20},
  "Crema Batida":{id:"crema_batida",c:20},
  "Cajeta":{id:"cajeta",c:20},
  "Lechera":{id:"lechera",c:20},
  "Nuez":{id:"nuez",c:12},
  "Almendra":{id:"almendra",c:12},
  "Costra Queso":{id:"mozzarella",c:40},
  "Salsa Picante":{id:"valentina",c:30}};

var CD={
  masas:["Dulce","Neutra"],
  untables:["Merm. Fresa","Merm. Zarzamora","Merm. Temporada","Nutella","Philadelphia"],
  rellenos:["Fresa Natural","Platano","Pina en Almibar","Kinder Delice","Gansito","Galleta Oreo","Durazno en Almibar","Jamon","Pepperoni","Mozzarella","Champinones"],
  toppings:["Salsa Chocolate","Nutella","Crema Batida","Cajeta","Lechera","Nuez","Almendra","Costra Queso","Salsa Picante"],
};

var TIPOS_GASTO=[
  ["insumo","📦 Compra insumo"],
  ["colaborador","👤 Colaborador"],
  ["tarjeta_migue","💳 Gasto T. Migue"],
  ["tarjeta_angel","💳 Gasto T. Angel"],
  ["personal","👫 Personal A&M"],
  ["otro","💸 Otro gasto"],
];

var OV={position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16};
var MD={background:"#fff",borderRadius:20,padding:24,width:"100%",maxWidth:440,boxShadow:"0 8px 40px rgba(0,0,0,.25)"};
function BS(bg,col,fl){return {flex:fl||1,padding:"13px",background:bg,color:col,border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer"};}
var LB={fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:6};
var IP={width:"100%",padding:"11px 13px",border:"1.5px solid #e0e0e0",borderRadius:9,fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
var SC={fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:8};
var CB={aspectRatio:"1",background:"#EFE3FF",border:"1.5px solid #7936AD",borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:4};
var PB={aspectRatio:"1",background:"#fff",border:"1.5px solid #e0e0e0",borderRadius:8,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:4,boxShadow:"0 1px 2px rgba(0,0,0,.04)"};

function re(type,props){
  var args=[type,props||{}];
  for(var i=2;i<arguments.length;i++)args.push(arguments[i]);
  return React.createElement.apply(React,args);
}

function SelectorLeche(props){
  var leche=props.leche,onChange=props.onChange;
  return re("div",{style:{marginBottom:16}},
    re("div",{style:LB},"Tipo de leche *"),
    re("div",{style:{display:"flex",gap:8}},
      ["Entera/Deslac","Vegetal"].map(function(t){
        var sel=leche===t;
        return re("button",{key:t,onClick:function(){onChange(t);},style:{flex:1,padding:"11px 6px",border:"2px solid "+(sel?C.teal:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.tealL:"#fff",color:sel?C.teal:"#888",fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
          re("span",null,t),t==="Vegetal"?re("span",{style:{fontSize:10,color:sel?C.teal:"#aaa"}},"+$20"):null
        );
      })
    )
  );
}

function SelectorParaLlevar(props){
  var val=props.val,onChange=props.onChange;
  return re("div",{style:{marginBottom:16}},
    re("div",{style:LB},"Para llevar o aqui?"),
    re("div",{style:{display:"flex",gap:8}},
      ["Aqui","Para llevar"].map(function(t){
        var sel=val===t;
        return re("button",{key:t,onClick:function(){onChange(t);},style:{flex:1,padding:"10px",border:"2px solid "+(sel?C.indigo:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.indigoL:"#fff",color:sel?C.indigo:"#666",fontSize:13}},t);
      })
    )
  );
}

function ModalProducto(props){
  var cat=props.cat,prod=props.prod,onAdd=props.onAdd,onClose=props.onClose;
  var nombre=typeof prod==="string"?prod:(prod.lbl||prod.n);
  var rKey=typeof prod==="string"?prod:prod.n;
  var precio=(typeof prod==="object"&&prod.p)?prod.p:(cat.precio||0);
  // Crepa salada o dulce fija: pide para llevar (y opciones si tiene)
  if(props.tipo==="crepa_sal"||props.tipo==="crepa_fija"){
    var precioCS=props.precio||cat.precio||85;
    var nombre2=typeof prod==="string"?prod:(prod.lbl||prod.n);
    var prodObj=typeof prod==="object"?prod:{n:nombre2};
    var sCS=useState("");var paraLlevarCS=sCS[0];var setParaLlevarCS=sCS[1];
    var sOp=useState("");var opCS=sOp[0];var setOpCS=sOp[1];
    var tieneOps=prodObj.op&&prodObj.op.length>0;
    function getRecetaKey(){
      if(tieneOps&&prodObj.claves&&opCS)return prodObj.claves[opCS]||nombre2;
      return nombre2;
    }
    function getNombre(){
      return nombre2+(opCS?" ("+opCS+")":"");
    }
    return re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},nombre2),
      re("div",{style:{fontSize:22,fontWeight:900,color:C.green,marginBottom:14}},fmt(precioCS)),
      tieneOps?re("div",{style:{marginBottom:14}},
        re("div",{style:LB},prodObj.opLbl||"Opcion"),
        re("div",{style:{display:"flex",gap:8}},
          prodObj.op.map(function(o){
            var sel=opCS===o;
            return re("button",{type:"button",key:o,onClick:function(){setOpCS(o);},
              style:{flex:1,padding:"10px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),
                borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,
                background:sel?C.purpleL:"#fff",color:sel?C.dark:"#888",fontSize:13}},o);
          })
        )
      ):null,
      re(SelectorParaLlevar,{val:paraLlevarCS,onChange:setParaLlevarCS}),
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(tieneOps&&!opCS)return;
          onAdd({nombre:getNombre(),precio:precioCS,recetaKey:getRecetaKey(),paraLlevar:paraLlevarCS,usaVegetal:false});
        },disabled:tieneOps&&!opCS,style:BS(tieneOps&&!opCS?"#ccc":C.dark,"#fff",2)},"Agregar")
      )
    ));
  }
  var necesitaLeche=cat.tipo==="leche"||(cat.tipo==="leche_sel"&&!(prod.sin));
  var tieneOp=prod.op&&prod.op.length>0;
  var s=useState({leche:"",opcion:"",paraLlevar:"",err:""});
  var v=s[0];var set=s[1];
  function upd(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  var precioFinal=precio+(v.leche==="Vegetal"?VEGETAL_EXTRA:0);
  var recetaKey=tieneOp&&v.opcion?((prod.claves&&prod.claves[v.opcion])||rKey):rKey;
  function confirmar(){
    if(necesitaLeche&&!v.leche){upd("err","Selecciona el tipo de leche");return;}
    if(tieneOp&&!v.opcion){upd("err","Selecciona: "+prod.opLbl);return;}
    var sufOp=v.opcion?" ("+v.opcion+")":"";
    var sufL=v.leche?" - "+(v.leche==="Vegetal"?"Vegetal":"Deslac"):"";
    onAdd({nombre:nombre+sufOp+sufL,precio:precioFinal,recetaKey:recetaKey,paraLlevar:v.paraLlevar,usaVegetal:v.leche==="Vegetal"});
  }
  return re("div",{style:OV},re("div",{style:MD},
    re("div",{style:{fontSize:20,fontWeight:900,color:C.dark,marginBottom:4}},nombre),
    re("div",{style:{fontSize:16,color:C.green,fontWeight:700,marginBottom:16}},fmt(precioFinal)),
    tieneOp?re("div",{style:{marginBottom:16}},
      re("div",{style:LB},prod.opLbl+" *"),
      re("div",{style:{display:"flex",gap:8}},prod.op.map(function(o){var sel=v.opcion===o;return re("button",{type:"button",key:o,onClick:function(){upd("opcion",o);},style:{flex:1,padding:"11px 8px",border:"2px solid "+(sel?C.green:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.greenL:"#fff",color:sel?C.green:"#888",fontSize:13}},o);}))
    ):null,
    necesitaLeche?re(SelectorLeche,{leche:v.leche,onChange:function(val){upd("leche",val);}}):null,
    re(SelectorParaLlevar,{val:v.paraLlevar,onChange:function(val){upd("paraLlevar",val);}}),
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    re("div",{style:{display:"flex",gap:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,style:BS(C.green,"#fff",2)},"Agregar")
    )
  ));
}

function ModalCrepisima(props){
  var onAdd=props.onAdd,onClose=props.onClose;
  var s=useState({masa:"",untables:[],rellenos:[],toppings:[],paraLlevar:"",err:""});
  var v=s[0];var set=s[1];
  function upd(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  function tog(k,item){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=p[k].includes(item)?p[k].filter(function(x){return x!==item;}):[].concat(p[k],[item]);return n;});}
  var precio=45+((v.untables.length>0?1:0)+v.rellenos.length+v.toppings.length)*15;
  function confirmar(){
    if(!v.masa){upd("err","Elige el tipo de masa");return;}
    var parts=["Masa "+v.masa];
    if(v.untables.length>0)parts.push("Untable: "+v.untables.join(", "));
    if(v.rellenos.length>0)parts.push("Relleno: "+v.rellenos.join(", "));
    if(v.toppings.length>0)parts.push("Topping: "+v.toppings.join(", "));
    onAdd({nombre:"Crepisima",precio:precio,detalle:parts.join(" | "),paraLlevar:v.paraLlevar,recetaKey:"__crepisima__",crepUntables:v.untables,crepRellenos:v.rellenos,crepToppings:v.toppings});
  }
  function Sec(sp){
    return re("div",{style:{marginBottom:16}},
      re("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
        re("div",{style:{background:sp.color,color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}},"Paso "+sp.paso),
        re("span",{style:{fontSize:13,fontWeight:700,color:"#555"}},sp.titulo+(sp.maxSel?" (max "+sp.maxSel+")":"")),
        sp.nota?re("span",{style:{fontSize:11,color:C.teal,fontWeight:700,marginLeft:"auto"}},sp.nota):re("span",{style:{fontSize:11,color:"#aaa",marginLeft:"auto"}},"+$15 c/u")
      ),
      re("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
        sp.items.map(function(item){var s=sp.sel.includes(item);return re("button",{key:item,onClick:function(){sp.onTog(item);},style:{padding:"7px 12px",border:"2px solid "+(s?sp.color:"#e0e0e0"),borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:s?700:400,background:s?sp.color:"#fff",color:s?"#fff":"#666"}},item);})
      )
    );
  }
  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:520,maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{position:"sticky",top:0,background:"#fff",paddingBottom:10,zIndex:1}},
      re("div",{style:{fontSize:20,fontWeight:900,color:C.dark}},"Crepisima"),
      re("div",{style:{fontSize:22,fontWeight:900,color:C.green}},fmt(precio))
    ),
    re("div",{style:{marginBottom:16}},
      re("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},
        re("div",{style:{background:C.dark,color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}},"Paso 1"),
        re("span",{style:{fontSize:13,fontWeight:700,color:"#555"}},"Masa * - $45")
      ),
      re("div",{style:{display:"flex",gap:8}},
        CD.masas.map(function(m){var sel=v.masa===m;return re("button",{key:m,onClick:function(){upd("masa",m);},style:{flex:1,padding:"12px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#888",fontSize:14}},m);})
      )
    ),
    Sec({titulo:"Untable(s)",paso:2,items:CD.untables,sel:v.untables,onTog:function(i){if(v.untables.length>=2&&!v.untables.includes(i))return;tog("untables",i);},color:C.teal,maxSel:2,nota:v.untables.length===2?"Media porcion c/u (17.5g)":""}),
    Sec({titulo:"Relleno(s)",paso:3,items:CD.rellenos,sel:v.rellenos,onTog:function(i){tog("rellenos",i);},color:C.green}),
    Sec({titulo:"Topping(s)",paso:4,items:CD.toppings,sel:v.toppings,onTog:function(i){tog("toppings",i);},color:C.purple}),
    re(SelectorParaLlevar,{val:v.paraLlevar,onChange:function(val){upd("paraLlevar",val);}}),
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    re("div",{style:{display:"flex",gap:10,position:"sticky",bottom:0,background:"#fff",paddingTop:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,style:BS(C.green,"#fff",2)},"Agregar - "+fmt(precio))
    )
  ));
}

function ModalTicket(props){
  var venta=props.venta,onClose=props.onClose;
  if(!venta)return null;
  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:360,maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{textAlign:"center",marginBottom:16}},
      re("div",{style:{fontSize:22,fontWeight:900,color:C.dark}},"Crepisimo"),
      re("div",{style:{fontSize:12,color:"#aaa",marginTop:4}},fmtFecha(venta.timestamp))
    ),
    re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
      (venta.items||[]).map(function(item,i){
        return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}},
          re("div",{style:{flex:1,paddingRight:8}},
            re("div",{style:{fontWeight:600,color:C.dark}},item.nombre),
            item.paraLlevar?re("div",{style:{fontSize:11,color:"#aaa"}},item.paraLlevar):null,
            item.detalle?re("div",{style:{fontSize:11,color:"#aaa"}},item.detalle):null
          ),
          re("div",{style:{fontWeight:700,color:item.precio===0?"#aaa":item.precio<0?C.red:C.green,whiteSpace:"nowrap"}},
            item.precio===0?"GRATIS":item.precio<0?"-"+fmt(Math.abs(item.precio)):fmt(item.precio))
        );
      })
    ),
    re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
      re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:C.dark,marginBottom:8}},re("span",null,"TOTAL"),re("span",null,fmt(venta.total))),
      re("div",{style:{fontSize:13,color:"#888"}},
        "Metodo: "+(venta.metodo||"").toUpperCase()+(venta.metodo==="didi"?" (T. Migue)":venta.metodo==="mercadolibre"?" (T. Angel)":""),
        venta.estadoPago==="por_pagar"?re("div",{style:{marginTop:4,color:"#E65100",fontWeight:700,fontSize:12}},"POR PAGAR"):null,
        venta.comisionClip>0?re("span",{style:{color:C.purple,marginLeft:8}}," | Clip: "+fmt(venta.comisionClip)):null,
        venta.comisionDidi>0?re("div",{style:{marginTop:4,fontSize:12,color:C.red}},"Comision Didi: -"+fmt(venta.comisionDidi)):null,
        venta.cambio>0?re("div",{style:{marginTop:4}},"Cambio: "+fmt(venta.cambio)):null
      )
    ),
    re("div",{style:{textAlign:"center",fontSize:11,color:"#aaa",marginBottom:16}},"Gracias por su preferencia"),
    re("button",{onClick:function(){window.imprimirTicket&&window.imprimirTicket(venta,venta.tienda||"centro");},style:Object.assign({},BS(C.dark,"#fff"),{width:"100%",marginBottom:8})},"🖨️ Reimprimir"),
    re("button",{onClick:onClose,style:Object.assign({},BS("#f0f0f0","#666"),{width:"100%"})},"Cerrar")
  ));
}

function ModalDescuento(props){
  var onAdd=props.onAdd,onClose=props.onClose;
  var s=useState({monto:"",motivo:""});var v=s[0];var set=s[1];
  function upd(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  function confirmar(){
    if(!v.monto||isNaN(v.monto)||parseFloat(v.monto)<=0)return;
    onAdd({nombre:"Descuento libre"+(v.motivo?" - "+v.motivo:""),precio:-parseFloat(v.monto),recetaKey:"__descuento__",paraLlevar:"",usaVegetal:false,esDescuento:true});
  }
  return re("div",{style:OV},re("div",{style:MD},
    re("div",{style:{fontSize:20,fontWeight:900,color:C.dark,marginBottom:4}},"Descuento libre"),
    re("div",{style:{fontSize:13,color:"#888",marginBottom:20}},"Los insumos se descontaran del inventario pero no se cobrara nada."),
    re("div",{style:{marginBottom:14}},
      re("div",{style:LB},"Monto a descontar ($) *"),
      re("input",{type:"number",placeholder:"0.00",value:v.monto,onChange:function(e){upd("monto",e.target.value);},style:Object.assign({},IP,{fontSize:22,fontWeight:700,textAlign:"center"})})
    ),
    re("div",{style:{marginBottom:18}},
      re("div",{style:LB},"Motivo (opcional)"),
      re("input",{type:"text",placeholder:"Ej: consumo propio, cortesia...",value:v.motivo,onChange:function(e){upd("motivo",e.target.value);},style:IP})
    ),
    re("div",{style:{display:"flex",gap:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,style:BS(C.purple,"#fff",2)},"Aplicar descuento")
    )
  ));
}

function CrepaGrid(props2){
  var todasC=CREPAS_FIJAS_D.concat(CREPAS_FIJAS_S);
  var sel=props2.sel,onSel=props2.onSel;
  var selKey=sel?sel.key:"";
  return re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}},
    todasC.map(function(o){
      var k=typeof o==="string"?o:o.n;
      var lb=typeof o==="string"?o:(o.lbl||o.n);
      var isS=selKey===k;
      return re("button",{type:"button",key:k,
        onClick:function(){onSel({key:k,prod:typeof o==="object"?o:{n:k},nombre:typeof o==="object"?(o.lbl||o.n):k});},
        style:{padding:"9px 4px",border:"2px solid "+(isS?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",
          fontWeight:isS?800:500,background:isS?C.purpleL:"#fff",color:isS?C.dark:"#555",fontSize:11,textAlign:"center"}
      },lb);
    })
  );
}

function Modal2Crepas(props){
  var onAdd=props.onAdd,onClose=props.onClose;
  var s1=useState(null);var crepa1=s1[0];var setCrepa1=s1[1];
  var s2=useState(null);var crepa2=s2[0];var setCrepa2=s2[1];
  var s3=useState("");var op1=s3[0];var setOp1=s3[1];
  var s4=useState("");var op2=s4[0];var setOp2=s4[1];
  var s5=useState("");var llevar1=s5[0];var setLlevar1=s5[1];
  var s6=useState("");var llevar2=s6[0];var setLlevar2=s6[1];
  var s7=useState("");var err=s7[0];var setErr=s7[1];

  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:14}},"🥞 Jueves 2 Crepas - $95"),

    re("div",{style:LB},"Crepa 1"),
    re(CrepaGrid,{sel:crepa1,onSel:function(o){setCrepa1(o);setOp1("");}}),
    crepa1&&crepa1.prod&&crepa1.prod.op?re("div",{style:{marginBottom:8}},
      re("div",{style:LB},crepa1.prod.opLbl||"Variante"),
      re("div",{style:{display:"flex",gap:8}},
        crepa1.prod.op.map(function(o){
          var isS=op1===o;
          return re("button",{type:"button",key:o,onClick:function(){setOp1(o);},
            style:{flex:1,padding:"9px",border:"2px solid "+(isS?C.green:"#e0e0e0"),borderRadius:9,cursor:"pointer",
              fontWeight:isS?800:500,background:isS?C.greenL:"#fff",color:isS?C.green:"#888",fontSize:12}},o);
        })
      )
    ):null,
    re(SelectorParaLlevar,{val:llevar1,onChange:setLlevar1}),

    re("div",{style:LB},"Crepa 2"),
    re(CrepaGrid,{sel:crepa2,onSel:function(o){setCrepa2(o);setOp2("");}}),
    crepa2&&crepa2.prod&&crepa2.prod.op?re("div",{style:{marginBottom:8}},
      re("div",{style:LB},crepa2.prod.opLbl||"Variante"),
      re("div",{style:{display:"flex",gap:8}},
        crepa2.prod.op.map(function(o){
          var isS=op2===o;
          return re("button",{type:"button",key:o,onClick:function(){setOp2(o);},
            style:{flex:1,padding:"9px",border:"2px solid "+(isS?C.green:"#e0e0e0"),borderRadius:9,cursor:"pointer",
              fontWeight:isS?800:500,background:isS?C.greenL:"#fff",color:isS?C.green:"#888",fontSize:12}},o);
        })
      )
    ):null,
    re(SelectorParaLlevar,{val:llevar2,onChange:setLlevar2}),

    err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},err):null,

    re("div",{style:{display:"flex",gap:10,marginTop:14}},
      re("button",{type:"button",onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{type:"button",onClick:function(){
        if(!crepa1||!crepa2){setErr("Selecciona las 2 crepas");return;}
        var rk1=op1&&crepa1.prod.claves?crepa1.prod.claves[op1]||crepa1.key:crepa1.key;
        var rk2=op2&&crepa2.prod.claves?crepa2.prod.claves[op2]||crepa2.key:crepa2.key;
        var n1=(crepa1.nombre||crepa1.key)+(op1?" ("+op1+")":"");
        var n2=(crepa2.nombre||crepa2.key)+(op2?" ("+op2+")":"");
        onAdd([
          {nombre:n1,precio:95,recetaKey:rk1,paraLlevar:llevar1||"",usaVegetal:false},
          {nombre:n2+" (promo)",precio:0,recetaKey:rk2,paraLlevar:llevar2||"",usaVegetal:false}
        ],"Jueves 2 Crepas - $95");
      },style:BS(C.amber,"#333",2)},"Agregar - $95")
    )
  ));
}


function Modal2Crepisimas(props){
  var onAdd=props.onAdd,onClose=props.onClose;
  var MASAS2=["Dulce","Neutra"];
  var UNTABLES2=["Merm. Fresa","Merm. Zarzamora","Merm. Temporada","Nutella","Philadelphia"];
  var s1=useState("");var masa1=s1[0];var setMasa1=s1[1];
  var s2=useState([]);var untables1=s2[0];var setUntables1=s2[1];
  var s3=useState("");var masa2=s3[0];var setMasa2=s3[1];
  var s4=useState([]);var untables2=s4[0];var setUntables2=s4[1];
  var s5=useState("");var err=s5[0];var setErr=s5[1];

  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},"🥞 Jueves 2 Crepisimas - $95"),
    re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Masa y 2 untables por Crepisima (toca hasta 2)"),

    re("div",{style:{marginBottom:16}},
      re("div",{style:LB},"Crepisima 1"),
      re("div",{style:{marginBottom:8}},
        re("div",{style:{fontSize:11,color:"#888",marginBottom:4}},"Paso 1 - Masa"),
        re("div",{style:{display:"flex",gap:8}},
          MASAS2.map(function(m){
            var sel=masa1===m;
            return re("button",{type:"button",key:m,onClick:function(){setMasa1(m);},
              style:{flex:1,padding:"10px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,
                cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#888",fontSize:13}},m);
          })
        )
      ),
      re("div",null,
        re("div",{style:{fontSize:11,color:"#888",marginBottom:4}},"Paso 2 - Untable"),
        re("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
          UNTABLES2.map(function(u){
            var sel=untables1.indexOf(u)>=0;
            return re("button",{type:"button",key:u,onClick:function(){
              setUntables1(function(prev){
                if(prev.indexOf(u)>=0)return prev.filter(function(x){return x!==u;});
                if(prev.length>=2)return prev;
                return prev.concat([u]);
              });
            },style:{padding:"8px 12px",border:"2px solid "+(sel?C.teal:"#e0e0e0"),borderRadius:9,
              cursor:"pointer",fontWeight:sel?800:500,background:sel?C.tealL:"#fff",color:sel?C.teal:"#666",fontSize:12}},u);
          })
        )
      )
    ),

    re("div",{style:{marginBottom:16}},
      re("div",{style:LB},"Crepisima 2"),
      re("div",{style:{marginBottom:8}},
        re("div",{style:{fontSize:11,color:"#888",marginBottom:4}},"Paso 1 - Masa"),
        re("div",{style:{display:"flex",gap:8}},
          MASAS2.map(function(m){
            var sel=masa2===m;
            return re("button",{type:"button",key:m,onClick:function(){setMasa2(m);},
              style:{flex:1,padding:"10px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,
                cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#888",fontSize:13}},m);
          })
        )
      ),
      re("div",null,
        re("div",{style:{fontSize:11,color:"#888",marginBottom:4}},"Paso 2 - Untable"),
        re("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
          UNTABLES2.map(function(u){
            var sel=untables2.indexOf(u)>=0;
            return re("button",{type:"button",key:u,onClick:function(){
              setUntables2(function(prev){
                if(prev.indexOf(u)>=0)return prev.filter(function(x){return x!==u;});
                if(prev.length>=2)return prev;
                return prev.concat([u]);
              });
            },style:{padding:"8px 12px",border:"2px solid "+(sel?C.teal:"#e0e0e0"),borderRadius:9,
              cursor:"pointer",fontWeight:sel?800:500,background:sel?C.tealL:"#fff",color:sel?C.teal:"#666",fontSize:12}},u);
          })
        )
      )
    ),

    err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},err):null,

    re("div",{style:{display:"flex",gap:10,marginTop:14}},
      re("button",{type:"button",onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{type:"button",onClick:function(){
        if(!masa1||untables1.length===0||!masa2||untables2.length===0){setErr("Completa los 2 pasos de cada Crepisima");return;}
        var mp1=CD_UNTABLE_MP[untable1];
        var mp2=CD_UNTABLE_MP[untable2];
        var unt1Str=untables1.join(" + ");
          var unt2Str=untables2.join(" + ");
          onAdd([
            {nombre:"Crepisima ("+masa1+" + "+unt1Str+")",precio:95,recetaKey:"__crepisima__",
             paraLlevar:"",usaVegetal:false,crepUntables:untables1,crepRellenos:[],crepToppings:[]},
            {nombre:"Crepisima ("+masa2+" + "+unt2Str+") (promo)",precio:0,recetaKey:"__crepisima__",
             paraLlevar:"",usaVegetal:false,crepUntables:untables2,crepRellenos:[],crepToppings:[]}
          ],"Jueves 2 Crepisimas - $95");
      },style:BS(C.amber,"#333",2)},"Agregar - $95")
    )
  ));
}


function ModalPromo(props){
  var promo=props.promo,onAdd=props.onAdd,onClose=props.onClose;
  var tipo=promo.tipo;
  var s=useState({cafe1:"",cafe2:"",leche1:"",leche2:"",soda1:"",soda2:"",cap:"",lecheCap:"",crepa1:null,opCrepa1:"",llevar1:"",crepa2:null,opCrepa2:"",llevar2:"",crepaComb:null,opCrepaComb:"",llevarcomb:"",sodaComb:"",err:""});
  var v=s[0];var set=s[1];
  function upd(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  function SelBtn(sp){
    var opts=sp.opts,val=sp.val,onChange=sp.onChange,cols=sp.cols||2;
    return re("div",{style:{display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:6,marginBottom:10}},
      opts.map(function(o){
        var lbl=typeof o==="string"?o:(o.lbl||o.n),key=typeof o==="string"?o:(o.n),sel=val===key;
        return re("button",{type:"button",key:key,onClick:function(){onChange(key,o);},style:{padding:"9px 6px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.purpleL:"#fff",color:sel?C.dark:"#555",fontSize:12,textAlign:"center"}},lbl||key);
      })
    );
  }
  var body=null;
  if(tipo==="2x1_cafe"){
    body=re("div",null,
      re("div",{style:LB},"Cafe 1 (pagas este)"),
      SelBtn({opts:CAFES_CAL,val:v.cafe1,onChange:function(k){upd("cafe1",k);},cols:3}),
      (v.cafe1&&v.cafe1!=="Americano"&&v.cafe1!=="Espresso")?re(SelectorLeche,{leche:v.leche1,onChange:function(val){upd("leche1",val);}}):null,
      re("div",{style:LB},"Cafe 2 (gratis)"),
      SelBtn({opts:CAFES_CAL,val:v.cafe2,onChange:function(k){upd("cafe2",k);},cols:3}),
      (v.cafe2&&v.cafe2!=="Americano"&&v.cafe2!=="Espresso")?re(SelectorLeche,{leche:v.leche2,onChange:function(val){upd("leche2",val);}}):null,
      v.cafe1&&v.cafe2?re("div",{style:{background:C.amberL,borderRadius:10,padding:"10px 14px",marginTop:8,fontSize:13,color:"#555"}},"Cobras: "+fmt(Math.max(PRECIOS_CAFE[v.cafe1]||50,PRECIOS_CAFE[v.cafe2]||50))+" (mayor precio)"):null,
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.cafe1||!v.cafe2){upd("err","Selecciona los 2 cafes");return;}
          var p1=PRECIOS_CAFE[v.cafe1]||50,p2=PRECIOS_CAFE[v.cafe2]||50,mayor=Math.max(p1,p2);
          onAdd([
            {nombre:v.cafe1+(v.leche1?" - "+v.leche1:""),precio:mayor,recetaKey:v.cafe1,paraLlevar:"",usaVegetal:v.leche1==="Vegetal"},
            {nombre:v.cafe2+(v.leche2?" - "+v.leche2:"")+" (GRATIS 2x1)",precio:0,recetaKey:v.cafe2,paraLlevar:"",usaVegetal:v.leche2==="Vegetal"},
          ],"Lunes 2x1 Cafes - "+fmt(mayor));
        },style:BS(C.amber,"#333",2)},"Agregar promo")
      )
    );
  } else if(tipo==="2sodas"){
    body=re("div",null,
      re("div",{style:LB},"Soda 1"),SelBtn({opts:SODAS_LIST,val:v.soda1,onChange:function(k){upd("soda1",k);},cols:3}),
      re("div",{style:LB},"Soda 2"),SelBtn({opts:SODAS_LIST,val:v.soda2,onChange:function(k){upd("soda2",k);},cols:3}),
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.soda1||!v.soda2){upd("err","Selecciona los 2 sabores");return;}
          onAdd([{nombre:v.soda1,precio:79,recetaKey:v.soda1,paraLlevar:"",usaVegetal:false},{nombre:v.soda2+" (promo)",precio:0,recetaKey:v.soda2,paraLlevar:"",usaVegetal:false}],"Martes 2 Sodas - $79");
        },style:BS(C.amber,"#333",2)},"Agregar - $79")
      )
    );
  } else if(tipo==="2capuchinos"){
    body=re("div",null,
      re("div",{style:LB},"Sabor (ambos iguales)"),SelBtn({opts:CAPUCHINOS,val:v.cap,onChange:function(k){upd("cap",k);},cols:3}),
      re(SelectorLeche,{leche:v.lecheCap,onChange:function(val){upd("lecheCap",val);}}),
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.cap){upd("err","Selecciona el sabor");return;}
          onAdd([{nombre:v.cap+(v.lecheCap?" - "+v.lecheCap:""),precio:99,recetaKey:v.cap,paraLlevar:"",usaVegetal:v.lecheCap==="Vegetal"},{nombre:v.cap+(v.lecheCap?" - "+v.lecheCap:"")+" (promo)",precio:0,recetaKey:v.cap,paraLlevar:"",usaVegetal:v.lecheCap==="Vegetal"}],"Miercoles 2 Capuchinos - $99");
        },style:BS(C.amber,"#333",2)},"Agregar - $99")
      )
    );
  } else if(tipo==="2crepas"){
    return re(Modal2Crepas,{onAdd:onAdd,onClose:onClose});
  } else if(tipo==="2crepisimas"){
    return re(Modal2Crepisimas,{onAdd:onAdd,onClose:onClose});
  } else if(tipo==="combo_amiguisimo"){
    var todasCF=CREPAS_FIJAS_D.concat(CREPAS_FIJAS_S);
    body=re("div",null,
      re("div",{style:LB},"Crepa (del menu)"),
      SelBtn({opts:todasCF,val:v.crepaComb&&v.crepaComb.key,onChange:function(k,o){upd("crepaComb",{key:k,prod:typeof o==="object"?o:{n:k},nombre:typeof o==="object"?(o.lbl||o.n):k});upd("opCrepaComb","");},cols:3}),
      v.crepaComb&&v.crepaComb.prod&&v.crepaComb.prod.op?re("div",{style:{marginBottom:10}},
        re("div",{style:LB},v.crepaComb.prod.opLbl||"Variante"),
        re("div",{style:{display:"flex",gap:8}},v.crepaComb.prod.op.map(function(o){var sel=v.opCrepaComb===o;return re("button",{type:"button",key:o,onClick:function(){upd("opCrepaComb",o);},style:{flex:1,padding:"9px",border:"2px solid "+(sel?C.green:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.greenL:"#fff",color:sel?C.green:"#888",fontSize:12}},o);}))
      ):null,
      re(SelectorParaLlevar,{val:v.llevarcomb,onChange:function(val){upd("llevarcomb",val);}}),
      re("div",{style:LB},"Soda italiana"),
      SelBtn({opts:SODAS_LIST,val:v.sodaComb,onChange:function(k){upd("sodaComb",k);},cols:3}),
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.crepaComb||!v.sodaComb){upd("err","Selecciona la crepa y la soda");return;}
          var rk=v.opCrepaComb&&v.crepaComb.prod.claves?v.crepaComb.prod.claves[v.opCrepaComb]||v.crepaComb.key:v.crepaComb.key;
          var nc=(v.crepaComb.nombre||v.crepaComb.key)+(v.opCrepaComb?" ("+v.opCrepaComb+")":"");
          onAdd([{nombre:nc,precio:115,recetaKey:rk,paraLlevar:v.llevarcomb||"",usaVegetal:false},{nombre:v.sodaComb+" (combo)",precio:0,recetaKey:v.sodaComb,paraLlevar:"",usaVegetal:false}],"Combo Amiguisimo - $115");
        },style:BS(C.amber,"#333",2)},"Agregar - $115")
      )
    );
  }
  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},promo.emoji+" "+promo.nombre),
    re("div",{style:{height:2,background:C.amberL,borderRadius:2,marginBottom:16}}),
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    body
  ));
}

function ModalCobro(props){
  var total=props.total,onConfirmar=props.onConfirmar,onClose=props.onClose;
  var s=useState({metodo:"",efectivo:"",terminalClip:""});var v=s[0];var set=s[1];
  function upd(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  var clip=total*CLIP_RATE,neto=total-clip;
  var efNum=parseFloat(v.efectivo),efOk=v.efectivo&&!isNaN(efNum)&&efNum>=total;
  var cambio=efOk?efNum-total:0;
  function confirmar(){
    if(!v.metodo||(v.metodo==="efectivo"&&!efOk))return;
    onConfirmar({metodo:v.metodo,total:total,comisionClip:v.metodo==="clip"?clip:0,netoRecibido:v.metodo==="clip"?neto:total,comisionDidi:0,cambio:v.metodo==="efectivo"?cambio:0,estadoPago:v.metodo==="didi"?"por_pagar":"pagado",terminalClip:v.metodo==="clip"?v.terminalClip:""});
  }
  return re("div",{style:OV},re("div",{style:MD},
    re("div",{style:{fontSize:20,fontWeight:900,color:C.dark,marginBottom:4}},"Cobrar"),
    re("div",{style:{fontSize:32,fontWeight:900,color:C.green,marginBottom:18}},fmt(total)),
    re("div",{style:LB},"Metodo de pago"),
    re("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:16}},
      [["efectivo","💵","Efectivo"],["transferencia","📲","Transferencia"],["clip","💳","Clip"],["didi","🛵","Didi Food"]].map(function(x){
        var id=x[0],ico=x[1],l=x[2],sel=v.metodo===id;
        return re("button",{key:id,onClick:function(){upd("metodo",id);},style:{padding:"12px 6px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:sel?C.dark:"#fff",color:sel?"#fff":"#888",fontWeight:sel?800:500,fontSize:13}},
          re("span",{style:{fontSize:20}},ico),re("span",null,l));
      })
    ),
    v.metodo==="efectivo"?re("div",{style:{marginBottom:16}},
      re("div",{style:LB},"Con cuanto paga?"),
      re("input",{type:"number",placeholder:"0.00",value:v.efectivo,onChange:function(e){upd("efectivo",e.target.value);},style:Object.assign({},IP,{fontSize:24,fontWeight:700,textAlign:"center",padding:"14px"})}),
      efOk?re("div",{style:{marginTop:10,background:C.greenL,borderRadius:10,padding:14,textAlign:"center"}},re("div",{style:{fontSize:11,color:C.green,fontWeight:700,marginBottom:3}},"CAMBIO"),re("div",{style:{fontSize:32,fontWeight:900,color:C.green}},fmt(cambio))):null,
      v.efectivo&&!isNaN(efNum)&&efNum<total?re("div",{style:{marginTop:8,background:C.redL,borderRadius:9,padding:10,textAlign:"center",fontSize:14,color:C.red,fontWeight:700}},"Faltan "+fmt(total-efNum)):null
    ):null,
    v.metodo==="clip"?re("div",{style:{background:C.purpleL,borderRadius:10,padding:14,marginBottom:16}},
      re("div",{style:{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}},"Terminal"),
      re("div",{style:{display:"flex",gap:8,marginBottom:10}},
        [["migue","T. Migue"],["angel","T. Angel"]].map(function(x){var sel=v.terminalClip===x[0];return re("button",{key:x[0],onClick:function(){upd("terminalClip",x[0]);},style:{flex:1,padding:"9px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#888",fontSize:12}},x[1]);})
      ),
      re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}},re("span",{style:{color:"#666"}},"Comision Clip (4.176%)"),re("span",{style:{color:C.purple,fontWeight:700}},"-"+fmt(clip))),
      re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800}},re("span",{style:{color:C.purple}},"Neto a recibir"),re("span",{style:{color:C.purple}},fmt(neto)))
    ):null,
    v.metodo==="transferencia"?re("div",{style:{background:C.indigoL,borderRadius:10,padding:14,marginBottom:16,textAlign:"center",fontSize:15,color:C.indigo,fontWeight:700}},"Pago completo: "+fmt(total)):null,
    v.metodo==="didi"?re("div",{style:{background:"#FFF3E0",borderRadius:10,padding:14,marginBottom:16,borderLeft:"4px solid #FF6D00"}},
        re("div",{style:{fontSize:13,fontWeight:800,color:"#E65100",marginBottom:4}},"Didi Food — T. Migue"),
        re("div",{style:{fontSize:12,color:"#555"}},"Se registra como POR PAGAR. Ingresa el monto cuando Didi deposite en pedidos del dia.")
      ):null,
    re("div",{style:{display:"flex",gap:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,disabled:!v.metodo||(v.metodo==="efectivo"&&!efOk),style:BS((v.metodo&&(v.metodo!=="efectivo"||efOk))?C.green:"#ccc","#fff",2)},v.metodo==="didi"?"Registrar (por pagar)":"Confirmar venta")
    )
  ));
}

function ModalGasto(props){
  var insumos=props.insumos,onGuardar=props.onGuardar,onClose=props.onClose;
  var s=useState({tipo:"",insumoId:"",cantidad:"",monto:"",desc:"",busqueda:"",metodoPago:"efectivo",err:""});
  var v=s[0];var set=s[1];
  function updL(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  var insumoSel=insumos.find(function(i){return i.id===v.insumoId;});
  var filtrados=insumos.filter(function(i){return i.nombre.toLowerCase().indexOf(v.busqueda.toLowerCase())>=0;});

  // Tipos disponibles en POS (todos salen de caja del dia)
  var TIPOS=[
    ["insumo","Compra insumo (caja)"],
    ["colaborador","Pago colaborador"],
    ["operativo","Gasto operativo"],
    ["otro","Otro gasto"],
  ];

  function guardar(){
    if(!v.tipo||!v.monto){updL("err","Completa los campos requeridos");return;}
    if(v.tipo==="insumo"&&(!v.insumoId||!v.cantidad)){updL("err","Selecciona insumo y cantidad");return;}
    onGuardar({
      seccion:"caja",
      tipo:v.tipo,
      insumoId:v.tipo==="insumo"?v.insumoId:null,
      insumoNombre:v.tipo==="insumo"&&insumoSel?insumoSel.nombre:null,
      cantidad:v.tipo==="insumo"?parseFloat(v.cantidad):0,
      unidad:v.tipo==="insumo"&&insumoSel?insumoSel.unidad:null,
      monto:parseFloat(v.monto),
      desc:v.tipo!=="insumo"?v.desc:"",
      metodoPago:v.metodoPago||"efectivo",
      timestamp:new Date().toISOString(),
    });
  }

  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:6}},"Registrar gasto del dia"),
    re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Estos gastos salen del dinero de la caja de hoy y se reflejan en el corte."),
    re("div",{style:{marginBottom:14}},
      re("div",{style:LB},"Tipo *"),
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},
        TIPOS.map(function(x){var id=x[0],l=x[1],sel=v.tipo===id;return re("button",{key:id,onClick:function(){updL("tipo",id);},style:{padding:"10px 8px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.purpleL:"#fff",color:sel?C.dark:"#666",fontSize:12,textAlign:"center"}},l);})
      )
    ),
    v.tipo==="insumo"?re("div",null,
      re("div",{style:{marginBottom:10}},
        re("div",{style:LB},"Insumo *"),
        re("input",{placeholder:"Buscar...",value:v.busqueda,onChange:function(e){updL("busqueda",e.target.value);},style:IP}),
        v.busqueda?re("div",{style:{border:"1px solid #e0e0e0",borderRadius:9,marginTop:4,maxHeight:150,overflowY:"auto"}},
          filtrados.slice(0,8).map(function(i){var sel=v.insumoId===i.id;return re("div",{key:i.id,onClick:function(){updL("insumoId",i.id);updL("busqueda",i.nombre);},style:{padding:"9px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f5f5f5",background:sel?C.greenL:"#fff",color:sel?C.green:"#333"}},i.nombre+" ("+i.unidad+")");})
        ):null
      ),
      insumoSel?re("div",{style:{marginBottom:10}},
        re("div",{style:LB},"Cantidad ("+insumoSel.unidad+") *"),
        re("input",{type:"number",placeholder:"0",value:v.cantidad,onChange:function(e){updL("cantidad",e.target.value);},style:IP})
      ):null
    ):null,
    (v.tipo&&v.tipo!=="insumo")?re("div",{style:{marginBottom:14}},
      re("div",{style:LB},"Descripcion"),
      re("input",{type:"text",placeholder:"Descripcion del gasto",value:v.desc,onChange:function(e){updL("desc",e.target.value);},style:IP})
    ):null,
    re("div",{style:{marginBottom:18}},
      re("div",{style:LB},"Monto ($) *"),
      re("input",{type:"number",placeholder:"0.00",value:v.monto,onChange:function(e){updL("monto",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700})})
    ),
    re("div",{style:{marginBottom:14}},
      re("div",{style:LB},"Pago con"),
      re("div",{style:{display:"flex",gap:8}},
        [["efectivo","💵 Efectivo"],["tarjeta_migue","💳 T. Migue"],["tarjeta_angel","💳 T. Angel"]].map(function(x){
          var sel=v.metodoPago===x[0];
          return re("button",{key:x[0],onClick:function(){updL("metodoPago",x[0]);},style:{flex:1,padding:"9px 4px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:11}},x[1]);
        })
      )
    ),
    v.tipo==="insumo"?re("div",{style:{background:C.amberL,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#555"}},"Este gasto sale de la caja de hoy y el insumo sube al inventario automaticamente."):null,
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    re("div",{style:{display:"flex",gap:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:guardar,style:BS(C.red,"#fff",2)},"Registrar gasto")
    )
  ));
}

var EMPAQUE_IDS = ["vaso_18oz","tapa_domo","popote","vaso_carton","tapa_carton","caja_crepa","papel_alim","bolsa_papel","servilleta","amb_papel_termico","amb_bolsa_papel"];

function ModalEmpleado(props){
  var onAdd=props.onAdd,onClose=props.onClose;

  // State for regular products
  var s1=useState([]);var seleccion=s1[0];var setSeleccion=s1[1];
  // State for crepisima builder
  var s2=useState(false);var hacerCrep=s2[0];var setHacerCrep=s2[1];
  var s3=useState({masa:"",untables:[],rellenos:[],toppings:[]});var crep=s3[0];var setCrep=s3[1];

  function togCrep(k,item){setCrep(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=Array.isArray(p[k])?(p[k].includes(item)?p[k].filter(function(x){return x!==item;}):[].concat(p[k],[item])):item;return n;});}

  // All bebidas categories
  var BEBIDAS_CATS=[
    {titulo:"Frappés ($70)",prods:["Oreo","Mango-Taro","Chocolate","Capuchino Regular","Capuchino Cajeta","Capuchino Banana","Brownie","Moca F","Pina Colada"]},
    {titulo:"Café Frío ($65)",prods:["3 Leches","Caramelo","Avellana","Moca CF"]},
    {titulo:"Café Caliente",prods:["Americano","Espresso","Capuchino CC","Latte","Moca CC","Chocolate CC"]},
    {titulo:"Latte Sin Azúcar ($70)",prods:["Latte Sin Azucar"]},
    {titulo:"Smoothies ($75)",prods:["Fresa Platano","Mango Durazno"]},
    {titulo:"Slush ($65)",prods:["Slush Fresa","Slush Mango","Slush Pina"]},
    {titulo:"Sodas Italianas ($45)",prods:["Pink Lemonade","Manzana Verde","Mora Azul","Soda Fresa","Soda Mango","Sandia"]},
    {titulo:"Temporada",prods:["Matchata","Nube Tejate","Mango Pop","Berry Chill"]},
  ];

  // Crepas fijas (no crepisima)
  var CREPAS_FIJAS_EMP=[
    {n:"DLiss",lbl:"D'Liss"},{n:"Ok",lbl:"Ok!"},{n:"Pink L",lbl:"Pink Lechera"},
    {n:"Pink C",lbl:"Pink Cajeta"},{n:"Cake Fresa",lbl:"Cake Fresa"},
    {n:"Cake Durazno",lbl:"Cake Durazno"},{n:"Chocolatisima",lbl:"Chocolatísima"},
    {n:"Pepperonisima",lbl:"Pepperonísima"},{n:"Hawaii",lbl:"Hawaii"},{n:"Crepizzima",lbl:"Crepizzíma"},
  ];

  function toggleProd(nombre,rKey){
    setSeleccion(function(p){
      var existe=p.find(function(x){return x.nombre===nombre;});
      if(existe)return p.filter(function(x){return x.nombre!==nombre;});
      return p.concat([{nombre:nombre,recetaKey:rKey}]);
    });
  }

  function confirmar(){
    seleccion.forEach(function(item){
      onAdd({nombre:item.nombre+" (empleado)",precio:0,recetaKey:"__emp__"+item.recetaKey,paraLlevar:"",usaVegetal:false,esEmpleado:true,recetaBase:item.recetaKey});
    });
    if(hacerCrep&&crep.masa){
      var parts=["Masa "+crep.masa];
      if(crep.untables.length>0)parts.push("Untable: "+crep.untables.join(", "));
      if(crep.rellenos.length>0)parts.push("Relleno: "+crep.rellenos.join(", "));
      if(crep.toppings.length>0)parts.push("Topping: "+crep.toppings.join(", "));
      onAdd({nombre:"Crepisima (empleado)",precio:0,recetaKey:"__emp____crepisima__",detalle:parts.join(" | "),paraLlevar:"",usaVegetal:false,esEmpleado:true,recetaBase:"__crepisima__"});
    }
    onClose();
  }

  function BtnSel(nombre,rKey){
    var sel=!!seleccion.find(function(x){return x.nombre===nombre;});
    return re("button",{key:nombre,onClick:function(){toggleProd(nombre,rKey||nombre);},style:{padding:"6px 10px",border:"2px solid "+(sel?"#4CAF50":"#e0e0e0"),borderRadius:8,cursor:"pointer",background:sel?"#E8F5E9":"#fff",fontSize:11,fontWeight:sel?700:400,color:sel?"#2E7D32":"#555",marginRight:5,marginBottom:5}},nombre);
  }

  function SecCrep(titulo,paso,items,key,color){
    return re("div",{style:{marginBottom:12}},
      re("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6}},
        re("div",{style:{background:color,color:"#fff",borderRadius:16,padding:"2px 8px",fontSize:10,fontWeight:700}},"Paso "+paso),
        re("span",{style:{fontSize:12,fontWeight:700,color:"#555"}},titulo)
      ),
      re("div",{style:{display:"flex",flexWrap:"wrap"}},
        items.map(function(item){
          var sel=Array.isArray(crep[key])?crep[key].includes(item):crep[key]===item;
          return re("button",{key:item,onClick:function(){togCrep(key,item);},style:{padding:"6px 10px",border:"2px solid "+(sel?color:"#e0e0e0"),borderRadius:8,cursor:"pointer",background:sel?color:"#fff",color:sel?"#fff":"#555",fontSize:11,fontWeight:sel?700:400,marginRight:5,marginBottom:5}},item);
        })
      )
    );
  }

  var totalSel=seleccion.length+(hacerCrep&&crep.masa?1:0);

  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"92vh",overflowY:"auto"})},
    re("div",{style:{position:"sticky",top:0,background:"#fff",paddingBottom:8,zIndex:1}},
      re("div",{style:{fontSize:18,fontWeight:900,color:"#2E7D32",marginBottom:2}},"Consumo de empleado"),
      re("div",{style:{fontSize:11,color:"#888",marginBottom:8}},"Gratis — sin descuento de empaque"),
      totalSel>0?re("div",{style:{background:"#E8F5E9",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#2E7D32",fontWeight:700}},totalSel+" producto(s) seleccionado(s)"):null
    ),

    // CREPAS FIJAS
    re("div",{style:{borderBottom:"2px solid #f0f0f0",paddingBottom:12,marginBottom:12}},
      re("div",{style:{fontSize:12,fontWeight:800,color:C.dark,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}},"Crepas del menu"),
      re("div",{style:{display:"flex",flexWrap:"wrap"}},
        CREPAS_FIJAS_EMP.map(function(p){return BtnSel(p.lbl||p.n,p.n);})
      )
    ),

    // CREPISIMA BUILDER
    re("div",{style:{borderBottom:"2px solid #f0f0f0",paddingBottom:12,marginBottom:12}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
        re("div",{style:{fontSize:12,fontWeight:800,color:C.dark,textTransform:"uppercase",letterSpacing:.5}},"Crepisima"),
        re("button",{onClick:function(){setHacerCrep(function(p){return !p;});},style:{padding:"6px 12px",border:"2px solid "+(hacerCrep?C.dark:"#e0e0e0"),borderRadius:8,cursor:"pointer",background:hacerCrep?C.dark:"#fff",color:hacerCrep?"#fff":"#666",fontSize:11,fontWeight:700}},hacerCrep?"✓ Incluir":"+ Armar")
      ),
      hacerCrep?re("div",null,
        SecCrep("Masa *",1,CD.masas,"masa",C.dark),
        SecCrep("Untable(s)",2,CD.untables,"untables",C.teal),
        SecCrep("Relleno(s)",3,CD.rellenos,"rellenos",C.green),
        SecCrep("Topping(s)",4,CD.toppings,"toppings",C.purple)
      ):null
    ),

    // BEBIDAS
    re("div",{style:{marginBottom:14}},
      re("div",{style:{fontSize:12,fontWeight:800,color:C.dark,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}},"Bebidas"),
      BEBIDAS_CATS.map(function(cat){
        return re("div",{key:cat.titulo,style:{marginBottom:10}},
          re("div",{style:{fontSize:11,fontWeight:700,color:"#888",marginBottom:5}},cat.titulo),
          re("div",{style:{display:"flex",flexWrap:"wrap"}},
            cat.prods.map(function(p){return BtnSel(p,p);})
          )
        );
      })
    ),

    re("div",{style:{display:"flex",gap:10,position:"sticky",bottom:0,background:"#fff",paddingTop:8}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,disabled:totalSel===0,style:BS(totalSel>0?"#4CAF50":"#ccc","#fff",2)},"Agregar gratis ("+totalSel+")")
    )
  ));
}

function ModalPin(props){
  var onAcceso=props.onAcceso,onClose=props.onClose;
  var s=useState({pin:"",err:false});var v=s[0];var set=s[1];
  function updL(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  function presionar(d){if(v.pin.length<6){updL("pin",v.pin+d);updL("err",false);}}
  function verificar(){if(v.pin===PIN)onAcceso();else{updL("err",true);updL("pin","");}}
  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:300,textAlign:"center"})},
    re("div",{style:{fontSize:36,marginBottom:8}},"🔒"),
    re("div",{style:{fontSize:17,fontWeight:900,color:C.dark,marginBottom:4}},"Acceso restringido"),
    re("div",{style:{fontSize:13,color:"#aaa",marginBottom:20}},"PIN de 6 digitos"),
    re("div",{style:{display:"flex",gap:10,justifyContent:"center",marginBottom:18}},
      [0,1,2,3,4,5].map(function(i){return re("div",{key:i,style:{width:13,height:13,borderRadius:"50%",background:v.pin.length>i?C.dark:"#e0e0e0"}});})
    ),
    v.err?re("div",{style:{fontSize:13,color:C.red,marginBottom:10,fontWeight:600}},"PIN incorrecto"):null,
    re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}},
      [1,2,3,4,5,6,7,8,9,"",0,"<"].map(function(d,i){
        return re("button",{key:i,onClick:function(){if(d==="<")updL("pin",v.pin.slice(0,-1));else if(d!=="")presionar(String(d));},style:{padding:"14px 0",background:d===""?"transparent":"#f5f5f5",border:"none",borderRadius:10,fontSize:20,fontWeight:700,cursor:d===""?"default":"pointer",color:C.dark}},d==="<"?"⌫":d);
      })
    ),
    re("button",{onClick:verificar,disabled:v.pin.length<6,style:Object.assign({},BS(v.pin.length===6?C.dark:"#ccc","#fff"),{width:"100%",marginBottom:10})},"Entrar"),
    re("button",{onClick:onClose,style:{background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer"}},"Cancelar")
  ));
}

function ModalPinReembolso(props){
  var onAcceso=props.onAcceso,onClose=props.onClose;
  var s=useState({pin:"",err:false});var v=s[0];var set=s[1];
  function presionar(d){if(v.pin.length<6){set(function(p){return {pin:p.pin+d,err:false};});}}
  function verificar(){if(v.pin===PIN_REEMBOLSO)onAcceso();else{set({pin:"",err:true});}}
  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:300,textAlign:"center"})},
    re("div",{style:{fontSize:36,marginBottom:8}},"🔒"),
    re("div",{style:{fontSize:17,fontWeight:900,color:C.dark,marginBottom:4}},"PIN de reembolso"),
    re("div",{style:{fontSize:13,color:"#aaa",marginBottom:20}},"PIN de 6 digitos"),
    re("div",{style:{display:"flex",gap:10,justifyContent:"center",marginBottom:18}},
      [0,1,2,3,4,5].map(function(i){return re("div",{key:i,style:{width:13,height:13,borderRadius:"50%",background:v.pin.length>i?C.dark:"#e0e0e0"}});})
    ),
    v.err?re("div",{style:{fontSize:13,color:C.red,marginBottom:10,fontWeight:600}},"PIN incorrecto"):null,
    re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}},
      [1,2,3,4,5,6,7,8,9,"",0,"<"].map(function(d,i){return re("button",{key:i,onClick:function(){if(d==="<")set(function(p){return {pin:p.pin.slice(0,-1),err:false};});else if(d!=="")presionar(String(d));},style:{padding:"14px 0",background:d===""?"transparent":"#f5f5f5",border:"none",borderRadius:10,fontSize:20,fontWeight:700,cursor:d===""?"default":"pointer",color:C.dark}},d==="<"?"⌫":d);})
    ),
    re("button",{onClick:verificar,disabled:v.pin.length<6,style:Object.assign({},BS(v.pin.length===6?C.dark:"#ccc","#fff"),{width:"100%",marginBottom:10})},"Entrar"),
    re("button",{onClick:onClose,style:{background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer"}},"Cancelar")
  ));
}

function POS(props){
  var tiendaId=props.tiendaId,insumos=props.insumos,setInsumos=props.setInsumos,onVenta=props.onVenta,onGasto=props.onGasto,ventas=props.ventas,gastos=props.gastos;
  var s1=useState(null);var catActiva=s1[0];var setCat=s1[1];
  var s2=useState(false);var verPromos=s2[0];var setVerPromos=s2[1];
  var s3=useState([]);var orden=s3[0];var setOrden=s3[1];
  var s4=useState(null);var modalProd=s4[0];var setModalProd=s4[1];
  var s5=useState(false);var modalCrep=s5[0];var setModalCrep=s5[1];
  var s6=useState(null);var modalPromo=s6[0];var setModalPromo=s6[1];
  var s7=useState(false);var modalCobro=s7[0];var setModalCobro=s7[1];
  var s8=useState(false);var modalGasto=s8[0];var setModalGasto=s8[1];
  var s9=useState(false);var modalDesc=s9[0];var setModalDesc=s9[1];
  var s10=useState(false);var exito=s10[0];var setExito=s10[1];
  var s11=useState(false);var modalEmpleado=s11[0];var setModalEmpleado=s11[1];
  var s12=useState(false);var verCorte=s12[0];var setVerCorte=s12[1];
  var s13=useState(false);var modalPinCorte=s13[0];var setModalPinCorte=s13[1];
  var s14=useState(hoy());var fechaCorte=s14[0];var setFechaCorte=s14[1];

  var total=orden.reduce(function(s,i){return s+i.precio;},0);
  var totalDisplay=Math.max(0,total);

  function agregarItem(item){
    setOrden(function(p){return p.concat([Object.assign({},item,{id:Date.now()+Math.random()})]);});
    setModalProd(null);setModalCrep(false);setModalPromo(null);setModalDesc(false);
  }
  function agregarItems(items){
    var newItems=items.map(function(item){return Object.assign({},item,{id:Date.now()+Math.random(),esPromo:true});});
    setOrden(function(p){return p.concat(newItems);});
    setModalPromo(null);
  }
  function abrirProd(cat,prod){
    if(cat.tipo==="builder"){setModalCrep(true);return;}
    if(cat.tipo==="simple"){
      var n=typeof prod==="string"?prod:prod.n;
      var precioSimple=typeof prod==="object"&&(prod.precio||prod.p)?(prod.precio||prod.p):cat.precio;
      agregarItem({nombre:n,precio:precioSimple,recetaKey:n,paraLlevar:"",usaVegetal:false});return;
    }
    setModalProd({cat:cat,prod:prod});
  }
  function confirmarCobro(info){
    var deltas={};
    function addDelta(id,amt){deltas[id]=(deltas[id]||0)-amt;}
    orden.forEach(function(item){
      if(item.esDescuento)return;
      var recKey=item.esEmpleado?(item.recetaBase||""):item.recetaKey;
      var rec=R[recKey]||[];
      rec.forEach(function(r){if(item.esEmpleado&&EMPAQUE_IDS.indexOf(r.id)>=0)return;addDelta(r.id,r.c);});
      if(recKey==="__crepisima__"){
        var uts=item.crepUntables||[];var factor=uts.length>=2?0.5:1;
        uts.forEach(function(u){var mp=CD_UNTABLE_MP[u];if(mp)addDelta(mp.id,mp.c*factor);});
        (item.crepRellenos||[]).forEach(function(r){var mp=CD_RELLENO_MP[r];if(mp)addDelta(mp.id,mp.c);});
        (item.crepToppings||[]).forEach(function(t){var mp=CD_TOPPING_MP[t];if(mp)addDelta(mp.id,mp.c);});
      }
      if(!item.esEmpleado&&item.paraLlevar==="Para llevar")addDelta("caja_crepa",1);
    });
    updateStockDelta(tiendaId,Object.keys(deltas).map(function(id){return {id:id,delta:deltas[id]};}));
    setInsumos(function(prev){return prev.map(function(ins){return deltas[ins.id]!==undefined?Object.assign({},ins,{stock:Math.max(0,(ins.stock||0)+deltas[ins.id])}):ins;});});
    var descuentoTotal=orden.filter(function(i){return i.esDescuento;}).reduce(function(s,i){return s+Math.abs(i.precio);},0);
    var _venta=Object.assign({},info,{tienda:tiendaId,total:totalDisplay,descuento:descuentoTotal,items:orden,timestamp:new Date().toISOString()});
    onVenta(_venta);
    imprimirTicket(_venta,tiendaId);
    setOrden([]);setModalCobro(false);setCat(null);setVerPromos(false);
    setExito(true);setTimeout(function(){setExito(false);},2000);
  }
  function confirmarGasto(gasto){
    if(gasto.tipo==="insumo"&&gasto.insumoId){
      setInsumos(function(p){return p.map(function(i){return i.id===gasto.insumoId?Object.assign({},i,{stock:(i.stock||0)+gasto.cantidad}):i;});});
    }
    onGasto(Object.assign({},gasto,{tienda:tiendaId,seccion:"caja"}));
    setModalGasto(false);
  }
  var _hoyStr=fechaCorte;
  var ventasHoy=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===_hoyStr;})()&&v.estadoPago!=="reembolsado";});
  var _hoyStr=fechaCorte;
  var ventasHoy=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===_hoyStr;})()&&v.estadoPago!=="reembolsado";});
  var tv=ventasHoy.reduce(function(s,v){return s+v.total;},0);
  var tEf=ventasHoy.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var tTr=ventasHoy.filter(function(v){return v.metodo==="transferencia";}).reduce(function(s,v){return s+v.total;},0);
  var tCl=ventasHoy.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.netoRecibido;},0);
  var tComCl=ventasHoy.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.comisionClip;},0);
  var gastosCajaHoy=gastos.filter(function(g){return g.seccion==="caja"&&g.timestamp&&(function(){var d=new Date(g.timestamp);var ld=d.getFullYear()+"-"+('0'+(d.getMonth()+1)).slice(-2)+"-"+('0'+d.getDate()).slice(-2);return ld===_hoyStr;})();});
  var tGasCaja=gastosCajaHoy.reduce(function(s,g){return s+g.monto;},0);
  var tCol=gastosCajaHoy.filter(function(g){return g.tipo==="colaborador";}).reduce(function(s,g){return s+g.monto;},0);
  var efCaja=tEf-tGasCaja;
  var alertas=insumos.filter(function(i){return (i.stock||0)>0&&(i.stock||0)<=i.minimo;});
  var agotados=insumos.filter(function(i){return (i.stock||0)===0&&i.minimo>0;});

  function renderProds(cat){
    if(cat.tipo==="builder")return [re("button",{key:"crep",onClick:function(){abrirProd(cat,null);},style:PB},re("div",{style:{fontSize:28,marginBottom:4}},"🫔"),re("div",{style:{fontSize:12,fontWeight:800,color:C.dark,textAlign:"center"}},"Armar Crepisima"),re("div",{style:{fontSize:11,color:"#aaa",marginTop:3}},"desde $45"))];
    return cat.prods.map(function(prod,i){
      var nombre=typeof prod==="string"?prod:(prod.lbl||prod.n);
      var precio=typeof prod==="object"&&(prod.p||prod.precio)?(prod.p||prod.precio):cat.precio;
      var tieneLeche=cat.tipo==="leche"||(cat.tipo==="leche_sel"&&!(prod.sin));
      return re("button",{key:i,onClick:function(){abrirProd(cat,prod);},style:PB},
        re("div",{style:{fontSize:13,fontWeight:800,color:C.dark,textAlign:"center",lineHeight:1.2}},nombre),
        re("div",{style:{fontSize:12,color:C.green,fontWeight:700,marginTop:3}},fmt(precio)),
        tieneLeche?re("div",{style:{fontSize:10,color:"#aaa",marginTop:2}},"+$20 vegetal"):null,
        prod.op?re("div",{style:{fontSize:10,color:"#aaa",marginTop:2}},"elige variante"):null
      );
    });
  }

  return re("div",{style:{padding:"10px 10px 70px"}},
    exito?re("div",{style:{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#fff",padding:"12px 28px",borderRadius:50,fontWeight:800,fontSize:16,zIndex:300,whiteSpace:"nowrap"}},"Venta registrada"):null,

    !catActiva&&!verPromos?re("div",null,
      re("div",{style:{display:"flex",gap:8,marginBottom:14}},
        re("button",{onClick:function(){setVerPromos(true);},style:{flex:1,padding:10,background:C.amberL,color:"#333",border:"2px solid "+C.amber,borderRadius:12,fontWeight:800,fontSize:13,cursor:"pointer"}},"🎉 Promos"),
        re("button",{onClick:function(){setModalDesc(true);},style:{flex:1,padding:9,background:C.purpleL,color:C.dark,border:"2px solid "+C.purple,borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer"}},"🏷 Desc."),
        re("button",{onClick:function(){setModalEmpleado(true);},style:{flex:1,padding:9,background:"#E8F5E9",color:"#2E7D32",border:"2px solid #4CAF50",borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer"}},"👤 Empl."),
        re("button",{onClick:function(){setModalGasto(true);},style:{flex:1,padding:9,background:C.redL,color:C.red,border:"2px solid "+C.red,borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer"}},"+ Gasto")
      ),
      re("div",{style:SC},"Categorias"),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:10}},
        MENU.map(function(cat){return re("button",{key:cat.id,onClick:function(){setCat(cat);},style:CB},
          re("div",{style:{fontSize:22}},cat.emoji),
          re("div",{style:{fontSize:11,fontWeight:800,color:"#7936AD",marginTop:3,textAlign:"center",lineHeight:1.2}},cat.nombre),
          cat.precio?re("div",{style:{fontSize:11,color:"#aaa",marginTop:2}},fmt(cat.precio)):null
        );})
      )
    ):null,
    verPromos?re("div",null,
      re("button",{onClick:function(){setVerPromos(false);},style:{background:"none",border:"none",color:C.dark,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:12,padding:0}},"<- Menu"),
      re("div",{style:SC},"Promociones"),
      PROMOS.map(function(promo){return re("button",{key:promo.id,onClick:function(){setModalPromo(promo);},style:{background:C.amberL,border:"2px solid "+C.amber,borderRadius:12,cursor:"pointer",padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8,width:"100%"}},
        re("div",{style:{fontSize:28}},promo.emoji),
        re("div",{style:{flex:1,textAlign:"left"}},re("div",{style:{fontSize:14,fontWeight:800,color:C.dark}},promo.nombre)),
        re("div",{style:{fontSize:20,color:C.amber}},"->")
      );})
    ):null,
    catActiva?re("div",null,
      re("button",{onClick:function(){setCat(null);},style:{background:C.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:12,padding:"10px 18px",display:"flex",alignItems:"center",gap:8}},"← Volver a Categorías"),
      re("div",{style:SC},catActiva.emoji+" "+catActiva.nombre),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}},renderProds(catActiva))
    ):null,
    orden.length>0?re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Orden actual"),
      orden.map(function(item,i){
        return re("div",{key:item.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:i<orden.length-1?"1px solid #f5f5f5":"none"}},
          re("div",{style:{flex:1,paddingRight:8}},
            re("div",{style:{fontSize:14,fontWeight:600,color:item.esDescuento?C.purple:C.dark}},item.nombre),
            item.paraLlevar?re("div",{style:{fontSize:11,color:"#aaa",marginTop:1}},item.paraLlevar):null,
            item.detalle?re("div",{style:{fontSize:11,color:"#aaa",marginTop:1}},item.detalle):null,
            item.esPromo?re("div",{style:{fontSize:10,color:C.amber,fontWeight:700,marginTop:1}},"PROMO"):null,
            item.esDescuento?re("div",{style:{fontSize:10,color:C.purple,fontWeight:700,marginTop:1}},"DESCUENTO"):null
          ),
          re("div",{style:{display:"flex",alignItems:"center",gap:8,flexShrink:0}},
            re("div",{style:{fontSize:14,fontWeight:700,color:item.precio===0?"#aaa":item.precio<0?C.purple:C.green}},
              item.precio===0?"GRATIS":item.precio<0?"-"+fmt(Math.abs(item.precio)):fmt(item.precio)
            ),
            re("button",{onClick:function(){var idx=i;setOrden(function(p){return p.filter(function(_,j){return j!==idx;});});},style:{background:C.redL,border:"none",color:C.red,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,fontWeight:700}},"X")
          )
        );
      }),
      re("div",{style:{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"2px solid #f0f0f0"}},
        re("span",{style:{fontSize:16,fontWeight:800,color:C.dark}},"Total"),
        re("span",{style:{fontSize:20,fontWeight:900,color:C.green}},fmt(totalDisplay))
      ),
      total<0?re("div",{style:{fontSize:12,color:C.purple,marginTop:4,textAlign:"right"}},"Descuento aplicado"):null,
      re("button",{onClick:function(){setModalCobro(true);},style:{width:"100%",marginTop:12,padding:15,background:C.green,color:"#fff",border:"none",borderRadius:12,fontWeight:900,fontSize:17,cursor:"pointer"}},"Cobrar "+fmt(totalDisplay))
    ):null,
    re("button",{onClick:function(){setModalGasto(true);},style:{width:"100%",padding:13,background:"#fff",color:C.red,border:"2px solid "+C.red,borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:14}},"+ Registrar gasto del dia"),
    verCorte?re("div",{style:{background:C.dark,borderRadius:16,padding:18,color:"#fff"}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        re("div",{style:{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,opacity:.6}},"Corte del dia"),
        re("button",{onClick:function(){setVerCorte(false);},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}},"Ocultar")
      ),
      re("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()-1);setFechaCorte(d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2));},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:"pointer",fontWeight:800}},"‹"),
        re("div",{style:{flex:1,textAlign:"center"}},
          re("div",{style:{fontSize:12,color:"rgba(255,255,255,.9)",fontWeight:700}},fechaCorte===hoy()?"HOY - "+fechaCorte:new Date(fechaCorte+"T12:00:00").toLocaleDateString("es-MX",{weekday:"short",day:"2-digit",month:"short"})+" - "+fechaCorte)
        ),
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()+1);var nd=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);if(nd<=hoy())setFechaCorte(nd);},disabled:fechaCorte>=hoy(),style:{background:fechaCorte>=hoy()?"rgba(255,255,255,.05)":"rgba(255,255,255,.15)",border:"none",color:fechaCorte>=hoy()?"rgba(255,255,255,.2)":"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:fechaCorte>=hoy()?"default":"pointer",fontWeight:800}},"›")
      ),
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
        [["Ventas totales",tv,"#a5d6a7"],["Efectivo en caja",efCaja,efCaja>=0?"#a5d6a7":"#ef9a9a"],["Transferencias",tTr,"#90caf9"],["Clip (neto)",tCl,"#ce93d8"]].map(function(x){
          return re("div",{key:x[0],style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px"}},
            re("div",{style:{fontSize:11,opacity:.65,marginBottom:3}},x[0]),
            re("div",{style:{fontSize:17,fontWeight:900,color:x[2]}},fmt(x[1]))
          );
        })
      ),
      (tGasCaja>0||tComCl>0)?re("div",{style:{borderTop:"1px solid rgba(255,255,255,.12)",paddingTop:12,marginBottom:12}},
        tGasCaja>0?re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}},re("span",{style:{opacity:.7}},"Gastos de caja"),re("span",{style:{color:"#ef9a9a",fontWeight:700}},"-"+fmt(tGasCaja))):null,
        tComCl>0?re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13}},re("span",{style:{opacity:.7}},"Comision Clip"),re("span",{style:{color:"#ef9a9a",fontWeight:700}},"-"+fmt(tComCl))):null
      ):null,
      gastosCajaHoy.length>0?re("div",{style:{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:12}},
        re("div",{style:{fontSize:11,opacity:.5,marginBottom:8,textTransform:"uppercase"}},"Gastos de caja hoy"),
        gastosCajaHoy.map(function(g,i){
          var desc=g.tipo==="insumo"?"Insumo: "+(g.insumoNombre||"")+" ("+fmtC(g.cantidad,g.unidad)+")":g.tipo==="colaborador"?"Colab: "+(g.desc||""):g.tipo==="operativo"?"Operativo: "+(g.desc||""):"Otro: "+(g.desc||"");
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}},
            re("span",{style:{opacity:.75}},desc),re("span",{style:{color:"#ef9a9a"}},fmt(g.monto))
          );
        })
      ):null,
      ventas.length===0&&gastos.length===0?re("div",{style:{textAlign:"center",opacity:.35,fontSize:13}},"Sin movimientos hoy"):null
    ):re("button",{onClick:function(){setModalPinCorte(true);},style:{width:"100%",padding:"14px",background:C.dark,color:"#fff",border:"none",borderRadius:14,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:14}},re("span",null,"🔒"),re("span",null,"Ver corte del dia")),
    (alertas.length>0||agotados.length>0)?re("div",{style:{background:C.amberL,border:"2px solid "+C.amber,borderRadius:12,padding:"12px 14px",marginTop:14}},
      re("div",{style:{fontSize:12,fontWeight:800,color:C.amber,marginBottom:6}},"Alertas de inventario"),
      agotados.map(function(i){return re("div",{key:i.id,style:{fontSize:12,color:C.red,marginBottom:2}},"AGOTADO: "+i.nombre);}),
      alertas.map(function(i){return re("div",{key:i.id,style:{fontSize:12,color:C.amber,marginBottom:2}},"Stock bajo: "+i.nombre+" ("+fmtC(i.stock||0,i.unidad)+")");})
    ):null,
    modalPinCorte?re(ModalPin,{onAcceso:function(){setVerCorte(true);setModalPinCorte(false);},onClose:function(){setModalPinCorte(false);}}):null,
    modalProd?re(ModalProducto,{cat:modalProd.cat,prod:modalProd.prod,onAdd:agregarItem,onClose:function(){setModalProd(null);}}):null,
    modalCrep?re(ModalCrepisima,{onAdd:agregarItem,onClose:function(){setModalCrep(false);}}):null,
    modalDesc?re(ModalDescuento,{onAdd:agregarItem,onClose:function(){setModalDesc(false);}}):null,
    modalPromo?re(ModalPromo,{promo:modalPromo,onAdd:agregarItems,onClose:function(){setModalPromo(null);}}):null,
    modalCobro?re(ModalCobro,{total:totalDisplay,onConfirmar:confirmarCobro,onClose:function(){setModalCobro(false);}}):null,
    modalGasto?re(ModalGasto,{insumos:insumos,onGuardar:confirmarGasto,onClose:function(){setModalGasto(false);}}):null,
    modalEmpleado?re(ModalEmpleado,{onAdd:function(item){agregarItem(item);},onClose:function(){setModalEmpleado(false);}}):null
  );
}

function Pedidos(props){
  var ventas=props.ventas,tiendaId=props.tiendaId,onActualizarPago=props.onActualizarPago,onReembolso=props.onReembolso;
  var s1=useState(null);var selected=s1[0];var setSelected=s1[1];
  var s2=useState(false);var modalDidi=s2[0];var setModalDidi=s2[1];
  var s3=useState([]);var diasSelec=s3[0];var setDiasSelec=s3[1];
  var s4=useState("");var montoDidiInput=s4[0];var setMontoDidiInput=s4[1];
  var s5=useState(false);var modalPinR=s5[0];var setModalPinR=s5[1];
  var s6=useState(null);var ventaR=s6[0];var setVentaR=s6[1];
  var s7=useState(hoy());var fechaSel=s7[0];var setFechaSel=s7[1];
  var montoDidiNum=parseFloat(montoDidiInput)||0;

  // Filter ventas by selected date (not just today)
  var ventasDia=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===fechaSel;})();});
  var ventasDiaActivas=ventasDia.filter(function(v){return v.estadoPago!=="reembolsado";});

  // Didi pending - all dates
  var didiPorPagar=ventas.filter(function(v){return v.tienda===tiendaId&&v.metodo==="didi"&&v.estadoPago==="por_pagar";});
  var totalDidiPendiente=didiPorPagar.reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var didiPorDia={};
  didiPorPagar.forEach(function(v){
    var d=v.timestamp?v.timestamp.split("T")[0]:"";
    if(!didiPorDia[d])didiPorDia[d]={fecha:d,ventas:[],total:0,neto:0};
    didiPorDia[d].ventas.push(v);
    didiPorDia[d].total+=v.total;
    didiPorDia[d].neto+=(v.netoRecibido||v.total);
  });
  var diasDidi=Object.keys(didiPorDia).sort();

  function toggleDia(d){setDiasSelec(function(p){return p.includes(d)?p.filter(function(x){return x!==d;}):p.concat([d]);});}
  var totalSelec=diasSelec.reduce(function(s,d){return s+(didiPorDia[d]?didiPorDia[d].neto:0);},0);

  function marcarDiasPagados(){
    var ts=[];
    diasSelec.forEach(function(d){didiPorDia[d].ventas.forEach(function(v){ts.push(v.timestamp);});});
    var comisionTotal=totalSelec-montoDidiNum;
    if(onActualizarPago)onActualizarPago(ts,"didi",montoDidiNum,comisionTotal);
    setDiasSelec([]);setMontoDidiInput("");setModalDidi(false);
  }

  function iniciarReembolso(venta){setVentaR(venta);setSelected(null);setModalPinR(true);}
  function confirmarReembolso(){if(onReembolso)onReembolso(ventaR);setVentaR(null);setModalPinR(false);}

  // Navigate days
  function cambiarDia(delta){
    var d=new Date(fechaSel+"T12:00:00");
    d.setDate(d.getDate()+delta);
    setFechaSel(d.toISOString().split("T")[0]);
  }

  if(selected){
    var esReemb=selected.estadoPago==="reembolsado";
    var esDidiP=selected.metodo==="didi"&&selected.estadoPago==="por_pagar";
    return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:380,maxHeight:"90vh",overflowY:"auto"})},
      re("div",{style:{textAlign:"center",marginBottom:14}},
        re("div",{style:{fontSize:20,fontWeight:900,color:C.dark}},
          tiendaId==="centro"?"Crepisimo Centro":tiendaId==="sanantonio"?"Crepisimo San Antonio":"AM-Burger"
        ),
        re("div",{style:{fontSize:12,color:"#aaa",marginTop:4}},fmtFecha(selected.timestamp))
      ),
      esReemb?re("div",{style:{background:C.redL,borderRadius:10,padding:"8px 14px",marginBottom:14,textAlign:"center",fontSize:13,color:C.red,fontWeight:700}},"REEMBOLSADO"):null,
      re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
        (selected.items||[]).map(function(item,i){
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}},
            re("div",{style:{flex:1,paddingRight:8}},
              re("div",{style:{fontWeight:600,color:C.dark}},item.nombre),
              item.paraLlevar?re("div",{style:{fontSize:11,color:"#aaa"}},item.paraLlevar):null,
              item.detalle?re("div",{style:{fontSize:11,color:"#aaa"}},item.detalle):null
            ),
            re("div",{style:{fontWeight:700,color:item.precio===0?"#aaa":item.precio<0?C.red:C.green,whiteSpace:"nowrap"}},
              item.precio===0?"GRATIS":item.precio<0?"-"+fmt(Math.abs(item.precio)):fmt(item.precio))
          );
        })
      ),
      re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:C.dark,marginBottom:8}},re("span",null,"TOTAL"),re("span",null,fmt(selected.total))),
        re("div",{style:{fontSize:13,color:"#888"}},
          "Metodo: "+(selected.metodo||"").toUpperCase()+(selected.metodo==="didi"?" (T. Migue)":selected.metodo==="mercadolibre"?" (T. Angel)":""),
          selected.estadoPago==="por_pagar"?re("div",{style:{marginTop:4,color:"#E65100",fontWeight:700,fontSize:12}},"POR PAGAR"):null,
          selected.cambio>0?re("div",{style:{marginTop:4}},"Cambio: "+fmt(selected.cambio)):null,
          selected.comisionClip>0?re("div",{style:{marginTop:4,fontSize:12,color:C.red}},"Com.Clip: -"+fmt(selected.comisionClip)):null
        )
      ),
      !esReemb?re("button",{onClick:function(){iniciarReembolso(selected);},style:{width:"100%",padding:"12px",background:C.redL,color:C.red,border:"2px solid "+C.red,borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:8}},"🔄 Hacer reembolso"):null,
      re("button",{onClick:function(){window.imprimirTicket&&window.imprimirTicket(selected,tiendaId);},style:Object.assign({},BS(C.dark,"#fff"),{width:"100%",marginBottom:8})},"🖨️ Reimprimir"),
      re("button",{onClick:function(){setSelected(null);},style:Object.assign({},BS("#f0f0f0","#666"),{width:"100%"})},"Cerrar")
    ));
  }

  return re("div",{style:{padding:"10px 10px 70px"}},

    // Date navigator
    re("div",{style:{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}},
        re("button",{onClick:function(){cambiarDia(-1);},style:{background:C.dark,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontWeight:800,fontSize:18,cursor:"pointer"}},"‹"),
        re("div",{style:{textAlign:"center"}},
          re("div",{style:{fontSize:15,fontWeight:800,color:C.dark}},
            fechaSel===hoy()?"HOY":new Date(fechaSel+"T12:00:00").toLocaleDateString("es-MX",{weekday:"long",day:"2-digit",month:"long"})
          ),
          re("div",{style:{fontSize:12,color:"#aaa"}},fechaSel)
        ),
        re("button",{onClick:function(){cambiarDia(1);},disabled:fechaSel>=hoy(),style:{background:fechaSel>=hoy()?"#ccc":C.dark,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontWeight:800,fontSize:18,cursor:fechaSel>=hoy()?"default":"pointer"}},"›")
      ),
      re("input",{type:"date",value:fechaSel,max:hoy(),onChange:function(e){setFechaSel(e.target.value);},style:Object.assign({},IP,{padding:"6px 10px",fontSize:13})})
    ),

    // Summary
    re("div",{style:{fontSize:13,color:"#888",marginBottom:14}},
      ventasDiaActivas.length+" pedidos | "+fmt(ventasDiaActivas.reduce(function(s,v){return s+v.total;},0))
    ),

    // Didi pending banner
    totalDidiPendiente>0?re("div",{style:{background:"#FFF3E0",border:"2px solid #FF6D00",borderRadius:12,padding:"12px 14px",marginBottom:14}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
        re("div",null,
          re("div",{style:{fontSize:12,fontWeight:800,color:"#E65100"}},"Por cobrar Didi (T. Migue)"),
          re("div",{style:{fontSize:18,fontWeight:900,color:"#E65100",marginTop:2}},fmt(totalDidiPendiente)),
          re("div",{style:{fontSize:11,color:"#aaa",marginTop:2}},diasDidi.length+" dias pendientes")
        ),
        re("button",{onClick:function(){setModalDidi(true);},style:{background:"#FF6D00",color:"#fff",border:"none",borderRadius:10,padding:"10px 14px",fontWeight:800,fontSize:12,cursor:"pointer"}},"Marcar pagados")
      )
    ):null,

    ventasDia.length===0?re("div",{style:{textAlign:"center",color:"#bbb",padding:40,fontSize:14}},"Sin pedidos este día"):null,

    ventasDia.map(function(v,i){
      var items=v.items||[];
      var esDidiP=v.metodo==="didi"&&v.estadoPago==="por_pagar";
      var esReembV=v.estadoPago==="reembolsado";
      return re("div",{key:i,onClick:function(){setSelected(v);},style:{background:"#fff",borderRadius:12,padding:"13px 15px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,.07)",cursor:"pointer",borderLeft:"4px solid "+(esReembV?C.red:esDidiP?"#FF6D00":C.dark),opacity:esReembV?.6:1}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
          re("div",null,
            re("div",{style:{fontSize:14,fontWeight:700,color:esReembV?C.red:C.dark}},"Pedido #"+(ventasDia.length-i)+(esReembV?" (REEMBOLSADO)":"")),
            re("div",{style:{fontSize:12,color:"#aaa",marginTop:2}},fmtFecha(v.timestamp)),
            re("div",{style:{fontSize:12,color:"#888",marginTop:4}},items.slice(0,2).map(function(x){return x.nombre;}).join(", ")+(items.length>2?" +"+(items.length-2)+" mas":"")),
            esDidiP?re("div",{style:{fontSize:11,background:"#FFF3E0",color:"#E65100",fontWeight:700,marginTop:4,padding:"2px 8px",borderRadius:8,display:"inline-block"}},"POR PAGAR - Didi"):null
          ),
          re("div",{style:{textAlign:"right"}},
            re("div",{style:{fontSize:18,fontWeight:900,color:esReembV?C.red:C.green}},fmt(v.total)),
            re("div",{style:{fontSize:11,color:C.teal,marginTop:4,fontWeight:600}},"Ver ticket ->")
          )
        )
      );
    }),

    modalPinR?re(ModalPinReembolso,{onAcceso:confirmarReembolso,onClose:function(){setModalPinR(false);setVentaR(null);}}):null,

    modalDidi?re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
      re("div",{style:{fontSize:18,fontWeight:900,color:"#E65100",marginBottom:4}},"Pago semanal Didi Food"),
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Selecciona los dias que incluye este pago (T. Migue)."),
      diasDidi.map(function(d){
        var dia=didiPorDia[d];
        var sel=diasSelec.includes(d);
        var fecha=new Date(d+"T12:00:00").toLocaleDateString("es-MX",{weekday:"long",day:"2-digit",month:"short"});
        return re("div",{key:d,onClick:function(){toggleDia(d);},style:{padding:"12px 14px",marginBottom:8,borderRadius:12,border:"2px solid "+(sel?"#FF6D00":"#e0e0e0"),background:sel?"#FFF3E0":"#fff",cursor:"pointer"}},
          re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
            re("div",null,
              re("div",{style:{fontSize:13,fontWeight:700,color:"#333",textTransform:"capitalize"}},fecha),
              re("div",{style:{fontSize:12,color:"#888",marginTop:2}},dia.ventas.length+" pedidos")
            ),
            re("div",{style:{textAlign:"right"}},
              re("div",{style:{fontSize:11,color:"#aaa"}},"Venta: "+fmt(dia.total)),
              re("div",{style:{fontSize:14,fontWeight:800,color:"#E65100"}},"Neto: "+fmt(dia.neto))
            )
          )
        );
      }),
      diasSelec.length>0?re("div",{style:{background:"#FFF3E0",borderRadius:10,padding:"12px 14px",marginBottom:14,marginTop:8}},
        re("div",{style:{fontSize:13,fontWeight:800,color:"#E65100",marginBottom:8}},"Monto real que deposito Didi (T. Migue)"),
        re("input",{type:"number",placeholder:"0.00",value:montoDidiInput,onChange:function(e){setMontoDidiInput(e.target.value);},style:Object.assign({},IP,{fontSize:20,fontWeight:700,textAlign:"center"})}),
        montoDidiNum>0?re("div",{style:{marginTop:10}},
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}},re("span",{style:{color:"#555"}},"Neto esperado"),re("span",{style:{fontWeight:700}},fmt(totalSelec))),
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}},re("span",{style:{color:"#555"}},"Didi deposito"),re("span",{style:{fontWeight:700,color:"#2E7D32"}},fmt(montoDidiNum))),
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13}},re("span",{style:{color:"#555"}},"Comision Didi"),re("span",{style:{fontWeight:700,color:C.red}},"-"+fmt(totalSelec-montoDidiNum)))
        ):null
      ):null,
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:function(){setModalDidi(false);setDiasSelec([]);setMontoDidiInput("");},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:marcarDiasPagados,disabled:diasSelec.length===0||montoDidiNum<=0,style:BS(diasSelec.length>0&&montoDidiNum>0?"#FF6D00":"#ccc","#fff",2)},"Confirmar pago Didi")
      )
    )):null
  );
}

function Inventario(props){
  var insumos=props.insumos,setInsumos=props.setInsumos,onGasto=props.onGasto;
  var tiendaId=props.tiendaId,insumosOtra=props.insumosOtra,setInsumosOtra=props.setInsumosOtra;
  var s1=useState("todos");var filtro=s1[0];var setFiltro=s1[1];
  var s2=useState(false);var modalCompra=s2[0];var setModalCompra=s2[1];
  var s3=useState(false);var modalTransf=s3[0];var setModalTransf=s3[1];
  var s4=useState(false);var exitoOk=s4[0];var setExitoOk=s4[1];
  var s5=useState({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:""});
  var ev=s5[0];var setEv=s5[1];
  function updE(k,val){setEv(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  var s6e=useState(false);var modalEdit=s6e[0];var setModalEdit=s6e[1];
  var s6i=useState(null);var editIns=s6i[0];var setEditIns=s6i[1];
  var s6v=useState("");var editVal=s6v[0];var setEditVal=s6v[1];
  var s6m=useState("sumar");var editMode=s6m[0];var setEditMode=s6m[1];
  var s6p=useState("");var editPrecio=s6p[0];var setEditPrecio=s6p[1];
  var s6c=useState("");var editCantPaq=s6c[0];var setEditCantPaq=s6c[1];

  var bajos=insumos.filter(function(i){return (i.stock||0)>0&&(i.stock||0)<=i.minimo;});
  function calcCostoProd(recetaKey){
    var rec=R[recetaKey]||[];
    var total=rec.reduce(function(s,r){
      var ins=insumos.find(function(x){return x.id===r.id;});
      return s+(ins&&ins.costoPorU?ins.costoPorU*r.c:0);
    },0);
    return total;
  }
  var agotados=insumos.filter(function(i){return (i.stock||0)===0;});
  var ok=insumos.filter(function(i){return (i.stock||0)>i.minimo;});
  var lista=filtro==="bajo"?bajos:filtro==="agotado"?agotados:filtro==="ok"?ok:insumos;
  var insumoSel=insumos.find(function(i){return i.id===ev.insumoId;});
  var filtrados=insumos.filter(function(i){return i.nombre.toLowerCase().indexOf(ev.busqueda.toLowerCase())>=0;});

  function registrarCompra(){
    if(!ev.insumoId||!ev.cantidad||isNaN(ev.cantidad)||parseFloat(ev.cantidad)<=0){updE("err","Selecciona insumo y cantidad");return;}
    if(!ev.monto||isNaN(ev.monto)||parseFloat(ev.monto)<=0){updE("err","Ingresa el monto pagado");return;}
    var cant=parseFloat(ev.cantidad),monto=parseFloat(ev.monto);
    setInsumos(function(p){return p.map(function(i){return i.id===ev.insumoId?Object.assign({},i,{stock:(i.stock||0)+cant}):i;});});
    if(onGasto)onGasto({seccion:"externo",tipo:"insumo",insumoId:ev.insumoId,insumoNombre:insumoSel?insumoSel.nombre:"",cantidad:cant,unidad:insumoSel?insumoSel.unidad:"",monto:monto,metodoPago:ev.metodoPago,desc:"",tienda:tiendaId,timestamp:new Date().toISOString()});
    setEv({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:""});
    setModalCompra(false);setExitoOk(true);setTimeout(function(){setExitoOk(false);},2000);
  }

  function registrarTransferencia(t){
    var cant=t.cantidad;
    if(t.dir==="salida"){
      setInsumos(function(p){return p.map(function(i){return i.id===t.insumoId?Object.assign({},i,{stock:Math.max(0,(i.stock||0)-cant)}):i;});});
      if(setInsumosOtra)setInsumosOtra(function(p){return p.map(function(i){return i.id===t.insumoId?Object.assign({},i,{stock:(i.stock||0)+cant}):i;});});
    } else {
      setInsumos(function(p){return p.map(function(i){return i.id===t.insumoId?Object.assign({},i,{stock:(i.stock||0)+cant}):i;});});
      if(setInsumosOtra)setInsumosOtra(function(p){return p.map(function(i){return i.id===t.insumoId?Object.assign({},i,{stock:Math.max(0,(i.stock||0)-cant)}):i;});});
    }
    setModalTransf(false);setExitoOk(true);setTimeout(function(){setExitoOk(false);},2000);
  }

  return re("div",{style:{padding:"10px 10px 70px"}},
    exitoOk?re("div",{style:{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#fff",padding:"12px 28px",borderRadius:50,fontWeight:800,fontSize:16,zIndex:300,whiteSpace:"nowrap"}},"Listo"):null,
    re("div",{style:{fontSize:17,fontWeight:900,color:C.dark,marginBottom:14}},"Inventario"),
    re("div",{style:{display:"flex",gap:8,marginBottom:14}},
      re("button",{onClick:function(){setModalCompra(true);},style:{flex:2,padding:13,background:C.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:13,cursor:"pointer"}},"+ Registrar compra"),
      re("button",{onClick:function(){setModalTransf(true);},style:{flex:1,padding:13,background:C.tealL,color:C.teal,border:"2px solid "+C.teal,borderRadius:12,fontWeight:700,fontSize:12,cursor:"pointer"}},"Transferir")
    ),
    re("div",{style:{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}},
      [["todos","Todos",C.dark],["agotado","Agotados"+(agotados.length>0?" ("+agotados.length+")":""),C.red],["bajo","Stock bajo"+(bajos.length>0?" ("+bajos.length+")":""),C.amber],["ok","OK",C.green]].map(function(x){
        var id=x[0],l=x[1],col=x[2],sel=filtro===id;
        return re("button",{key:id,onClick:function(){setFiltro(id);},style:{padding:"7px 14px",border:"2px solid "+(sel?col:"#e0e0e0"),borderRadius:20,cursor:"pointer",fontWeight:sel?800:500,background:sel?col:"#fff",color:sel?"#fff":"#666",fontSize:12}},l);
      })
    ),
    re("div",{style:{background:"#fff",borderRadius:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)",overflow:"hidden"}},
      lista.length===0?re("div",{style:{padding:30,textAlign:"center",color:"#bbb",fontSize:13}},"Sin insumos"):null,
      lista.map(function(ins,i){
        var stock=ins.stock||0,agotado=stock===0,bajo=stock>0&&stock<=ins.minimo;
        var color=agotado?C.red:bajo?C.amber:C.green;
        var pct=Math.min(100,ins.minimo>0?(stock/ins.minimo)*100:100);
        return re("div",{key:ins.id,onClick:function(){setEditIns(ins);setEditVal("");setEditMode("sumar");setEditPrecio("");setEditCantPaq("");setModalEdit(true);},style:{padding:"12px 16px",borderBottom:i<lista.length-1?"1px solid #f5f5f5":"none",cursor:"pointer"}},
          re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
            re("div",null,re("div",{style:{fontSize:13,fontWeight:700,color:agotado?C.red:C.dark}},ins.nombre),re("div",{style:{fontSize:11,color:"#aaa"}},"Min: "+fmtC(ins.minimo,ins.unidad))),
            re("div",{style:{textAlign:"right"}},
              re("div",{style:{fontSize:14,fontWeight:800,color:color}},agotado?"AGOTADO":fmtC(stock,ins.unidad)),
              re("div",{style:{fontSize:10,color:"#bbb",marginTop:2}},"toca para editar")
            )
          ),
          re("div",{style:{height:4,background:"#f0f0f0",borderRadius:2,overflow:"hidden"}},re("div",{style:{height:"100%",width:pct+"%",background:color,borderRadius:2}}))
        );
      })
    ),
    modalCompra?re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
      re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},"Registrar compra de insumo"),
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Actualiza el inventario y registra el gasto en finanzas."),
      re("div",{style:{marginBottom:10}},
        re("div",{style:LB},"Insumo *"),
        re("input",{placeholder:"Buscar insumo...",value:ev.busqueda,onChange:function(e){updE("busqueda",e.target.value);},style:IP}),
        ev.busqueda?re("div",{style:{border:"1px solid #e0e0e0",borderRadius:9,marginTop:4,maxHeight:150,overflowY:"auto"}},
          filtrados.slice(0,10).map(function(i){var sel=ev.insumoId===i.id;return re("div",{key:i.id,onClick:function(){updE("insumoId",i.id);updE("busqueda",i.nombre);},style:{padding:"9px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f5f5f5",background:sel?C.greenL:"#fff",color:sel?C.green:"#333"}},i.nombre+" ("+i.unidad+") - Stock: "+fmtC(i.stock||0,i.unidad));})
        ):null
      ),
      insumoSel?re("div",{style:{background:C.greenL,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:C.green,fontWeight:600}},"Stock actual: "+fmtC(insumoSel.stock||0,insumoSel.unidad)):null,
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
        re("div",null,re("div",{style:LB},"Cantidad"+(insumoSel?" ("+insumoSel.unidad+")":"")),re("input",{type:"number",placeholder:"0",value:ev.cantidad,onChange:function(e){updE("cantidad",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700,textAlign:"center"})})),
        re("div",null,re("div",{style:LB},"Monto pagado ($)"),re("input",{type:"number",placeholder:"0.00",value:ev.monto,onChange:function(e){updE("monto",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700,textAlign:"center"})}))
      ),
      insumoSel&&ev.cantidad&&ev.monto&&parseFloat(ev.cantidad)>0&&parseFloat(ev.monto)>0?re("div",{style:{background:C.amberL,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#555"}},"Costo unitario: "+fmt(parseFloat(ev.monto)/parseFloat(ev.cantidad))+" / "+insumoSel.unidad):null,
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Como se pago *"),
        re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}},
          [["efectivo","Efectivo"],["tarjeta_migue","T. Migue"],["tarjeta_angel","T. Angel"]].map(function(x){var id=x[0],l=x[1],sel=ev.metodoPago===id;return re("button",{key:id,onClick:function(){updE("metodoPago",id);},style:{padding:"10px 6px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.purpleL:"#fff",color:sel?C.dark:"#666",fontSize:12,textAlign:"center"}},l);})
        )
      ),
      ev.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},ev.err):null,
      re("div",{style:{display:"flex",gap:10}},
        re("button",{onClick:function(){setModalCompra(false);setEv({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:""});},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:registrarCompra,style:BS(C.green,"#fff",2)},"Registrar compra")
      )
    )):null,
    modalTransf?re(ModalTransferencia,{insumos:insumos,tiendaId:tiendaId||"centro",onTransferir:registrarTransferencia,onClose:function(){setModalTransf(false);}}):null,
    modalEdit&&editIns?re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},"Editar stock"),
      re("div",{style:{fontSize:14,fontWeight:700,color:"#555",marginBottom:4}},editIns.nombre),
      re("div",{style:{fontSize:13,color:"#888",marginBottom:14}},"Stock actual: "+fmtC(editIns.stock||0,editIns.unidad)),
      re("div",{style:{display:"flex",gap:8,marginBottom:14,background:"#f5f5f5",borderRadius:12,padding:4}},
        [["sumar","+ Sumar"],["restar","- Restar"],["fijar","= Fijar"]].map(function(x){var sel=editMode===x[0];return re("button",{key:x[0],onClick:function(){setEditMode(x[0]);},style:{flex:1,padding:"10px 4px",border:"none",borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"transparent",color:sel?"#fff":"#888",fontSize:12}},x[1]);})
      ),
      re("div",{style:{marginBottom:8}},
        re("div",{style:LB},editMode==="sumar"?"Cantidad a sumar ("+editIns.unidad+")":editMode==="restar"?"Cantidad a restar ("+editIns.unidad+")":"Nuevo stock ("+editIns.unidad+")"),
        re("input",{type:"number",placeholder:"0",value:editVal,onChange:function(e){setEditVal(e.target.value);},style:Object.assign({},IP,{fontSize:22,fontWeight:700,textAlign:"center"})})
      ),
      editVal&&!isNaN(editVal)&&parseFloat(editVal)>=0?re("div",{style:{background:C.amberL,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#555"}},
        "Stock resultante: "+fmtC(
          editMode==="sumar"?(editIns.stock||0)+parseFloat(editVal):
          editMode==="restar"?Math.max(0,(editIns.stock||0)-parseFloat(editVal)):
          parseFloat(editVal),
          editIns.unidad
        )
      ):null,
      re("div",{style:{height:1,background:"#f0f0f0",margin:"14px 0"}}),
      re("div",{style:{fontSize:13,fontWeight:800,color:C.dark,marginBottom:10}},"💰 Precio de compra"),
      re("div",{style:{fontSize:11,color:"#888",marginBottom:8}},"Para calcular costo de produccion. El sistema calcula automaticamente el costo por "+editIns.unidad+"."),
      re("div",{style:{display:"flex",gap:8,marginBottom:8}},
        re("div",{style:{flex:1}},
          re("div",{style:LB},"Precio del paquete ($)"),
          re("input",{type:"number",placeholder:"0.00",value:editPrecio,onChange:function(e){setEditPrecio(e.target.value);},style:IP})
        ),
        re("div",{style:{flex:1}},
          re("div",{style:LB},"Cantidad del paquete ("+editIns.unidad+")"),
          re("input",{type:"number",placeholder:"1",value:editCantPaq,onChange:function(e){setEditCantPaq(e.target.value);},style:IP})
        )
      ),
      editPrecio&&editCantPaq&&parseFloat(editPrecio)>0&&parseFloat(editCantPaq)>0?re("div",{style:{background:C.greenL,borderRadius:10,padding:"8px 12px",fontSize:13,color:C.green,fontWeight:700,marginBottom:8}},
        "Costo por "+editIns.unidad+": $"+(parseFloat(editPrecio)/parseFloat(editCantPaq)).toFixed(4)
      ):
      editIns.costoPorU?re("div",{style:{background:"#f5f5f5",borderRadius:10,padding:"8px 12px",fontSize:13,color:"#555",marginBottom:8}},
        "Costo actual: $"+editIns.costoPorU.toFixed(4)+"/"+editIns.unidad
      ):null,
      re("div",{style:{display:"flex",gap:10}},
        re("button",{onClick:function(){setModalEdit(false);setEditIns(null);setEditPrecio("");setEditCantPaq("");},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!editVal||isNaN(editVal)||parseFloat(editVal)<0)return;
          var val=parseFloat(editVal);
          var delta=editMode==="sumar"?val:editMode==="restar"?-val:null;
          var nuevo=editMode==="sumar"?(editIns.stock||0)+val:editMode==="restar"?Math.max(0,(editIns.stock||0)-val):val;
          var costoPorU=editPrecio&&editCantPaq&&parseFloat(editPrecio)>0&&parseFloat(editCantPaq)>0?parseFloat(editPrecio)/parseFloat(editCantPaq):editIns.costoPorU;
          if(delta!==null){updateStockDelta(tiendaId,[{id:editIns.id,delta:delta}]);}
          else{saveInventario(tiendaId,insumos.map(function(i){return i.id===editIns.id?Object.assign({},i,{stock:nuevo,costoPorU:costoPorU}):i;}));}
          var stockDelta=nuevo-(editIns.stock||0);
          updateStockDelta(tiendaId,[{id:editIns.id,delta:stockDelta}]);
          setInsumos(function(p){return p.map(function(i){return i.id===editIns.id?Object.assign({},i,{stock:nuevo,costoPorU:costoPorU}):i;});});
          setModalEdit(false);setEditIns(null);setEditVal("");setEditPrecio("");setEditCantPaq("");
        },style:BS(C.dark,"#fff",2)},"Guardar")
      )
    )):null
  );
}

function BarChart(props){
  var datos=props.datos,titulo=props.titulo,colorBar=props.color||C.dark;
  if(!datos||datos.length===0)return re("div",{style:{textAlign:"center",color:"#bbb",padding:30,fontSize:13}},"Sin datos para mostrar");
  var maxVal=Math.max.apply(null,datos.map(function(d){return d.v;}));
  if(maxVal===0)return re("div",{style:{textAlign:"center",color:"#bbb",padding:30,fontSize:13}},"Sin datos");
  return re("div",null,
    titulo?re("div",{style:{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:12}},titulo):null,
    re("div",{style:{display:"flex",alignItems:"flex-end",gap:4,height:120,paddingBottom:24,position:"relative"}},
      datos.map(function(d,i){
        var pct=(d.v/maxVal)*100;
        return re("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
          d.v>0?re("div",{style:{fontSize:9,color:colorBar,fontWeight:700,textAlign:"center"}},d.v>=1000?(d.v/1000).toFixed(1)+"k":d.v):null,
          re("div",{style:{width:"100%",background:colorBar,borderRadius:"3px 3px 0 0",height:pct+"%",minHeight:d.v>0?4:0,opacity:.85}}),
          re("div",{style:{fontSize:9,color:"#888",textAlign:"center",marginTop:2,wordBreak:"break-word"}},d.l)
        );
      })
    )
  );
}

function Finanzas(props){
  var ventas=props.ventas,gastos=props.gastos,insumos=props.insumos||[];
  var s1=useState("dia");var periodo=s1[0];var setPeriodo=s1[1];
  var s2=useState("ventas_dia");var graficaActiva=s2[0];var setGraficaActiva=s2[1];

  var tv=ventas.reduce(function(s,v){return s+v.total;},0);
  var tg=gastos.filter(function(g){return g.desc!=="Comision Mercado Libre"&&g.tipo!=="transf_tarjeta";}).reduce(function(s,g){return s+g.monto;},0);
  var tc=ventas.filter(function(v){return v.estadoPago!=="reembolsado";}).reduce(function(s,v){return s+v.comisionClip;},0);
  var tDidiComision=ventas.reduce(function(s,v){return s+(v.comisionDidi||0);},0);
  var tDidiNeto=ventas.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tDidiTotal=ventas.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+v.total;},0);
  var tDidiPorPagar=ventas.filter(function(v){return v.metodo==="didi"&&v.estadoPago==="por_pagar";}).reduce(function(s,v){return s+v.total;},0);
  var util=tv-tg-tc-tDidiComision-tComisionML;
  var margen=tv>0?(util/tv)*100:0;
  var ef=ventas.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var tr=ventas.filter(function(v){return v.metodo==="transferencia";}).reduce(function(s,v){return s+v.total;},0);
  var cl=ventas.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.netoRecibido;},0);

  var gastosInsumo=gastosFil.filter(function(g){return g.tipo==="insumo";});
  // MP por marca: insumos Crepisimo (no tienen prefijo amb_) vs AMBurger (prefijo amb_)
  var gastosCrep=gastosInsumo.filter(function(g){return !g.insumoId||(g.insumoId.indexOf("amb_")!==0&&g.insumoId.indexOf("ti_")!==0);});
  var gastosAmb=gastosInsumo.filter(function(g){return g.insumoId&&g.insumoId.indexOf("amb_")===0;});
  var tvCrep=ventas.filter(function(v){return v.tienda!=="amburger";}).reduce(function(s,v){return s+v.total;},0);
  var tvAmb=ventas.filter(function(v){return v.tienda==="amburger";}).reduce(function(s,v){return s+v.total;},0);

  var totalMP=gastosCrep.reduce(function(s,g){return s+g.monto;},0);
  var presupuestoMP=tvCrep*META_MP;
  var pctMPReal=tvCrep>0?(totalMP/tvCrep)*100:0;
  var excedeMP=totalMP>presupuestoMP;
  var colorMP=excedeMP?C.red:C.green;
  var bgMP=excedeMP?C.redL:C.greenL;
  var pctBarra=presupuestoMP>0?Math.min(100,(totalMP/presupuestoMP)*100):0;



  var comprasPorInsumo={};
  gastosInsumo.forEach(function(g){
    if(!g.insumoId)return;
    if(!comprasPorInsumo[g.insumoId])comprasPorInsumo[g.insumoId]={monto:0,cantidad:0};
    comprasPorInsumo[g.insumoId].monto+=g.monto;
    comprasPorInsumo[g.insumoId].cantidad+=g.cantidad;
  });
  var valorInventario=insumos.reduce(function(s,ins){
    var cp=comprasPorInsumo[ins.id];
    if(!cp||cp.cantidad===0)return s;
    return s+(cp.monto/cp.cantidad)*(ins.stock||0);
  },0);

  var tColaboradores=gastosFil.filter(function(g){return g.tipo==="colaborador";}).reduce(function(s,g){return s+g.monto;},0);
  var tTarjetaMigue=gastosFil.filter(function(g){return g.tipo==="tarjeta_migue";}).reduce(function(s,g){return s+g.monto;},0);
  var tTarjetaAngel=gastosFil.filter(function(g){return g.tipo==="tarjeta_angel";}).reduce(function(s,g){return s+g.monto;},0);
  var tPersonal=gastosFil.filter(function(g){return g.tipo==="personal";}).reduce(function(s,g){return s+g.monto;},0);
  var tOtro=gastosFil.filter(function(g){return g.tipo==="otro";}).reduce(function(s,g){return s+g.monto;},0);

  // Estadisticas: productos mas vendidos
  var conteoProductos={};
  ventas.forEach(function(v){
    (v.items||[]).forEach(function(item){
      if(item.precio<=0)return;
      var n=item.nombre.split(" (")[0].split(" - ")[0];
      if(!conteoProductos[n])conteoProductos[n]=0;
      conteoProductos[n]++;
    });
  });
  var topProductos=Object.keys(conteoProductos).map(function(k){return {nombre:k,cant:conteoProductos[k]};}).sort(function(a,b){return b.cant-a.cant;}).slice(0,8);

  // Ventas por dia (ultimos 7 dias)
  var ventasPorDia={};
  ventas.forEach(function(v){
    var d=v.timestamp?v.timestamp.split("T")[0]:"";
    if(!d)return;
    if(!ventasPorDia[d])ventasPorDia[d]=0;
    ventasPorDia[d]+=v.total;
  });
  var dias7=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var ds=d.toISOString().split("T")[0];
    var lbl=d.toLocaleDateString("es-MX",{weekday:"short",day:"2-digit"});
    dias7.push({l:lbl,v:Math.round(ventasPorDia[ds]||0)});
  }

  // Ventas por semana (ultimas 4)
  var ventasPorSemana={};
  ventas.forEach(function(v){
    if(!v.timestamp)return;
    var d=new Date(v.timestamp);
    var startOfWeek=new Date(d);
    startOfWeek.setDate(d.getDate()-d.getDay());
    var wk=startOfWeek.toISOString().split("T")[0];
    if(!ventasPorSemana[wk])ventasPorSemana[wk]=0;
    ventasPorSemana[wk]+=v.total;
  });
  var semanas=Object.keys(ventasPorSemana).sort().slice(-4).map(function(wk,i){
    return {l:"Sem "+(i+1),v:Math.round(ventasPorSemana[wk])};
  });

  // Ventas por mes (ultimos 6)
  var ventasPorMes={};
  ventas.forEach(function(v){
    if(!v.timestamp)return;
    var d=new Date(v.timestamp);
    var mes=d.getFullYear()+"-"+(d.getMonth()+1<10?"0":"")+(d.getMonth()+1);
    if(!ventasPorMes[mes])ventasPorMes[mes]=0;
    ventasPorMes[mes]+=v.total;
  });
  var meses=Object.keys(ventasPorMes).sort().slice(-6).map(function(mes){
    var parts=mes.split("-");
    var nombres=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return {l:nombres[parseInt(parts[1])],v:Math.round(ventasPorMes[mes])};
  });

  var GRAFICAS=[
    {id:"ventas_dia",lbl:"Ventas por dia"},
    {id:"ventas_semana",lbl:"Por semana"},
    {id:"ventas_mes",lbl:"Por mes"},
    {id:"top_productos",lbl:"Mas vendidos"},
  ];

  function getGraficaData(){
    if(graficaActiva==="ventas_dia")return {datos:dias7,titulo:"Ventas ultimos 7 dias",color:C.teal};
    if(graficaActiva==="ventas_semana")return {datos:semanas.length>0?semanas:[],titulo:"Ventas por semana",color:C.green};
    if(graficaActiva==="ventas_mes")return {datos:meses.length>0?meses:[],titulo:"Ventas por mes",color:C.dark};
    if(graficaActiva==="top_productos")return {datos:topProductos.map(function(p){return {l:p.nombre.slice(0,8),v:p.cant};}),titulo:"Productos mas vendidos (cantidad)",color:C.orange};
    return {datos:[],titulo:""};
  }
  var gData=getGraficaData();

  function Card(l,v,col,bg){return re("div",{style:{background:bg,borderRadius:12,padding:"14px",borderLeft:"4px solid "+col}},re("div",{style:{fontSize:11,color:col,fontWeight:700,textTransform:"uppercase",marginBottom:3}},l),re("div",{style:{fontSize:22,fontWeight:900,color:col}},v));}
  function Row(l,v,col){return re("div",{key:l,style:{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}},re("span",{style:{color:"#555"}},l),re("span",{style:{fontWeight:700,color:col||C.dark}},fmt(v)));}

  return re("div",{style:{padding:"10px 10px 70px"}},
    re("div",{style:{fontSize:17,fontWeight:900,color:C.dark,marginBottom:14}},"Finanzas - Crepisimo Centro"),
    re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
      Card("Ventas",fmt(tv),C.green,C.greenL),
      Card("Egresos",fmt(tg+tc+tDidiComision+tComisionML),C.red,C.redL),
      Card("Utilidad",fmt(util),util>=0?C.green:C.red,util>=0?C.greenL:C.redL),
      Card("Margen",margen.toFixed(1)+"%",margen>=15?C.green:C.orange,C.amberL)
    ),

    re("div",{style:{background:C.dark,borderRadius:14,padding:18,marginBottom:14,color:"#fff"}},
      re("div",{style:{fontSize:12,opacity:.7,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}},"Valor del inventario actual"),
      re("div",{style:{fontSize:32,fontWeight:900}},fmt(valorInventario)),
      re("div",{style:{fontSize:12,opacity:.6,marginTop:4}},valorInventario===0?"Registra compras para calcular":"Calculado con costo promedio de compras")
    ),

    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        re("div",{style:SC},"Control materia prima Crepísimo (32%)"),
        re("div",{style:{fontSize:11,fontWeight:700,color:colorMP,background:bgMP,padding:"3px 10px",borderRadius:20}},excedeMP?"EXCEDIDO":"OK")
      ),
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
        re("div",{style:{background:bgMP,borderRadius:10,padding:"12px 14px",borderLeft:"4px solid "+colorMP}},
          re("div",{style:{fontSize:11,color:colorMP,fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Gastado en MP"),
          re("div",{style:{fontSize:18,fontWeight:900,color:colorMP}},fmt(totalMP)),
          re("div",{style:{fontSize:11,color:"#999",marginTop:2}},pctMPReal.toFixed(1)+"% de ventas")
        ),
        re("div",{style:{background:"#f5f5f5",borderRadius:10,padding:"12px 14px",borderLeft:"4px solid #ccc"}},
          re("div",{style:{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Presupuesto 32%"),
          re("div",{style:{fontSize:18,fontWeight:900,color:"#555"}},fmt(presupuestoMP)),
          re("div",{style:{fontSize:11,color:"#999",marginTop:2}},"Diferencia: "+fmt(presupuestoMP-totalMP))
        )
      ),
      re("div",null,
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",marginBottom:5}},
          re("span",null,"0%"),
          re("span",{style:{fontWeight:700,color:colorMP}},pctBarra.toFixed(0)+"% del presupuesto usado"),
          re("span",null,"100%")
        ),
        re("div",{style:{height:10,background:"#f0f0f0",borderRadius:5,overflow:"hidden"}},
          re("div",{style:{height:"100%",width:pctBarra+"%",background:colorMP,borderRadius:5}})
        )
      )
    ),

    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Estadisticas"),
      re("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}},
        GRAFICAS.map(function(g){var sel=graficaActiva===g.id;return re("button",{key:g.id,onClick:function(){setGraficaActiva(g.id);},style:{padding:"7px 12px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:20,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:12}},g.lbl);})
      ),
      re(BarChart,{datos:gData.datos,titulo:gData.titulo,color:gData.color})
    ),

    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Por metodo de pago"),
      Row("Efectivo",ef),Row("Transferencia",tr),Row("Clip (neto)",cl),Row("Comision Clip",tc,C.red),tDidiTotal>0?Row("Didi Food (bruto)",tDidiTotal):null,tDidiNeto>0?Row("Didi (neto cobrado)",tDidiNeto):null,tDidiPorPagar>0?Row("Didi por pagar",tDidiPorPagar,"#E65100"):null,tDidiComision>0?Row("Comision Didi",tDidiComision,C.red):null
    ),

    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Desglose de egresos"),
      Row("Materia prima",totalMP,C.red),
      Row("Colaboradores",tColaboradores,C.red),
      Row("Gasto tarjeta Migue",tTarjetaMigue,C.red),
      Row("Gasto tarjeta Angel",tTarjetaAngel,C.red),
      Row("Gasto personal A&M",tPersonal,C.purple),
      Row("Otros gastos",tOtro,C.red),
      Row("Comision Clip",tc,C.red),
        tDidiComision>0?Row("Comision Didi",tDidiComision,C.red):null,
        tComisionML>0?Row("Comision Mercado Libre",tComisionML,C.red):null,
      re("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:14,borderTop:"2px solid #f0f0f0",marginTop:4}},
        re("span",{style:{fontWeight:800,color:C.dark}},"Total egresos"),
        re("span",{style:{fontWeight:900,color:C.red}},fmt(tg+tc+tDidiComision))
      )
    ),

    re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Ultimas ventas ("+ventas.length+")"),
      ventas.length===0?re("div",{style:{textAlign:"center",color:"#bbb",padding:20,fontSize:13}},"Sin ventas registradas"):
      ventas.slice(0,20).map(function(v,i){
        return re("div",{key:i,style:{padding:"8px 0",borderBottom:i<Math.min(ventas.length,20)-1?"1px solid #f5f5f5":"none"}},
          re("div",{style:{display:"flex",justifyContent:"space-between"}},
            re("div",null,
              re("div",{style:{fontSize:12,color:"#888"}},(v.items||[]).map(function(x){return x.nombre;}).join(", ")),
              re("div",{style:{fontSize:11,color:"#ccc"}},v.metodo+(v.comisionClip>0?" | com. "+fmt(v.comisionClip):""))
            ),
            re("div",{style:{fontSize:14,fontWeight:800,color:C.green}},fmt(v.total))
          )
        );
      })
    )
  );
}

// ── TICHI DATA ───────────────────────────────────────────
var TC = { dark:"#2E7D32", mid:"#4CAF50", light:"#81C784", bg:"#E8F5E9", accent:"#00C853", bgL:"#F1F8E9" };

var INSUMOS_TICHI_MP = [
  {id:"ti_azucar",nombre:"Azucar",unidad:"kg",minimo:25},
  {id:"ti_agua",nombre:"Agua natural",unidad:"L",minimo:20},
  {id:"ti_acido",nombre:"Acido citrico",unidad:"kg",minimo:0.5},
  {id:"ti_benzoato",nombre:"Benzoato de sodio",unidad:"kg",minimo:0.1},
  {id:"ti_leche_polvo",nombre:"Leche en polvo",unidad:"kg",minimo:2},
  {id:"ti_goma",nombre:"Goma xantana",unidad:"kg",minimo:0.5},
  {id:"ti_cocoa",nombre:"Cocoa",unidad:"kg",minimo:0.5},
  {id:"ti_choc_mp",nombre:"Chocolate en polvo MP",unidad:"kg",minimo:1},
  {id:"ti_esencia_horchata",nombre:"Esencia horchata",unidad:"kg",minimo:0.1},
  {id:"ti_color_mora",nombre:"Colorante mora azul",unidad:"g",minimo:30},
  {id:"ti_color_verde",nombre:"Colorante verde neon",unidad:"g",minimo:30},
  {id:"ti_color_rojo",nombre:"Colorante rojo navidad",unidad:"g",minimo:30},
  {id:"ti_sab_mora",nombre:"Concentrado mora azul",unidad:"kg",minimo:0.5},
  {id:"ti_sab_manzana",nombre:"Concentrado manzana verde",unidad:"kg",minimo:0.5},
  {id:"ti_sab_mandarina",nombre:"Concentrado mandarina",unidad:"kg",minimo:0.1},
  {id:"ti_sab_sandia",nombre:"Concentrado sandia",unidad:"kg",minimo:0.1},
  {id:"ti_sab_fresa",nombre:"Concentrado fresa",unidad:"kg",minimo:0.5},
  {id:"ti_sab_frutos",nombre:"Concentrado frutos rojos",unidad:"kg",minimo:0.5},
  {id:"ti_sab_limon",nombre:"Concentrado limon",unidad:"kg",minimo:0.5},
  {id:"ti_sab_naranja",nombre:"Concentrado naranja",unidad:"kg",minimo:0.5},
  {id:"ti_sab_maracuya",nombre:"Concentrado maracuya",unidad:"kg",minimo:0.5},
  {id:"ti_sab_cereza",nombre:"Esencia cereza",unidad:"kg",minimo:0.5},
  {id:"ti_sab_pina",nombre:"Concentrado pina",unidad:"kg",minimo:0.5},
  {id:"ti_sab_mango",nombre:"Concentrado mango",unidad:"kg",minimo:0.5},
  {id:"ti_sab_banana",nombre:"Concentrado banana",unidad:"kg",minimo:0.5},
  {id:"ti_sab_taro",nombre:"Concentrado taro",unidad:"kg",minimo:0.1},
  {id:"ti_sab_vainilla",nombre:"Concentrado vainilla",unidad:"kg",minimo:0.5},
  {id:"ti_sab_choc_j",nombre:"Concentrado chocolate cafe",unidad:"kg",minimo:0.5},
  {id:"ti_sab_cajeta",nombre:"Concentrado cajeta",unidad:"kg",minimo:0.5},
  {id:"ti_sab_coco",nombre:"Concentrado coco",unidad:"kg",minimo:0.5},
  {id:"ti_sab_avellana",nombre:"Concentrado avellana",unidad:"kg",minimo:0.5},
  {id:"ti_botella",nombre:"Botella con tapa",unidad:"pza",minimo:25},
  {id:"ti_bolsa",nombre:"Bolsa empaque",unidad:"pza",minimo:10},
  {id:"ti_etiqueta_bot",nombre:"Etiqueta botella",unidad:"pza",minimo:25},
  {id:"ti_etiqueta_bol",nombre:"Etiqueta bolsa",unidad:"pza",minimo:10},
  {id:"ti_sal",nombre:"Sal",unidad:"kg",minimo:0.1},
  {id:"ti_albumina",nombre:"Albumina",unidad:"kg",minimo:0.1},
  {id:"ti_polvo_hornear",nombre:"Polvo para hornear",unidad:"kg",minimo:0.1},
];

// Producto terminado en inventario
var INSUMOS_TICHI_PT = [
  {id:"ti_pt_mora",nombre:"Jarabe Mora Azul (L)",unidad:"L",minimo:5},
  {id:"ti_pt_manzana",nombre:"Jarabe Manzana Verde (L)",unidad:"L",minimo:5},
  {id:"ti_pt_mandarina",nombre:"Jarabe Mandarina (L)",unidad:"L",minimo:5},
  {id:"ti_pt_sandia",nombre:"Jarabe Sandia (L)",unidad:"L",minimo:5},
  {id:"ti_pt_fresa",nombre:"Jarabe Fresa (L)",unidad:"L",minimo:5},
  {id:"ti_pt_frutos",nombre:"Jarabe Frutos Rojos (L)",unidad:"L",minimo:5},
  {id:"ti_pt_limon",nombre:"Jarabe Limon (L)",unidad:"L",minimo:5},
  {id:"ti_pt_naranja",nombre:"Jarabe Naranja (L)",unidad:"L",minimo:5},
  {id:"ti_pt_maracuya",nombre:"Jarabe Maracuya (L)",unidad:"L",minimo:5},
  {id:"ti_pt_cereza",nombre:"Jarabe Cereza (L)",unidad:"L",minimo:5},
  {id:"ti_pt_pina",nombre:"Jarabe Pina (L)",unidad:"L",minimo:5},
  {id:"ti_pt_mango",nombre:"Jarabe Mango (L)",unidad:"L",minimo:5},
  {id:"ti_pt_banana",nombre:"Jarabe Banana (L)",unidad:"L",minimo:5},
  {id:"ti_pt_taro",nombre:"Jarabe Taro (L)",unidad:"L",minimo:5},
  {id:"ti_pt_vainilla",nombre:"Jarabe Vainilla (L)",unidad:"L",minimo:5},
  {id:"ti_pt_choc_j",nombre:"Jarabe Chocolate cafe (L)",unidad:"L",minimo:5},
  {id:"ti_pt_cajeta",nombre:"Jarabe Cajeta (L)",unidad:"L",minimo:5},
  {id:"ti_pt_coco",nombre:"Jarabe Coco (L)",unidad:"L",minimo:5},
  {id:"ti_pt_avellana",nombre:"Jarabe Avellana (L)",unidad:"L",minimo:5},
  {id:"ti_pt_base_neutra",nombre:"Base Neutra 1kg",unidad:"bolsa",minimo:5},
  {id:"ti_pt_base_crystal",nombre:"Base Crystal 1kg",unidad:"bolsa",minimo:5},
  {id:"ti_pt_base_horchata",nombre:"Base Horchata 1kg",unidad:"bolsa",minimo:5},
  {id:"ti_pt_choc_polvo",nombre:"Chocolate en polvo 1kg",unidad:"bolsa",minimo:5},
  {id:"ti_pt_azucar_masa",nombre:"Azucar para masa 240g",unidad:"bolsa",minimo:5},
];

function mkInsumosTichi(){
  return INSUMOS_TICHI_MP.concat(INSUMOS_TICHI_PT).map(function(i){return Object.assign({},i,{stock:0});});
}

// Receta por litro de jarabe (cantidad de MP por litro terminado)
var TI_BASE_SODA_L = [{id:"ti_azucar",c:0.800},{id:"ti_agua",c:0.480},{id:"ti_acido",c:0.01648},{id:"ti_benzoato",c:0.001}];
var TI_BASE_CAFE_L = [{id:"ti_azucar",c:0.800},{id:"ti_agua",c:0.480},{id:"ti_benzoato",c:0.001}];
var TI_PACK_BOT = [{id:"ti_botella",c:1},{id:"ti_etiqueta_bot",c:1}];
var TI_PACK_BOL = [{id:"ti_bolsa",c:1},{id:"ti_etiqueta_bol",c:1}];

// Recetas por litro = base + sabor + color + empaque
var R_TICHI_PROD = {
  "ti_pt_mora":    TI_BASE_SODA_L.concat([{id:"ti_sab_mora",c:0.033},{id:"ti_color_mora",c:1}]).concat(TI_PACK_BOT),
  "ti_pt_manzana": TI_BASE_SODA_L.concat([{id:"ti_sab_manzana",c:0.033},{id:"ti_color_verde",c:1}]).concat(TI_PACK_BOT),
  "ti_pt_mandarina":TI_BASE_SODA_L.concat([{id:"ti_sab_mandarina",c:0.030}]).concat(TI_PACK_BOT),
  "ti_pt_sandia":  TI_BASE_SODA_L.concat([{id:"ti_sab_sandia",c:0.030}]).concat(TI_PACK_BOT),
  "ti_pt_fresa":   TI_BASE_SODA_L.concat([{id:"ti_sab_fresa",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_frutos":  TI_BASE_SODA_L.concat([{id:"ti_sab_frutos",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_limon":   TI_BASE_SODA_L.concat([{id:"ti_sab_limon",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_naranja": TI_BASE_SODA_L.concat([{id:"ti_sab_naranja",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_maracuya":TI_BASE_SODA_L.concat([{id:"ti_sab_maracuya",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_cereza":  TI_BASE_SODA_L.concat([{id:"ti_sab_cereza",c:0.045},{id:"ti_color_rojo",c:1}]).concat(TI_PACK_BOT),
  "ti_pt_pina":    TI_BASE_SODA_L.concat([{id:"ti_sab_pina",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_mango":   TI_BASE_SODA_L.concat([{id:"ti_sab_mango",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_banana":  TI_BASE_CAFE_L.concat([{id:"ti_sab_banana",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_taro":    TI_BASE_CAFE_L.concat([{id:"ti_sab_taro",c:0.030}]).concat(TI_PACK_BOT),
  "ti_pt_vainilla":TI_BASE_CAFE_L.concat([{id:"ti_sab_vainilla",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_choc_j":  TI_BASE_CAFE_L.concat([{id:"ti_sab_choc_j",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_cajeta":  TI_BASE_CAFE_L.concat([{id:"ti_sab_cajeta",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_coco":    TI_BASE_CAFE_L.concat([{id:"ti_sab_coco",c:0.033}]).concat(TI_PACK_BOT),
  "ti_pt_avellana":TI_BASE_CAFE_L.concat([{id:"ti_sab_avellana",c:0.033}]).concat(TI_PACK_BOT),
  // Bases y chocolate: receta por bolsa de produccion
  "ti_pt_base_neutra":  [{id:"ti_azucar",c:0.600},{id:"ti_leche_polvo",c:0.385},{id:"ti_goma",c:0.015}].concat(TI_PACK_BOL),
  "ti_pt_base_crystal": [{id:"ti_azucar",c:0.970},{id:"ti_goma",c:0.030}].concat(TI_PACK_BOL),
  "ti_pt_base_horchata":[{id:"ti_esencia_horchata",c:0.030},{id:"ti_azucar",c:0.585},{id:"ti_leche_polvo",c:0.370},{id:"ti_goma",c:0.015}].concat(TI_PACK_BOL),
  "ti_pt_choc_polvo":   [{id:"ti_cocoa",c:0.130},{id:"ti_choc_mp",c:0.870}].concat(TI_PACK_BOL),
  "ti_pt_azucar_masa":  [{id:"ti_azucar",c:0.2285},{id:"ti_sal",c:0.0035},{id:"ti_albumina",c:0.009},{id:"ti_polvo_hornear",c:0.003},{id:"ti_goma",c:0.004},{id:"ti_bolsa",c:1}],
};

// Cuanto producto terminado puedo hacer con MP actual (para mostrar en inventario)
function calcPotencial(insumos, receta, unidades){
  if(!receta||receta.length===0)return 999;
  var min=999999;
  receta.forEach(function(r){
    var ins=insumos.find(function(i){return i.id===r.id;});
    if(!ins||r.c<=0)return;
    var posible=Math.floor((ins.stock||0)/r.c);
    if(posible<min)min=posible;
  });
  return min===999999?0:min;
}

// Menu Tichi: productos terminados para venta
var MENU_TICHI_SODAS = [
  {id:"ti_pt_mora",nombre:"Mora Azul Tichi",precio:150},
  {id:"ti_pt_manzana",nombre:"Manzana Verde Tichi",precio:150},
  {id:"ti_pt_mandarina",nombre:"Mandarina Tichi",precio:150},
  {id:"ti_pt_sandia",nombre:"Sandia Tichi",precio:150},
  {id:"ti_pt_fresa",nombre:"Fresa Tichi",precio:150},
  {id:"ti_pt_frutos",nombre:"Frutos Rojos Tichi",precio:150},
  {id:"ti_pt_limon",nombre:"Limon Tichi",precio:150},
  {id:"ti_pt_naranja",nombre:"Naranja Tichi",precio:150},
  {id:"ti_pt_maracuya",nombre:"Maracuya Tichi",precio:150},
  {id:"ti_pt_cereza",nombre:"Cereza Tichi",precio:150},
  {id:"ti_pt_pina",nombre:"Pina Tichi",precio:150},
  {id:"ti_pt_mango",nombre:"Mango Tichi",precio:150},
];
var MENU_TICHI_CAFE = [
  {id:"ti_pt_banana",nombre:"Banana Tichi",precio:150},
  {id:"ti_pt_taro",nombre:"Taro Tichi",precio:150},
  {id:"ti_pt_vainilla",nombre:"Vainilla Tichi",precio:150},
  {id:"ti_pt_choc_j",nombre:"Chocolate",precio:150},
  {id:"ti_pt_cajeta",nombre:"Cajeta Tichi",precio:150},
  {id:"ti_pt_coco",nombre:"Coco Tichi",precio:150},
  {id:"ti_pt_avellana",nombre:"Avellana Tichi",precio:150},
];
var MENU_TICHI_BASES = [
  {id:"ti_pt_base_neutra",nombre:"Base Neutra 1kg",precio:160},
  {id:"ti_pt_base_crystal",nombre:"Base Crystal 1kg",precio:150},
  {id:"ti_pt_base_horchata",nombre:"Base Horchata 1kg",precio:230},
  {id:"ti_pt_choc_polvo",nombre:"Chocolate en polvo 1kg",precio:175},
  {id:"ti_pt_azucar_masa",nombre:"Azucar para masa 240g",precio:16},
];

var TIENDAS=[{id:"centro",nombre:"Crepisimo Centro",emoji:"🏪"},{id:"sanantonio",nombre:"Crepisimo San Antonio",emoji:"🏬"},{id:"amburger",nombre:"AM-Burger San Antonio",emoji:"🍔"},{id:"tichi",nombre:"Tichi",emoji:"🧪"}];
function mkInsumos(){return INSUMOS_INIT.map(function(i){return Object.assign({},i,{stock:0});});}

function ModalTransferencia(props){
  var insumos=props.insumos,tiendaId=props.tiendaId,onTransferir=props.onTransferir,onClose=props.onClose;
  var otraNombre=tiendaId==="centro"?"San Antonio":"Centro";
  var s=useState({dir:"salida",insumoId:"",cantidad:"",busqueda:"",err:""});
  var v=s[0];var set=s[1];
  function updL(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
  var insumoSel=insumos.find(function(i){return i.id===v.insumoId;});
  var filtrados=insumos.filter(function(i){return i.nombre.toLowerCase().indexOf(v.busqueda.toLowerCase())>=0;});
  function confirmar(){
    if(!v.insumoId||!v.cantidad||isNaN(v.cantidad)||parseFloat(v.cantidad)<=0){updL("err","Selecciona insumo y cantidad");return;}
    onTransferir({insumoId:v.insumoId,insumoNombre:insumoSel?insumoSel.nombre:"",cantidad:parseFloat(v.cantidad),unidad:insumoSel?insumoSel.unidad:"",dir:v.dir});
  }
  return re("div",{style:OV},re("div",{style:MD},
    re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:4}},"Transferencia de insumos"),
    re("div",{style:{fontSize:13,color:"#888",marginBottom:14}},"Entre "+(tiendaId==="centro"?"Centro":"San Antonio")+" y "+otraNombre),
    re("div",{style:{display:"flex",gap:6,marginBottom:14,background:"#f5f5f5",borderRadius:12,padding:4}},
      [["salida","Sale de aqui -> "+otraNombre],["entrada","Llega de "+otraNombre]].map(function(x){
        var id=x[0],l=x[1],sel=v.dir===id;
        return re("button",{key:id,onClick:function(){updL("dir",id);},style:{flex:1,padding:"10px 6px",border:"none",borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"transparent",color:sel?"#fff":"#888",fontSize:11,textAlign:"center"}},l);
      })
    ),
    re("div",{style:{marginBottom:10}},
      re("div",{style:LB},"Insumo *"),
      re("input",{placeholder:"Buscar insumo...",value:v.busqueda,onChange:function(e){updL("busqueda",e.target.value);},style:IP}),
      v.busqueda?re("div",{style:{border:"1px solid #e0e0e0",borderRadius:9,marginTop:4,maxHeight:150,overflowY:"auto"}},
        filtrados.slice(0,8).map(function(i){var sel=v.insumoId===i.id;return re("div",{key:i.id,onClick:function(){var n={};for(var k in v)n[k]=v[k];n.insumoId=i.id;n.busqueda=i.nombre;set(n);},style:{padding:"9px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f5f5f5",background:sel?C.greenL:"#fff",color:sel?C.green:"#333"}},i.nombre+" - Stock: "+fmtC(i.stock||0,i.unidad));})
      ):null
    ),
    insumoSel?re("div",{style:{background:v.dir==="salida"?C.amberL:C.greenL,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,fontWeight:600,color:"#555"}},v.dir==="salida"?"Disponible: "+fmtC(insumoSel.stock||0,insumoSel.unidad):"Llega a esta tienda desde "+otraNombre):null,
    re("div",{style:{marginBottom:18}},
      re("div",{style:LB},"Cantidad"+(insumoSel?" ("+insumoSel.unidad+")":"")),
      re("input",{type:"number",placeholder:"0",value:v.cantidad,onChange:function(e){updL("cantidad",e.target.value);},style:Object.assign({},IP,{fontSize:20,fontWeight:700,textAlign:"center"})})
    ),
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    re("div",{style:{display:"flex",gap:10}},
      re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
      re("button",{onClick:confirmar,style:BS(C.teal,"#fff",2)},"Transferir")
    )
  ));
}

function ModalPromoAmb(props){
  var promo=props.promo,onAdd=props.onAdd,onClose=props.onClose;
  var tipo=promo.tipo;
  var BURGS=MENU_AMB[0].prods;
  var HDS=MENU_AMB[1].prods;
  var TODOS=BURGS.concat(HDS);
  var BEBS=["Refresco","Horchata","Jamaica","Agua Embotellada"];
  var BEB_RK={"Refresco":"Bebida","Horchata":"Horchata","Jamaica":"Jamaica","Agua Embotellada":"Agua Bot"};

  var s=useState({b1:"",b2:"",b3:"",hd:"",beb1:"",beb2:"",beb3:"",beb4:"",err:""});
  var v=s[0];var set=s[1];
  function updL(k,val){set(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}

  function SelBtn(opts,val,onChange,lbl){
    return re("div",{style:{marginBottom:12}},
      re("div",{style:LB},lbl),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}},
        opts.map(function(o){
          var key=typeof o==="string"?o:(o.lbl||o.n),rk=typeof o==="string"?o:(o.n),sel=val===key;
          return re("button",{key:key,onClick:function(){onChange(key,rk);},style:{padding:"8px 4px",border:"2px solid "+(sel?"#D34633":"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:400,background:sel?"#FFDCDC":"#fff",color:sel?"#D34633":"#555",fontSize:11,textAlign:"center"}},key);
        })
      )
    );
  }

  var body=null;
  if(tipo==="amb_combo_simple"){
    body=re("div",null,
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Elige el producto y agrega +$49 por papas y bebida."),
      SelBtn(TODOS,v.b1,function(k){updL("b1",k);},"Hamburguesa o Hot Dog"),
      SelBtn(BEBS,v.beb1,function(k){updL("beb1",k);},"Bebida"),
      v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:8}},v.err):null,
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.b1||!v.beb1){updL("err","Selecciona producto y bebida");return;}
          var prod=TODOS.find(function(x){return (x.lbl||x.n)===v.b1;});
          var precio=prod?prod.p:0;
          onAdd([
            {nombre:v.b1,precio:precio,recetaKey:prod?prod.n:"",paraLlevar:"",usaVegetal:false},
            {nombre:"Papas Fritas (combo)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false},
            {nombre:v.beb1+" (combo)",precio:49,recetaKey:BEB_RK[v.beb1]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
          ]);
        },style:BS("#D34633","#fff",2)},"Agregar combo")
      )
    );
  } else if(tipo==="amb_combo_2x2"){
    var BURGS2=[{n:"Caramel",lbl:"Caramel",p:110},{n:"Light",lbl:"Light",p:99}];
    body=re("div",null,
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"2 hamburguesas (Caramel o Light) + 2 papas + 2 bebidas (horchata o jamaica) - $229"),
      SelBtn(BURGS2,v.b1,function(k){updL("b1",k);},"Hamburguesa 1"),
      SelBtn(BURGS2,v.b2,function(k){updL("b2",k);},"Hamburguesa 2"),
      SelBtn(["Horchata","Jamaica"],v.beb1,function(k){updL("beb1",k);},"Bebida 1"),
      SelBtn(["Horchata","Jamaica"],v.beb2,function(k){updL("beb2",k);},"Bebida 2"),
      v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:8}},v.err):null,
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.b1||!v.b2||!v.beb1||!v.beb2){updL("err","Completa todos los campos");return;}
          onAdd([
            {nombre:v.b1,precio:229,recetaKey:v.b1,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.b2+" (2en2)",precio:0,recetaKey:v.b2,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (2en2)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (2en2)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb1+" (2en2)",precio:0,recetaKey:BEB_RK[v.beb1]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb2+" (2en2)",precio:0,recetaKey:BEB_RK[v.beb2]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
          ]);
        },style:BS("#D34633","#fff",2)},"Agregar - $229")
      )
    );
  } else if(tipo==="amb_combo_todo"){
    body=re("div",null,
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"3 hamburguesas + 1 hotdog + 4 papas + 4 bebidas - $499"),
      SelBtn(BURGS,v.b1,function(k){updL("b1",k);},"Hamburguesa 1"),
      SelBtn(BURGS,v.b2,function(k){updL("b2",k);},"Hamburguesa 2"),
      SelBtn(BURGS,v.b3,function(k){updL("b3",k);},"Hamburguesa 3"),
      SelBtn(HDS,v.hd,function(k){updL("hd",k);},"Hot Dog"),
      SelBtn(BEBS,v.beb1,function(k){updL("beb1",k);},"Bebida 1"),
      SelBtn(BEBS,v.beb2,function(k){updL("beb2",k);},"Bebida 2"),
      SelBtn(BEBS,v.beb3,function(k){updL("beb3",k);},"Bebida 3"),
      SelBtn(BEBS,v.beb4,function(k){updL("beb4",k);},"Bebida 4"),
      v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:8}},v.err):null,
      re("div",{style:{display:"flex",gap:10,marginTop:14}},
        re("button",{onClick:onClose,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          if(!v.b1||!v.b2||!v.b3||!v.hd||!v.beb1||!v.beb2||!v.beb3||!v.beb4){updL("err","Completa todos los campos");return;}
          onAdd([
            {nombre:v.b1,precio:499,recetaKey:v.b1,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.b2+" (combo)",precio:0,recetaKey:v.b2,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.b3+" (combo)",precio:0,recetaKey:v.b3,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.hd+" (combo)",precio:0,recetaKey:v.hd,paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (combo)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (combo)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (combo)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:"Papas (combo)",precio:0,recetaKey:"Papas",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb1+" (combo)",precio:0,recetaKey:BEB_RK[v.beb1]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb2+" (combo)",precio:0,recetaKey:BEB_RK[v.beb2]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb3+" (combo)",precio:0,recetaKey:BEB_RK[v.beb3]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
            {nombre:v.beb4+" (combo)",precio:0,recetaKey:BEB_RK[v.beb4]||"Bebida",paraLlevar:"",usaVegetal:false,esPromo:true},
          ]);
        },style:BS("#D34633","#fff",2)},"Agregar - $499")
      )
    );
  }

  return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
    re("div",{style:{fontSize:18,fontWeight:900,color:"#1a237e",marginBottom:4}},promo.emoji+" "+promo.nombre),
    re("div",{style:{height:2,background:"#FFC107",borderRadius:2,marginBottom:14}}),
    v.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},v.err):null,
    body
  ));
}

function POSAmburger(props){
  var tiendaId=props.tiendaId,insumos=props.insumos,setInsumos=props.setInsumos;
  var onVenta=props.onVenta,onGasto=props.onGasto,ventas=props.ventas,gastos=props.gastos;

  var s1=useState(null);var catActiva=s1[0];var setCat=s1[1];
  var s2=useState(false);var verPromos=s2[0];var setVerPromos=s2[1];
  var s3=useState([]);var orden=s3[0];var setOrden=s3[1];
  var s4=useState(null);var modalPromo=s4[0];var setModalPromo=s4[1];
  var s5=useState(false);var modalCobro=s5[0];var setModalCobro=s5[1];
  var s6=useState(false);var modalGasto=s6[0];var setModalGasto=s6[1];
  var s7=useState(false);var modalDesc=s7[0];var setModalDesc=s7[1];
  var s8=useState(false);var exito=s8[0];var setExito=s8[1];
  var s9vc=useState(false);var verCorte=s9vc[0];var setVerCorte=s9vc[1];
  var s9pc=useState(false);var modalPinCorte=s9pc[0];var setModalPinCorte=s9pc[1];
  var s9fc=useState(hoy());var fechaCorte=s9fc[0];var setFechaCorte=s9fc[1];
  var s9=useState(false);var modalExtras=s9[0];var setModalExtras=s9[1];
  var s10=useState(null);var prodBase=s10[0];var setProdBase=s10[1];

  var total=orden.reduce(function(s,i){return s+i.precio;},0);
  var totalDisplay=Math.max(0,total);

  var COLORES_AMB={dark:"#1a237e",orange:"#FF6F00",bg:"#fff8e1"};

  function agregarItem(item){setOrden(function(p){return p.concat([Object.assign({},item,{id:Date.now()+Math.random()})]);});setModalPromo(null);setModalDesc(false);setModalExtras(false);}
  function agregarItems(items){setOrden(function(p){return p.concat(items.map(function(item){return Object.assign({},item,{id:Date.now()+Math.random()});}));});setModalPromo(null);}

  function abrirProducto(cat,prod){
    if(cat.tipo==="amb_simple"){
      var n=typeof prod==="string"?prod:prod.n;
      agregarItem({nombre:n,precio:cat.precio,recetaKey:n,paraLlevar:"",usaVegetal:false});return;
    }
    if(cat.tipo==="amb_beb"){
      agregarItem({nombre:prod.lbl||prod.n,precio:cat.precio,recetaKey:prod.rk||prod.n,paraLlevar:"",usaVegetal:false});return;
    }
    // hamburguesas y hotdogs: preguntar para llevar y extras
    setProdBase({cat:cat,prod:prod});setModalExtras(true);
  }

  function confirmarCobro(info){
    var deltas={};
    function addDelta(id,amt){deltas[id]=(deltas[id]||0)-amt;}
    var hayParaLlevar=orden.some(function(item){return item.paraLlevar==="Para llevar";});
    orden.forEach(function(item){
      if(item.esDescuento)return;
      var rec=R_AMB[item.recetaKey]||[];
      rec.forEach(function(r){addDelta(r.id,r.c);});
    });
    if(hayParaLlevar)addDelta("amb_bolsa_papel",1);
    updateStockDelta(tiendaId,Object.keys(deltas).map(function(id){return {id:id,delta:deltas[id]};}));
    setInsumos(function(prev){return prev.map(function(ins){return deltas[ins.id]!==undefined?Object.assign({},ins,{stock:Math.max(0,(ins.stock||0)+deltas[ins.id])}):ins;});});
    var _va=Object.assign({},info,{tienda:tiendaId,total:totalDisplay,items:orden,timestamp:new Date().toISOString()});onVenta(_va);window.imprimirTicket&&window.imprimirTicket(_va,tiendaId);
    setOrden([]);setModalCobro(false);setCat(null);setVerPromos(false);
    setExito(true);setTimeout(function(){setExito(false);},2000);
  }

  function confirmarGasto(gasto){
    if(gasto.tipo==="insumo"&&gasto.insumoId){
      setInsumos(function(p){return p.map(function(i){return i.id===gasto.insumoId?Object.assign({},i,{stock:(i.stock||0)+gasto.cantidad}):i;});});
    }
    onGasto(Object.assign({},gasto,{tienda:tiendaId,seccion:"caja"}));setModalGasto(false);
  }

  var hoyStr=fechaCorte;
  var ventasHoy=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===hoyStr;})()&&v.estadoPago!=="reembolsado";});
  var gastosCajaHoy=gastos.filter(function(g){return g.tienda===tiendaId&&g.seccion==="caja"&&g.timestamp&&(function(){var d=new Date(g.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===hoyStr;})();});
  var tv=ventasHoy.reduce(function(s,v){return s+v.total;},0);
  var tEf=ventasHoy.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var tTr=ventasHoy.filter(function(v){return v.metodo==="transferencia";}).reduce(function(s,v){return s+v.total;},0);
  var tCl=ventasHoy.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.netoRecibido;},0);
  var tComCl=ventasHoy.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.comisionClip;},0);
  var tDidi=ventasHoy.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tDidiPorPagar=ventasHoy.filter(function(v){return v.metodo==="didi"&&v.estadoPago==="por_pagar";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
    var tDidi=ventasHoy.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tDidiPorPagar=ventasHoy.filter(function(v){return v.metodo==="didi"&&v.estadoPago==="por_pagar";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tGasCaja=gastosCajaHoy.reduce(function(s,g){return s+g.monto;},0);
  var efCaja=tEf-tGasCaja;
  var alertas=insumos.filter(function(i){return (i.stock||0)>0&&(i.stock||0)<=i.minimo;});
  var agotados=insumos.filter(function(i){return (i.stock||0)===0&&i.minimo>0;});

  var AMB_DARK="#1a237e"; var AMB_ORANGE="#FF6F00";
  var AMB_CAT={background:"#fff3e0",border:"2px solid "+AMB_ORANGE,borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"14px 8px"};
  var AMB_PROD={aspectRatio:"1",background:"#fff",border:"2px solid #e0e0e0",borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:8,boxShadow:"0 1px 4px rgba(0,0,0,.06)"};

  return re("div",{style:{padding:"10px 10px 70px"}},
    exito?re("div",{style:{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:AMB_ORANGE,color:"#fff",padding:"12px 28px",borderRadius:50,fontWeight:800,fontSize:16,zIndex:300,whiteSpace:"nowrap"}},"Venta registrada"):null,



    !catActiva&&!verPromos?re("div",null,
      re("div",{style:{display:"flex",gap:8,marginBottom:14}},
        re("button",{onClick:function(){setVerPromos(true);},style:{flex:1,padding:13,background:"#fff3e0",color:AMB_DARK,border:"2px solid "+AMB_ORANGE,borderRadius:12,fontWeight:800,fontSize:13,cursor:"pointer"}},"Combos"),
        re("button",{onClick:function(){setModalDesc(true);},style:{flex:1,padding:13,background:C.purpleL,color:C.dark,border:"2px solid "+C.purple,borderRadius:12,fontWeight:800,fontSize:13,cursor:"pointer"}},"Descuento"),
        re("button",{onClick:function(){setModalGasto(true);},style:{flex:1,padding:9,background:C.redL,color:C.red,border:"2px solid "+C.red,borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer"}},"+ Gasto")
      ),
      re("div",{style:SC},"Menu"),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}},
        MENU_AMB.map(function(cat){return re("button",{key:cat.id,onClick:function(){setCat(cat);},style:AMB_CAT},
          re("div",{style:{fontSize:22}},cat.emoji),
          re("div",{style:{fontSize:11,fontWeight:800,color:AMB_DARK,marginTop:3,textAlign:"center",lineHeight:1.2}},cat.nombre),
          cat.precio?re("div",{style:{fontSize:11,color:"#aaa",marginTop:2}},fmt(cat.precio)):null
        );})
      )
    ):null,

    verPromos?re("div",null,
      re("button",{onClick:function(){setVerPromos(false);},style:{background:"none",border:"none",color:AMB_DARK,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:12,padding:0}},"<- Menu"),
      re("div",{style:SC},"Combos"),
      PROMOS_AMB.map(function(promo){return re("button",{key:promo.id,onClick:function(){setModalPromo(promo);},style:{background:"#fff3e0",border:"2px solid "+AMB_ORANGE,borderRadius:12,cursor:"pointer",padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8,width:"100%"}},
        re("div",{style:{fontSize:28}},promo.emoji),
        re("div",{style:{flex:1,textAlign:"left"}},re("div",{style:{fontSize:14,fontWeight:800,color:AMB_DARK}},promo.nombre)),
        re("div",{style:{fontSize:20,color:AMB_ORANGE}},"->")
      );})
    ):null,

    catActiva?re("div",null,
      re("button",{onClick:function(){setCat(null);},style:{background:"none",border:"none",color:AMB_DARK,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:12,padding:0}},"<- Menu"),
      re("div",{style:SC},catActiva.emoji+" "+catActiva.nombre),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}},
        catActiva.prods.map(function(prod,i){
          var nombre=typeof prod==="string"?prod:(prod.lbl||prod.n);
          var precio=typeof prod==="object"&&prod.p?prod.p:catActiva.precio;
          return re("button",{key:i,onClick:function(){abrirProducto(catActiva,prod);},style:AMB_PROD},
            re("div",{style:{fontSize:12,fontWeight:800,color:AMB_DARK,textAlign:"center",lineHeight:1.3}},nombre),
            re("div",{style:{fontSize:12,color:AMB_ORANGE,fontWeight:700,marginTop:5}},fmt(precio))
          );
        })
      )
    ):null,

    orden.length>0?re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Orden actual"),
      orden.map(function(item,i){
        return re("div",{key:item.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:i<orden.length-1?"1px solid #f5f5f5":"none"}},
          re("div",{style:{flex:1,paddingRight:8}},
            re("div",{style:{fontSize:14,fontWeight:600,color:item.esDescuento?C.purple:AMB_DARK}},item.nombre),
            item.paraLlevar?re("div",{style:{fontSize:11,color:"#aaa",marginTop:1}},item.paraLlevar):null,
            item.esPromo?re("div",{style:{fontSize:10,color:AMB_ORANGE,fontWeight:700,marginTop:1}},"COMBO"):null,
            item.esDescuento?re("div",{style:{fontSize:10,color:C.purple,fontWeight:700,marginTop:1}},"DESCUENTO"):null
          ),
          re("div",{style:{display:"flex",alignItems:"center",gap:8,flexShrink:0}},
            re("div",{style:{fontSize:14,fontWeight:700,color:item.precio===0?"#aaa":item.precio<0?C.purple:AMB_ORANGE}},
              item.precio===0?"GRATIS":item.precio<0?"-"+fmt(Math.abs(item.precio)):fmt(item.precio)),
            re("button",{onClick:function(){var idx=i;setOrden(function(p){return p.filter(function(_,j){return j!==idx;});});},style:{background:C.redL,border:"none",color:C.red,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,fontWeight:700}},"X")
          )
        );
      }),
      re("div",{style:{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"2px solid #f0f0f0"}},
        re("span",{style:{fontSize:16,fontWeight:800,color:AMB_DARK}},"Total"),
        re("span",{style:{fontSize:20,fontWeight:900,color:AMB_ORANGE}},fmt(totalDisplay))
      ),
      re("button",{onClick:function(){setModalCobro(true);},style:{width:"100%",marginTop:12,padding:15,background:AMB_ORANGE,color:"#fff",border:"none",borderRadius:12,fontWeight:900,fontSize:17,cursor:"pointer"}},"Cobrar "+fmt(totalDisplay))
    ):null,

    verCorte?re("div",{style:{background:AMB_DARK,borderRadius:16,padding:18,color:"#fff",marginTop:14}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        re("div",{style:{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,opacity:.6}},"Corte del dia"),
        re("button",{onClick:function(){setVerCorte(false);},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}},"Ocultar")
      ),
      re("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()-1);setFechaCorte(d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2));},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:"pointer",fontWeight:800}},"‹"),
        re("div",{style:{flex:1,textAlign:"center"}},
          re("div",{style:{fontSize:12,color:"rgba(255,255,255,.9)",fontWeight:700}},fechaCorte===hoy()?"HOY - "+fechaCorte:new Date(fechaCorte+"T12:00:00").toLocaleDateString("es-MX",{weekday:"short",day:"2-digit",month:"short"})+" - "+fechaCorte)
        ),
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()+1);var nd=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);if(nd<=hoy())setFechaCorte(nd);},disabled:fechaCorte>=hoy(),style:{background:fechaCorte>=hoy()?"rgba(255,255,255,.05)":"rgba(255,255,255,.15)",border:"none",color:fechaCorte>=hoy()?"rgba(255,255,255,.2)":"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:fechaCorte>=hoy()?"default":"pointer",fontWeight:800}},"›")
      ),
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
        [["Ventas hoy",tv,"#a5d6a7"],["Efectivo en caja",efCaja,efCaja>=0?"#a5d6a7":"#ef9a9a"],["Transferencias",tTr,"#90caf9"],["Clip (neto)",tCl,"#ce93d8"]].map(function(x){
          return re("div",{key:x[0],style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px"}},
            re("div",{style:{fontSize:11,opacity:.65,marginBottom:3}},x[0]),
            re("div",{style:{fontSize:17,fontWeight:900,color:x[2]}},fmt(x[1]))
          );
        })
      ),
      tDidi>0?re("div",{style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px",marginBottom:10}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          re("div",null,re("div",{style:{fontSize:11,opacity:.65}},"Didi Food (T. Migue)"),re("div",{style:{fontSize:17,fontWeight:900,color:"#FFB74D"}},fmt(tDidi))),
          tDidiPorPagar>0?re("div",{style:{background:"rgba(255,109,0,.3)",borderRadius:8,padding:"3px 8px",fontSize:11,color:"#FFB74D",fontWeight:700}},"Por pagar: "+fmt(tDidiPorPagar)):re("div",{style:{fontSize:11,color:"#a5d6a7",fontWeight:600}},"Cobrado")
        )
      ):null,
      tDidi>0?re("div",{style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px",marginBottom:10}},re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},re("div",null,re("div",{style:{fontSize:11,opacity:.65}},"Didi Food (T. Migue)"),re("div",{style:{fontSize:17,fontWeight:900,color:"#FFB74D"}},fmt(tDidi))),tDidiPorPagar>0?re("div",{style:{background:"rgba(255,109,0,.3)",borderRadius:8,padding:"3px 8px",fontSize:11,color:"#FFB74D",fontWeight:700}},"Por pagar: "+fmt(tDidiPorPagar)):re("div",{style:{fontSize:11,color:"#a5d6a7",fontWeight:600}},"Cobrado"))):null,
      gastosCajaHoy.length>0?re("div",{style:{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:12}},
        re("div",{style:{fontSize:11,opacity:.5,marginBottom:8,textTransform:"uppercase"}},"Gastos de caja hoy"),
        gastosCajaHoy.map(function(g,i){
          var desc=g.tipo==="insumo"?"Insumo: "+(g.insumoNombre||"")+" ("+fmtC(g.cantidad,g.unidad)+")":g.tipo==="colaborador"?"Colab: "+(g.desc||""):g.tipo==="operativo"?"Operativo: "+(g.desc||""):"Otro: "+(g.desc||"");
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}},
            re("span",{style:{opacity:.75}},desc),re("span",{style:{color:"#ef9a9a"}},fmt(g.monto))
          );
        })
      ):null,
      ventasHoy.length===0&&gastosCajaHoy.length===0?re("div",{style:{textAlign:"center",opacity:.35,fontSize:13}},"Sin movimientos hoy"):null
    ):re("button",{onClick:function(){setModalPinCorte(true);},style:{width:"100%",padding:"14px",background:AMB_DARK,color:"#fff",border:"none",borderRadius:14,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}},re("span",null,"🔒"),re("span",null,"Ver corte del dia")),

    (alertas.length>0||agotados.length>0)?re("div",{style:{background:C.amberL,border:"2px solid "+C.amber,borderRadius:12,padding:"12px 14px",marginTop:14}},
      re("div",{style:{fontSize:12,fontWeight:800,color:C.amber,marginBottom:6}},"Alertas de inventario"),
      agotados.map(function(i){return re("div",{key:i.id,style:{fontSize:12,color:C.red,marginBottom:2}},"AGOTADO: "+i.nombre);}),
      alertas.map(function(i){return re("div",{key:i.id,style:{fontSize:12,color:C.amber,marginBottom:2}},"Stock bajo: "+i.nombre+" ("+fmtC(i.stock||0,i.unidad)+")");})
    ):null,
    modalPinCorte?re(ModalPin,{onAcceso:function(){setVerCorte(true);setModalPinCorte(false);},onClose:function(){setModalPinCorte(false);}}):null,
    modalPromo?re(ModalPromoAmb,{promo:modalPromo,onAdd:agregarItems,onClose:function(){setModalPromo(null);}}):null,
    modalCobro?re(ModalCobro,{total:totalDisplay,onConfirmar:confirmarCobro,onClose:function(){setModalCobro(false);}}):null,
    modalGasto?re(ModalGasto,{insumos:insumos,onGuardar:confirmarGasto,onClose:function(){setModalGasto(false);}}):null,
    modalDesc?re(ModalDescuento,{onAdd:function(item){agregarItem(item);},onClose:function(){setModalDesc(false);}}):null,

    // Modal para hamburguesa/hotdog con extras y para llevar
    modalExtras&&prodBase?re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:20,fontWeight:900,color:AMB_DARK,marginBottom:4}},prodBase.prod.lbl||prodBase.prod.n),
      re("div",{style:{fontSize:16,color:AMB_ORANGE,fontWeight:700,marginBottom:14}},fmt(prodBase.prod.p)),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Para llevar o aqui?"),
        re("div",{style:{display:"flex",gap:8}},
          ["Aqui","Para llevar"].map(function(t){
            return re("button",{key:t,style:{flex:1,padding:"10px",border:"2px solid #e0e0e0",borderRadius:10,cursor:"pointer",background:"#fff",color:"#666",fontSize:13},onClick:function(){
              agregarItem({nombre:prodBase.prod.lbl||prodBase.prod.n,precio:prodBase.prod.p,recetaKey:prodBase.prod.n,paraLlevar:t,usaVegetal:false});
            }},t);
          })
        )
      ),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Extras (opcional)"),
        re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},
          EXTRAS_AMB.map(function(ext){
            return re("button",{key:ext.n,onClick:function(){
              agregarItem({nombre:ext.n,precio:ext.precio,recetaKey:"__extra__",extraRec:ext.rec,paraLlevar:"",usaVegetal:false});
            },style:{padding:"10px 8px",border:"2px solid #e0e0e0",borderRadius:10,cursor:"pointer",background:"#fff",color:AMB_DARK,fontSize:12,textAlign:"center",fontWeight:600}},
              ext.n+" "+fmt(ext.precio)
            );
          })
        )
      ),
      re("button",{onClick:function(){setModalExtras(false);setProdBase(null);},style:Object.assign({},BS("#f0f0f0","#666"),{width:"100%",marginTop:8})},"Cerrar")
    )):null
  );
}

function POSTichi(props){
  var tiendaId=props.tiendaId,insumos=props.insumos,setInsumos=props.setInsumos;
  var onVenta=props.onVenta,onGasto=props.onGasto,ventas=props.ventas,gastos=props.gastos;

  var s1=useState([]);var orden=s1[0];var setOrden=s1[1];
  var s2=useState(false);var modalCobro=s2[0];var setModalCobro=s2[1];
  var s3=useState(false);var modalGasto=s3[0];var setModalGasto=s3[1];
  var s4=useState(false);var modalDesc=s4[0];var setModalDesc=s4[1];
  var s5=useState(false);var modalEnvio=s5[0];var setModalEnvio=s5[1];
  var s6=useState(false);var exito=s6[0];var setExito=s6[1];
  var s7c=useState(false);var verCorte=s7c[0];var setVerCorte=s7c[1];
  var s8c=useState(false);var modalPinCorte=s8c[0];var setModalPinCorte=s8c[1];
  var s9fc=useState(hoy());var fechaCorte=s9fc[0];var setFechaCorte=s9fc[1];
  var s7=useState("");var envioMonto=s7[0];var setEnvioMonto=s7[1];

  var total=orden.reduce(function(s,i){return s+i.precio;},0);
  var totalDisplay=Math.max(0,total);

  function agregarItem(item){setOrden(function(p){return p.concat([Object.assign({},item,{id:Date.now()+Math.random()})]);});setModalDesc(false);}

  function agregarEnvio(){
    if(!envioMonto||isNaN(envioMonto)||parseFloat(envioMonto)<=0)return;
    setOrden(function(p){return p.concat([{id:Date.now()+Math.random(),nombre:"Envio",precio:parseFloat(envioMonto),recetaKey:"__envio__",esEnvio:true}]);});
    setModalEnvio(false);setEnvioMonto("");
  }

  function abrirProducto(prod){
    agregarItem({nombre:prod.nombre,precio:prod.precio,recetaKey:prod.id,paraLlevar:"",usaVegetal:false});
  }

  function confirmarCobro(info){
    var envioItems=orden.filter(function(i){return i.esEnvio;});
    var totalEnvio=envioItems.reduce(function(s,i){return s+i.precio;},0);
    var deltas={};
    function addDelta(id,amt){deltas[id]=(deltas[id]||0)-amt;}
    orden.forEach(function(item){
      if(item.esEnvio||item.esDescuento)return;
      var receta=R_TICHI_PROD[item.recetaKey]||[];
      receta.forEach(function(r){addDelta(r.id,r.c);});
    });
    updateStockDelta(tiendaId,Object.keys(deltas).map(function(id){return {id:id,delta:deltas[id]};}));
    setInsumos(function(prev){return prev.map(function(ins){return deltas[ins.id]!==undefined?Object.assign({},ins,{stock:Math.max(0,(ins.stock||0)+deltas[ins.id])}):ins;});});
    if(totalEnvio>0){
      onGasto({seccion:"caja",tipo:"operativo",monto:totalEnvio,desc:"Costo envio",tienda:tiendaId,timestamp:new Date().toISOString()});
    }
    var ventaObjT=Object.assign({},info,{tienda:tiendaId,total:totalDisplay,items:orden,timestamp:new Date().toISOString()});
    onVenta(ventaObjT);

    window.imprimirTicket&&window.imprimirTicket(ventaObjT,tiendaId);
    setOrden([]);setModalCobro(false);
    setExito(true);setTimeout(function(){setExito(false);},2000);
  }

  function confirmarGasto(gasto){
    onGasto(Object.assign({},gasto,{tienda:tiendaId,seccion:"caja"}));setModalGasto(false);
  }

  var hoyStr=fechaCorte;
  var ventasHoy=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===hoyStr;})()&&v.estadoPago!=="reembolsado";});
  var gastosCajaHoy=gastos.filter(function(g){return g.tienda===tiendaId&&g.seccion==="caja"&&g.timestamp&&(function(){var d=new Date(g.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===hoyStr;})();});
  var tv=ventasHoy.reduce(function(s,v){return s+v.total;},0);
  var tEf=ventasHoy.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var tTr=ventasHoy.filter(function(v){return v.metodo==="transferencia";}).reduce(function(s,v){return s+v.total;},0);
  var tCl=ventasHoy.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.netoRecibido;},0);
  var tML=ventasHoy.filter(function(v){return v.metodo==="mercadolibre";}).reduce(function(s,v){return s+v.total;},0);
  var tMLNeto=ventasHoy.filter(function(v){return v.metodo==="mercadolibre";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tMLComision=ventasHoy.filter(function(v){return v.metodo==="mercadolibre";}).reduce(function(s,v){return s+(v.comisionML||0);},0);
  var tMLPorPagar=ventasHoy.filter(function(v){return v.metodo==="mercadolibre"&&v.estadoPago==="por_pagar";}).reduce(function(s,v){return s+v.total;},0);
  var tGasCaja=gastosCajaHoy.reduce(function(s,g){return s+g.monto;},0);
  var efCaja=tEf-tGasCaja;
  var alertas=insumos.filter(function(i){return (i.stock||0)>0&&(i.stock||0)<=i.minimo;});
  var agotados=insumos.filter(function(i){return (i.stock||0)===0&&i.minimo>0;});

  var TODOS_PROD=MENU_TICHI_SODAS.concat(MENU_TICHI_CAFE).concat(MENU_TICHI_BASES);

  function renderCategoria(lista,titulo){
    return re("div",{style:{marginBottom:16}},
      re("div",{style:{fontSize:12,fontWeight:700,color:TC.dark,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}},titulo),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}},
        lista.map(function(prod){
          var receta=R_TICHI_PROD[prod.id]||[];
          var potencial=calcPotencial(insumos,receta);
          return re("button",{key:prod.id,onClick:function(){abrirProducto(prod);},style:{padding:"10px 6px",background:"#fff",border:"2px solid "+TC.mid,borderRadius:12,cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}},
            re("div",{style:{fontSize:11,fontWeight:800,color:TC.dark,textAlign:"center",lineHeight:1.3}},prod.nombre),
            re("div",{style:{fontSize:12,color:TC.accent,fontWeight:700,marginTop:4}},fmt(prod.precio)),
            potencial>0?re("div",{style:{fontSize:9,color:TC.mid,marginTop:2}},"MP para: "+potencial):re("div",{style:{fontSize:9,color:"#aaa",marginTop:2}},"Sin MP registrada")
          );
        })
      )
    );
  }

  function ModalCobroTichi(props2){
    var total2=props2.total,onConf=props2.onConfirmar,onCl=props2.onClose;
    var ms=useState({metodo:"",efectivo:"",montoML:"",terminalClip:""});var mv=ms[0];var mset=ms[1];
    function mupdL(k,val){mset(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}
    var clip2=total2*CLIP_RATE,neto2=total2-clip2;
    var efNum=parseFloat(mv.efectivo),efOk=mv.efectivo&&!isNaN(efNum)&&efNum>=total2;
    var cambio=efOk?efNum-total2:0;
    var montoMLNum=parseFloat(mv.montoML)||0;
    function conf(){
      if(!mv.metodo||(mv.metodo==="efectivo"&&!efOk))return;
      if(mv.metodo==="mercadolibre"&&montoMLNum<=0)return;
      onConf({metodo:mv.metodo,total:total2,comisionClip:mv.metodo==="clip"?clip2:0,netoRecibido:mv.metodo==="clip"?neto2:mv.metodo==="mercadolibre"?montoMLNum:total2,comisionML:mv.metodo==="mercadolibre"?total2-montoMLNum:0,cambio:mv.metodo==="efectivo"?cambio:0,terminalClip:mv.metodo==="clip"?mv.terminalClip:"",estadoPago:mv.metodo==="mercadolibre"?"por_pagar":"pagado"});
    }
    return re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:20,fontWeight:900,color:TC.dark,marginBottom:4}},"Cobrar"),
      re("div",{style:{fontSize:32,fontWeight:900,color:TC.accent,marginBottom:16}},fmt(total2)),
      re("div",{style:LB},"Metodo de pago"),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:14}},
        [["efectivo","💵","Efectivo"],["transferencia","📲","Transferencia"],["clip","💳","Clip"],["mercadolibre","🛒","Mercado Libre"]].map(function(x){
          var id=x[0],ico=x[1],l=x[2],sel=mv.metodo===id;
          return re("button",{key:id,onClick:function(){mupdL("metodo",id);},style:{padding:"12px 6px",border:"2px solid "+(sel?TC.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:sel?TC.dark:"#fff",color:sel?"#fff":"#888",fontWeight:sel?800:500,fontSize:12}},
            re("span",{style:{fontSize:18}},ico),re("span",null,l));
        })
      ),
      mv.metodo==="efectivo"?re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Con cuanto paga?"),
        re("input",{type:"number",placeholder:"0.00",value:mv.efectivo,onChange:function(e){mupdL("efectivo",e.target.value);},style:Object.assign({},IP,{fontSize:22,fontWeight:700,textAlign:"center"})}),
        efOk?re("div",{style:{marginTop:8,background:TC.bg,borderRadius:10,padding:12,textAlign:"center"}},re("div",{style:{fontSize:11,color:TC.dark,fontWeight:700,marginBottom:2}},"CAMBIO"),re("div",{style:{fontSize:28,fontWeight:900,color:TC.accent}},fmt(cambio))):null
      ):null,
      mv.metodo==="clip"?re("div",{style:{background:C.purpleL,borderRadius:10,padding:14,marginBottom:14}},
        re("div",{style:{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}},"Terminal"),
        re("div",{style:{display:"flex",gap:8,marginBottom:10}},
          [["migue","Terminal Migue"],["angel","Terminal Angel"]].map(function(x){var id=x[0],l=x[1],sel=mv.terminalClip===id;return re("button",{key:id,onClick:function(){mupdL("terminalClip",id);},style:{flex:1,padding:"9px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.purpleL:"#fff",color:sel?C.dark:"#888",fontSize:12}},l);})
        ),
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}},re("span",{style:{color:"#666"}},"Comision Clip (4.176%)"),re("span",{style:{color:C.purple,fontWeight:700}},"-"+fmt(clip2))),
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800}},re("span",{style:{color:C.purple}},"Neto a recibir"),re("span",{style:{color:C.purple}},fmt(neto2)))
      ):null,
      mv.metodo==="mercadolibre"?re("div",{style:{background:"#FFF8E1",borderRadius:10,padding:14,marginBottom:14,borderLeft:"4px solid #FFC107"}},
        re("div",{style:{fontSize:13,fontWeight:800,color:"#F57F17",marginBottom:8}},"Monto real que te deposita ML"),
        re("input",{type:"number",placeholder:"0.00",value:mv.montoML,onChange:function(e){mupdL("montoML",e.target.value);},style:Object.assign({},IP,{fontSize:20,fontWeight:700,textAlign:"center",marginBottom:8})}),
        montoMLNum>0?re("div",{style:{marginTop:8}},
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}},re("span",{style:{color:"#555"}},"Venta"),re("span",{style:{fontWeight:700}},fmt(total2))),
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}},re("span",{style:{color:"#555"}},"ML te deposita"),re("span",{style:{fontWeight:700,color:"#43A047"}},fmt(montoMLNum))),
          re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13}},re("span",{style:{color:"#555"}},"Comision ML"),re("span",{style:{fontWeight:700,color:C.red}},"-"+fmt(total2-montoMLNum)))
        ):re("div",{style:{fontSize:12,color:"#aaa",marginTop:4}},"Ingresa cuanto te deposita Mercado Libre")
      ):null,
      re("div",{style:{display:"flex",gap:10,marginTop:4}},
        re("button",{onClick:onCl,style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:conf,disabled:!mv.metodo||(mv.metodo==="efectivo"&&!efOk)||(mv.metodo==="mercadolibre"&&montoMLNum<=0),style:BS(mv.metodo?TC.dark:"#ccc","#fff",2)},mv.metodo==="mercadolibre"?"Registrar (por pagar)":"Confirmar venta")
      )
    ));
  }

  return re("div",{style:{padding:"10px 10px 70px"}},
    exito?re("div",{style:{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:TC.dark,color:"#fff",padding:"12px 28px",borderRadius:50,fontWeight:800,fontSize:16,zIndex:300,whiteSpace:"nowrap"}},"Venta registrada"):null,
    
    re("div",{style:{display:"flex",gap:8,marginBottom:14}},
      re("button",{onClick:function(){setModalDesc(true);},style:{flex:1,padding:12,background:C.purpleL,color:C.dark,border:"2px solid "+C.purple,borderRadius:12,fontWeight:800,fontSize:13,cursor:"pointer"}},"Descuento"),
      re("button",{onClick:function(){setModalGasto(true);},style:{flex:1,padding:12,background:C.redL,color:C.red,border:"2px solid "+C.red,borderRadius:12,fontWeight:800,fontSize:13,cursor:"pointer"}},"+ Gasto")
    ),
    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      renderCategoria(MENU_TICHI_SODAS,"Jarabes para Soda"),
      renderCategoria(MENU_TICHI_CAFE,"Jarabes para Cafe"),
      renderCategoria(MENU_TICHI_BASES,"Bases y Chocolate")
    ),
    orden.length>0?re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:SC},"Pedido actual"),
      orden.map(function(item,i){
        return re("div",{key:item.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<orden.length-1?"1px solid #f5f5f5":"none"}},
          re("div",{style:{flex:1}},
            re("div",{style:{fontSize:14,fontWeight:600,color:item.esEnvio?"#1565C0":item.esDescuento?C.purple:TC.dark}},item.nombre),
            item.esEnvio?re("div",{style:{fontSize:10,color:"#1565C0",fontWeight:600}},"ENVIO"):null,
            item.esDescuento?re("div",{style:{fontSize:10,color:C.purple,fontWeight:600}},"DESCUENTO"):null
          ),
          re("div",{style:{display:"flex",alignItems:"center",gap:8}},
            re("div",{style:{fontSize:14,fontWeight:700,color:item.precio<0?C.purple:TC.accent}},item.precio<0?"-"+fmt(Math.abs(item.precio)):fmt(item.precio)),
            re("button",{onClick:function(){var idx=i;setOrden(function(p){return p.filter(function(_,j){return j!==idx;});});},style:{background:C.redL,border:"none",color:C.red,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,fontWeight:700}},"X")
          )
        );
      }),
      re("div",{style:{display:"flex",gap:8,marginTop:10}},
        re("button",{onClick:function(){setModalEnvio(true);},style:{flex:1,padding:"10px",background:"#E3F2FD",color:"#1565C0",border:"2px solid #1565C0",borderRadius:10,fontWeight:700,fontSize:12,cursor:"pointer"}},"+ Agregar envio"),
        re("div",{style:{flex:2,display:"flex",justifyContent:"space-between",alignItems:"center",paddingLeft:12}},
          re("span",{style:{fontSize:16,fontWeight:800,color:TC.dark}},"Total"),
          re("span",{style:{fontSize:20,fontWeight:900,color:TC.accent}},fmt(totalDisplay))
        )
      ),
      re("button",{onClick:function(){setModalCobro(true);},style:{width:"100%",marginTop:10,padding:15,background:TC.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:900,fontSize:17,cursor:"pointer"}},"Cobrar "+fmt(totalDisplay))
    ):null,
    verCorte?re("div",{style:{background:TC.dark,borderRadius:16,padding:18,color:"#fff",marginTop:14}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        re("div",{style:{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,opacity:.6}},"Corte del dia"),
        re("button",{onClick:function(){setVerCorte(false);},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}},"Ocultar")
      ),
      re("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()-1);setFechaCorte(d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2));},style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:"pointer",fontWeight:800}},"‹"),
        re("div",{style:{flex:1,textAlign:"center"}},
          re("div",{style:{fontSize:12,color:"rgba(255,255,255,.9)",fontWeight:700}},fechaCorte===hoy()?"HOY - "+fechaCorte:new Date(fechaCorte+"T12:00:00").toLocaleDateString("es-MX",{weekday:"short",day:"2-digit",month:"short"})+" - "+fechaCorte)
        ),
        re("button",{onClick:function(){var d=new Date(fechaCorte+"T12:00:00");d.setDate(d.getDate()+1);var nd=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);if(nd<=hoy())setFechaCorte(nd);},disabled:fechaCorte>=hoy(),style:{background:fechaCorte>=hoy()?"rgba(255,255,255,.05)":"rgba(255,255,255,.15)",border:"none",color:fechaCorte>=hoy()?"rgba(255,255,255,.2)":"#fff",borderRadius:8,padding:"6px 14px",fontSize:18,cursor:fechaCorte>=hoy()?"default":"pointer",fontWeight:800}},"›")
      ),
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
        [["Ventas hoy",tv,"#a5d6a7"],["Efectivo en caja",efCaja,efCaja>=0?"#a5d6a7":"#ef9a9a"],["Transferencias",tTr,"#90caf9"],["Clip (neto)",tCl,"#ce93d8"]].map(function(x){
          return re("div",{key:x[0],style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px"}},
            re("div",{style:{fontSize:11,opacity:.65,marginBottom:3}},x[0]),
            re("div",{style:{fontSize:17,fontWeight:900,color:x[2]}},fmt(x[1]))
          );
        })
      ),
      tML>0?re("div",{style:{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"12px 14px",marginBottom:10}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}},
          re("div",null,re("div",{style:{fontSize:11,opacity:.65}},"Mercado Libre (neto)"),re("div",{style:{fontSize:17,fontWeight:900,color:"#FFF176"}},fmt(tMLNeto))),
          tMLPorPagar>0?re("div",{style:{background:"rgba(255,196,7,.2)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#FFC107",fontWeight:700}},"Por pagar: "+fmt(tMLPorPagar)):re("div",{style:{fontSize:11,color:"#a5d6a7",fontWeight:600}},"Todo cobrado")
        ),
        tMLComision>0?re("div",{style:{fontSize:11,opacity:.6}},"Comision ML: -"+fmt(tMLComision)):null
      ):null,
      gastosCajaHoy.length>0?re("div",{style:{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:12}},
        re("div",{style:{fontSize:11,opacity:.5,marginBottom:8,textTransform:"uppercase"}},"Gastos hoy"),
        gastosCajaHoy.map(function(g,i){
          var desc=g.tipo==="operativo"?"Operativo: "+(g.desc||""):g.tipo==="colaborador"?"Colab: "+(g.desc||""):"Otro: "+(g.desc||"");
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}},re("span",{style:{opacity:.75}},desc),re("span",{style:{color:"#ef9a9a"}},fmt(g.monto)));
        })
      ):null,
      ventasHoy.length===0&&gastosCajaHoy.length===0?re("div",{style:{textAlign:"center",opacity:.35,fontSize:13}},"Sin movimientos hoy"):null
    ):re("button",{onClick:function(){setModalPinCorte(true);},style:{width:"100%",padding:"14px",background:TC.dark,color:"#fff",border:"none",borderRadius:14,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}},re("span",null,"🔒"),re("span",null,"Ver corte del dia")),
    modalEnvio?re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:18,fontWeight:900,color:TC.dark,marginBottom:4}},"Agregar envio"),
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Se suma al total y se registra como gasto operativo."),
      re("input",{type:"number",placeholder:"0.00",value:envioMonto,onChange:function(e){setEnvioMonto(e.target.value);},style:Object.assign({},IP,{fontSize:22,fontWeight:700,textAlign:"center",marginBottom:14})}),
      re("div",{style:{display:"flex",gap:10}},
        re("button",{onClick:function(){setModalEnvio(false);setEnvioMonto("");},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:agregarEnvio,style:BS(TC.dark,"#fff",2)},"Agregar al pedido")
      )
    )):null,
    modalPinCorte?re(ModalPin,{onAcceso:function(){setVerCorte(true);setModalPinCorte(false);},onClose:function(){setModalPinCorte(false);}}):null,
    modalPinCorte?re(ModalPin,{onAcceso:function(){setVerCorte(true);setModalPinCorte(false);},onClose:function(){setModalPinCorte(false);}}):null,
    modalCobro?re(ModalCobroTichi,{total:totalDisplay,onConfirmar:confirmarCobro,onClose:function(){setModalCobro(false);}}):null,
    modalGasto?re(ModalGasto,{insumos:insumos,onGuardar:confirmarGasto,onClose:function(){setModalGasto(false);}}):null,
    modalDesc?re(ModalDescuento,{onAdd:agregarItem,onClose:function(){setModalDesc(false);}}):null
  );
}
function PedidosTichi(props){
  var ventas=props.ventas,tiendaId=props.tiendaId,onActualizarPago=props.onActualizarPago,onReembolso=props.onReembolso;
  var s1=useState(null);var sel=s1[0];var setSel=s1[1];
  var s2=useState(false);var modalPinR=s2[0];var setModalPinR=s2[1];
  var s3=useState(null);var ventaR=s3[0];var setVentaR=s3[1];
  var s4=useState(hoy());var fechaSel=s4[0];var setFechaSel=s4[1];

  var ventasDia=ventas.filter(function(v){return v.tienda===tiendaId&&v.timestamp&&(function(){var d=new Date(v.timestamp);var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);return ld===fechaSel;})();});
  var ventasDiaActivas=ventasDia.filter(function(v){return v.estadoPago!=="reembolsado";});
  var porPagar=ventasDiaActivas.filter(function(v){return v.estadoPago==="por_pagar";});

  function cambiarDia(delta){
    var d=new Date(fechaSel+"T12:00:00");
    d.setDate(d.getDate()+delta);
    setFechaSel(d.toISOString().split("T")[0]);
  }

  function iniciarReembolso(venta){setVentaR(venta);setSel(null);setModalPinR(true);}
  function confirmarReembolso(){if(onReembolso)onReembolso(ventaR);setVentaR(null);setModalPinR(false);}

  if(sel){
    var esReemb=sel.estadoPago==="reembolsado";
    var esPorPagar=sel.estadoPago==="por_pagar";
    return re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxWidth:380,maxHeight:"90vh",overflowY:"auto"})},
      re("div",{style:{textAlign:"center",marginBottom:14}},
        re("div",{style:{fontSize:20,fontWeight:900,color:TC.dark}},"Tichi"),
        re("div",{style:{fontSize:12,color:"#aaa",marginTop:4}},fmtFecha(sel.timestamp))
      ),
      esReemb?re("div",{style:{background:C.redL,borderRadius:10,padding:"8px 14px",marginBottom:14,textAlign:"center",fontSize:13,color:C.red,fontWeight:700}},"REEMBOLSADO"):null,
      esPorPagar?re("div",{style:{background:"#FFF8E1",border:"2px solid #FFC107",borderRadius:10,padding:"10px 14px",marginBottom:14,textAlign:"center"}},
        re("div",{style:{fontSize:13,fontWeight:800,color:"#F57F17",marginBottom:8}},"PENDIENTE - Mercado Libre"),
        re("button",{onClick:function(){onActualizarPago(sel.timestamp);setSel(null);},style:{background:"#43A047",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:800,fontSize:14,cursor:"pointer"}},"Marcar como PAGADO")
      ):re("div",{style:{background:TC.bg,borderRadius:10,padding:"8px 14px",marginBottom:14,textAlign:"center",fontSize:13,color:TC.dark,fontWeight:700}},esReemb?"REEMBOLSADO":"PAGADO"),
      re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
        (sel.items||[]).map(function(item,i){
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}},
            re("div",{style:{fontWeight:600,color:TC.dark}},item.nombre),
            re("div",{style:{fontWeight:700,color:TC.accent}},item.precio===0?"GRATIS":fmt(item.precio))
          );
        })
      ),
      re("div",{style:{borderTop:"2px dashed #e0e0e0",paddingTop:14,marginBottom:14}},
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:TC.dark}},re("span",null,"TOTAL"),re("span",null,fmt(sel.total))),
        re("div",{style:{fontSize:13,color:"#888",marginTop:4}},"Metodo: "+(sel.metodo||"").toUpperCase())
      ),
      !esReemb?re("button",{onClick:function(){iniciarReembolso(sel);},style:{width:"100%",padding:"12px",background:C.redL,color:C.red,border:"2px solid "+C.red,borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:8}},"🔄 Hacer reembolso"):null,
      re("button",{onClick:function(){window.imprimirTicket&&window.imprimirTicket(sel,tiendaId);},style:Object.assign({},BS(TC.dark,"#fff"),{width:"100%",marginBottom:8})},"🖨️ Reimprimir"),
      re("button",{onClick:function(){setSel(null);},style:Object.assign({},BS("#f0f0f0","#666"),{width:"100%"})},"Cerrar")
    ));
  }

  return re("div",{style:{padding:"10px 10px 70px"}},
    re("div",{style:{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}},
        re("button",{onClick:function(){cambiarDia(-1);},style:{background:TC.dark,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontWeight:800,fontSize:18,cursor:"pointer"}},"‹"),
        re("div",{style:{textAlign:"center"}},
          re("div",{style:{fontSize:15,fontWeight:800,color:TC.dark}},
            fechaSel===hoy()?"HOY":new Date(fechaSel+"T12:00:00").toLocaleDateString("es-MX",{weekday:"long",day:"2-digit",month:"long"})
          ),
          re("div",{style:{fontSize:12,color:"#aaa"}},fechaSel)
        ),
        re("button",{onClick:function(){cambiarDia(1);},disabled:fechaSel>=hoy(),style:{background:fechaSel>=hoy()?"#ccc":TC.dark,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontWeight:800,fontSize:18,cursor:fechaSel>=hoy()?"default":"pointer"}},"›")
      ),
      re("input",{type:"date",value:fechaSel,max:hoy(),onChange:function(e){setFechaSel(e.target.value);},style:Object.assign({},IP,{padding:"6px 10px",fontSize:13})})
    ),
    re("div",{style:{fontSize:13,color:"#888",marginBottom:14}},ventasDiaActivas.length+" pedidos | "+fmt(ventasDiaActivas.reduce(function(s,v){return s+v.total;},0))),
    porPagar.length>0?re("div",{style:{background:"#FFF8E1",border:"2px solid #FFC107",borderRadius:12,padding:"10px 14px",marginBottom:14}},
      re("div",{style:{fontSize:12,fontWeight:800,color:"#F57F17"}},"Por cobrar ML (T. Angel): "+fmt(porPagar.reduce(function(s,v){return s+v.total;},0)))
    ):null,
    ventasDia.length===0?re("div",{style:{textAlign:"center",color:"#bbb",padding:40,fontSize:14}},"Sin pedidos este día"):null,
    ventasDia.map(function(v,i){
      var items=v.items||[];
      var esPorPagarV=v.estadoPago==="por_pagar";
      var esReembV=v.estadoPago==="reembolsado";
      return re("div",{key:i,onClick:function(){setSel(v);},style:{background:"#fff",borderRadius:12,padding:"13px 15px",marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,.07)",cursor:"pointer",borderLeft:"4px solid "+(esReembV?C.red:esPorPagarV?"#FFC107":TC.dark),opacity:esReembV?.6:1}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
          re("div",null,
            re("div",{style:{fontSize:14,fontWeight:700,color:esReembV?C.red:TC.dark}},"Pedido #"+(ventasDia.length-i)+(esReembV?" (REEMBOLSADO)":"")),
            re("div",{style:{fontSize:12,color:"#aaa",marginTop:2}},fmtFecha(v.timestamp)),
            re("div",{style:{fontSize:12,color:"#888",marginTop:4}},items.slice(0,2).map(function(x){return x.nombre;}).join(", ")+(items.length>2?" +"+(items.length-2)+" mas":"")),
            esPorPagarV?re("div",{style:{fontSize:11,background:"#FFF8E1",color:"#F57F17",fontWeight:700,marginTop:4,padding:"2px 8px",borderRadius:8,display:"inline-block"}},"POR PAGAR - ML"):null
          ),
          re("div",{style:{textAlign:"right"}},
            re("div",{style:{fontSize:18,fontWeight:900,color:esReembV?C.red:TC.accent}},fmt(v.total)),
            re("div",{style:{fontSize:11,color:TC.mid,marginTop:4,fontWeight:600}},"Ver ticket ->")
          )
        )
      );
    }),
    modalPinR?re(ModalPinReembolso,{onAcceso:confirmarReembolso,onClose:function(){setModalPinR(false);setVentaR(null);}}):null
  );
}

function InventarioTichi(props){
  var insumos=props.insumos,setInsumos=props.setInsumos,onGasto=props.onGasto,tiendaId=props.tiendaId;
  var s1=useState("pt");var tab=s1[0];var setTab=s1[1];
  var s2=useState(false);var modalCompra=s2[0];var setModalCompra=s2[1];
  var s3=useState({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:"",ok:false});
  var ev=s3[0];var setEv=s3[1];
  function updE(k,val){setEv(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}

  var allIns=insumos;
  var mpIns=allIns.filter(function(i){return INSUMOS_TICHI_MP.some(function(m){return m.id===i.id;});});
  var ptIns=allIns.filter(function(i){return INSUMOS_TICHI_PT.some(function(m){return m.id===i.id;});});
  var lista=mpIns;
  var insumoSel=allIns.find(function(i){return i.id===ev.insumoId;});
  var filtrados=mpIns.filter(function(i){return i.nombre.toLowerCase().indexOf(ev.busqueda.toLowerCase())>=0;});

  function registrarCompra(){
    if(!ev.insumoId||!ev.cantidad||isNaN(ev.cantidad)||parseFloat(ev.cantidad)<=0){updE("err","Selecciona insumo y cantidad");return;}
    if(!ev.monto||isNaN(ev.monto)||parseFloat(ev.monto)<=0){updE("err","Ingresa el monto pagado");return;}
    var cant=parseFloat(ev.cantidad),monto=parseFloat(ev.monto);
    setInsumos(function(p){return p.map(function(i){return i.id===ev.insumoId?Object.assign({},i,{stock:(i.stock||0)+cant}):i;});});
    if(onGasto)onGasto({seccion:"externo",tipo:"insumo",insumoId:ev.insumoId,insumoNombre:insumoSel?insumoSel.nombre:"",cantidad:cant,unidad:insumoSel?insumoSel.unidad:"",monto:monto,metodoPago:ev.metodoPago,desc:"",tienda:tiendaId,timestamp:new Date().toISOString()});
    setEv({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:"",ok:true});
    setModalCompra(false);setTimeout(function(){updE("ok",false);},2000);
  }

  return re("div",{style:{padding:"10px 10px 70px"}},
    ev.ok?re("div",{style:{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:TC.dark,color:"#fff",padding:"12px 28px",borderRadius:50,fontWeight:800,fontSize:16,zIndex:300,whiteSpace:"nowrap"}},"Registrado"):null,
    re("div",{style:{fontSize:17,fontWeight:900,color:TC.dark,marginBottom:14}},"Inventario Tichi"),
    re("button",{onClick:function(){setModalCompra(true);},style:{width:"100%",padding:13,background:TC.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14}},"+ Registrar compra de materia prima"),

    re("div",{style:{background:"#fff",borderRadius:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)",overflow:"hidden"}},
      lista.length===0?re("div",{style:{padding:30,textAlign:"center",color:"#bbb",fontSize:13}},"Sin insumos"):null,
      lista.map(function(ins,i){
        var stock=ins.stock||0,agotado=stock===0,bajo=stock>0&&stock<=ins.minimo;
        var color=agotado?C.red:bajo?C.amber:TC.dark;
        var pct=Math.min(100,ins.minimo>0?(stock/ins.minimo)*100:100);
        var potencial=tab==="pt"?null:calcPotencial(insumos,R_TICHI_PROD[ins.id.replace("_mp","")]||[]);
        return re("div",{key:ins.id,style:{padding:"12px 16px",borderBottom:i<lista.length-1?"1px solid #f5f5f5":"none"}},
          re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}},
            re("div",null,
              re("div",{style:{fontSize:13,fontWeight:700,color:agotado?C.red:TC.dark}},ins.nombre),
              re("div",{style:{fontSize:11,color:"#aaa"}},"Min: "+fmtC(ins.minimo,ins.unidad))
            ),
            re("div",{style:{textAlign:"right"}},
              re("div",{style:{fontSize:14,fontWeight:800,color:color}},agotado?"AGOTADO":fmtC(stock,ins.unidad))
            )
          ),
          re("div",{style:{height:4,background:"#f0f0f0",borderRadius:2,overflow:"hidden"}},re("div",{style:{height:"100%",width:pct+"%",background:color,borderRadius:2}}))
        );
      })
    ),
    modalCompra?re("div",{style:OV},re("div",{style:Object.assign({},MD,{maxHeight:"90vh",overflowY:"auto"})},
      re("div",{style:{fontSize:18,fontWeight:900,color:TC.dark,marginBottom:4}},"Registrar compra de MP"),
      re("div",{style:{fontSize:12,color:"#888",marginBottom:14}},"Actualiza materia prima y registra en finanzas."),
      re("div",{style:{marginBottom:10}},
        re("div",{style:LB},"Insumo *"),
        re("input",{placeholder:"Buscar insumo...",value:ev.busqueda,onChange:function(e){updE("busqueda",e.target.value);},style:IP}),
        ev.busqueda?re("div",{style:{border:"1px solid #e0e0e0",borderRadius:9,marginTop:4,maxHeight:150,overflowY:"auto"}},
          filtrados.slice(0,10).map(function(i){var s2=ev.insumoId===i.id;return re("div",{key:i.id,onClick:function(){updE("insumoId",i.id);updE("busqueda",i.nombre);},style:{padding:"9px 12px",cursor:"pointer",fontSize:13,borderBottom:"1px solid #f5f5f5",background:s2?TC.bg:"#fff",color:s2?TC.dark:"#333"}},i.nombre+" ("+i.unidad+") - Stock: "+fmtC(i.stock||0,i.unidad));})
        ):null
      ),
      insumoSel?re("div",{style:{background:TC.bg,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:TC.dark,fontWeight:600}},"Stock actual: "+fmtC(insumoSel.stock||0,insumoSel.unidad)):null,
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
        re("div",null,re("div",{style:LB},"Cantidad"+(insumoSel?" ("+insumoSel.unidad+")":"")),re("input",{type:"number",placeholder:"0",value:ev.cantidad,onChange:function(e){updE("cantidad",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700,textAlign:"center"})})),
        re("div",null,re("div",{style:LB},"Monto pagado ($)"),re("input",{type:"number",placeholder:"0.00",value:ev.monto,onChange:function(e){updE("monto",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700,textAlign:"center"})}))
      ),
      insumoSel&&ev.cantidad&&ev.monto&&parseFloat(ev.cantidad)>0&&parseFloat(ev.monto)>0?re("div",{style:{background:TC.bg,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:TC.dark}},"Costo unitario: "+fmt(parseFloat(ev.monto)/parseFloat(ev.cantidad))+" / "+insumoSel.unidad):null,
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Como se pago *"),
        re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}},
          [["efectivo","Efectivo"],["tarjeta_migue","T. Migue"],["tarjeta_angel","T. Angel"]].map(function(x){var id=x[0],l=x[1],sel=ev.metodoPago===id;return re("button",{key:id,onClick:function(){updE("metodoPago",id);},style:{padding:"10px 6px",border:"2px solid "+(sel?TC.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?TC.bg:"#fff",color:sel?TC.dark:"#666",fontSize:12,textAlign:"center"}},l);})
        )
      ),
      ev.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},ev.err):null,
      re("div",{style:{display:"flex",gap:10}},
        re("button",{onClick:function(){setModalCompra(false);setEv({insumoId:"",cantidad:"",monto:"",metodoPago:"efectivo",busqueda:"",err:"",ok:false});},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:registrarCompra,style:BS(TC.dark,"#fff",2)},"Registrar compra")
      )
    )):null
  );
}

function FinanzasGlobal(props){
  var ventas=props.ventas,gastos=props.gastos,insC=props.insC,insSA=props.insSA,insAmb=props.insAmb||[],insTichi=props.insTichi||[],onGasto=props.onGasto;
  var sT=useState("resumen");var tab=sT[0];var setTab=sT[1];
  var sG=useState("dias");var graf=sG[0];var setGraf=sG[1];
  var sM=useState(false);var modalExt=sM[0];var setModalExt=sM[1];
  var sPer=useState("mes");var periodo=sPer[0];var setPeriodo=sPer[1];
  var sFI=useState("");var fechaIni=sFI[0];var setFechaIni=sFI[1];
  var sFF=useState("");var fechaFin=sFF[0];var setFechaFin=sFF[1];
  var sTr=useState(false);var modalTransf=sTr[0];var setModalTransf=sTr[1];
  var sFTP=useState("todas");var filtroTiendaProd=sFTP[0];var setFiltroTiendaProd=sFTP[1];
  var sTrV=useState({de:"tarjeta_migue",para:"tarjeta_angel",monto:"",desc:""});var trv=sTrV[0];var setTrv=sTrV[1];
  function updTr(k,val){setTrv(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=val;return n;});}

  // Calculate date range based on periodo
  function getRango(){
    var hoyD=new Date();
    var hoyStr=hoyD.getFullYear()+"-"+("0"+(hoyD.getMonth()+1)).slice(-2)+"-"+("0"+hoyD.getDate()).slice(-2);
    if(periodo==="hoy")return {ini:hoyStr,fin:hoyStr};
    if(periodo==="semana"){
      var lun=new Date(hoyD);lun.setDate(hoyD.getDate()-hoyD.getDay()+1);
      return {ini:lun.toISOString().split("T")[0],fin:hoyStr};
    }
    if(periodo==="mes"){
      var ini=hoyD.getFullYear()+"-"+(hoyD.getMonth()+1<10?"0":"")+(hoyD.getMonth()+1)+"-01";
      return {ini:ini,fin:hoyStr};
    }
    if(periodo==="custom"&&fechaIni&&fechaFin)return {ini:fechaIni,fin:fechaFin};
    return {ini:"2000-01-01",fin:"2099-12-31"};
  }
  var rango=getRango();
  function enRango(ts){
    if(!ts)return false;
    var d=new Date(ts);
    var ld=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
    return ld>=rango.ini&&ld<=rango.fin;
  }
  var sGv=useState({tipo:"",desc:"",monto:"",err:""});var gv=sGv[0];var setGv=sGv[1];
  function updG(k,v){setGv(function(p){var n={};for(var x in p)n[x]=p[x];n[k]=v;return n;});}

  var ventasFil=ventas.filter(function(v){return enRango(v.timestamp)&&v.estadoPago!=="reembolsado";});
  var gastosFil=gastos.filter(function(g){return enRango(g.timestamp);});

  // Saldos por origen de dinero
  // Efectivo
  var ingEfectivo=ventasFil.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var egreEfectivo=gastosFil.filter(function(g){return g.tipo!=="transf_tarjeta"&&(g.metodoPago==="efectivo"||(!g.metodoPago&&g.seccion==="caja"&&g.tipo!=="operativo")||g.tipo==="colaborador");}).reduce(function(s,g){return s+g.monto;},0);
  // Tarjeta Migue: Clip Migue + Didi cobrado - gastos T.Migue
  var ingMigue=ventasFil.filter(function(v){return (v.metodo==="clip"&&v.terminalClip==="migue")||(v.metodo==="didi"&&v.estadoPago==="pagado");}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var egreMigue=gastosFil.filter(function(g){return g.tipo!=="transf_tarjeta"&&g.metodoPago==="tarjeta_migue";}).reduce(function(s,g){return s+g.monto;},0);
  // Tarjeta Angel: Clip Angel + Transferencias + ML cobrado - gastos T.Angel
  var ingAngel=ventasFil.filter(function(v){return (v.metodo==="clip"&&v.terminalClip==="angel")||(v.metodo==="transferencia")||(v.metodo==="mercadolibre"&&v.estadoPago==="pagado");}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var egreAngel=gastosFil.filter(function(g){return g.tipo!=="transf_tarjeta"&&g.metodoPago==="tarjeta_angel";}).reduce(function(s,g){return s+g.monto;},0);
  // Transferencias entre tarjetas
  var transfMigueAAngel=gastosFil.filter(function(g){return g.tipo==="transf_tarjeta"&&g.desc&&g.desc.indexOf("T.Migue->")>=0;}).reduce(function(s,g){return s+g.monto;},0);
  var transfAngelAMigue=gastosFil.filter(function(g){return g.tipo==="transf_tarjeta"&&g.desc&&g.desc.indexOf("T.Angel->T.Migue")>=0;}).reduce(function(s,g){return s+g.monto;},0);
  var saldoEfectivo=ingEfectivo-egreEfectivo;
  var saldoMigue=ingMigue-egreMigue-transfMigueAAngel+transfAngelAMigue;
  var saldoAngel=ingAngel-egreAngel-transfAngelAMigue+transfMigueAAngel;
  var tv=ventasFil.reduce(function(s,v){return s+v.total;},0);
  var tvC=ventasFil.filter(function(v){return v.tienda==="centro";}).reduce(function(s,v){return s+v.total;},0);
  var tvSA=ventasFil.filter(function(v){return v.tienda==="sanantonio";}).reduce(function(s,v){return s+v.total;},0);
  var tc=ventasFil.reduce(function(s,v){return s+v.comisionClip;},0);
  var tDidiComision=ventasFil.reduce(function(s,v){return s+(v.comisionDidi||0);},0);
  var tComisionML=ventasFil.filter(function(v){return v.metodo==="mercadolibre";}).reduce(function(s,v){return s+(v.comisionML||(v.total-(v.netoRecibido||v.total)));},0);
  var tDidiNeto=ventasFil.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+(v.netoRecibido||v.total);},0);
  var tDidiTotal=ventasFil.filter(function(v){return v.metodo==="didi";}).reduce(function(s,v){return s+v.total;},0);
  var tDidiPorPagar=ventasFil.filter(function(v){return v.metodo==="didi"&&v.estadoPago==="por_pagar";}).reduce(function(s,v){return s+v.total;},0);
  var ef=ventasFil.filter(function(v){return v.metodo==="efectivo";}).reduce(function(s,v){return s+v.total;},0);
  var tr=ventasFil.filter(function(v){return v.metodo==="transferencia";}).reduce(function(s,v){return s+v.total;},0);
  var cl=ventasFil.filter(function(v){return v.metodo==="clip";}).reduce(function(s,v){return s+v.netoRecibido;},0);
  var tg=gastosFil.filter(function(g){return g.desc!=="Comision Mercado Libre"&&g.tipo!=="transf_tarjeta";}).reduce(function(s,g){return s+g.monto;},0);
  var util=tv-tg-tc-tDidiComision-tComisionML;
  var margen=tv>0?(util/tv)*100:0;

  var gastosExt=gastosFil.filter(function(g){return g.seccion==="externo";});
  var gastosInsumo=gastosFil.filter(function(g){return g.tipo==="insumo";});
  // AMBurger MP 42%
  var gastosCrep=gastosInsumo.filter(function(g){return !g.insumoId||(g.insumoId.indexOf("amb_")!==0&&g.insumoId.indexOf("ti_")!==0);});
  var gastosAmb=gastosInsumo.filter(function(g){return g.insumoId&&g.insumoId.indexOf("amb_")===0;});
  var tvCrep=ventasFil.filter(function(v){return v.tienda!=="amburger"&&v.tienda!=="tichi";}).reduce(function(s,v){return s+v.total;},0);
  // MP control Crepisimo (only after tvCrep is defined)
  var totalMP=gastosCrep.reduce(function(s,g){return s+g.monto;},0);
  var presupMP=tvCrep*META_MP;
  var excede=totalMP>presupMP;
  var cMP=excede?C.red:C.green;
  var bMP=excede?C.redL:C.greenL;
  var pctMP=tvCrep>0?(totalMP/tvCrep)*100:0;
  var pctB=presupMP>0?Math.min(100,(totalMP/presupMP)*100):0;
  var tvAmb=ventasFil.filter(function(v){return v.tienda==="amburger";}).reduce(function(s,v){return s+v.total;},0);
  var totalMPAmb=gastosAmb.reduce(function(s,g){return s+g.monto;},0);
  var presupMPAmb=tvAmb*0.42;
  var pctMPAmb=tvAmb>0?(totalMPAmb/tvAmb)*100:0;
  var excedeAmb=totalMPAmb>presupMPAmb;
  var AMB_NAR="#FF6F00"; var AMB_NAR_L="#FFF3E0";
  var colorAmb=excedeAmb?C.red:AMB_NAR;
  var bgAmb=excedeAmb?C.redL:AMB_NAR_L;
  var pctBarraAmb=presupMPAmb>0?Math.min(100,(totalMPAmb/presupMPAmb)*100):0;

  // Tichi MP 25%
  var gastosTichi=gastosInsumo.filter(function(g){return g.insumoId&&g.insumoId.indexOf("ti_")===0;});
  var tvTichi=ventasFil.filter(function(v){return v.tienda==="tichi";}).reduce(function(s,v){return s+v.total;},0);
  var totalMPTichi=gastosTichi.reduce(function(s,g){return s+g.monto;},0);
  var presupMPTichi=tvTichi*0.25;
  var pctMPTichi=tvTichi>0?(totalMPTichi/tvTichi)*100:0;
  var excedeTichi=totalMPTichi>presupMPTichi;
  var colorTichi=excedeTichi?C.red:TC.dark;
  var bgTichi=excedeTichi?C.redL:TC.bg;
  var pctBarraTichi=presupMPTichi>0?Math.min(100,(totalMPTichi/presupMPTichi)*100):0;

  // Fix: recalculate Crepisimo MP excluding ti_ and amb_ insumos
  gastosCrep=gastosInsumo.filter(function(g){return !g.insumoId||( g.insumoId.indexOf("amb_")!==0&&g.insumoId.indexOf("ti_")!==0);});

  var tTarMigue=gastosExt.filter(function(g){return g.tipo==="tarjeta_migue";}).reduce(function(s,g){return s+g.monto;},0);
  var tTarAngel=gastosExt.filter(function(g){return g.tipo==="tarjeta_angel";}).reduce(function(s,g){return s+g.monto;},0);
  var tPersonal=gastosExt.filter(function(g){return g.tipo==="personal";}).reduce(function(s,g){return s+g.monto;},0);
  var tOtroExt=gastosExt.filter(function(g){return g.tipo!=="insumo"&&g.tipo!=="tarjeta_migue"&&g.tipo!=="tarjeta_angel"&&g.tipo!=="personal";}).reduce(function(s,g){return s+g.monto;},0);
  var gastosCaja=gastosFil.filter(function(g){return g.seccion==="caja";});
  var tColab=gastosCaja.filter(function(g){return g.tipo==="colaborador";}).reduce(function(s,g){return s+g.monto;},0);
  var tOper=gastosCaja.filter(function(g){return g.tipo==="operativo";}).reduce(function(s,g){return s+g.monto;},0);
  var tOtroCaja=gastosCaja.filter(function(g){return g.tipo==="otro";}).reduce(function(s,g){return s+g.monto;},0);

  var cpxI={};
  gastosInsumo.forEach(function(g){if(!g.insumoId)return;if(!cpxI[g.insumoId])cpxI[g.insumoId]={m:0,c:0};cpxI[g.insumoId].m+=g.monto;cpxI[g.insumoId].c+=g.cantidad;});
  function calcV(ins){return ins.reduce(function(s,i){var cp=cpxI[i.id];if(!cp||cp.c===0)return s;return s+(cp.m/cp.c)*(i.stock||0);},0);}
  var valC=calcV(insC),valSA=calcV(insSA),valAmb=calcV(insAmb),valTichi=calcV(insTichi);

  var vpd={};ventasFil.forEach(function(v){var d=v.timestamp?v.timestamp.split("T")[0]:"";if(!d)return;if(!vpd[d])vpd[d]=0;vpd[d]+=v.total;});
  var dias7=[];for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var ds=d.toISOString().split("T")[0];dias7.push({l:d.toLocaleDateString("es-MX",{weekday:"short"}),v:Math.round(vpd[ds]||0)});}
  var vpm={};ventasFil.forEach(function(v){if(!v.timestamp)return;var d=new Date(v.timestamp);var m=d.getFullYear()+"-"+(d.getMonth()+1<10?"0":"")+(d.getMonth()+1);if(!vpm[m])vpm[m]=0;vpm[m]+=v.total;});
  var meses=Object.keys(vpm).sort().slice(-6).map(function(m){var p=m.split("-");var ns=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];return {l:ns[parseInt(p[1])],v:Math.round(vpm[m])};});
  var cp={};ventasFil.forEach(function(v){(v.items||[]).forEach(function(item){if(item.precio<=0)return;var n=item.nombre.split(" (")[0].split(" - ")[0];if(!cp[n])cp[n]=0;cp[n]++;});});
  var topP=Object.keys(cp).map(function(k){return {l:k.slice(0,8),v:cp[k]};}).sort(function(a,b){return b.v-a.v;}).slice(0,8);

  function Row(l,v,col){return re("div",{key:l,style:{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}},re("span",{style:{color:"#555"}},l),re("span",{style:{fontWeight:700,color:col||C.dark}},fmt(v)));}
  function Card(l,v,col,bg){return re("div",{style:{background:bg,borderRadius:12,padding:"14px",borderLeft:"4px solid "+col}},re("div",{style:{fontSize:11,color:col,fontWeight:700,textTransform:"uppercase",marginBottom:3}},l),re("div",{style:{fontSize:22,fontWeight:900,color:col}},v));}

  function guardarGastoExt(){
    if(!gv.tipo||!gv.monto){updG("err","Completa los campos");return;}
    onGasto({seccion:"externo",tipo:gv.tipo,insumoId:null,insumoNombre:null,cantidad:0,unidad:null,monto:parseFloat(gv.monto),metodoPago:null,desc:gv.desc,tienda:"global",timestamp:new Date().toISOString()});
    setGv({tipo:"",desc:"",monto:"",err:""});setModalExt(false);
  }

  var TABS=[["resumen","Resumen"],["semana","Sem. Visual"],["productos","Por Producto"],["graficas","Graficas"],["egresos","Egresos"],["ventas","Ventas"]];
  var GRAFS=[{id:"dias",lbl:"Por dia"},{id:"meses",lbl:"Por mes"},{id:"productos",lbl:"Mas vendidos"}];
  var grafDatos=graf==="dias"?{datos:dias7,titulo:"Ultimos 7 dias",color:C.teal}:graf==="meses"?{datos:meses,titulo:"Por mes",color:C.dark}:{datos:topP,titulo:"Mas vendidos (cantidad)",color:C.orange};

  return re("div",{style:{padding:"10px 10px 70px"}},
    re("div",{style:{fontSize:17,fontWeight:900,color:C.dark,marginBottom:10}},"Finanzas — Todas las tiendas"),

    // ── SALDOS POR TARJETA ────────────────
    re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        re("div",{style:{fontSize:14,fontWeight:800,color:C.dark}},"Saldos actuales"),
        re("button",{onClick:function(){setModalTransf(true);},style:{background:C.dark,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}},"↔ Transferencia")
      ),
      re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}},
        [["💵","Efectivo",saldoEfectivo,"#388E3C"],["💳","T. Migue",saldoMigue,"#1565C0"],["💳","T. Angel",saldoAngel,"#6A1B9A"]].map(function(x){
          return re("div",{key:x[1],style:{background:"#f8f9fa",borderRadius:12,padding:"12px 8px",textAlign:"center"}},
            re("div",{style:{fontSize:11,color:x[3],fontWeight:700,marginBottom:4}},x[0]+" "+x[1]),
            re("div",{style:{fontSize:16,fontWeight:900,color:x[2]>=0?x[3]:C.red}},fmt(x[2]))
          );
        })
      )
    ),

    // ── MODAL TRANSFERENCIA ENTRE TARJETAS ──
    modalTransf?re("div",{style:OV},re("div",{style:MD},
      re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:14}},"Transferencia entre tarjetas"),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"De"),
        re("div",{style:{display:"flex",gap:8}},
          [["tarjeta_migue","💳 T. Migue"],["tarjeta_angel","💳 T. Angel"],["efectivo","💵 Efectivo"]].map(function(x){
            var sel=trv.de===x[0];
            return re("button",{key:x[0],onClick:function(){updTr("de",x[0]);},style:{flex:1,padding:"9px 4px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:11}},x[1]);
          })
        )
      ),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Para"),
        re("div",{style:{display:"flex",gap:8}},
          [["tarjeta_angel","💳 T. Angel"],["tarjeta_migue","💳 T. Migue"],["efectivo","💵 Efectivo"]].map(function(x){
            var sel=trv.para===x[0];
            return re("button",{key:x[0],onClick:function(){updTr("para",x[0]);},style:{flex:1,padding:"9px 4px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:11}},x[1]);
          })
        )
      ),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Monto"),
        re("input",{type:"number",placeholder:"0.00",value:trv.monto,onChange:function(e){updTr("monto",e.target.value);},style:Object.assign({},IP,{fontSize:20,fontWeight:700})})
      ),
      re("div",{style:{marginBottom:14}},
        re("div",{style:LB},"Nota (opcional)"),
        re("input",{type:"text",placeholder:"Ej: para compra de insumos",value:trv.desc,onChange:function(e){updTr("desc",e.target.value);},style:IP})
      ),
      re("div",{style:{display:"flex",gap:10}},
        re("button",{onClick:function(){setModalTransf(false);},style:BS("#f0f0f0","#666")},"Cancelar"),
        re("button",{onClick:function(){
          var monto=parseFloat(trv.monto);
          if(!monto||monto<=0||trv.de===trv.para)return;
          function labelTarjeta(t){return t==="tarjeta_migue"?"T.Migue":t==="tarjeta_angel"?"T.Angel":t==="efectivo"?"Efectivo":t;}
          var deLabel=labelTarjeta(trv.de);
          var paraLabel=labelTarjeta(trv.para);
          var desc=deLabel+"->"+paraLabel+(trv.desc?" - "+trv.desc:"");
          onGasto({tipo:"transf_tarjeta",seccion:"externo",monto:monto,desc:desc,metodoPago:trv.de,timestamp:new Date().toISOString()});
          setModalTransf(false);
          updTr("monto","");updTr("desc","");
        },disabled:!trv.monto||parseFloat(trv.monto)<=0||trv.de===trv.para,style:BS(!trv.monto||parseFloat(trv.monto)<=0||trv.de===trv.para?"#ccc":C.dark,"#fff",2)},"Registrar transferencia")
      )
    )):null,

    // Date filter
    re("div",{style:{background:"#fff",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
      re("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:periodo==="custom"?10:0}},
        [["hoy","Hoy"],["semana","Esta semana"],["mes","Este mes"],["todo","Todo"],["custom","Personalizado"]].map(function(x){
          var sel=periodo===x[0];
          return re("button",{key:x[0],onClick:function(){setPeriodo(x[0]);},style:{padding:"7px 12px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:20,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:12}},x[1]);
        })
      ),
      periodo==="custom"?re("div",{style:{display:"flex",gap:8,alignItems:"center",marginTop:8}},
        re("div",null,re("div",{style:LB},"Desde"),re("input",{type:"date",value:fechaIni,onChange:function(e){setFechaIni(e.target.value);},style:Object.assign({},IP,{padding:"8px 10px",fontSize:13})})),
        re("div",{style:{paddingTop:20,color:"#888"}},"—"),
        re("div",null,re("div",{style:LB},"Hasta"),re("input",{type:"date",value:fechaFin,onChange:function(e){setFechaFin(e.target.value);},style:Object.assign({},IP,{padding:"8px 10px",fontSize:13})}))
      ):null,
      re("div",{style:{fontSize:11,color:"#aaa",marginTop:periodo==="custom"?8:6}},
        periodo==="hoy"?"Mostrando: hoy "+rango.ini:
        periodo==="semana"?"Mostrando: "+rango.ini+" al "+rango.fin:
        periodo==="mes"?"Mostrando: "+rango.ini+" al "+rango.fin:
        periodo==="custom"&&fechaIni&&fechaFin?"Mostrando: "+fechaIni+" al "+fechaFin:
        periodo==="custom"?"Selecciona el rango de fechas":
        "Mostrando: todo el historial"
      )
    ),
    re("div",{style:{display:"flex",gap:4,marginBottom:14,background:"#f0f0f0",borderRadius:12,padding:4}},
      TABS.map(function(t){var sel=tab===t[0];return re("button",{key:t[0],onClick:function(){setTab(t[0]);},style:{flex:1,padding:"9px 4px",border:"none",borderRadius:9,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"transparent",color:sel?"#fff":"#888",fontSize:11}},t[1]);})
    ),
    tab==="resumen"?re("div",null,
      re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
        Card("Ventas totales",fmt(tv),C.green,C.greenL),
        Card("Egresos",fmt(tg+tc+tDidiComision+tComisionML),C.red,C.redL),
        Card("Utilidad",fmt(util),util>=0?C.green:C.red,util>=0?C.greenL:C.redL),
        Card("Margen",margen.toFixed(1)+"%",margen>=15?C.green:C.orange,C.amberL)
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:SC},"Ventas por tienda"),
        Row("🏪 Centro",tvC),Row("🏬 San Antonio",tvSA),Row("🍔 AM-Burger",tvAmb),Row("🧪 Tichi",tvTichi)
      ),
      re("div",{style:{background:C.dark,borderRadius:14,padding:18,marginBottom:14,color:"#fff"}},
        re("div",{style:{fontSize:12,opacity:.7,textTransform:"uppercase",marginBottom:6}},"Valor del inventario"),
        re("div",{style:{fontSize:30,fontWeight:900}},fmt(valC+valSA+valAmb+valTichi)),
        re("div",{style:{display:"flex",gap:10,marginTop:10}},
          re("div",{style:{flex:1,background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 12px"}},re("div",{style:{fontSize:10,opacity:.7,marginBottom:3}},"Centro"),re("div",{style:{fontSize:16,fontWeight:800}},fmt(valC))),
          re("div",{style:{flex:1,background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 12px"}},re("div",{style:{fontSize:10,opacity:.7,marginBottom:3}},"San Antonio"),re("div",{style:{fontSize:16,fontWeight:800}},fmt(valSA))),
          re("div",{style:{flex:1,background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 12px"}},re("div",{style:{fontSize:10,opacity:.7,marginBottom:3}},"AM-Burger"),re("div",{style:{fontSize:16,fontWeight:800}},fmt(valAmb))),
          re("div",{style:{flex:1,background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 12px"}},re("div",{style:{fontSize:10,opacity:.7,marginBottom:3}},"Tichi"),re("div",{style:{fontSize:16,fontWeight:800}},fmt(valTichi)))
        )
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          re("div",{style:SC},"Control materia prima Crepísimo (32%)"),
          re("div",{style:{fontSize:11,fontWeight:700,color:cMP,background:bMP,padding:"3px 10px",borderRadius:20}},excede?"EXCEDIDO":"OK")
        ),
        re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
          re("div",{style:{background:bMP,borderRadius:10,padding:"12px 14px",borderLeft:"4px solid "+cMP}},re("div",{style:{fontSize:11,color:cMP,fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Gastado MP"),re("div",{style:{fontSize:18,fontWeight:900,color:cMP}},fmt(totalMP)),re("div",{style:{fontSize:11,color:"#999",marginTop:2}},pctMP.toFixed(1)+"% de ventas")),
          re("div",{style:{background:"#f5f5f5",borderRadius:10,padding:"12px 14px",borderLeft:"4px solid #ccc"}},re("div",{style:{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Presupuesto 32%"),re("div",{style:{fontSize:18,fontWeight:900,color:"#555"}},fmt(presupMP)),re("div",{style:{fontSize:11,color:"#999",marginTop:2}},"Diferencia: "+fmt(presupMP-totalMP)))
        ),
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",marginBottom:5}},re("span",null,"0%"),re("span",{style:{fontWeight:700,color:cMP}},pctB.toFixed(0)+"% usado"),re("span",null,"100%")),
        re("div",{style:{height:10,background:"#f0f0f0",borderRadius:5,overflow:"hidden"}},re("div",{style:{height:"100%",width:pctB+"%",background:cMP,borderRadius:5}}))
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          re("div",{style:SC},"Control materia prima AM-Burger (42%)"),
          re("div",{style:{fontSize:11,fontWeight:700,color:colorAmb,background:bgAmb,padding:"3px 10px",borderRadius:20}},excedeAmb?"EXCEDIDO":"OK")
        ),
        re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
          re("div",{style:{background:bgAmb,borderRadius:10,padding:"12px 14px",borderLeft:"4px solid "+colorAmb}},
            re("div",{style:{fontSize:11,color:colorAmb,fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Gastado MP"),
            re("div",{style:{fontSize:18,fontWeight:900,color:colorAmb}},fmt(totalMPAmb)),
            re("div",{style:{fontSize:11,color:"#999",marginTop:2}},pctMPAmb.toFixed(1)+"% de ventas AMB")
          ),
          re("div",{style:{background:"#f5f5f5",borderRadius:10,padding:"12px 14px",borderLeft:"4px solid #ccc"}},
            re("div",{style:{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Presupuesto 42%"),
            re("div",{style:{fontSize:18,fontWeight:900,color:"#555"}},fmt(presupMPAmb)),
            re("div",{style:{fontSize:11,color:"#999",marginTop:2}},"Diferencia: "+fmt(presupMPAmb-totalMPAmb))
          )
        ),
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",marginBottom:5}},re("span",null,"0%"),re("span",{style:{fontWeight:700,color:colorAmb}},pctBarraAmb.toFixed(0)+"% usado"),re("span",null,"100%")),
        re("div",{style:{height:10,background:"#f0f0f0",borderRadius:5,overflow:"hidden"}},re("div",{style:{height:"100%",width:pctBarraAmb+"%",background:colorAmb,borderRadius:5}}))
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          re("div",{style:SC},"Control materia prima Tichi (25%)"),
          re("div",{style:{fontSize:11,fontWeight:700,color:colorTichi,background:bgTichi,padding:"3px 10px",borderRadius:20}},excedeTichi?"EXCEDIDO":"OK")
        ),
        re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
          re("div",{style:{background:bgTichi,borderRadius:10,padding:"12px 14px",borderLeft:"4px solid "+colorTichi}},
            re("div",{style:{fontSize:11,color:colorTichi,fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Gastado MP"),
            re("div",{style:{fontSize:18,fontWeight:900,color:colorTichi}},fmt(totalMPTichi)),
            re("div",{style:{fontSize:11,color:"#999",marginTop:2}},pctMPTichi.toFixed(1)+"% de ventas Tichi")
          ),
          re("div",{style:{background:"#f5f5f5",borderRadius:10,padding:"12px 14px",borderLeft:"4px solid #ccc"}},
            re("div",{style:{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",marginBottom:3}},"Presupuesto 25%"),
            re("div",{style:{fontSize:18,fontWeight:900,color:"#555"}},fmt(presupMPTichi)),
            re("div",{style:{fontSize:11,color:"#999",marginTop:2}},"Diferencia: "+fmt(presupMPTichi-totalMPTichi))
          )
        ),
        re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",marginBottom:5}},re("span",null,"0%"),re("span",{style:{fontWeight:700,color:colorTichi}},pctBarraTichi.toFixed(0)+"% usado"),re("span",null,"100%")),
        re("div",{style:{height:10,background:"#f0f0f0",borderRadius:5,overflow:"hidden"}},re("div",{style:{height:"100%",width:pctBarraTichi+"%",background:colorTichi,borderRadius:5}}))
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:SC},"Por metodo de pago"),
        Row("Efectivo",ef),Row("Transferencia",tr),Row("Clip (neto)",cl),Row("Comision Clip",tc,C.red),tDidiTotal>0?Row("Didi Food (bruto)",tDidiTotal):null,tDidiNeto>0?Row("Didi (neto cobrado)",tDidiNeto):null,tDidiPorPagar>0?Row("Didi por pagar",tDidiPorPagar,"#E65100"):null,tDidiComision>0?Row("Comision Didi",tDidiComision,C.red):null
      )
    ):null,

    tab==="semana"?re("div",null,
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        // Week selector
        re("div",{style:{fontSize:14,fontWeight:800,color:C.dark,marginBottom:12}},"Resumen Visual"),
        re("div",{style:{fontSize:12,color:"#aaa",marginBottom:14}},
          "Periodo: "+(periodo==="hoy"?"Hoy":periodo==="semana"?"Esta semana":periodo==="mes"?"Este mes":periodo==="custom"&&fechaIni&&fechaFin?fechaIni+" al "+fechaFin:"Todo el historial")
        ),

        // Main numbers
        re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}},
          re("div",{style:{background:"#E8F5E9",borderRadius:12,padding:"14px 10px",textAlign:"center"}},
            re("div",{style:{fontSize:11,color:"#388E3C",fontWeight:700,marginBottom:4}},"💰 INGRESOS"),
            re("div",{style:{fontSize:18,fontWeight:900,color:"#2E7D32"}},fmt(tv))
          ),
          re("div",{style:{background:"#FFEBEE",borderRadius:12,padding:"14px 10px",textAlign:"center"}},
            re("div",{style:{fontSize:11,color:C.red,fontWeight:700,marginBottom:4}},"💸 EGRESOS"),
            re("div",{style:{fontSize:18,fontWeight:900,color:C.red}},fmt(tg+tc+tDidiComision))
          ),
          re("div",{style:{background:(tv-tg-tc-tDidiComision)>=0?"#E3F2FD":"#FFEBEE",borderRadius:12,padding:"14px 10px",textAlign:"center"}},
            re("div",{style:{fontSize:11,color:"#1565C0",fontWeight:700,marginBottom:4}},"📈 UTILIDAD"),
            re("div",{style:{fontSize:18,fontWeight:900,color:(tv-tg-tc-tDidiComision)>=0?"#1565C0":C.red}},fmt(tv-tg-tc-tDidiComision))
          )
        ),

        // Por tienda
        re("div",{style:{marginBottom:16}},
          re("div",{style:{fontSize:12,fontWeight:800,color:"#555",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}},"Por tienda"),
          [
            ["🏪","Crepisimo Centro",ventasFil.filter(function(v){return v.tienda==="centro";}).reduce(function(s,v){return s+v.total;},0)],
            ["🏬","Crepisimo S.A.",ventasFil.filter(function(v){return v.tienda==="sanantonio";}).reduce(function(s,v){return s+v.total;},0)],
            ["🍔","AM-Burger",tvAmb],
            ["🧋","Tichi",tvTichi]
          ].map(function(x){
            var pct=tv>0?Math.round(x[2]/tv*100):0;
            return re("div",{key:x[1],style:{marginBottom:8}},
              re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}},
                re("span",null,x[0]+" "+x[1]),
                re("span",{style:{fontWeight:700}},fmt(x[2])+" ("+pct+"%)")
              ),
              re("div",{style:{height:8,background:"#f0f0f0",borderRadius:4,overflow:"hidden"}},
                re("div",{style:{height:"100%",width:pct+"%",background:C.dark,borderRadius:4}})
              )
            );
          })
        ),

        // Por metodo de pago / saldos
        re("div",{style:{marginBottom:16}},
          re("div",{style:{fontSize:12,fontWeight:800,color:"#555",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}},"Por origen de dinero"),
          re("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}},
            [["💵","Efectivo",saldoEfectivo,"#388E3C"],["💳","T. Migue",saldoMigue,"#1565C0"],["💳","T. Angel",saldoAngel,"#6A1B9A"]].map(function(x){
              return re("div",{key:x[1],style:{background:"#f8f9fa",borderRadius:10,padding:"12px 8px",textAlign:"center"}},
                re("div",{style:{fontSize:11,color:x[3],fontWeight:700,marginBottom:3}},x[0]+" "+x[1]),
                re("div",{style:{fontSize:15,fontWeight:900,color:x[2]>=0?x[3]:C.red}},fmt(x[2]))
              );
            })
          )
        ),

        // Top 5 productos
        re("div",null,
          re("div",{style:{fontSize:12,fontWeight:800,color:"#555",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}},"Top 5 productos"),
          re("div",null,
            (function(){
              var conteo={};
              ventasFil.forEach(function(v){
                (v.items||[]).forEach(function(item){
                  if(item.precio<=0||item.esDescuento||item.esEmpleado)return;
                  var n=item.nombre;
                  if(!conteo[n])conteo[n]={nombre:n,qty:0,total:0};
                  conteo[n].qty++;
                  conteo[n].total+=item.precio;
                });
              });
              var sorted=Object.values(conteo).sort(function(a,b){return b.qty-a.qty;}).slice(0,5);
              var maxQty=sorted.length>0?sorted[0].qty:1;
              return sorted.map(function(p,i){
                return re("div",{key:p.nombre,style:{marginBottom:8}},
                  re("div",{style:{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}},
                    re("span",null,(i+1)+". "+p.nombre),
                    re("span",{style:{fontWeight:700,color:"#555"}},p.qty+" veces | "+fmt(p.total))
                  ),
                  re("div",{style:{height:6,background:"#f0f0f0",borderRadius:3,overflow:"hidden"}},
                    re("div",{style:{height:"100%",width:Math.round(p.qty/maxQty*100)+"%",background:C.amber,borderRadius:3}})
                  )
                );
              });
            })()
          )
        )
      )
    ):null,

    tab==="productos"?re("div",null,
      re("div",{style:{background:"#fff",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:{fontSize:13,fontWeight:800,color:C.dark,marginBottom:10}},"Ventas por Producto"),
        re("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          [["todas","Todas"],["centro","Centro"],["sanantonio","S.Antonio"],["amburger","AM-Burger"],["tichi","Tichi"]].map(function(x){
            var sel=filtroTiendaProd===x[0];
            return re("button",{key:x[0],onClick:function(){setFiltroTiendaProd(x[0]);},
              style:{padding:"7px 12px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:9,
                cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",
                color:sel?"#fff":"#666",fontSize:11}},x[1]);
          })
        )
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",null,(function(){
          var vFil=ventasFil.filter(function(v){return filtroTiendaProd==="todas"||v.tienda===filtroTiendaProd;});
          var conteo={};
          vFil.forEach(function(v){
            (v.items||[]).forEach(function(item){
              if(item.precio<0||item.esDescuento)return;
              var n=(item.nombre||"").replace(" (empleado)","").replace(" (promo)","").trim();
              if(!conteo[n])conteo[n]={nombre:n,qty:0,total:0,tiendas:{}};
              conteo[n].qty++;
              conteo[n].total+=item.precio||0;
              var t=v.tienda||"";
              conteo[n].tiendas[t]=(conteo[n].tiendas[t]||0)+1;
            });
          });
          var sorted=Object.values(conteo).sort(function(a,b){return b.qty-a.qty;});
          if(sorted.length===0)return re("div",{style:{textAlign:"center",color:"#bbb",padding:30}},"Sin ventas");
          return re("div",null,
            re("div",{style:{display:"grid",gridTemplateColumns:"1fr 60px 80px",gap:"6px 10px",marginBottom:8,paddingBottom:6,borderBottom:"2px solid #f0f0f0"}},
              re("div",{style:{fontSize:10,fontWeight:800,color:"#aaa",textTransform:"uppercase"}},"Producto"),
              re("div",{style:{fontSize:10,fontWeight:800,color:"#aaa",textTransform:"uppercase",textAlign:"right"}},"Pzas"),
              re("div",{style:{fontSize:10,fontWeight:800,color:"#aaa",textTransform:"uppercase",textAlign:"right"}},"Total")
            ),
            sorted.map(function(p){
              return re("div",{key:p.nombre,style:{display:"grid",gridTemplateColumns:"1fr 60px 80px",gap:"4px 10px",paddingBottom:8,marginBottom:8,borderBottom:"1px solid #f8f8f8",alignItems:"start"}},
                re("div",null,
                  re("div",{style:{fontSize:13,fontWeight:600,color:C.dark}},p.nombre),
                  filtroTiendaProd==="todas"?re("div",{style:{fontSize:10,color:"#aaa",marginTop:1}},
                    Object.entries(p.tiendas).map(function(e){
                      var lb=e[0]==="centro"?"C":e[0]==="sanantonio"?"SA":e[0]==="amburger"?"AMB":"T";
                      return lb+":"+e[1];
                    }).join(" ")
                  ):null
                ),
                re("div",{style:{fontSize:13,fontWeight:700,color:"#555",textAlign:"right"}},p.qty),
                re("div",{style:{fontSize:13,fontWeight:700,color:C.green,textAlign:"right"}},fmt(p.total))
              );
            })
          );
        })())
      )
    ):null,

    tab==="graficas"?re("div",null,
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}},
          GRAFS.map(function(g){var sel=graf===g.id;return re("button",{key:g.id,onClick:function(){setGraf(g.id);},style:{padding:"7px 12px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:20,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.dark:"#fff",color:sel?"#fff":"#666",fontSize:12}},g.lbl);})
        ),
        re(BarChart,{datos:grafDatos.datos,titulo:grafDatos.titulo,color:grafDatos.color})
      )
    ):null,

    tab==="egresos"?re("div",null,
      re("button",{onClick:function(){setModalExt(true);},style:{width:"100%",padding:13,background:C.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:14}},"+ Agregar gasto externo (tarjetas / personal)"),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:SC},"Desglose de egresos"),
        Row("Materia prima",totalMP,C.red),
        Row("Colaboradores",tColab,C.red),
        Row("Gasto operativo",tOper,C.red),
        Row("Tarjeta Migue",tTarMigue,C.red),
        Row("Tarjeta Angel",tTarAngel,C.red),
        Row("Gasto personal A&M",tPersonal,C.purple),
        Row("Otros",tOtroCaja+tOtroExt,C.red),
        Row("Comision Clip",tc,C.red),
        tDidiComision>0?Row("Comision Didi",tDidiComision,C.red):null,
        tComisionML>0?Row("Comision Mercado Libre",tComisionML,C.red):null,
        re("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:14,borderTop:"2px solid #f0f0f0",marginTop:4}},
          re("span",{style:{fontWeight:800,color:C.dark}},"Total egresos"),
          re("span",{style:{fontWeight:900,color:C.red}},fmt(tg+tc+tDidiComision))
        )
      ),
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:SC},"Gastos externos recientes"),
        gastosExt.length===0?re("div",{style:{textAlign:"center",color:"#bbb",padding:20,fontSize:13}},"Sin gastos externos"):
        gastosExt.slice(0,15).map(function(g,i){
          var t=g.tienda==="centro"?"Centro":g.tienda==="sanantonio"?"S.Antonio":"Global";
          var desc=g.tipo==="insumo"?"MP: "+g.insumoNombre+" ("+fmtC(g.cantidad,g.unidad)+") ["+t+"]":g.tipo==="tarjeta_migue"?"T.Migue: "+(g.desc||""):g.tipo==="tarjeta_angel"?"T.Angel: "+(g.desc||""):g.tipo==="personal"?"Personal A&M: "+(g.desc||""):"Otro: "+(g.desc||"");
          return re("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<gastosExt.slice(0,15).length-1?"1px solid #f5f5f5":"none",fontSize:12}},
            re("div",null,re("div",{style:{color:"#555"}},desc),re("div",{style:{fontSize:10,color:"#aaa"}},fmtFecha(g.timestamp))),
            re("span",{style:{fontWeight:700,color:C.red,flexShrink:0,marginLeft:8}},fmt(g.monto))
          );
        })
      ),
      modalExt?re("div",{style:OV},re("div",{style:MD},
        re("div",{style:{fontSize:18,fontWeight:900,color:C.dark,marginBottom:16}},"Gasto externo"),
        re("div",{style:{marginBottom:14}},
          re("div",{style:LB},"Tipo *"),
          re("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},
            [["tarjeta_migue","💳 T. Migue"],["tarjeta_angel","💳 T. Angel"],["personal","👫 Personal A&M"],["otro","💸 Otro"]].map(function(x){var id=x[0],l=x[1],sel=gv.tipo===id;return re("button",{key:id,onClick:function(){updG("tipo",id);},style:{padding:"10px 8px",border:"2px solid "+(sel?C.dark:"#e0e0e0"),borderRadius:10,cursor:"pointer",fontWeight:sel?800:500,background:sel?C.purpleL:"#fff",color:sel?C.dark:"#666",fontSize:12,textAlign:"center"}},l);})
          )
        ),
        re("div",{style:{marginBottom:14}},re("div",{style:LB},"Descripcion"),re("input",{type:"text",placeholder:"Descripcion",value:gv.desc,onChange:function(e){updG("desc",e.target.value);},style:IP})),
        re("div",{style:{marginBottom:18}},re("div",{style:LB},"Monto ($) *"),re("input",{type:"number",placeholder:"0.00",value:gv.monto,onChange:function(e){updG("monto",e.target.value);},style:Object.assign({},IP,{fontSize:18,fontWeight:700})})),
        gv.err?re("div",{style:{fontSize:12,color:C.red,marginBottom:10,fontWeight:600}},gv.err):null,
        re("div",{style:{display:"flex",gap:10}},
          re("button",{onClick:function(){setModalExt(false);setGv({tipo:"",desc:"",monto:"",err:"" });},style:BS("#f0f0f0","#666")},"Cancelar"),
          re("button",{onClick:guardarGastoExt,style:BS(C.dark,"#fff",2)},"Registrar")
        )
      )):null
    ):null,

    tab==="ventas"?re("div",null,
      re("div",{style:{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.09)"}},
        re("div",{style:SC},"Ultimas ventas ("+ventasFil.length+")"),
        ventasFil.length===0?re("div",{style:{textAlign:"center",color:"#bbb",padding:20,fontSize:13}},"Sin ventas"):
        ventasFil.slice(0,30).map(function(v,i){
          return re("div",{key:i,style:{padding:"8px 0",borderBottom:i<Math.min(ventas.length,30)-1?"1px solid #f5f5f5":"none"}},
            re("div",{style:{display:"flex",justifyContent:"space-between"}},
              re("div",null,
                re("div",{style:{fontSize:12,color:"#888"}},(v.items||[]).map(function(x){return x.nombre;}).join(", ")),
                re("div",{style:{fontSize:11,color:"#ccc"}},v.metodo+" | "+(v.tienda==="centro"?"Centro":"San Antonio"))
              ),
              re("div",{style:{fontSize:14,fontWeight:800,color:C.green}},fmt(v.total))
            )
          );
        })
      )
    ):null
  );
}

// ── IMPRESION TERMICA BLUETOOTH ──────────────────────────
// Logos MP210 ESC* format (pre-converted bitmap)
var LOGO_CREPISIMO_B64="GyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDx8/OHBwMDAYPn8/AAEDAwMBAwMDAQAAAQMDAwMDAwMBAAABAwMDAAEDAwMDAwEAAAB/f38+AAABAwMDAgMDAwMAADN7e3szAAABAwMDAwADAwMDAwEBAwMDAwMBAAAAAAEDAwMDAwMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw/v//DwMBAQEBAwcOAID/////gcDgwAD+//+bERER8fP3AACA/////4EAAMP///4AAPP7+/EAAAfn8/H4eDw/n98GAAH/////AQCAgf///8GAgMH////BgID/////AQA8////gwEAgf///3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgMDAwMCAgAAAAIDAwMDAwAAAAAAAgIDAwMDAwIAAAAAM/Pz8/IzAwMDAgAAAAIDAwIAAAACAwICAwMDAgIAAAIDAwMDAgACAwMDAwMAAgMDAwMDAAACAwMDAgAAAAICAwMDAwICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEChIAAB4OAA4eAAAeHAACHgAADhYIAAACDg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK";
var LOGO_AMBURGER_B64="GyoAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChsqAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABw88cGDBzISciJCZibnDwuZwOB4HOf7//f//8fHz///+/nx9Mw8PDwAADw8PDw8PEB8fHx8bBx8fHx8PAAIGDw8fHh4eHx8PBxgfHx8fAw8fHx8fAB8eHh4eHg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAobKgCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDc//fAQNH3rywsLiYnDx44OBgYTEz93/9/9///4+Pj8////9//77h//8PDjz//////wD/////wb6//7/Dkz///3+A/19v7+/v354e+////8KAHh6fjw/P////fn48AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICA4PAwMDAwMDAwcGBgYODAwICAAACAgICAgICAgICAgICAAAAAgICAAAAAAICAgAAAgICAgAB4uLi4uHj4+PDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChsqAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAobKgCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChsqAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAo=";
var LOGO_TICHI_B64="GyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIHBwcPz8wcHBj7+9AAw8eHA8HAP//AAAAAH//8AcPBHB/HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8BAAD///8A//8AQODDG/z4wMDA///gH//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwODAAADAwMAAgMDgYODAgAAAAAAAAAAAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyoAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK";

function b64ToBytes(b64){
  var bin=atob(b64);
  var arr=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
  return arr;
}


function buildTicket(venta, tiendaId, ticketNum){
  var LF=0x0A;
  var ESC=0x1B;
  var GS=0x1D;
  var W=32;
  var bytes=[];

  function pushByte(b){bytes.push(b);}
  function pushBytes(arr){for(var i=0;i<arr.length;i++)bytes.push(arr[i]);}

  function encodeStr(str){
    var out=[];
    for(var i=0;i<str.length;i++){
      var c=str.charCodeAt(i);
      if(c>=32&&c<127)out.push(c);
      else if(c===10)out.push(10);
      else out.push(32); // space for unsupported chars
    }
    return out;
  }

  function writeLine(str){
    pushBytes(encodeStr(str));
    pushByte(LF);
  }

  function writeCenter(str){
    var s=String(str);
    var spaces=Math.max(0,Math.floor((W-s.length)/2));
    var padded="";
    for(var i=0;i<spaces;i++)padded+=" ";
    padded+=s;
    writeLine(padded);
  }

  function writeCols(left,right){
    var l=String(left);
    var r=String(right);
    var gap=W-l.length-r.length;
    if(gap<1)gap=1;
    var row=l;
    for(var i=0;i<gap;i++)row+=" ";
    row+=r;
    writeLine(row);
  }

  function writeSep(){writeLine("--------------------------------");}
  function writeBlank(){pushByte(LF);}

  // ── INIT ──────────────────────────────
  pushBytes([ESC,0x40]); // initialize printer

  // ── LOGO (center + bitmap) ────────────
  pushBytes([0x1B,0x61,0x01]); // center
  pushBytes([0x1B,0x33,0x00]); // line spacing 0
  var _logoB64=tiendaId==="amburger"?LOGO_AMBURGER_B64:tiendaId==="tichi"?LOGO_TICHI_B64:LOGO_CREPISIMO_B64;
  var _logoBytes=b64ToBytes(_logoB64);
  for(var _li=0;_li<_logoBytes.length;_li++)pushByte(_logoBytes[_li]);
  pushBytes([0x1B,0x32]); // restore line spacing
  pushBytes([0x1B,0x61,0x00]); // left align
  pushByte(0x0A);

  // ── STORE NAME (bold) ─────────────────
  pushBytes([ESC,0x45,0x01]); // bold ON
  var storeName="";
  if(tiendaId==="centro")storeName="Crepisimo Centro";
  else if(tiendaId==="sanantonio")storeName="Crepisimo San Antonio";
  else if(tiendaId==="amburger")storeName="AM-Burger";
  else storeName="Tichi";
  writeCenter(storeName);
  pushBytes([ESC,0x45,0x00]); // bold OFF
  writeBlank();

  // ── DATE & TIME ───────────────────────
  var d=new Date(venta.timestamp);
  var fecha=("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear();
  var hora=("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
  writeCenter(fecha+"  "+hora);
  writeCenter("Ticket #"+("000"+ticketNum).slice(-4));
  writeBlank();
  writeCenter("Bienvenido, esta es tu orden");
  writeSep();

  // ── ITEMS ─────────────────────────────
  var items=venta.items||[];
  for(var i=0;i<items.length;i++){
    var item=items[i];
    var nombre=String(item.nombre||"");
    if(nombre.length>18)nombre=nombre.slice(0,17)+"~";
    var precio="";
    if(item.precio===0)precio="GRATIS";
    else if(item.precio<0)precio="-$"+Math.abs(item.precio).toFixed(2);
    else precio="$"+item.precio.toFixed(2);
    writeCols(nombre,precio);
    if(item.paraLlevar&&item.paraLlevar!=="")writeLine("  "+item.paraLlevar);
    if(item.detalle)writeLine("  "+item.detalle);
  }
  writeSep();

  // ── TOTAL ─────────────────────────────
  pushBytes([ESC,0x45,0x01]); // bold ON
  writeCols("TOTAL","$"+Number(venta.total||0).toFixed(2));
  pushBytes([ESC,0x45,0x00]); // bold OFF

  // ── PAYMENT ───────────────────────────
  var met=String(venta.metodo||"").toLowerCase();
  var metNombre=met==="efectivo"?"Efectivo":met==="transferencia"?"Transferencia":met==="clip"?"Clip":met==="didi"?"Didi Food":met==="mercadolibre"?"Mercado Libre":"";
  writeLine("Pago: "+metNombre);
  if(Number(venta.cambio)>0)writeLine("Cambio: $"+Number(venta.cambio).toFixed(2));
  if(Number(venta.comisionClip)>0)writeLine("Com.Clip: -$"+Number(venta.comisionClip).toFixed(2));
  writeSep();

  // ── FOOTER ────────────────────────────
  pushBytes([ESC,0x45,0x01]); // bold ON
  writeCenter("Nos vemos en la proxima,");
  writeCenter("chaoo!");
  pushBytes([ESC,0x45,0x00]); // bold OFF

  // Feed paper before cut
  for(var j=0;j<6;j++)writeBlank();

  // Paper cut
  pushBytes([GS,0x56,0x01]); // full cut

  return new Uint8Array(bytes);
}

window._ticketCounter=window._ticketCounter||{};
function getNextTicket(tiendaId){
  if(!window._ticketCounter[tiendaId])window._ticketCounter[tiendaId]=0;
  window._ticketCounter[tiendaId]++;
  return window._ticketCounter[tiendaId];
}

window._btChar=null;
window._btDevice=null;

window.conectarImpresora=async function(){
  try{
    var device=await navigator.bluetooth.requestDevice({
      acceptAllDevices:true,
      optionalServices:["000018f0-0000-1000-8000-00805f9b34fb","e7810a71-73ae-499d-8c15-faa9aef0c3f2","00001101-0000-1000-8000-00805f9b34fb"]
    });
    var server=await device.gatt.connect();
    var services=await server.getPrimaryServices();
    var ch=null;
    for(var i=0;i<services.length&&!ch;i++){
      try{
        var chars=await services[i].getCharacteristics();
        for(var j=0;j<chars.length;j++){
          if(chars[j].properties.writeWithoutResponse||chars[j].properties.write){
            ch=chars[j];break;
          }
        }
      }catch(e){}
    }
    if(!ch){alert("No se encontro caracteristica de impresion");return false;}
    window._btChar=ch;
    window._btDevice=device;
    device.addEventListener("gattserverdisconnected",function(){
      window._btChar=null;window._btDevice=null;
    });
    return true;
  }catch(e){console.error("BT connect error:",e);return false;}
};

window.imprimirTicket=async function(venta,tiendaId){
  try{
    if(!window._btChar||!window._btDevice||!window._btDevice.gatt.connected){
      var ok=await window.conectarImpresora();
      if(!ok){alert("No se pudo conectar a la impresora. Verifica que este encendida.");return;}
    }
    var num=getNextTicket(tiendaId);
    var data=buildTicket(venta,tiendaId,num);
    // Split into 20-byte chunks (BLE default MTU safe size)
    var CHUNK=20;
    for(var i=0;i<data.length;i+=CHUNK){
      var chunk=data.slice(i,Math.min(i+CHUNK,data.length));
      if(window._btChar.properties.writeWithoutResponse){
        await window._btChar.writeValueWithoutResponse(chunk);
      } else {
        await window._btChar.writeValue(chunk);
      }
    }
  }catch(e){
    console.error("Print error:",e);
    window._btChar=null;
    alert("Error de impresion: "+e.message);
  }
};


// ── SUPABASE ─────────────────────────────────────────────
var SB_URL="https://ctsijalwjuzmingdxozi.supabase.co";
var SB_KEY="sb_publishable_LJZo3cGXe7hhzajWSogATw_A8vGfRO7";

function sbFetch(path,method,body){
  var opts={method:method||"GET",headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":method==="POST"?"return=minimal":"return=representation"}};
  if(body)opts.body=JSON.stringify(body);
  return fetch(SB_URL+"/rest/v1/"+path,opts).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t);});if(r.status===204)return null;return r.json();});
}

function sbGet(table,params){return sbFetch(table+(params?"?"+params:""),"GET");}
function sbPost(table,data){return sbFetch(table,"POST",data);}
function sbPatch(table,filter,data){return sbFetch(table+"?"+filter,"PATCH",data);}
function sbUpsert(table,data,onConflict){
  return fetch(SB_URL+"/rest/v1/"+table+"?on_conflict="+(onConflict||"id"),{method:"POST",headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(data)}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t);});return null;});
}

async function saveVenta(venta){
  try{await sbPost("ventas",{timestamp:venta.timestamp,tienda:venta.tienda||"",total:venta.total||0,metodo:venta.metodo||"",items:venta.items||[],comision_clip:venta.comisionClip||0,neto_recibido:venta.netoRecibido||venta.total||0,comision_didi:venta.comisionDidi||0,comision_ml:venta.comisionML||0,cambio:venta.cambio||0,estado_pago:venta.estadoPago||"pagado",terminal_clip:venta.terminalClip||""});}catch(e){console.error("saveVenta:",e);}
}

async function saveGasto(gasto){
  try{await sbPost("gastos",{timestamp:gasto.timestamp||new Date().toISOString(),tienda:gasto.tienda||"",seccion:gasto.seccion||"caja",tipo:gasto.tipo||"",monto:gasto.monto||0,desc_gasto:gasto.desc||"",insumo_id:gasto.insumoId||"",insumo_nombre:gasto.insumoNombre||"",cantidad:gasto.cantidad||0,unidad:gasto.unidad||"",metodo_pago:gasto.metodoPago||""});}catch(e){console.error("saveGasto:",e);}
}

async function saveInventario(tienda,insumos){
  try{var rows=insumos.map(function(i){return {tienda:tienda,insumo_id:i.id,stock:i.stock||0,costo_por_u:i.costoPorU||null};});await sbUpsert("inventario",rows,"tienda,insumo_id");}catch(e){console.error("saveInventario:",e);}
}

async function applyStockDeltas(tienda,deltas){
  // deltas = [{id:"insumo_id", delta:-6}]
  try{
    for(var i=0;i<deltas.length;i++){
      await updateStock(tienda,deltas[i].id,deltas[i].delta);
    }
  }catch(e){console.error("applyStockDeltas:",e);}
}

async function updateStockDelta(tienda,deltas){
  // deltas: [{id, delta}] - positive=add, negative=subtract
  try{
    for(var i=0;i<deltas.length;i++){
      var d=deltas[i];
      if(!d.id||d.delta===0)continue;
      await fetch(SB_URL+"/rest/v1/rpc/update_stock",{
        method:"POST",
        headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({p_tienda:tienda,p_insumo_id:d.id,p_delta:d.delta})
      });
    }
  }catch(e){console.error("updateStockDelta:",e);}
}

async function updateEstadoPago(timestamps,status){
  try{var s=status||"pagado";for(var i=0;i<timestamps.length;i++){await sbPatch("ventas","timestamp=eq."+encodeURIComponent(timestamps[i]),{estado_pago:s});}}catch(e){console.error("updateEstadoPago:",e);}
}

async function updateVentaById(dbId,data){
  try{await sbPatch("ventas","id=eq."+dbId,data);}catch(e){console.error("updateVentaById:",e);}
}

async function sbRpc(fn, params){
  var r=await fetch(SB_URL+"/rest/v1/rpc/"+fn,{
    method:"POST",
    headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json"},
    body:JSON.stringify(params)
  });
  if(!r.ok){var t=await r.text();throw new Error(t);}
  return null;
}

async function updateStock(tienda,insumoId,delta){
  try{await sbRpc("update_stock",{p_tienda:tienda,p_insumo_id:insumoId,p_delta:delta});}
  catch(e){console.error("updateStock:",e);}
}

async function loadFromSupabase(){
  try{
    var ventas=await sbGet("ventas","select=*&order=timestamp.desc&limit=2000")||[];
    var gastos=await sbGet("gastos","select=*&order=timestamp.desc&limit=2000")||[];
    var inventario=await sbGet("inventario","select=*")||[];
    var ventasApp=ventas.map(function(v){return {_dbId:v.id,timestamp:v.timestamp,tienda:v.tienda,total:v.total,metodo:v.metodo,items:v.items||[],comisionClip:v.comision_clip||0,netoRecibido:v.neto_recibido||v.total,comisionDidi:v.comision_didi||0,comisionML:v.comision_ml||0,cambio:v.cambio||0,estadoPago:v.estado_pago||"pagado",terminalClip:v.terminal_clip||""};});
    var gastosApp=gastos.map(function(g){return {timestamp:g.timestamp,tienda:g.tienda,seccion:g.seccion,tipo:g.tipo,monto:g.monto,desc:g.desc_gasto||"",insumoId:g.insumo_id||"",insumoNombre:g.insumo_nombre||"",cantidad:g.cantidad||0,unidad:g.unidad||"",metodoPago:g.metodo_pago||""};});
    return {ventas:ventasApp,gastos:gastosApp,inventario:inventario};
  }catch(e){console.error("loadFromSupabase:",e);return null;}
}

export default function App(){
  var sI1=useState(mkInsumos());var insC=sI1[0];var setInsC=sI1[1];
  var sI2=useState(mkInsumos());var insSA=sI2[0];var setInsSA=sI2[1];
  var sI3=useState(mkInsumosAmb());var insAmb=sI3[0];var setInsAmb=sI3[1];
  var sI4=useState(mkInsumosTichi());var insTichi=sI4[0];var setInsTichi=sI4[1];
  var sV=useState([]);var ventas=sV[0];var setVentas=sV[1];
  var sG=useState([]);var gastos=sG[0];var setGastos=sG[1];
  var sLoad=useState(true);var cargando=sLoad[0];var setCargando=sLoad[1];
  var sErr=useState("");var sbError=sErr[0];var setSbError=sErr[1];

  // Load from Supabase on mount
  React.useEffect(function(){
    loadFromSupabase().then(function(data){
      if(data){
        setVentas(data.ventas);
        setGastos(data.gastos);
        // Restore inventario stock
        var inv=data.inventario;
        if(inv&&inv.length>0){
          function restoreIns(setFn,tiendaId,mkFn){
            setFn(function(prev){
              return prev.map(function(ins){
                var row=inv.find(function(r){return r.tienda===tiendaId&&r.insumo_id===ins.id;});
                return row?Object.assign({},ins,{stock:row.stock,costoPorU:row.costo_por_u||ins.costoPorU||null}):ins;
              });
            });
          }
          restoreIns(setInsC,"centro");
          restoreIns(setInsSA,"sanantonio");
          restoreIns(setInsAmb,"amburger");
          restoreIns(setInsTichi,"tichi");
        }
      } else {
        setSbError("No se pudo conectar a la base de datos");
      }
      setCargando(false);
    });
  },[]);
  var sVist=useState("selector");var vista=sVist[0];var setVista=sVist[1];
  var sTid=useState(null);var tiendaId=sTid[0];var setTiendaId=sTid[1];
  var sSec=useState("pos");var seccion=sSec[0];var setSeccion=sSec[1];
  var sPinM=useState(false);var pinModal=sPinM[0];var setPinModal=sPinM[1];
  var sPinOk=useState(false);var pinOk=sPinOk[0];var setPinOk=sPinOk[1];

  // Save inventario to Supabase when it changes (debounced)
  React.useEffect(function(){
    if(cargando)return;
    var timer=setTimeout(function(){
      saveInventario("centro",insC);
    },3000);
    return function(){clearTimeout(timer);};
  },[insC]);
  React.useEffect(function(){
    if(cargando)return;
    var timer=setTimeout(function(){
      saveInventario("sanantonio",insSA);
    },3000);
    return function(){clearTimeout(timer);};
  },[insSA]);
  React.useEffect(function(){
    if(cargando)return;
    var timer=setTimeout(function(){
      saveInventario("amburger",insAmb);
    },3000);
    return function(){clearTimeout(timer);};
  },[insAmb]);
  React.useEffect(function(){
    if(cargando)return;
    var timer=setTimeout(function(){
      saveInventario("tichi",insTichi);
    },3000);
    return function(){clearTimeout(timer);};
  },[insTichi]);

  function addVenta(v){
    setVentas(function(p){return [v].concat(p);});
    saveVenta(v);
  }
  function addGasto(g){
    setGastos(function(p){return [g].concat(p);});
    saveGasto(g);
  }
  function insFor(tid){return tid==="centro"?insC:tid==="sanantonio"?insSA:tid==="amburger"?insAmb:insTichi;}
  function setInsFor(tid){return tid==="centro"?setInsC:tid==="sanantonio"?setInsSA:tid==="amburger"?setInsAmb:setInsTichi;}
  function insOtra(tid){return tid==="centro"?insSA:insC;}
  function setInsOtra(tid){return tid==="centro"?setInsSA:setInsC;}

  var alertC=insC.filter(function(i){return (i.stock||0)<=i.minimo&&i.minimo>0;}).length;
  var alertSA=insSA.filter(function(i){return (i.stock||0)<=i.minimo&&i.minimo>0;}).length;
  var alertAmb=insAmb.filter(function(i){return (i.stock||0)<=i.minimo&&i.minimo>0;}).length;
  var alertTichi=insTichi.filter(function(i){return (i.stock||0)<=i.minimo&&i.minimo>0;}).length;

  // Loading screen while fetching from Supabase
  if(cargando){
    return re("div",{style:{minHeight:"100vh",background:"#f0f2f7",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}},
      re("div",{style:{fontSize:40}},"⏳"),
      re("div",{style:{fontSize:18,fontWeight:700,color:C.dark}},"Cargando datos..."),
      re("div",{style:{fontSize:13,color:"#aaa"}},"Conectando con la base de datos")
    );
  }

  if(sbError){
    return re("div",{style:{minHeight:"100vh",background:"#f0f2f7",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24}},
      re("div",{style:{fontSize:40}},"⚠️"),
      re("div",{style:{fontSize:18,fontWeight:700,color:C.red}},"Error de conexion"),
      re("div",{style:{fontSize:13,color:"#666",textAlign:"center"}},sbError),
      re("button",{onClick:function(){setCargando(true);setSbError("");loadFromSupabase().then(function(data){if(data){setVentas(data.ventas);setGastos(data.gastos);}else{setSbError("No se pudo conectar");}setCargando(false);});},style:{marginTop:8,padding:"12px 24px",background:C.dark,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer"}},"Reintentar")
    );
  }

  if(vista==="selector"){
    return re("div",{style:{minHeight:"100vh",background:"#f0f2f7",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}},
      re("div",{style:{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Sistema de Ventas"),
      re("div",{style:{fontSize:26,fontWeight:900,color:C.dark,marginBottom:32}},"Crepísimo"),
      re("div",{style:{width:"100%",maxWidth:500}},
        TIENDAS.map(function(t){
          var alerts=t.id==="centro"?alertC:t.id==="sanantonio"?alertSA:t.id==="amburger"?alertAmb:alertTichi;
          return re("button",{key:t.id,onClick:function(){setTiendaId(t.id);setSeccion("pos");setVista("tienda");},style:{width:"100%",background:"#fff",border:"2px solid "+C.dark,borderRadius:16,padding:20,marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}},
            re("div",{style:{fontSize:36}},t.emoji),
            re("div",{style:{flex:1,textAlign:"left"}},
              re("div",{style:{fontSize:16,fontWeight:900,color:C.dark}},t.nombre),
              alerts>0?re("div",{style:{fontSize:12,color:C.amber,fontWeight:600,marginTop:2}},"Alertas: "+alerts+" insumos"):re("div",{style:{fontSize:12,color:"#aaa",marginTop:2}},"Sin alertas")
            ),
            re("div",{style:{fontSize:20,color:C.dark}},"->")
          );
        }),
        re("button",{onClick:function(){if(pinOk){setVista("finanzas");}else{setPinModal(true);}},style:{width:"100%",background:C.dark,border:"none",borderRadius:16,padding:20,cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,.12)"}},
          re("div",{style:{fontSize:36}},"📊"),
          re("div",{style:{flex:1,textAlign:"left"}},
            re("div",{style:{fontSize:16,fontWeight:900,color:"#fff"}},"Finanzas Globales"),
            re("div",{style:{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:2}},pinOk?"Todas las tiendas":"🔒 Requiere PIN")
          ),
          re("div",{style:{fontSize:20,color:"rgba(255,255,255,.6)"}},"->")
        )
      ),
      re("button",{onClick:function(){window.conectarImpresora&&window.conectarImpresora().then(function(ok){alert(ok?"Impresora conectada!":"No se pudo conectar. Verifica que la impresora este encendida y pareada.");});},style:{width:"100%",background:"#fff",border:"2px solid #e0e0e0",borderRadius:16,padding:16,cursor:"pointer",display:"flex",alignItems:"center",gap:14,marginTop:8,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}},
        re("div",{style:{fontSize:30}},"🖨️"),
        re("div",{style:{flex:1,textAlign:"left"}},
          re("div",{style:{fontSize:14,fontWeight:700,color:"#333"}},"Conectar impresora"),
          re("div",{style:{fontSize:12,color:"#aaa",marginTop:2}},"Bluetooth - Impresora termica")
        )
      ),
      pinModal?re(ModalPin,{onAcceso:function(){setPinOk(true);setPinModal(false);setVista("finanzas");},onClose:function(){setPinModal(false);}}):null
    );
  }

  if(vista==="finanzas"){
    return re("div",{style:{minHeight:"100vh",background:"#f0f2f7",fontFamily:"'Segoe UI',system-ui,sans-serif"}},
      re("div",{style:{background:C.dark,padding:"14px 14px 0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}},
        re("button",{onClick:function(){setVista("selector");},style:{background:"rgba(255,255,255,.2)",color:"#fff",border:"2px solid rgba(255,255,255,.5)",borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer",padding:"8px 16px",marginBottom:8,display:"block"}},"← Inicio"),
        re("div",{style:{fontSize:18,fontWeight:900,color:"#fff",paddingBottom:12}})
      ),
      re("div",{style:{maxWidth:900,margin:"0 auto"}},
        re(FinanzasGlobal,{ventas:ventas,gastos:gastos,insC:insC,insSA:insSA,insAmb:insAmb,insTichi:insTichi,onGasto:addGasto})
      )
    );
  }

  // Vista tienda
  var tid=tiendaId;
  var tInfo=TIENDAS.find(function(t){return t.id===tid;})||TIENDAS[0];
  var ins=insFor(tid);
  var setIns=setInsFor(tid);
  var alertCount=ins.filter(function(i){return (i.stock||0)<=i.minimo&&i.minimo>0;}).length;

  function irSec(id){
    if(id==="pos"||id==="pedidos"){setSeccion(id);return;}
    if(id==="finanzas"){if(pinOk){setVista("finanzas");}else{setPinModal(true);}return;}
    if(pinOk){setSeccion(id);}else{setPinModal(true);}
  }

  return re("div",{style:{minHeight:"100vh",background:"#f0f2f7",fontFamily:"'Segoe UI',system-ui,sans-serif"}},
    re("div",{style:{background:tid==="amburger"?"#1a237e":tid==="tichi"?TC.dark:C.dark,paddingTop:10,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}},
      re("div",{style:{maxWidth:900,margin:"0 auto"}},
        re("div",{style:{padding:"0 14px",marginBottom:2}},
          re("button",{onClick:function(){setVista("selector");},style:{background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:12,cursor:"pointer",padding:0,marginBottom:2,display:"block"}},"<- Inicio"),
          re("div",{style:{fontSize:16,fontWeight:900,color:"#fff"}},tInfo.emoji+" "+tInfo.nombre)
        ),
        re("div",{style:{display:"flex",padding:"6px 14px 0",overflowX:"auto",gap:2}},
          [["pos","Ventas"],["pedidos","Pedidos"],["inventario","Inv."+(alertCount>0?" !":"")],["finanzas","Finanzas"]].map(function(x){
            var id=x[0],lbl=x[1],sel=seccion===id&&vista==="tienda";
            return re("button",{key:id,onClick:function(){irSec(id);},style:{padding:"7px 10px",border:"none",cursor:"pointer",background:sel?"#fff":"transparent",color:sel?(tid==="amburger"?"#1a237e":tid==="tichi"?TC.dark:C.dark):"rgba(255,255,255,.85)",fontWeight:sel?800:500,fontSize:13,borderRadius:"8px 8px 0 0",whiteSpace:"nowrap"}},
              lbl+((id==="inventario"||id==="finanzas")&&!pinOk?" 🔒":"")
            );
          })
        )
      )
    ),
    re("div",{style:{maxWidth:900,margin:"0 auto"}},
      seccion==="pos"?tid==="tichi"?re(POSTichi,{tiendaId:tid,insumos:ins,setInsumos:setIns,onVenta:function(v){addVenta(Object.assign({},v,{tienda:tid}));},onGasto:function(g){addGasto(Object.assign({},g,{tienda:tid}));},ventas:ventas.filter(function(v){return v.tienda===tid;}),gastos:gastos.filter(function(g){return g.tienda===tid;})}):tid==="amburger"?re(POSAmburger,{tiendaId:tid,insumos:ins,setInsumos:setIns,onVenta:function(v){addVenta(Object.assign({},v,{tienda:tid}));},onGasto:function(g){addGasto(Object.assign({},g,{tienda:tid}));},ventas:ventas.filter(function(v){return v.tienda===tid;}),gastos:gastos.filter(function(g){return g.tienda===tid;})}):re(POS,{tiendaId:tid,insumos:ins,setInsumos:setIns,onVenta:function(v){addVenta(Object.assign({},v,{tienda:tid}));},onGasto:function(g){addGasto(Object.assign({},g,{tienda:tid}));},ventas:ventas.filter(function(v){return v.tienda===tid;}),gastos:gastos.filter(function(g){return g.tienda===tid;})}):null,
      seccion==="pedidos"?tid==="tichi"?re(PedidosTichi,{ventas:ventas.filter(function(v){return v.tienda===tid;}),tiendaId:tid,
              onActualizarPago:function(ts){setVentas(function(p){return p.map(function(v){return v.timestamp===ts?Object.assign({},v,{estadoPago:"pagado"}):v;});});updateEstadoPago([ts]);},
              onReembolso:function(venta){
                setVentas(function(p){return p.map(function(v){return v.timestamp===venta.timestamp?Object.assign({},v,{estadoPago:"reembolsado"}):v;});});
                if(venta._dbId){updateVentaById(venta._dbId,{estado_pago:"reembolsado"});}else{updateEstadoPago([venta.timestamp],"reembolsado");}
                setInsTichi(function(prev){
                  var newIns=prev.map(function(i){return Object.assign({},i);});
                  (venta.items||[]).forEach(function(item){
                    if(item.esDescuento||item.esEnvio)return;
                    var rec=R_TICHI_PROD[item.recetaKey]||[];
                    rec.forEach(function(r){var ins=newIns.find(function(x){return x.id===r.id;});if(ins)ins.stock=(ins.stock||0)+r.c;});
                  });
                  return newIns;
                });
              }}):re(Pedidos,{ventas:ventas,tiendaId:tid,
          onActualizarPago:function(timestamps,tipo,montoReal,comision){setVentas(function(p){return p.map(function(v){return timestamps.includes(v.timestamp)?Object.assign({},v,{estadoPago:"pagado",netoRecibido:montoReal?(montoReal/Math.max(1,timestamps.length)):v.netoRecibido,comisionDidi:comision?(comision/Math.max(1,timestamps.length)):v.comisionDidi}):v;});});updateEstadoPago(timestamps);},
          onReembolso:function(venta){
            // Mark as reembolsado
            setVentas(function(p){return p.map(function(v){return v.timestamp===venta.timestamp?Object.assign({},v,{estadoPago:"reembolsado"}):v;});});
            if(venta._dbId){updateVentaById(venta._dbId,{estado_pago:"reembolsado"});}else{updateEstadoPago([venta.timestamp],"reembolsado");}
            // Restore MP inventory
            var insKey=tid==="centro"?"centro":tid==="sanantonio"?"sanantonio":tid==="amburger"?"amburger":"tichi";
            var setFn=insKey==="centro"?setInsC:insKey==="sanantonio"?setInsSA:insKey==="amburger"?setInsAmb:setInsTichi;
            var recipes=insKey==="amburger"?R_AMB:insKey==="tichi"?R_TICHI_PROD:R;
            setFn(function(prev){
              var newIns=prev.map(function(i){return Object.assign({},i);});
              (venta.items||[]).forEach(function(item){
                if(item.esDescuento||item.esEnvio)return;
                var rk=item.esEmpleado?(item.recetaBase||""):item.recetaKey;
                var rec=recipes[rk]||[];
                rec.forEach(function(r){
                  if(item.esEmpleado&&EMPAQUE_IDS.indexOf(r.id)>=0)return;
                  var ins=newIns.find(function(x){return x.id===r.id;});
                  if(ins)ins.stock=(ins.stock||0)+r.c;
                });
              });
              return newIns;
            });
          }
        }):null,
      seccion==="inventario"?tid==="tichi"?re(InventarioTichi,{insumos:ins,setInsumos:setIns,onGasto:function(g){addGasto(Object.assign({},g,{tienda:tid}));},tiendaId:tid}):re(Inventario,{
        insumos:ins,setInsumos:setIns,
        onGasto:function(g){addGasto(Object.assign({},g,{tienda:tid}));},
        tiendaId:tid,
        insumosOtra:insOtra(tid),
        setInsumosOtra:setInsOtra(tid),
      }):null
    ),
    pinModal?re(ModalPin,{onAcceso:function(){setPinOk(true);setPinModal(false);setVista("finanzas");},onClose:function(){setPinModal(false);}}):null
  );
}
