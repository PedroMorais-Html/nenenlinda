/* ===================================================
   SCRIPT.JS — portfólio principal
   Banco de dados: localStorage (funciona em file://)
   =================================================== */
 
/* ── PROTEÇÃO DE LOGIN ─────────────────────────── */
const _auth = sessionStorage.getItem('cartas-auth') || localStorage.getItem('cartas-auth');
if (!_auth) {
  window.location.href = 'login.html';
}
 
/* ── MENU MOBILE ───────────────────────────────── */
document.getElementById('nav-toggle')
  .addEventListener('click', () =>
    document.getElementById('nav-links').classList.toggle('aberto'));
 
document.getElementById('nav-links').querySelectorAll('a')
  .forEach(a => a.addEventListener('click', () =>
    document.getElementById('nav-links').classList.remove('aberto')));
 
/* ── FOTO DE PERFIL ──────────────────────────────*/
const fotoImg     = document.getElementById('foto-perfil-img');
const iconeCamera = document.getElementById('icone-camera');
 
function mostrarFoto(src) {
  if (!src) return;
  fotoImg.src               = src;
  fotoImg.style.display     = 'block';
  iconeCamera.style.display = 'none';
}
 
document.getElementById('foto-perfil')
  .addEventListener('click', () =>
    document.getElementById('input-foto-perfil').click());
 
document.getElementById('input-foto-perfil')
  .addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      mostrarFoto(ev.target.result);
      salvarPerfil();
    };
    r.readAsDataURL(f);
  });
 
/* ── PERFIL (foto + título + bio) ────────────────*/
function salvarPerfil() {
  const dados = {
    foto:   fotoImg.src || '',
    titulo: document.getElementById('titulo')?.innerText || '',
    bio:    document.getElementById('bio')?.innerText    || ''
  };
  try { localStorage.setItem('cartas-perfil', JSON.stringify(dados)); } catch(e){}
}
 
function carregarPerfil() {
  try {
    const d = JSON.parse(localStorage.getItem('cartas-perfil') || 'null');
    if (!d) return;
    if (d.foto)   mostrarFoto(d.foto);
    const t = document.getElementById('titulo');
    const b = document.getElementById('bio');
    if (d.titulo && t) t.innerText = d.titulo;
    if (d.bio    && b) b.innerText = d.bio;
  } catch(e){}
}
 
['titulo','bio'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', salvarPerfil);
});
 
carregarPerfil();
 
/* ── GALERIAS ────────────────────────────────────*/
const modelo = document.getElementById('modelo-cartao');
 
function iniciarGaleria(idGrid, idInput, chave) {
  const grid  = document.getElementById(idGrid);
  const input = document.getElementById(idInput);
  if (!grid || !input) return;
 
  function salvar() {
    const itens = [...grid.querySelectorAll('.cartao:not(.cartao-add)')].map(c => ({
      src:    c.querySelector('img')?.src             || '',
      titulo: c.querySelector('.campo-titulo')?.value || '',
      texto:  c.querySelector('.campo-texto')?.value  || ''
    }));
    try {
      localStorage.setItem(chave, JSON.stringify(itens));
    } catch(e) {
      const leves = itens.map(i => ({...i, src: i.src.length > 150000 ? '' : i.src}));
      try { localStorage.setItem(chave, JSON.stringify(leves)); } catch(e2){}
    }
  }
 
  function criarCartao({ src, titulo, texto } = {}) {
    const node   = modelo.content.cloneNode(true);
    const cartao = node.querySelector('.cartao');
    const img         = cartao.querySelector('img');
    const campoTitulo = cartao.querySelector('.campo-titulo');
    const campoTexto  = cartao.querySelector('.campo-texto');
    const faixaTitulo = cartao.querySelector('.faixa-titulo');
    const faixaTexto  = cartao.querySelector('.faixa-texto');
    const removerBtn  = cartao.querySelector('.remover');
 
    if (src) img.src    = src;
    campoTitulo.value   = titulo || '';
    campoTexto.value    = texto  || '';
 
    function sync() {
      faixaTitulo.textContent = campoTitulo.value || 'Sem título';
      faixaTexto.textContent  = campoTexto.value  || '';
    }
    sync();
 
    campoTitulo.addEventListener('input', () => { sync(); salvar(); });
    campoTexto.addEventListener('input',  () => { sync(); salvar(); });
 
    removerBtn.addEventListener('click', e => {
      e.stopPropagation();
      cartao.remove();
      salvar();
    });
 
    grid.appendChild(cartao);
  }
 
  function criarBotaoAdicionar() {
    const div = document.createElement('div');
    div.className = 'cartao cartao-add';
    div.innerHTML = `
      <div class="img-area">
        <div class="placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Adicionar imagem</span>
        </div>
      </div>`;
    div.addEventListener('click', () => input.click());
    grid.appendChild(div);
  }
 
  input.addEventListener('change', e => {
    [...e.target.files].forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        grid.querySelector('.cartao-add')?.remove();
        criarCartao({ src: ev.target.result });
        criarBotaoAdicionar();
        salvar();
      };
      r.readAsDataURL(f);
    });
    input.value = '';
  });
 
  function carregar() {
    let itens = [];
    try { itens = JSON.parse(localStorage.getItem(chave) || '[]'); } catch(e){}
    itens.forEach(item => criarCartao(item));
    criarBotaoAdicionar();
  }
 
  carregar();
}
 
iniciarGaleria('galeria-grid',   'input-arquivo',        'cartas-galeria');
iniciarGaleria('galeria-cartas', 'input-arquivo-cartas', 'cartas-secao-cartas');