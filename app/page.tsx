"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, BrainCircuit, Check, ChevronDown, Clock3, Crown, Gamepad2, ImageIcon, LockKeyhole, Menu, MessageCircle, Play, ShieldCheck, Sparkles, Trophy, Users, X, Zap } from "lucide-react";
import "./site-v2.css";

type Player = { position: number; displayName: string; points: number; victories: number };
type SiteData = { content: Record<string, string>; media: Record<string, string>; testimonials: Array<{ id: number; name: string; role: string; quote: string }> };
type Game = { id: string; title: string; category: string; players: string; duration: string; command: string; access: string; description: string; image?: string };

const games: Game[] = [
  { id:"city", title:"FLANTO City", category:"Estratégia autoral", players:"6–12 jogadores", duration:"20–35 min", command:"/jogo city", access:"Premium", description:"Papéis secretos, Cidade, Visitantes e Farsante em uma disputa social conduzida pelo FLANTO.", image:"/flanto-city.webp" },
  { id:"drawing", title:"Acerte o Desenho", category:"Criatividade autoral", players:"3+ jogadores", duration:"5–15 min", command:"/jogo desenho", access:"Grátis", description:"Um jogador desenha e o grupo tenta descobrir. Quem acerta primeiro conquista pontos.", image:"/acerte-desenho.webp" },
  { id:"anagrama", title:"Anagrama", category:"Velocidade", players:"2+ jogadores", duration:"3–10 min", command:"/jogo 1", access:"Grátis", description:"Organize as letras antes de todo mundo e avance no ranking.", image:"/anagrama.webp" },
  { id:"quiz", title:"Quiz", category:"Conhecimento", players:"2+ jogadores", duration:"5–15 min", command:"/jogo 2", access:"Grátis", description:"Perguntas rápidas com alternativas para movimentar a comunidade.", image:"/quiz.webp" },
  { id:"number", title:"Adivinhe o Número", category:"Desafio", players:"2+", duration:"3–8 min", command:"/jogo 3", access:"Grátis", description:"Encontre o número secreto usando as pistas." },
  { id:"complete", title:"Complete a Palavra", category:"Desafio", players:"2+", duration:"3–8 min", command:"/jogo 4", access:"Grátis", description:"Descubra as letras que faltam antes dos demais." },
  { id:"scramble", title:"Palavra Embaralhada", category:"Desafio", players:"2+", duration:"3–8 min", command:"/jogo 5", access:"Grátis", description:"Reorganize a palavra e responda rapidamente." },
  { id:"emoji", title:"Emojis", category:"Descoberta", players:"2+", duration:"5–10 min", command:"/jogo 6", access:"Grátis", description:"Descubra títulos e ideias representados por emojis." },
  { id:"movie", title:"Filme", category:"Descoberta", players:"2+", duration:"5–10 min", command:"/jogo 7", access:"Grátis", description:"Acerte o filme a partir das pistas." },
  { id:"music", title:"Música", category:"Descoberta", players:"2+", duration:"5–10 min", command:"/jogo 8", access:"Grátis", description:"Reconheça músicas e artistas pelas pistas." },
  { id:"geo", title:"Geografia", category:"Conhecimento", players:"2+", duration:"5–10 min", command:"/jogo 9", access:"Grátis", description:"Desafios sobre lugares, países e curiosidades do mundo." },
  { id:"football", title:"Futebol", category:"Conhecimento", players:"2+", duration:"5–10 min", command:"/jogo 10", access:"Grátis", description:"Perguntas para quem acompanha futebol." },
  { id:"who", title:"Quem Sou Eu", category:"Descoberta", players:"2+", duration:"5–10 min", command:"/jogo 11", access:"Grátis", description:"Descubra a pessoa ou personagem pelas pistas." },
  { id:"truefalse", title:"Verdadeiro ou Falso", category:"Competitivo", players:"2+", duration:"5–10 min", command:"/jogo 12", access:"Grátis", description:"Decida rapidamente se cada afirmação é verdadeira." },
  { id:"hangman", title:"Forca", category:"Competitivo", players:"2+", duration:"5–12 min", command:"/jogo 13", access:"Grátis", description:"Letras, tentativas e colaboração para salvar a palavra." },
  { id:"special", title:"Quizzes Especiais", category:"Gospel e Cripto", players:"2+", duration:"5–15 min", command:"/jogos", access:"Grátis", description:"Categorias especiais para diferentes comunidades." },
];

