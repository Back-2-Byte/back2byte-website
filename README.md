# Back2Byte Interactive

Website institucional da Back2Byte Interactive, holding B2B especializada em engenharia de games, co-development, porting, otimização e gamificação corporativa.

## Estrutura

- `index.html`, `en/index.html` e `es/index.html`: páginas iniciais nos três idiomas.
- `about/`, `ourwork/`, `whygames/`, `partners/` e `contact/`: cada pasta contém o `index.html` em português e as versões `en/index.html` e `es/index.html`.
- `assets/css/styles.css`: temas, componentes e layouts responsivos.
- `assets/js/script.js`: alternância de idioma e tema, navegação móvel, abas técnicas, jogo da cobrinha, animações e formulário de contato.
- `assets/data/content.json`: metadados, strings de interface e traduções em português, inglês e espanhol.
- `assets/images/`: logotipos e imagens do site.
- `robots.txt` e `sitemap.xml`: permitem o rastreamento e enumeram as rotas canônicas e suas alternativas de idioma.

## Visualização local

Como o site carrega `content.json` usando `fetch`, abra-o por um servidor HTTP local, não diretamente como arquivo. No VS Code, inicie o **Live Server** na raiz do projeto e abra a URL local disponibilizada.

O formulário de contato prepara uma mensagem e abre o aplicativo de e-mail configurado no dispositivo. Ele não envia dados a um servidor.

## Conteúdo e identidade

As páginas têm conteúdo HTML próprio, não são renderizadas como uma single page. As rotas em português são `/`, `/about/`, `/ourwork/`, `/whygames/`, `/partners/` e `/contact/`. As homes em inglês e espanhol ficam em `/en/` e `/es/`; nas demais páginas, cada idioma tem sua subpasta, como `/about/en/` e `/about/es/`. O seletor de idioma mantém a página atual ao trocar de idioma. O jogo da cobrinha aceita as setas, WASD e controles de toque; o recorde fica salvo no navegador. O tema escuro é o padrão e a preferência de tema também é salva localmente.

O contato oficial é `contact@back2byte.com`. Os links oficiais do [LinkedIn](https://www.linkedin.com/company/back2byte), [Instagram](https://www.instagram.com/back2byte_b2b/) e [YouTube](https://www.youtube.com/@back2byte_b2b) aparecem no cabeçalho e na seção de contato.

## Licença

Este projeto é propriedade intelectual da Back2Byte Interactive. Todos os direitos reservados.
