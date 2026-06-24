/* ===================================================
   DB.JS — banco de dados online (Firebase Firestore)
   + fallback local (localStorage) se estiver offline

   ✏️  PASSO 1: cria o projeto em https://firebase.google.com
   ✏️  PASSO 2: cola as tuas credenciais no bloco CONFIG abaixo
   =================================================== */


/* ── CONFIG FIREBASE ─────────────────────────────
   Vai a https://console.firebase.google.com
   → Criar projeto → Web (</>)
   → Copia o objeto firebaseConfig e cola aqui      */
const FIREBASE_CONFIG = {
  apiKey: "COLA_AQUI",
  authDomain: "COLA_AQUI",
  projectId: "COLA_AQUI",
  storageBucket: "COLA_AQUI",
  messagingSenderId: "COLA_AQUI",
  appId: "COLA_AQUI"
};
/* ─────────────────────────────────────────────── */


/* ── FIREBASE SDK (carregado dinamicamente) ───── */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore, doc, setDoc, getDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/* documento único que guarda TUDO do portfólio */
const REF = doc(db, 'cartas', 'dados');


/* ===================================================
   API PÚBLICA — usada pelo script.js
   =================================================== */
const DB = {

  /* ── SALVAR ──────────────────────────────────────
     Chama sempre que houver mudança (foto, título,
     nova imagem, nova descrição, remoção)           */
  async salvar(dados) {
    /* dados = { perfil, galeria, cartas } */
    try {
      await setDoc(REF, dados, { merge: true });
    } catch (e) {
      /* sem internet → salva local como backup */
      console.warn('DB offline, guardando local:', e.message);
      localStorage.setItem('cartas-backup', JSON.stringify(dados));
    }
  },

  /* ── CARREGAR (uma vez ao abrir a página) ────── */
  async carregar() {
    try {
      const snap = await getDoc(REF);
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.warn('DB offline, carregando local:', e.message);
    }
    /* fallback: tenta localStorage */
    try {
      return JSON.parse(localStorage.getItem('cartas-backup') || 'null');
    } catch (e) { return null; }
  },

  /* ── ESCUTAR MUDANÇAS EM TEMPO REAL ─────────────
     Chama o callback sempre que outro dispositivo
     salvar algo novo — atualiza a página sozinha   */
  escutar(callback) {
    return onSnapshot(REF, snap => {
      if (snap.exists()) callback(snap.data());
    }, err => console.warn('DB escuta:', err.message));
  }

};

export default DB;