const demoSteps = [
  { who:"Eu", text:"/Jogos", side:"out" },
  { who:"FLANTO AI", text:"🎮 CENTRAL DE JOGOS\n01 Anagrama · 02 Quiz · 03 Adivinhe o Número · 04 Complete a Palavra · 05 Palavra Embaralhada · 06 Emojis · 07 Filme · 08 Música · 09 Geografia · 10 Futebol · 11 Quem Sou Eu · 12 Verdadeiro ou Falso · 13 Forca · 14 Quizzes Especiais · 15 Acerte o Desenho · 16 FLANTO City\n\nEscolha de 1 a 16.", side:"in" },
  { who:"Eu", text:"1", side:"out" },
  { who:"FLANTO AI", text:"Organize: FTANOL", side:"in" },
  { who:"Eu", text:"flanto", side:"out" },
  { who:"FLANTO AI", text:"ACERTOU!!! +20 PONTOS NO RANKING", side:"in" },
];

function InteractiveDemo() {
  const [running, setRunning] = useState(false); const [step, setStep] = useState(2);
  useEffect(() => { if (!running) return; setStep(1); const timer=setInterval(()=>setStep((current)=>{ if(current>=demoSteps.length){clearInterval(timer);setRunning(false);return current;} return current+1;}),2200); return()=>clearInterval(timer); }, [running]);
  return <div className="v2-demo"><div className="v2-demo-top"><img src="/flanto-logo-new.webp" alt="" /><span><strong>FLANTO AI</strong><small>online</small></span><ShieldCheck /></div><div className="v2-chat">{demoSteps.slice(0,step).map((item,index)=><div className={`v2-message ${item.side}`} key={index}><small>{item.who}</small>{item.text}</div>)}</div><button onClick={()=>setRunning(true)} disabled={running}><Play /> {running ? "Demonstração em andamento…" : "Veja o FLANTO funcionando"}</button></div>;
}

function LiveRanking() {
  const [players,setPlayers]=useState<Player[]>([]); const [mode,setMode]=useState("season"); const [status,setStatus]=useState("loading");
  useEffect(()=>{fetch("/api/ranking",{cache:"no-store"}).then(r=>r.json()).then(d=>{setPlayers(d.ranking||[]);setStatus("ready")}).catch(()=>setStatus("error"));},[]);
  return <div className="v2-ranking-card"><div className="v2-rank-tabs"><button className={mode==="day"?"active":""} onClick={()=>setMode("day")}>Diário</button><button className={mode==="week"?"active":""} onClick={()=>setMode("week")}>Semanal</button><button className={mode==="season"?"active":""} onClick={()=>setMode("season")}>Temporada</button></div>{mode!=="season"?<div className="v2-empty"><Clock3 /> Este recorte já está preparado e será conectado aos dados do FLANTO.</div>:status==="ready"?<div className="v2-rank-list">{players.slice(0,10).map(p=><div key={p.position}><b>{String(p.position).padStart(2,"0")}</b><span>{p.displayName}</span><strong>{p.points.toLocaleString("pt-BR")} pts</strong></div>)}</div>:<div className="v2-empty">Carregando ranking…</div>}<small className="v2-updated">Atualização automática • dados da temporada</small></div>;
}

const faqs = [
  ["O FLANTO AI é gratuito?","Sim. É possível começar gratuitamente, sem anúncios. Boosts e recursos adicionais podem ser oferecidos separadamente."],
  ["Como adiciono ao meu grupo?","Salve o número oficial, adicione o FLANTO ao grupo e envie /jogos."],
  ["Precisa instalar aplicativo?","Não. A experiência acontece dentro do WhatsApp."],
  ["O FLANTO lê todas as conversas?","O FLANTO processa as mensagens necessárias para reconhecer comandos, respostas dos jogos e recursos administrativos habilitados. Consulte a Política de Privacidade para os detalhes."],
  ["Quais permissões ele precisa?","Somente as permissões necessárias aos recursos que o administrador decidir utilizar no grupo."],
  ["Quem configura a moderação?","Apenas pessoas autorizadas e administradores podem acessar configurações sensíveis."],
  ["Como funcionam os Boosts?","Os Boosts x2, x3 e x4 multiplicam pontos temporariamente e não acumulam."],
  ["Posso remover quando quiser?","Sim. Um administrador do grupo pode remover o FLANTO quando desejar."],
];

