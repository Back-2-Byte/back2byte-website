
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
"nav.services":"Serviços","nav.process":"Processo","nav.why":"Por que nós","nav.contact":"Contato","nav.cta":"Fale conosco",
"hero.eyebrow":"ENGENHARIA DE JOGOS / B2B","hero.title":"Seu jogo.<br><em>Nosso</em> desafio.","hero.lead":"Somos o time técnico que entra quando o jogo precisa ir mais longe — outra plataforma, mais performance, mais escala ou simplesmente chegar ao fim da linha.","hero.primary":"Conte seu desafio <span>↗</span>","hero.secondary":"Conheça os serviços <span>↓</span>",
"statement.eyebrow":"O QUE FAZEMOS","statement.title":"Código pesado.<br><span>Jogos leves.</span>","statement.body":"A Back2Byte é uma parceira técnica para estúdios, publishers e marcas. Entramos na produção para resolver problemas difíceis, acelerar entregas e transformar projetos ambiciosos em produtos que chegam ao jogador.",
"services.eyebrow":"SERVIÇOS","services.title":"Tecnologia que<br><span>tira o jogo do caminho.</span>","services.intro":"Você traz o produto e o desafio. Nós trazemos engenharia, experiência e capacidade de execução.",
"s1.kicker":"PORTING / PERFORMANCE","s1.title":"Mais plataformas.<br><em>Sem perder o jogo.</em>","s1.body":"Levamos títulos existentes para novas plataformas com otimização profunda de memória, CPU/GPU, processos e estabilidade. Implementação específica, debugging, profiling e suporte à certificação para ecossistemas como Xbox e PlayStation.",
"s2.kicker":"CO-DEVELOPMENT","s2.title":"Seu estúdio.<br><em>Nossa engenharia.</em>","s2.body":"Entramos na sua equipe como parceiros técnicos. Assumimos arquitetura, C#, Unity, gameplay, integrações e sistemas complexos para que seu time possa concentrar energia em direção de arte, game design e experiência do jogador.",
"s3.kicker":"ADVERGAMING / CASUAL","s3.title":"Ideia rápida.<br><em>Execução afiada.</em>","s3.body":"Criamos jogos mobile, experiências interativas e gamificação para marcas e empresas. Do primeiro projeto à preparação de lançamento, lojas digitais e distribuição global.",
"process.eyebrow":"COMO TRABALHAMOS","process.title":"Sem caixas-pretas.<br><span>Sem surpresas.</span>","process.body":"Nosso trabalho é técnico, mas nossa parceria é humana. Comunicação direta, escopo claro, responsabilidade compartilhada e visibilidade constante.",
"step1.title":"Entender","step1.body":"Problema, produto, plataforma e objetivo.","step2.title":"Construir","step2.body":"Entramos no código e fazemos acontecer.","step3.title":"Entregar","step3.body":"Medimos, estabilizamos e colocamos na mão do jogador.",
"why.eyebrow":"POR QUE BACK2BYTE","why.title":"Não somos<br><em>mais um fornecedor.</em>","why.intro":"Somos a equipe que você chama quando precisa de alguém que entenda o problema e assuma a responsabilidade por resolvê-lo.",
"why1.title":"Engineering-first","why1.body":"Decisões técnicas baseadas em produto, performance e resultado — não em buzzwords.","why2.title":"Extensão do seu time","why2.body":"Integramos processos e comunicação em vez de criar mais uma camada entre você e o código.","why3.title":"Feito para shippar","why3.body":"Nosso norte é concreto: builds estáveis, plataformas funcionando e projetos chegando ao público.",
"cta.title":"Tem um jogo<br>que precisa <em>andar?</em>","cta.body":"Conte o que você está construindo, onde quer chegar e o que está impedindo o próximo passo."
},
en:{
"nav.services":"Services","nav.process":"Process","nav.why":"Why us","nav.contact":"Contact","nav.cta":"Talk to us",
"hero.eyebrow":"GAME ENGINEERING / B2B","hero.title":"Your game.<br><em>Our</em> challenge.","hero.lead":"We are the technical team you bring in when a game needs to go further — another platform, more performance, more scale, or simply across the finish line.","hero.primary":"Tell us the challenge <span>↗</span>","hero.secondary":"Explore services <span>↓</span>",
"statement.eyebrow":"WHAT WE DO","statement.title":"Heavy code.<br><span>Light games.</span>","statement.body":"Back2Byte is a technical partner for studios, publishers and brands. We join production to solve hard problems, accelerate delivery and turn ambitious projects into products that reach players.",
"services.eyebrow":"SERVICES","services.title":"Technology that<br><span>gets games moving.</span>","services.intro":"You bring the product and the challenge. We bring engineering, experience and execution.",
"s1.kicker":"PORTING / PERFORMANCE","s1.title":"More platforms.<br><em>Same game.</em>","s1.body":"We take existing titles to new platforms with deep memory, CPU/GPU, process and stability optimization. Platform-specific implementation, debugging, profiling and certification support for ecosystems such as Xbox and PlayStation.",
"s2.kicker":"CO-DEVELOPMENT","s2.title":"Your studio.<br><em>Our engineering.</em>","s2.body":"We join your team as a technical partner. We take on architecture, C#, Unity, gameplay, integrations and complex systems so your core team can stay focused on art direction, game design and player experience.",
"s3.kicker":"ADVERGAMING / CASUAL","s3.title":"Fast idea.<br><em>Sharp execution.</em>","s3.body":"We create mobile games, interactive experiences and gamification for brands and companies. From the first project to launch preparation, digital stores and global distribution.",
"process.eyebrow":"HOW WE WORK","process.title":"No black boxes.<br><span>No surprises.</span>","process.body":"Our work is technical, but our partnership is human. Direct communication, clear scope, shared ownership and constant visibility.",
"step1.title":"Understand","step1.body":"Problem, product, platform and goal.","step2.title":"Build","step2.body":"We get into the code and make it happen.","step3.title":"Ship","step3.body":"We measure, stabilize and put it in players' hands.",
"why.eyebrow":"WHY BACK2BYTE","why.title":"We are not<br><em>just another vendor.</em>","why.intro":"We are the team you call when you need someone who understands the problem and owns the responsibility of solving it.",
"why1.title":"Engineering-first","why1.body":"Technical decisions grounded in product, performance and outcomes — not buzzwords.","why2.title":"Your team's extension","why2.body":"We integrate with your process and communication instead of adding another layer between you and the code.","why3.title":"Built to ship","why3.body":"Our north star is concrete: stable builds, working platforms and projects reaching the public.",
"cta.title":"Got a game<br>that needs to <em>move?</em>","cta.body":"Tell us what you're building, where you need to go and what's blocking the next step."
}};
let lang='pt';
document.getElementById('langToggle').addEventListener('click',()=>{
 lang=lang==='pt'?'en':'pt';
 document.documentElement.lang=lang==='pt'?'pt-BR':'en';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.innerHTML=translations[lang][key]});
 document.getElementById('langToggle').textContent=lang==='pt'?'EN / PT':'PT / EN';
});
