const glow=document.querySelector('.cursor-glow'), dot=document.querySelector('.cursor-dot');
window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'});
document.querySelectorAll('.service-card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const counters=document.querySelectorAll('[data-count]');
const countObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const el=e.target,end=+el.dataset.count;let n=0;const step=Math.max(1,Math.ceil(end/35));const timer=setInterval(()=>{n=Math.min(end,n+step);el.textContent=n;if(n>=end)clearInterval(timer)},28);countObs.unobserve(el)}}),{threshold:.7});
counters.forEach(e=>countObs.observe(e));

const translations={
pt:{
"nav.services":"Serviços", "nav.experience":"Experiência", "nav.why_games":"Por que Jogos?", "nav.partners":"Parceiros", "nav.contact":"Contacto", "nav.cta":"Fale connosco",
"hero.eyebrow":"HOLDING B2B / ENGENHARIA DE JOGOS", "hero.title":"O seu desafio.<br><em>A nossa</em> engenharia.", "hero.lead":"Somos a holding técnica de co-desenvolvimento e gamificação corporativa. Entramos no projeto para resolver estrangulamentos complexos, otimizar a performance e transformar a atenção do seu público em compromisso ativo.", "hero.primary":"Inicie um projeto <span>↗</span>", "hero.secondary":"Explorar BUs <span>↓</span>",
"services.eyebrow":"UNIDADES DE NEGÓCIO", "services.title":"Foco a 100% no<br><span>ecossistema B2B.</span>", "services.intro":"Dividimos a nossa operação em dois pilares centrais para entregar soluções à medida da sua indústria.",
"bu1.kicker":"B2B GAME INDUSTRY", "bu1.title":"Co-Development &<br><em>Porting.</em>", "bu1.body":"Serviços técnicos para publishers e estúdios. Otimização profunda, portabilidade para consolas e telemóveis, arquitetura em C#/Unity e publishing conjunto. Atuamos como extensão da sua equipa de desenvolvimento para assegurar que o jogo chega ao mercado com máxima performance.",
"bu2.kicker":"B2B CORPORATE", "bu2.title":"Advergames &<br><em>Corporate Gamification.</em>", "bu2.body":"Desenvolvimento end-to-end de soluções interativas para empresas fora do mercado de videojogos. Produzimos videojogos para campanhas de marketing, treinos empresariais, ativações em eventos e questionários dinâmicos. Entrega chave-na-mão para envolver o seu público-alvo.",
"track.eyebrow":"SENIORITY & TRACK RECORD", "track.title":"Construído sobre<br><em>projetos globais.</em>", "track.intro":"A nossa liderança e engenheiros possuem um vasto currículo de entregas críticas na indústria, reduzindo o risco do seu projeto.",
"game1.body":"Engenharia de alta performance e otimização de renderização.", "game2.body":"Liderança técnica e desenvolvimento direcionado à plataforma Xbox.", "game3.body":"Preparação de lançamento e engenharia de certificação em loja.", "game4.body":"Ciclo completo para o ecossistema mobile e mercado casual.",
"whygames.eyebrow":"A VANTAGEM CORPORATIVA", "whygames.title":"Da audiência passiva<br><span>à interação ativa.</span>", "whygames.body":"No mercado atual corporativo, competir pela atenção não é suficiente. Um jogo converte o utilizador de um espetador passivo no protagonista da sua marca.",
"wg1.title":"Retenção Extrema", "wg1.body":"Minutos ou horas de compromisso voluntário, aumentando exponencialmente a fixação da marca.", "wg2.title":"Dados em Tempo Real", "wg2.body":"Recolha qualificada de leads e análise de comportamento sem a fricção dos formulários tradicionais.", "wg3.title":"Destaque em Eventos", "wg3.body":"O magnetismo interativo que atrai multidões para o seu stand em feiras e conferências profissionais.",
"partners.eyebrow":"REDE ESTRATÉGICA", "partners.title":"O hub da<br><em>produção técnica.</em>", "partners.intro":"A Back2Byte lidera um ecossistema sólido de parceiros para escalar capacidade de produção, reunindo as melhores mentes da indústria sempre que o projeto o exigir.",
"cta.title":"Vamos discutir<br>o seu <em>projeto.</em>", "cta.body":"Seja para expandir o seu jogo para novas consolas ou para desenvolver uma ferramenta gamificada para a sua empresa."
},
en:{
"nav.services":"Services", "nav.experience":"Experience", "nav.why_games":"Why Games?", "nav.partners":"Partners", "nav.contact":"Contact", "nav.cta":"Talk to us",
"hero.eyebrow":"B2B HOLDING / GAME ENGINEERING", "hero.title":"Your challenge.<br><em>Our</em> engineering.", "hero.lead":"We are the technical holding for co-development and corporate gamification. We step in to solve complex bottlenecks, optimize performance, and turn your audience's attention into active engagement.", "hero.primary":"Start a project <span>↗</span>", "hero.secondary":"Explore BUs <span>↓</span>",
"services.eyebrow":"BUSINESS UNITS", "services.title":"100% focused on<br><span>the B2B ecosystem.</span>", "services.intro":"We divide our operation into two central pillars to deliver tailored solutions for your industry.",
"bu1.kicker":"B2B GAME INDUSTRY", "bu1.title":"Co-Development &<br><em>Porting.</em>", "bu1.body":"Technical services for publishers and studios. Deep optimization, console and mobile porting, C#/Unity architecture, and joint publishing. We act as an extension of your dev team to ensure your game hits the market with peak performance.",
"bu2.kicker":"B2B CORPORATE", "bu2.title":"Advergames &<br><em>Corporate Gamification.</em>", "bu2.body":"End-to-end development of interactive solutions for non-gaming companies. We build games for marketing campaigns, corporate training, event activations, and dynamic quizzes. Turnkey delivery to engage your target audience.",
"track.eyebrow":"SENIORITY & TRACK RECORD", "track.title":"Built on<br><em>global projects.</em>", "track.intro":"Our leadership and engineers hold a vast track record of critical industry deliveries, reducing the risk of your project.",
"game1.body":"High-performance engineering and rendering optimization.", "game2.body":"Technical leadership and Xbox platform-oriented development.", "game3.body":"Launch preparation and store certification engineering.", "game4.body":"Full cycle for the mobile ecosystem and casual market.",
"whygames.eyebrow":"THE CORPORATE ADVANTAGE", "whygames.title":"From passive audience<br><span>to active interaction.</span>", "whygames.body":"In today's corporate market, competing for attention isn't enough. A game converts the user from a passive spectator into the protagonist of your brand.",
"wg1.title":"Extreme Retention", "wg1.body":"Minutes or hours of voluntary engagement, exponentially increasing brand stickiness.", "wg2.title":"Real-Time Data", "wg2.body":"Qualified lead capture and behavior analysis without the friction of traditional forms.", "wg3.title":"Event Standout", "wg3.body":"The interactive magnetism that draws crowds to your booth at trade shows and professional conferences.",
"partners.eyebrow":"STRATEGIC NETWORK", "partners.title":"The hub of<br><em>technical production.</em>", "partners.intro":"Back2Byte leads a solid ecosystem of partners to scale production capacity, bringing together the best minds in the industry whenever the project demands it.",
"cta.title":"Let's discuss<br>your <em>project.</em>", "cta.body":"Whether you need to bring your game to new consoles or develop a gamified tool for your business."
}};
let lang='pt';
document.getElementById('langToggle').addEventListener('click',()=>{
 lang=lang==='pt'?'en':'pt';
 document.documentElement.lang=lang==='pt'?'pt-PT':'en';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.innerHTML=translations[lang][key]});
 document.getElementById('langToggle').textContent=lang==='pt'?'EN / PT':'PT / EN';
});