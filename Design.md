# 🎨 Design System, Animações e Estrutura Frontend — Back2Byte

Este documento define a direção de arte, a linguagem visual, a arquitetura de componentes, as animações baseadas em bytes/pixels e a internacionalização em JSON para o website da **Back2Byte**.

---

## 1. Identidade Visual & Direção de Arte

### Conceito Estético: *Retro-Futurismo Corporativo & Rigor Técnico*
O design une o minimalismo limpo (*clean*) de uma consultoria de tecnologia com elementos visuais que remetem à arquitetura de computadores, matrizes de bytes e jogos clássicos. 

### Paleta de Cores

#### Modos de Exibição
* **Primary Accent:** `#00FF66` (Electric Byte Green) — Utilizado para estados ativos, cursores, conexões de nós e *highlights* de código.
* **Secondary Accent:** `#00B348` (Emerald Deep) — Usado para gradientes, sombras e elementos de profundidade.
* **Warning / Highlight:** `#FF3366` (Crimson Red) — Apenas para acentos de alerta ou detalhes de alta prioridade.

#### Dark Mode (Padrão Principal)
* **Background Primário:** `#0B0F12` (Obsidian Tech / Deep Charcoal)
* **Background Secundário (Cards):** `#13191E` (Terminal Surface)
* **Bordas & Linhas de Byte:** `#1E262D` / `rgba(0, 255, 102, 0.15)`
* **Texto Primário:** `#F0F4F8`
* **Texto Secundário:** `#8A99AD`

#### Light Mode
* **Background Primário:** `#F8FAFC` (Clean Slate)
* **Background Secundário (Cards):** `#FFFFFF` (Pure White)
* **Bordas & Linhas de Byte:** `#E2E8F0` / `rgba(0, 179, 72, 0.2)`
* **Texto Primário:** `#0F172A`
* **Texto Secundário:** `#475569`

---

## 2. Efeitos Visuais & Animações (Pixels e Bytes)

### 1. Canvas de Fundo Animado (Pixel Grid Shift)
* **Conceito:** Um *canvas* sutil em HTML5/WebGL onde pequenos pixels verdes flutuam e se agrupam organizadamente quando o usuário move o cursor.
* **Comportamento:** Representa o conceito de "organizar bytes dispersos em sistemas complexos". Os pixels convergem para formar linhas de grade sutis à medida que a rolagem desce.

### 2. Efeito "Byte Assembly" nas Seções
* **Animação de Entrada:** Ao rolar até uma nova seção, os *cards* e textos não fazem apenas um *fade-in*. Eles se constroem através de um efeito *pixelate/glitch* suave (de baixa resolução para ultra-definição em 0.4s).

### 3. Cursor Customizado (Byte Tracker)
* O cursor do mouse possui um contêiner quadrado de `8x8px` que segue o movimento com interpolação suave (*lerp*), expandindo para formar um retículo de alinhamento ao passar por botões interativos.

---

## 3. Arquitetura de Navegação & Conteúdo das Abas

O site é organizado em navegação fluida (*Single Page Application* com roteamento ou abas fixas no cabeçalho):

1. **[01] Visão Geral (Home)**
   * Hero Section com animação de bytes, Slogan B2B, chamada para agendamento e indicadores numéricos.
