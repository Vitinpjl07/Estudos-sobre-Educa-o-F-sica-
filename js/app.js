/* =============================================
   Esportes da Escola — app.js
   JavaScript puro: menu, instalação PWA,
   scroll, toast e service worker.
   ============================================= */
(function () {
  "use strict";

  /* ---------- Elementos ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const btnInstall = document.getElementById("btnInstall");
  const btnInstall2 = document.getElementById("btnInstall2");
  const toast = document.getElementById("toast");
  const statusOffline = document.getElementById("statusOffline");

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function mostrarToast(mensagem) {
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("visivel");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("visivel");
    }, 3200);
  }

  /* ---------- Menu mobile ---------- */
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const aberto = nav.classList.toggle("aberto");
      menuToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
      menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    nav.addEventListener("click", function (evento) {
      if (evento.target.tagName === "A") {
        nav.classList.remove("aberto");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Link ativo conforme a rolagem ---------- */
  const secoes = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  const linksNav = Array.prototype.slice.call(document.querySelectorAll(".nav a"));

  function atualizarLinkAtivo() {
    const pos = window.scrollY + 120;
    let atual = null;
    secoes.forEach(function (secao) {
      if (secao.offsetTop <= pos) atual = secao.id;
    });
    linksNav.forEach(function (link) {
      link.classList.toggle("ativo", link.getAttribute("href") === "#" + atual);
    });
  }
  window.addEventListener("scroll", atualizarLinkAtivo, { passive: true });
  atualizarLinkAtivo();

  /* ---------- Revelar elementos ao rolar ---------- */
  const alvos = document.querySelectorAll(".cartao, .dica, .comparativo__col, .faq details");
  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    alvos.forEach(function (alvo) {
      alvo.classList.add("revelar");
      observador.observe(alvo);
    });
  }

  /* ---------- Instalação do PWA ---------- */
  let eventoInstall = null;

  function podeInstalar() {
    if (btnInstall) btnInstall.hidden = false;
    if (btnInstall2) btnInstall2.hidden = false;
  }

  function instalar() {
    if (!eventoInstall) {
      mostrarToast("Use o menu do navegador e escolha \"Adicionar à tela inicial\".");
      return;
    }
    eventoInstall.prompt();
    eventoInstall.userChoice.then(function (escolha) {
      if (escolha.outcome === "accepted") {
        mostrarToast("App instalado com sucesso!");
      }
      eventoInstall = null;
      if (btnInstall) btnInstall.hidden = true;
      if (btnInstall2) btnInstall2.hidden = true;
    });
  }

  window.addEventListener("beforeinstallprompt", function (evento) {
    evento.preventDefault();
    eventoInstall = evento;
    podeInstalar();
  });

  if (btnInstall) btnInstall.addEventListener("click", instalar);
  if (btnInstall2) btnInstall2.addEventListener("click", instalar);

  window.addEventListener("appinstalled", function () {
    mostrarToast("Esportes da Escola foi adicionado à tela inicial!");
  });

  /* ---------- Status online / offline ---------- */
  function atualizarStatus() {
    if (!statusOffline) return;
    if (navigator.onLine) {
      statusOffline.textContent = "";
    } else {
      statusOffline.textContent = "Você está offline — o conteúdo continua disponível.";
    }
  }
  window.addEventListener("online", atualizarStatus);
  window.addEventListener("offline", atualizarStatus);
  atualizarStatus();

  /* ---------- Service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("sw.js")
        .then(function () {
          console.log("Service worker registrado.");
        })
        .catch(function (erro) {
          console.warn("Falha ao registrar o service worker:", erro);
        });
    });
  }

  /* ---------- Contador animado dos números do hero ---------- */
  const numeros = document.querySelectorAll(".hero__stats strong");
  function animarContador(elemento) {
    const texto = elemento.textContent.trim();
    if (!/^\d+$/.test(texto)) return;
    let atual = 0;
    const alvo = parseInt(texto, 10);
    const passo = Math.max(1, Math.round(alvo / 12));
    const intervalo = setInterval(function () {
      atual += passo;
      if (atual >= alvo) {
        atual = alvo;
        clearInterval(intervalo);
      }
      elemento.textContent = String(atual);
    }, 60);
  }
  if ("IntersectionObserver" in window && numeros.length) {
    const observadorNumeros = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observadorNumeros.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    numeros.forEach(function (n) { observadorNumeros.observe(n); });
  }
})();
