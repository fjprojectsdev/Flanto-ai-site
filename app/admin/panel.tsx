"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, FileImage, Gamepad2, ImagePlus, LayoutDashboard, LogOut, MessageSquareQuote, Save, Upload, Users } from "lucide-react";

type SiteData = { content: Record<string, string>; media: Record<string, string>; testimonials: Array<{ id: number; name: string; role: string; quote: string }> };
type MediaSlot = { slot: string; title: string; description: string; optional?: boolean };
type MediaGroup = { id: string; step: string; eyebrow: string; title: string; description: string; slots: MediaSlot[] };

const groups: MediaGroup[] = [
  { id:"city", step:"02", eyebrow:"JOGO AUTORAL", title:"FLANTO City", description:"Organize toda a apresentação visual do jogo em um único lugar.", slots:[
    { slot:"game_flanto_city", title:"Capa do FLANTO City", description:"Imagem principal usada no catálogo e na apresentação do jogo." },
    { slot:"flanto_city_character_1", title:"Personagem 1", description:"Arte individual do primeiro personagem ou facção." },
    { slot:"flanto_city_character_2", title:"Personagem 2", description:"Arte individual do segundo personagem ou facção." },
    { slot:"flanto_city_character_3", title:"Personagem 3", description:"Arte individual do terceiro personagem ou facção.", optional:true },
    { slot:"flanto_city_rules", title:"Regras do jogo", description:"Card ou captura visual explicando as regras.", optional:true },
    { slot:"flanto_city_characters", title:"Composição geral", description:"Imagem com Cidade, Visitantes e Farsante juntos.", optional:true },
  ]},
  { id:"games", step:"03", eyebrow:"CATÁLOGO", title:"Capas dos jogos", description:"Imagens exibidas nos cards e detalhes dos jogos em destaque.", slots:[
    { slot:"game_anagrama", title:"Capa do Anagrama", description:"Arte ou captura oficial do Anagrama." },
    { slot:"game_quiz", title:"Capa do Quiz", description:"Arte ou captura oficial do Quiz." },
    { slot:"game_drawing", title:"Capa do Acerte o Desenho", description:"Arte principal do jogo autoral." },
  ]},
  { id:"demo", step:"04", eyebrow:"DEMONSTRAÇÕES", title:"Produto em funcionamento", description:"Capturas reais para demonstrar partidas, pontuação e atividade.", slots:[
    { slot:"hero_demo", title:"Demonstração principal", description:"Imagem que representa o FLANTO funcionando.", optional:true },
    { slot:"proof_1", title:"Partida real", description:"Captura de uma partida acontecendo." },
    { slot:"proof_2", title:"Ranking ou pontuação", description:"Captura real de pontos ou ranking." },
    { slot:"proof_3", title:"Comunidade ativa", description:"Captura de uma comunidade usando o FLANTO." },
  ]},
];

const allSlots = groups.flatMap((group)=>group.slots);

function UploadCard({ item, url, onUpload }: { item: MediaSlot; url?: string; onUpload: (slot:string,file?:File)=>void }) {
  return <article className="admin-upload-card">
    <div className="admin-upload-preview">{url ? <img src={url} alt={`Prévia de ${item.title}`} /> : <div className="admin-placeholder"><ImagePlus /><span>Aguardando imagem</span></div>}<span className={`admin-file-status ${url?"ready":"pending"}`}>{url?"Publicada":"Pendente"}</span></div>
    <div className="admin-upload-copy"><div><h3>{item.title}</h3>{item.optional&&<small>OPCIONAL</small>}</div><p>{item.description}</p><label><Upload /> {url?"Substituir imagem":"Enviar imagem"}<input type="file" accept="image/*" onChange={(e)=>onUpload(item.slot,e.target.files?.[0])}/></label></div>
  </article>;
}

