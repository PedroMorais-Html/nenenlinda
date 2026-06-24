/* ===================================================
   LOGIN.JS — comportamento da página de entrada
   =================================================== */
 
/* =============================================
   ✏️  EDITE AQUI — nomes e data da senha
   ============================================= */
const USUARIOS = [
  { nome: 'Pedro',   senha: '13112007' },
  { nome: 'Vanessa', senha: '31052007' }
];
const DESTINO = 'index.html'; /* página que abre após o login */
/* ============================================= */
 
 
/* ── PÉTALAS DECORATIVAS ── */
(function criarPetalas() {
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'petala';
    const s = 7 + Math.random() * 11;
    p.style.cssText = [
      `width:${s}px`,
      `height:${s * 1.5}px`,
      `left:${Math.random() * 100}%`,
      `animation-duration:${6 + Math.random() * 10}s`,
      `animation-delay:${Math.random() * 12}s`,
      `transform:rotate(${Math.random() * 200}deg)`
    ].join(';');
    document.body.appendChild(p);
  }
})();
 
 
/* ── LÓGICA DE LOGIN ── */
 
/* normaliza o texto: remove espaços, pontos, traços, barras e põe em maiúsculas
   assim '14/02/2023', '14-02-2023' e '14022023' são todos iguais */
function normalizar(str) {
  return str.trim().toUpperCase().replace(/[\s.\-\/]/g, '');
}
 
function tentarEntrar() {
  const nomeVal  = document.getElementById('nome').value;
  const senhaVal = document.getElementById('senha').value;
 
  const usuarioOk = USUARIOS.find(u =>
    normalizar(u.nome)  === normalizar(nomeVal) &&
    normalizar(u.senha) === normalizar(senhaVal)
  );
 
  if (usuarioOk) {
    /* guarda quem entrou para o portfólio saber */
    sessionStorage.setItem('cartas-auth', nomeVal.trim());
 
    /* troca a tela de login pela de sucesso */
    document.getElementById('tela-login').style.display   = 'none';
    document.getElementById('tela-sucesso').style.display = 'block';
    document.getElementById('nome-ok').textContent        = nomeVal.trim();
  } else {
    /* mostra erro por 3 segundos */
    const erro = document.getElementById('erro');
    erro.classList.add('visivel');
    setTimeout(() => erro.classList.remove('visivel'), 3200);
  }
}
 
/* botão de entrar */
document.getElementById('btn-entrar').addEventListener('click', tentarEntrar);
 
/* tecla Enter nos campos */
document.querySelectorAll('.input').forEach(el =>
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') tentarEntrar();
  })
);
 
/* botão "Entrar no portfólio" */
document.getElementById('btn-ir').addEventListener('click', () => {
  /* guarda também no localStorage como fallback para file:// */
  localStorage.setItem('cartas-auth', nomeVal.trim());
  window.location.href = DESTINO;
});
 