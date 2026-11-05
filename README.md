# Back2Byte Interactive

Website institucional da Back2Byte Interactive, holding B2B especializada em engenharia de games, co-development, porting, otimização e gamificação corporativa.

## Estrutura

- `index.html`: página institucional única, com navegação por seções para apresentação, serviços, engenharia, experiência, parceiros e contato.
- `havefun/index.html`: página independente de minigames (Snake, Pong, Breakout, Dino Game e Pac-Man).
- `assets/css/styles.css`: temas, componentes, animações e layouts responsivos do site e do arcade.
- `assets/js/script.js`: alternância de idioma e tema, navegação móvel, abas técnicas, animações e formulário de contato.
- `assets/js/havefun.js`: lógica dos jogos Pong, Breakout, Dino Game e Pac-Man.
- `assets/data/content.json`: metadados, strings de interface e traduções em português, inglês e espanhol.
- `assets/images/`: logotipos e imagens do site.
- `robots.txt` e `sitemap.xml`: permitem o rastreamento e enumeram as rotas públicas.

## Visualização local

Como o site carrega `content.json` usando `fetch`, abra-o por um servidor HTTP local, não diretamente como arquivo. No VS Code, inicie o **Live Server** na raiz do projeto e abra a URL local disponibilizada.

O formulário de contato prepara uma mensagem e abre o aplicativo de e-mail configurado no dispositivo. Ele não envia dados a um servidor.

## Conteúdo e identidade

A página inicial concentra o conteúdo institucional e usa âncoras para navegar entre seções. `/havefun/` é uma página separada para os jogos. Snake e Dino Game salvam os recordes no navegador. Os jogos iniciam sob demanda e aceitam teclado e, quando aplicável, controles touch. O tema escuro é o padrão e a preferência de tema também é salva localmente.

O contato oficial é `contact@back2byte.com`. Os links oficiais do [LinkedIn](https://www.linkedin.com/company/back2byte), [Instagram](https://www.instagram.com/back2byte_b2b/) e [YouTube](https://www.youtube.com/@back2byte_b2b) aparecem no cabeçalho e na seção de contato.

## Licença

Este projeto é propriedade intelectual da Back2Byte Interactive. Todos os direitos reservados.
