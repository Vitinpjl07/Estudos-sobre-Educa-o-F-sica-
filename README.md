# Esportes da Escola — Jiu-Jitsu & Vôlei (PWA)

Site informativo (PWA) sobre **Jiu-Jitsu** e **Vôlei**, feito com **HTML, CSS e JavaScript puros**,
sem frameworks ou dependências. Cores principais: **amarelo e azul**.

🌐 **Site publicado:** https://vitinpjl07.github.io/Estudos-sobre-Educa-o-F-sica-/

## Conteúdo

- **3 finalizações de Jiu-Jitsu**, cada uma com ilustração própria e dicas:
  1. Armbar (finalização de braço)
  2. Triângulo (estrangulamento)
  3. Kimura (chave de braço)
- **3 fundamentos de Vôlei**, cada um com ilustração própria e dicas:
  1. Saque
  2. Recepção / Passe (antebraço)
  3. Ataque (cortada / spike)

## Estrutura

```
.
├── index.html              # página única
├── css/styles.css          # estilos (paleta amarelo/azul, responsivo)
├── js/app.js               # menu mobile, instalação do app, animações, service worker
├── manifest.webmanifest    # manifesto do PWA
├── sw.js                   # service worker (cache offline)
├── server.mjs              # servidor estático para testes locais
├── icons/                  # ícones do app (192 e 512 px)
├── img/                    # ilustrações SVG (hero, banners e 6 técnicas)
└── tools/make-icons.mjs    # script que gera os ícones PNG
```

## Publicação (GitHub Pages)

O repositório publica o site automaticamente no branch `gh-pages` a cada push na `main`
(workflow `.github/workflows/deploy.yml`).

```bash
git add .
git commit -m "nova versão do site"
git push origin main        # dispara a publicação automática
```

O site fica disponível em:
`https://vitinpjl07.github.io/Estudos-sobre-Educa-o-F-sica-/`

## Como rodar localmente

```bash
node server.mjs       # ou: npm start
# abra http://localhost:8080
```

O **service worker** (e o botão "Instalar") exigem `http://localhost` ou HTTPS.
Abrir o arquivo direto (`file://`) funciona para ver o layout, mas sem cache offline.

## Funcionalidades do PWA

- Instalável na tela inicial (Android, iOS e desktop) via botão **Instalar** ou manifesto.
- Cache offline de todo o conteúdo (HTML, CSS, JS, ícones e ilustrações).
- Aviso de status **online/offline** no rodapé.
- Layout responsivo com menu hambúrguer no celular.
- Acessibilidade: `alt` descritivo nas imagens, navegação por teclado e `prefers-reduced-motion`.

## Paleta

| Cor | Uso |
| --- | --- |
| `#FFD400` | amarelo principal (destaques, botões, faixa da quadra) |
| `#E8A200` | amarelo escuro (sombras e gradientes) |
| `#0B4F9E` | azul principal (seções, botões, uniforme) |
| `#062D5C` | azul escuro (fundo, cabeçalho, rodapé) |

## Gerar os ícones novamente

```bash
node tools/make-icons.mjs
```