export default function Home(){
  const [menu,setMenu]=useState(false); const [selected,setSelected]=useState<Game|null>(null); const [allGames,setAllGames]=useState(false); const [audience,setAudience]=useState<"player"|"admin">("player"); const [siteData,setSiteData]=useState<SiteData>({content:{},media:{},testimonials:[]});
  useEffect(()=>{
    fetch("/api/site-data",{cache:"no-store"})
      .then(async (response)=>{
        if (!response.ok) return null;
        const data = await response.json();
        if (!data || typeof data.content !== "object" || typeof data.media !== "object" || !Array.isArray(data.testimonials)) return null;
        return data;
      })
      .then((data)=>{ if (data) setSiteData(data); })
      .catch(()=>{});
  },[]);
  const featured=useMemo(()=>games.slice(0,4),[]); const image=(slot:string,fallback:string)=>siteData.media[slot]||fallback;
  return <main className="v2-site">
    <header className="v2-header"><a className="v2-brand" href="#inicio"><img src="/flanto-logo-new.webp" alt="" /><span>FLANTO <b>AI</b></span></a><nav className={menu?"open":""}><a href="#demo">Demonstração</a><a href="#jogos">Jogos</a><a href="#city">FLANTO City</a><a href="#ranking">Ranking</a><a href="/whitepaper">Whitepaper</a></nav><div className="v2-head-actions"><a href="/conta">Minha conta</a><a className="v2-primary small" href="https://wa.me/5569992308771" target="_blank" rel="noreferrer">Começar grátis</a></div><button className="v2-menu" onClick={()=>setMenu(!menu)} aria-label="Abrir menu">{menu?<X/>:<Menu/>}</button></header>

    <section className="v2-hero" id="inicio"><div className="v2-hero-copy"><span className="v2-kicker"><i/> AI DE JOGOS PARA COMUNIDADES</span><h1>{siteData.content.heroTitle||"A AI de jogos que mantém sua comunidade ativa 24 horas."}</h1><p>Jogos, competição e automações dentro do WhatsApp. O FLANTO movimenta os membros enquanto economiza o tempo de quem administra.</p><div className="v2-actions"><a className="v2-primary" href="https://wa.me/5569992308771" target="_blank" rel="noreferrer">Começar gratuitamente <ArrowRight/></a><a href="#demo"><Play/> Veja funcionando</a></div><small><Check/> Sem anúncios <i/> Sem instalar outro aplicativo</small><div className="v2-proof-numbers"><div><strong>{siteData.content.registeredUsers||"70+"}</strong><span>usuários</span></div><div><strong>{siteData.content.communities||"30+"}</strong><span>grupos</span></div><div><strong>16</strong><span>jogos</span></div></div></div><div className="v2-hero-visual"><img src="/flanto-hero.webp" alt="Robô oficial do FLANTO AI"/><div><ShieldCheck/><span><small>STATUS</small>Ativo 24 horas</span></div></div></section>

    <section className="v2-steps"><div className="v2-title"><span>COMECE EM MINUTOS</span><h2>Da primeira mensagem à primeira partida.</h2></div><div><article><b>01</b><MessageCircle/><h3>Salve o número</h3><p>Abra a conversa e salve o contato oficial.</p></article><article><b>02</b><Users/><h3>Adicione ao grupo</h3><p>Inclua o FLANTO na sua comunidade.</p></article><article><b>03</b><Gamepad2/><h3>Envie /jogos</h3><p>Escolha uma experiência e comece.</p></article></div></section>

    <section className="v2-demo-section" id="demo"><div className="v2-title"><span>DEMONSTRAÇÃO INTERATIVA</span><h2>Veja uma partida acontecer.</h2><p>Acompanhe o comando, a rodada, o acerto e a atualização do ranking.</p></div><InteractiveDemo/></section>

    <section className="v2-games" id="jogos"><div className="v2-title left"><span>JOGOS EM DESTAQUE</span><h2>Uma comunidade que nunca fica parada.</h2><p>Toque em um jogo para conhecer participantes, duração, comando e acesso.</p></div><div className="v2-game-grid">{(allGames?games:featured).map((g,index)=><button key={g.id} onClick={()=>setSelected(g)} className={index===0&&!allGames?"featured":""}>{g.image?<img src={image(g.id==="city"?"game_flanto_city":g.id==="drawing"?"game_drawing":`game_${g.id}`,g.image)} alt=""/>:<div className="v2-game-placeholder"><Gamepad2/></div>}<span className="v2-game-overlay"/><div><small>{g.category}</small><h3>{g.title}</h3><p>{g.description}</p><b>{g.access}</b></div></button>)}</div><button className="v2-outline-button" onClick={()=>setAllGames(!allGames)}>{allGames?"Mostrar destaques":"Conhecer todos os jogos"} <ArrowRight/></button></section>

    <section className="v2-city" id="city"><div className="v2-city-art"><img src={image("flanto_city_characters","/flanto-city.webp")} alt="Personagens do FLANTO City"/><span>JOGO AUTORAL</span></div><div><span>EXCLUSIVO FLANTO AI</span><h2>FLANTO City</h2><p>Um jogo social de estratégia em que cada participante recebe seu papel no privado. A Cidade tenta descobrir quem são os Visitantes, enquanto o Farsante joga sozinho por uma vitória improvável.</p><div className="v2-city-factions"><article><strong>Cidade</strong><span>Investigue, proteja e sobreviva.</span></article><article><strong>Visitantes</strong><span>Engane o grupo e controle a noite.</span></article><article><strong>Farsante</strong><span>Convença todos a votar em você.</span></article></div><small>6–12 jogadores • papéis secretos • experiência Premium</small><a className="v2-primary" href="https://wa.me/5569992308771" target="_blank" rel="noreferrer">Quero jogar <ArrowRight/></a></div></section>

    <section className="v2-audience" id="recursos"><div className="v2-title"><span>DOIS JEITOS DE USAR</span><h2>Diversão para membros. Controle para administradores.</h2></div><div className="v2-tabs"><button className={audience==="player"?"active":""} onClick={()=>setAudience("player")}>Quero jogar</button><button className={audience==="admin"?"active":""} onClick={()=>setAudience("admin")}>Quero administrar melhor</button></div>{audience==="player"?<div className="v2-benefits"><article><Gamepad2/><h3>Jogos e desafios</h3><p>16 experiências para diferentes comunidades.</p></article><article><Trophy/><h3>Ranking e temporadas</h3><p>Partidas que continuam valendo depois da rodada.</p></article><article><Zap/><h3>Pontos e Boosts</h3><p>Progressão, disputa e multiplicadores opcionais.</p></article><article><Crown/><h3>Jogos autorais</h3><p>FLANTO City e Acerte o Desenho.</p></article></div>:<div className="v2-benefits"><article><ShieldCheck/><h3>Moderação</h3><p>Controles reservados a pessoas autorizadas.</p></article><article><LockKeyhole/><h3>Anti-spam</h3><p>Proteção configurável para cada comunidade.</p></article><article><Clock3/><h3>Lembretes</h3><p>Mensagens programadas sem rotina manual.</p></article><article><Bot/><h3>Rotinas do grupo</h3><p>Boas-vindas, abertura e fechamento automático.</p></article></div>}</section>

    <section className="v2-proof"><div className="v2-title"><span>PROVAS REAIS</span><h2>O FLANTO já está em operação.</h2><p>Produto funcionando, jogadores ativos e comunidades usando todos os dias.</p></div><div className="v2-proof-grid">{[1,2,3].map(n=>siteData.media[`proof_${n}`]?<img key={n} src={siteData.media[`proof_${n}`]} alt={`Demonstração real ${n}`}/>:<div className="v2-proof-placeholder" key={n}><ImageIcon/><strong>Espaço preparado</strong><span>Envie uma captura real pelo painel administrativo.</span></div>)}</div>{siteData.testimonials.length>0&&<div className="v2-testimonials">{siteData.testimonials.slice(0,3).map(t=><article key={t.id}><p>“{t.quote}”</p><strong>{t.name}</strong><span>{t.role}</span></article>)}</div>}</section>

    <section className="v2-ranking" id="ranking"><div><span>COMPETIÇÃO NACIONAL</span><h2>Jogue. Pontue. Suba.</h2><p>O ranking conecta jogadores de diferentes grupos em uma temporada comum. Os recortes diário e semanal já estão preparados para a próxima integração.</p><a href="/conta">Encontrar minha posição <ArrowRight/></a></div><LiveRanking/></section>

    <section className="v2-plans"><div className="v2-title"><span>GRATUITO E PREMIUM</span><h2>Comece sem pagar. Evolua quando quiser.</h2></div><div className="v2-plan-grid"><article><span>GRATUITO</span><h3>Para toda comunidade</h3><strong>R$ 0</strong><ul><li><Check/> Jogos essenciais</li><li><Check/> Pontos e ranking</li><li><Check/> Recursos básicos</li><li><Check/> Sem anúncios</li></ul><a href="https://wa.me/5569992308771">Começar gratuitamente</a></article><article className="premium"><span>PREMIUM EM EVOLUÇÃO</span><h3>Mais possibilidades</h3><strong>Opcional</strong><ul><li><Check/> Boosts x2, x3 e x4</li><li><Check/> Experiências Premium</li><li><Check/> Configurações especiais em implantação</li><li><Check/> Novidades antecipadas em implantação</li></ul><a href="https://wa.me/5569992308771">Conhecer opções</a></article></div><p className="v2-plan-note">A página diferencia o que já está disponível do que ainda está em implantação.</p></section>

    <section className="v2-faq"><div className="v2-title"><span>PERGUNTAS FREQUENTES</span><h2>Clareza antes de adicionar.</h2></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown/></summary><p>{a}</p></details>)}</div></section>

    <section className="v2-final"><img src="/flanto-logo-new.webp" alt="FLANTO AI"/><span>TOTALMENTE DE GRAÇA PARA COMEÇAR</span><h2>Dê uma nova vida à sua comunidade.</h2><p>Salve o número, adicione o FLANTO ao grupo e envie <code>/jogos</code>.</p><a className="v2-primary" href="https://wa.me/5569992308771" target="_blank" rel="noreferrer">Abrir no WhatsApp <ArrowRight/></a></section>
    <footer className="v2-footer"><div><a className="v2-brand" href="#inicio"><img src="/flanto-logo-new.webp" alt=""/><span>FLANTO <b>AI</b></span></a><p>Salva seu tempo. Salva seus grupos.</p></div><div><strong>Produto</strong><a href="#jogos">Jogos</a><a href="#ranking">Ranking</a><a href="/whitepaper">Whitepaper</a><a href="/conta">Minha conta</a></div><div><strong>Confiança</strong><a href="/privacidade">Privacidade</a><a href="/termos">Termos de Uso</a><a href="/pagamentos">Pagamentos e reembolsos</a><a href="/status">Status do serviço</a><a href="/suporte">Suporte</a></div><small>© 2026 FLANTO AI. Produto independente, não afiliado ao WhatsApp.</small></footer>

    {selected&&<div className="v2-modal" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><article onClick={e=>e.stopPropagation()}><button onClick={()=>setSelected(null)} aria-label="Fechar"><X/></button>{selected.image?<img src={selected.image} alt=""/>:<div className="v2-modal-placeholder"><Gamepad2/></div>}<span>{selected.category}</span><h2>{selected.title}</h2><p>{selected.description}</p><dl><div><dt>Participantes</dt><dd>{selected.players}</dd></div><div><dt>Duração</dt><dd>{selected.duration}</dd></div><div><dt>Comando</dt><dd><code>{selected.command}</code></dd></div><div><dt>Acesso</dt><dd>{selected.access}</dd></div></dl><a className="v2-primary" href="https://wa.me/5569992308771">Experimentar no WhatsApp <ArrowRight/></a></article></div>}
  </main>;
}