2. **[02] Senioridade Técnica**
   * Abas internas com demonstração de arquitetura (C#, Unity, DOTS, Porting e Otimização).
3. **[03] Parceiros Estratégicos (Hub de Alianças)**
   * Rede de empresas com logotipos, links externos e direcionamentos para soluções específicas.
4. **[04] Cultura & R&D**
   * O espaço do "hobby compartilhado", projetos de pesquisa e cultura de desenvolvimento de games.
5. **[05] Contato B2B**
   * Formulário de qualificação de projetos e e-mail direto de suporte comercial.

---

## 4. Estrutura de Parceiros Estratégicos (Hub)

Cada card de parceiro conta com espaço para logotipos, descrição curta e o link direcionado:

* **JP Desenvolvimento (Johnny Pereira):**
  * *Chamada:* "Procurando desenvolvimento de software corporativo e infraestrutura sob medida?"
  * *Link:* `https://jpdesenvolvimento.com.br` (Exemplo)
* **Inominatum Digital:**
  * *Chamada:* "Procurando jogos originais e experiências autorais para PC e Consoles?"
  * *Link:* `https://inominatum.digital` (Exemplo)
* **Strafe Theory:**
  * *Chamada:* "Procurando uma powerhouse mobile para prototipagem e jogos móveis?"
  * *Link:* `https://strafetheory.com` (Exemplo)

---

## 5. Estrutura de Código & Dicionário de Idiomas (JSON)

Toda a camada de texto é desacoplada da interface para permitir alternância instantânea entre Português (`pt`) e Inglês (`en`).

```json
{
  "meta": {
    "company_name": "Back2Byte",
    "contact_email": "hello@backtobite.com",
    "default_language": "pt"
  },
  "nav": {
    "home": { "pt": "Início", "en": "Home" },
    "seniority": { "pt": "Senioridade Técnica", "en": "Technical Expertise" },
    "partners": { "pt": "Parceiros Estratégicos", "en": "Strategic Partners" },
    "culture": { "pt": "Cultura & R&D", "en": "Culture & R&D" },
    "contact": { "pt": "Contato B2B", "en": "B2B Contact" }
  },
  "hero": { "slogan_en": "We got your back. We got your byte.",
    "slogan_pt": "Te damos o byte. Te damos cobertura.",
    "title": {
      "pt": "Engenharia de Games e Gamificação Corporativa de Alta Performance",
      "en": "High-Performance Game Engineering & Corporate Gamification"
    },
    "subtitle": {
      "pt": "Simplificamos a complexidade técnica para que a sua empresa foque no crescimento. Entregamos software previsível, otimizado e seguro em C# e Unity.",
      "en": "We simplify technical complexity so your company can focus on growth. Delivering predictable, optimized, and secure software in C# and Unity."
    },
    "cta_primary": { "pt": "Agendar Reunião", "en": "Schedule a Call" },
    "cta_secondary": { "pt": "Ver Soluções", "en": "View Solutions" }
  },
  "seniority": {
    "title": { "pt": "Rigor de Engenharia & Arquitetura", "en": "Engineering Rigor & Architecture" },
    "tabs": [
      {
        "id": "architecture",
        "label": { "pt": "Arquitetura C# & Unity", "en": "C# & Unity Architecture" },
        "content": {
          "pt": "Aplicações construídas sobre padrões desacoplados, suporte a DOTS/ECS e gerenciamento rigoroso de memória sem picos de Garbage Collector.",
          "en": "Decoupled architecture patterns, DOTS/ECS support, and strict memory management with zero Garbage Collector spikes."
        }
      },
      {
        "id": "porting",
        "label": { "pt": "Porting & Multi-Platform", "en": "Porting & Multi-Platform" },
        "content": {
          "pt": "Adequação de código-fonte para PC, WebGL/WebGPU e Consoles, garantindo conformidade total com requerimentos técnicos do mercado.",
          "en": "Source code adaptation for PC, WebGL/WebGPU, and Consoles, ensuring full compliance with technical certification guidelines."
        }
      },
      {
        "id": "optimization",
        "label": { "pt": "Otimização Extrema", "en": "Extreme Optimization" },
        "content": {
          "pt": "Profiling avançado de CPU/GPU, redução drástica de Draw Calls, otimização de shaders e carregamento assíncrono instantâneo.",
          "en": "Advanced CPU/GPU profiling, dramatic Draw Call reduction, custom shader optimization, and instant asynchronous loading."
        }
      }
    ]
  },
  "partners": {
    "title": { "pt": "Parceiros Estratégicos", "en": "Strategic Partners" },
    "subtitle": {
      "pt": "Conheça o nosso ecossistema de alianças e empresas homologadas:",
      "en": "Explore our ecosystem of strategic alliances and certified partners:"
    },
    "items": [
      {
        "id": "jp_dev",
        "name": "JP Desenvolvimento (Johnny Pereira)",
        "role": {
          "pt": "Desenvolvimento de Software & Infraestrutura",
          "en": "Software Development & Infrastructure"
        },
        "description": {
          "pt": "Se você está procurando desenvolvimento de software corporativo, aplicações web robustas ou infraestrutura customizada, conheça a JP Desenvolvimento.",
          "en": "If you are looking for enterprise software development, robust web applications, or custom infrastructure, check out JP Desenvolvimento."
        },
        "logo_placeholder_id": "img_partner_jp",
        "external_link": "https://jpdesenvolvimento.com.br"
      },
      {
        "id": "inominatum",
        "name": "Inominatum Digital",
        "role": {
          "pt": "Estúdio de Jogos Originais B2C",
          "en": "Original B2C Games Studio"
        },
        "description": {
          "pt": "Se você está procurando jogos originais autorais, títulos imersivos e projetos autorais para PC e Consoles, confira a Inominatum Digital.",
          "en": "If you are looking for original authorial games, immersive narrative titles, and PC/Console experiences, check out Inominatum Digital."
        },
        "logo_placeholder_id": "img_partner_inominatum",
        "external_link": "https://inominatum.digital"
      },
      {
        "id": "strafe_theory",
        "name": "Strafe Theory",
        "role": {
          "pt": "Powerhouse Mobile & Protótipos",
          "en": "Mobile Powerhouse & Prototypes"
        },
        "description": {
          "pt": "Se você está procurando uma powerhouse focada no mercado mobile, prototipagem ágil e mecânicas de alto engajamento, procure a Strafe Theory.",
          "en": "If you are looking for a mobile powerhouse focused on agile prototyping and high-engagement mechanics, connect with Strafe Theory."
        },
        "logo_placeholder_id": "img_partner_strafe",
        "external_link": "https://strafetheory.com"
      }
    ]
  },
  "culture": {
    "title": { "pt": "O Hobby que Move a Indústria", "en": "The Hobby That Drives the Industry" },
    "text": {
      "pt": "Desenvolver jogos é o nosso trabalho e a nossa maior paixão. Compartilhamos dessa cultura de inovação contínua e P&D com os maiores estúdios do mundo.",
      "en": "Game development is both our trade and our ultimate passion. We share this culture of continuous innovation and R&D with top global studios."
    },
    "banner_placeholder_id": "img_culture_rnd"
  },
  "contact": {
    "title": { "pt": "Inicie um Projeto Conosco", "en": "Start a Project With Us" },
    "email_label": { "pt": "Contato Comercial Direto:", "en": "Direct Business Contact:" },
    "email": "hello@backtobite.com",
    "form_name": { "pt": "Seu Nome / Empresa", "en": "Your Name / Company" },
    "form_email": { "pt": "Seu E-mail Corporativo", "en": "Your Corporate Email" },
    "form_message": { "pt": "Descreva o Escopo do Projeto", "en": "Describe Project Scope" },
    "submit_btn": { "pt": "Enviar Mensagem", "en": "Send Message" }
  }
}
```

---

## 6. Mapeamento de Placeholders de Imagem

O código do frontend incluirá contêineres estruturados com proporções mantidas (*aspect-ratio*) e estilos de *skeleton screen* pixelados enquanto as imagens não forem carregadas:

1. `img_hero_preview`: `16:9` — Localizado na Hero Section para demonstração técnica/vídeo interativo de byte.
2. `img_seniority_diagram`: `21:9` — Diagrama de arquitetura de software e otimização.
3. `img_partner_jp`: `1:1` — Logotipo quadrado da JP Desenvolvimento.
4. `img_partner_inominatum`: `1:1` — Logotipo quadrado da Inominatum Digital.
5. `img_partner_strafe`: `1:1` — Logotipo quadrado da Strafe Theory.
6. `img_culture_rnd`: `16:9` — Banner da seção de cultura e protótipos R&D.