export default function AdminPanel({ user, signOutPath }: { user: { name: string; email: string }; signOutPath: string }) {
  const [data,setData]=useState<SiteData>({content:{},media:{},testimonials:[]});
  const [values,setValues]=useState<Record<string,string>>({registeredUsers:"70+",communities:"30+",matches:"",heroTitle:"A AI de jogos que mantém sua comunidade ativa 24 horas."});
  const [message,setMessage]=useState(""); const [testimonial,setTestimonial]=useState({name:"",role:"",quote:""});
  const load=async()=>{const response=await fetch("/api/site-data",{cache:"no-store"});const result=await response.json();setData(result);setValues((current)=>({...current,...result.content}));};
  useEffect(()=>{load();},[]);
  const completed=useMemo(()=>allSlots.filter((item)=>data.media[item.slot]).length,[data.media]);
  const progress=Math.round((completed/allSlots.length)*100);
  const saveContent=async()=>{setMessage("Salvando…");const response=await fetch("/api/admin/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({values})});setMessage(response.ok?"Conteúdo atualizado.":"Não foi possível salvar.");};
  const upload=async(slot:string,file?:File)=>{if(!file)return;if(file.size>2*1024*1024){setMessage("Envie uma imagem de até 2 MB.");return;}setMessage(`Enviando ${file.name}…`);const dataUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=reject;reader.readAsDataURL(file);});const response=await fetch("/api/admin/media",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slot,filename:file.name,dataUrl})});const result=await response.json().catch(()=>({}));setMessage(response.ok?"Imagem publicada.":result.error||"Falha no envio.");if(response.ok)await load();};
  const addTestimonial=async()=>{setMessage("Salvando depoimento…");const response=await fetch("/api/admin/testimonials",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(testimonial)});if(response.ok){setTestimonial({name:"",role:"",quote:""});await load();setMessage("Depoimento publicado.");}else setMessage("Não foi possível salvar o depoimento.");};

  return <main className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/"><img src="/flanto-logo-new.webp" alt=""/><span>FLANTO <b>ADMIN</b></span></a><p className="admin-nav-label">ETAPAS DO SITE</p><nav><a href="#overview"><b>01</b><LayoutDashboard/>Visão geral</a><a href="#city"><b>02</b><Gamepad2/>FLANTO City</a><a href="#games"><b>03</b><FileImage/>Capas dos jogos</a><a href="#demo"><b>04</b><ImagePlus/>Demonstrações</a><a href="#testimonials"><b>05</b><MessageSquareQuote/>Depoimentos</a></nav><div className="admin-user"><span>{user.name}</span><small>{user.email}</small><a href={signOutPath} target="_top"><LogOut/>Sair</a></div></aside>
    <section className="admin-main"><header><div><span>PAINEL ADMINISTRATIVO</span><h1>Conteúdo do FLANTO</h1><p>Siga as etapas para completar o site.</p></div><a href="/" target="_blank">Ver site</a></header>{message&&<div className="admin-toast"><Check/>{message}</div>}
      <section id="overview" className="admin-overview"><div className="admin-section-title"><div><span>ETAPA 01</span><h2>Visão geral</h2><p>Atualize as informações principais e acompanhe o que ainda falta.</p></div></div><div className="admin-progress"><div><strong>{progress}%</strong><span>da biblioteca visual preenchida</span></div><div className="admin-progress-track"><i style={{width:`${progress}%`}}/></div><small>{completed} de {allSlots.length} imagens publicadas</small></div><div className="admin-stats"><article><Users/><strong>{values.registeredUsers||"70+"}</strong><span>Usuários cadastrados</span></article><article><MessageSquareQuote/><strong>{data.testimonials.length}</strong><span>Depoimentos</span></article><article><FileImage/><strong>{completed}</strong><span>Imagens publicadas</span></article><article><Gamepad2/><strong>16</strong><span>Jogos no catálogo</span></article></div><div className="admin-content-box"><div className="admin-section-title compact"><div><span>TEXTO E NÚMEROS</span><h2>Informações principais</h2></div><button onClick={saveContent}><Save/>Salvar alterações</button></div><div className="admin-form-grid"><label className="wide">Promessa principal<textarea value={values.heroTitle||""} onChange={(e)=>setValues({...values,heroTitle:e.target.value})}/></label><label>Usuários cadastrados<input value={values.registeredUsers||""} onChange={(e)=>setValues({...values,registeredUsers:e.target.value})}/></label><label>Comunidades atendidas<input value={values.communities||""} onChange={(e)=>setValues({...values,communities:e.target.value})}/></label><label>Partidas realizadas<input placeholder="Ex.: 1.200+" value={values.matches||""} onChange={(e)=>setValues({...values,matches:e.target.value})}/></label></div></div></section>
      {groups.map((group)=><section id={group.id} key={group.id} className="admin-category"><div className="admin-section-title"><div><span>ETAPA {group.step} · {group.eyebrow}</span><h2>{group.title}</h2><p>{group.description}</p></div><div className="admin-category-count">{group.slots.filter((item)=>data.media[item.slot]).length}/{group.slots.length}</div></div><div className="admin-media-grid">{group.slots.map((item)=><UploadCard key={item.slot} item={item} url={data.media[item.slot]} onUpload={upload}/>)}</div></section>)}
      <section id="testimonials"><div className="admin-section-title"><div><span>ETAPA 05 · PROVA SOCIAL</span><h2>Depoimentos reais</h2><p>Publique somente relatos verdadeiros de usuários e administradores.</p></div><button onClick={addTestimonial}><Save/>Publicar</button></div><div className="admin-form-grid"><label>Nome<input value={testimonial.name} onChange={(e)=>setTestimonial({...testimonial,name:e.target.value})}/></label><label>Cargo ou comunidade<input value={testimonial.role} onChange={(e)=>setTestimonial({...testimonial,role:e.target.value})}/></label><label className="wide">Depoimento<textarea value={testimonial.quote} onChange={(e)=>setTestimonial({...testimonial,quote:e.target.value})}/></label></div>{data.testimonials.length>0&&<div className="admin-testimonials">{data.testimonials.map((item)=><article key={item.id}><p>“{item.quote}”</p><strong>{item.name}</strong><span>{item.role}</span></article>)}</div>}</section>
    </section>
  </main>;
}
