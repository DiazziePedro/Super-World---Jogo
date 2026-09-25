/**
 * ============================================================================
 * SUPER WORLD - O Jogo da Discórdia
 * Jogo de plataforma 2D estilo retrô com física dinâmica
 * JavaScript Puro (Vanilla JS) + HTML5 Canvas + Web Audio API Sintetizada
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. SISTEMA DE ÁUDIO SINTETIZADO (Web Audio API - Sem arquivos externos)
// ----------------------------------------------------------------------------
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.enabled;
  }

  // Pulo clássico 8-bit
  playJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // Batida na cabeça / Bloco
  playBump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.setValueAtTime(80, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) { }
  }

  // Som de armadilha acionada (alarme rápido)
  playTrapTrigger() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.setValueAtTime(300, this.ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(700, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) { }
  }

  // Explosão cômica (ruído)
  playExplosion() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) { }
  }

  // Morte trágica e engraçada (trompete triste)
  playDeath() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [330, 311, 293, 261];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.14;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.linearRampToValueAtTime(0.01, startTime + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.17);
      });
    } catch (e) { }
  }

  // Risadinha troll sintetizada
  playTrollLaugh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = [400, 550, 420, 580, 450, 620];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.linearRampToValueAtTime(0.01, startTime + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.08);
      });
    } catch (e) { }
  }

  // Som de vitória triunfante
  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [261.6, 329.6, 392.0, 523.2, 659.2, 783.9];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.12;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.linearRampToValueAtTime(0.01, startTime + (idx === notes.length - 1 ? 0.6 : 0.15));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + (idx === notes.length - 1 ? 0.7 : 0.18));
      });
    } catch (e) { }
  }

  // Teleporte
  playTeleport() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) { }
  }

  // Música Chiptune de fundo procedural e contínua
  startBGM() {
    if (!this.enabled || this.bgmPlaying) return;
    this.bgmPlaying = true;
    const melody = [
      261.6, 0, 261.6, 0, 329.6, 0, 392.0, 0,
      329.6, 0, 261.6, 0, 293.7, 329.6, 293.7, 0,
      246.9, 0, 246.9, 0, 293.7, 0, 349.2, 0,
      293.7, 0, 246.9, 0, 261.6, 0, 0, 0
    ];

    const playStep = () => {
      if (!this.bgmPlaying || !this.enabled) return;
      this.init();
      if (this.ctx) {
        const note = melody[this.bgmStep % melody.length];
        if (note > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(note, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.13);
        }
      }
      this.bgmStep++;
      this.bgmTimer = setTimeout(playStep, 150);
    };

    playStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

const AudioSys = new RetroAudioEngine();

// ----------------------------------------------------------------------------
// 2. FRASES SARCÁSTICAS DE MORTE
// ----------------------------------------------------------------------------
const DEATH_QUOTES = [
  "Ops! Isso foi cruel, né?",
  "Regra básica do troll game: O chão nem sempre é chão!",
  "Você confiou na plaquinha de aviso? Sério? kkkk",
  "Cat Mario manda um abraço carinhoso!",
  "A física neste jogo é puramente uma sugestão.",
  "Parabéns! Você descobriu uma armadilha com a testa!",
  "Quem disse que pular na cabeça dos bichos dava certo?",
  "A moeda brilhava tanto... uma pena que era dinamite.",
  "Achou que a bandeira de vitória era de verdade? Inocente...",
  "Gravidade: o pior inimigo da confiança humana.",
  "Tentativa comovente, porém desastrosa.",
  "Um minuto de silêncio para esse pulo de fé.",
  "Você já tentou NÃO pisar onde parece seguro?",
  "Aquele cano verde parecia tão amigável...",
  "Dica: feche os olhos e reze, talvez ajude na próxima."
];

// ----------------------------------------------------------------------------
// 3. DEFINIÇÃO MODULAR DOS NÍVEIS (FÁCIL DE EXPANDIR)
// ----------------------------------------------------------------------------
/**
 * Tipos de entidades e blocos suportados:
 * - 'ground': Chão sólido normal
 * - 'platform': Plataforma sólida suspensa
 * - 'falling_platform': Plataforma que treme e cai 0.3s após ser pisada
 * - 'illusion_floor': Parece chão sólido perfeito, mas não tem colisão (jogador cai através!)
 * - 'invisible_block': Fica invisível até a cabeça do jogador bater por baixo (para o pulo no ar!)
 * - 'question_block': Bloco '?' que guarda surpresas cruéis:
 *      * action: 'spike_drop' (cai espinho na cabeça)
 *      * action: 'crush_down' (o próprio bloco cai esmagando)
 *      * action: 'teleport_start' (teleporta de volta ao começo rindo)
 *      * action: 'coin_explode' (solta moeda que explode)
 * - 'spike': Espinho mortal clássico
 * - 'inverted_enemy': Inimigo que pula no jogador se você tentar pular nele
 * - 'sign': Placa de aviso (muitas vezes mente deliberadamente!)
 * - 'troll_coin': Moeda reluzente que explode ao toque
 * - 'gravity_zone': Inverte a gravidade por alguns segundos
 * - 'suction_pipe': Cano que suga ou empurra o jogador para trás
 * - 'checkpoint': Salva o progresso na fase
 * - 'fake_flag': Bandeira falsa que cai ou abre alçapão rindo
 * - 'true_goal': Saída real da fase
 */

const LEVELS = [
  {
    id: 1,
    name: "Fase 1: O Passeio 'Inocente'",
    width: 4500,
    height: 500,
    spawnX: 60,
    spawnY: 340,
    bgColorTop: "#3a86ff",
    bgColorBottom: "#a0c4ff",
    entities: [
      // === CHÃO INICIAL ===
      { type: 'ground', x: 0, y: 400, width: 450, height: 100 },

      // Placa 1: Aviso inocente
      { type: 'sign', x: 120, y: 360, width: 40, height: 40, text: "BEM-VINDO!\nUSE [ESPAÇO] PARA PULAR" },

      // Bloco '?' inicial: movido mais para esquerda e um pouco mais baixo que o pulo máximo para conseguir subir nele
      { type: 'question_block', x: 190, y: 300, width: 36, height: 36, action: 'spike_drop', used: false },

      // Inimigo Invertido 1: Parece um Goomba, mas pula uma vez no jogador!
      { type: 'inverted_enemy', x: 300, y: 370, width: 30, height: 30, vx: -1.2, patrolLeft: 240, patrolRight: 400 },

      // Bloco Invisível #1: Colocado estrategicamente logo antes do primeiro buraco!
      // O jogador tenta correr e pular... e bate a cabeça caindo no abismo!
      { type: 'invisible_block', x: 420, y: 260, width: 36, height: 36, hit: false },

      // BURACO #1 COM ESPINHOS NO FUNDO
      { type: 'spike', x: 450, y: 470, width: 140, height: 30 },

      // PLATAFORMA QUE DESMORONA APÓS 0.3s
      { type: 'falling_platform', x: 500, y: 340, width: 70, height: 24 },

      // CHÃO DO MEIO (Agora 100% sólido, chão falso apagado)
      { type: 'ground', x: 610, y: 400, width: 380, height: 100 },

      // Placa apontando para a direita: "CAMINHO 100% SEGURO ->"
      { type: 'sign', x: 740, y: 360, width: 40, height: 40, text: "CAMINHO SEGURO ->\n(CONFIA! 😉)" },

      // Texto de aviso no ar
      { type: 'text_troll', x: 830, y: 320, text: "Pule Aqui! ⭐" },

      // Bloco Invisível #2 (se pular bate a cabeça, mas cai no chão sólido)
      { type: 'invisible_block', x: 880, y: 250, width: 36, height: 36, hit: false },

      // Plataforma flutuante alta
      { type: 'platform', x: 1010, y: 320, width: 100, height: 24 },

      // Bloco '?' que TELEPORTA para o início rindo!
      { type: 'question_block', x: 1040, y: 200, width: 36, height: 36, action: 'teleport_start', used: false },

      // CHECKPOINT (Ilha aumentada de tamanho)
      { type: 'checkpoint', x: 1140, y: 340, width: 30, height: 60, reached: false },
      { type: 'ground', x: 1110, y: 400, width: 420, height: 100 },

      // MOEDA TROLL QUE EXPLODE (texto removido)
      { type: 'troll_coin', x: 1250, y: 360, width: 24, height: 24, collected: false },

      // Espinho logo atrás do cano
      { type: 'spike', x: 1350, y: 380, width: 40, height: 20 },

      // CANO TROLL (Suga o jogador para trás contra espinhos)
      { type: 'suction_pipe', x: 1450, y: 310, width: 50, height: 90, force: -8 },

      // Pulos em plataformas estreitas
      { type: 'falling_platform', x: 1560, y: 340, width: 60, height: 20 },
      { type: 'spike', x: 1530, y: 470, width: 230, height: 30 },
      { type: 'falling_platform', x: 1670, y: 310, width: 60, height: 20 },

      // Bloco '?' esmagador (o bloco despenca quando bate nele)
      { type: 'question_block', x: 1670, y: 190, width: 36, height: 36, action: 'crush_down', used: false },

      // Ilha das duas criaturas (espaço ampliado e criaturas com distância bem maior entre elas)
      { type: 'ground', x: 1780, y: 400, width: 520, height: 100 },
      { type: 'inverted_enemy', x: 1860, y: 370, width: 30, height: 30, vx: 1.4, patrolLeft: 1800, patrolRight: 1980 },
      { type: 'inverted_enemy', x: 2180, y: 370, width: 30, height: 30, vx: -1.4, patrolLeft: 2060, patrolRight: 2280 },

      // Gravidade Invertida temporária (zona e plataforma do teto ligeiramente aumentadas)
      { type: 'gravity_zone', x: 2380, y: 90, width: 280, height: 310 },
      { type: 'platform', x: 2380, y: 90, width: 280, height: 24 }, // Teto onde você anda de ponta cabeça!
      { type: 'spike', x: 2490, y: 114, width: 60, height: 20, upsideDown: true },

      // Chão do final (ilha final muito mais longa para esconder o verdadeiro castelo)
      { type: 'ground', x: 2660, y: 400, width: 1750, height: 100 },

      // ESCADARIA DE BLOCOS INVISÍVEIS PARA BURLAR A BANDEIRA FALSA:
      // Degrau 1: Pule antes da bandeira para revelar ou subir
      { type: 'invisible_block', x: 2900, y: 300, width: 36, height: 36, hit: false, isSecretPath: true },
      // Degrau 2: Subindo a escada
      { type: 'invisible_block', x: 2955, y: 230, width: 36, height: 36, hit: false, isSecretPath: true },
      // Degrau 3: Ponte passando por CIMA do mastro da bandeira fake
      { type: 'invisible_block', x: 3010, y: 160, width: 60, height: 32, hit: false, isSecretPath: true },
      // Degrau 4: Descida segura do outro lado da bandeira
      { type: 'invisible_block', x: 3085, y: 210, width: 45, height: 28, hit: false, isSecretPath: true },

      // BANDEIRA FALSA! (Parece 100% o fim da fase, mas é a cilada)
      { type: 'fake_flag', x: 3020, y: 220, width: 40, height: 180, triggered: false },

      // Estrutura do falso castelo
      { type: 'platform', x: 3145, y: 240, width: 90, height: 20 },

      // Pista secreta dos campeões (distante, completamente fora de vista de quem está na bandeira fake!)
      { type: 'text_troll', x: 3280, y: 300, text: "VOCÊ BURLOU A BANDEIRA FAKE! 🏆" },
      { type: 'platform', x: 3420, y: 310, width: 90, height: 20 },
      { type: 'platform', x: 3650, y: 260, width: 90, height: 20 },
      { type: 'text_troll', x: 3780, y: 240, text: "O VERDADEIRO FINAL LOGO À FRENTE! 👑" },
      { type: 'platform', x: 3980, y: 280, width: 100, height: 20 },
      { type: 'platform', x: 4130, y: 240, width: 80, height: 20 },

      // A VERDADEIRA SAÍDA: Bem longe (mais de 1200px da bandeira fake!), impossível ver antes da hora!
      { type: 'true_goal', x: 4260, y: 260, width: 60, height: 140 }
    ]
  },

  {
    id: 2,
    name: "Fase 2: O Caos Absoluto",
    width: 3500,
    height: 500,
    spawnX: 60,
    spawnY: 340,
    bgColorTop: "#7209b7",
    bgColorBottom: "#f72585",
    entities: [
      // Início fase 2
      { type: 'ground', x: 0, y: 400, width: 350, height: 100 },
      { type: 'sign', x: 80, y: 360, width: 40, height: 40, text: "FASE 2: SEJA BEM-VINDO AO INFERNO" },

      // Bloco que solta míssil troll
      { type: 'question_block', x: 200, y: 260, width: 36, height: 36, action: 'coin_explode', used: false },

      // Ilha de plataformas movediças e caindo
      { type: 'falling_platform', x: 420, y: 350, width: 60, height: 20 },
      { type: 'invisible_block', x: 430, y: 230, width: 36, height: 36, hit: false },
      { type: 'spike', x: 380, y: 470, width: 300, height: 30 },

      { type: 'falling_platform', x: 560, y: 310, width: 60, height: 20 },
      { type: 'falling_platform', x: 700, y: 270, width: 60, height: 20 },

      // Chão ilusório gigante
      { type: 'illusion_floor', x: 820, y: 300, width: 200, height: 30 },
      { type: 'spike', x: 820, y: 470, width: 200, height: 30 },

      // Caminho real é por BAIXO em blocos invisíveis ou teto
      { type: 'platform', x: 850, y: 180, width: 120, height: 20 },

      // Checkpoint
      { type: 'checkpoint', x: 1060, y: 340, width: 30, height: 60, reached: false },
      { type: 'ground', x: 1050, y: 400, width: 250, height: 100 },

      // Inimigos agressivos
      { type: 'inverted_enemy', x: 1140, y: 370, width: 30, height: 30, vx: 2.2, patrolLeft: 1070, patrolRight: 1280 },
      { type: 'inverted_enemy', x: 1220, y: 370, width: 30, height: 30, vx: -2.0, patrolLeft: 1070, patrolRight: 1280 },

      // Zona de Gravidade Invertida Estendida
      { type: 'gravity_zone', x: 1350, y: 80, width: 300, height: 320, duration: 320 },
      { type: 'platform', x: 1350, y: 80, width: 300, height: 24 },
      { type: 'spike', x: 1420, y: 104, width: 80, height: 20, upsideDown: true },
      { type: 'spike', x: 1540, y: 470, width: 100, height: 30 },

      // Plataformas traiçoeiras pós-gravidade
      { type: 'ground', x: 1720, y: 400, width: 200, height: 100 },
      { type: 'troll_coin', x: 1790, y: 360, width: 24, height: 24, collected: false },
      { type: 'text_troll', x: 1760, y: 330, text: "AGORA SIM É REAL! 🏆" },

      // Bloco que teleporta
      { type: 'question_block', x: 1840, y: 260, width: 36, height: 36, action: 'teleport_start', used: false },

      // Cano de sucção reversa
      { type: 'suction_pipe', x: 1980, y: 310, width: 50, height: 90, force: -10 },
      { type: 'falling_platform', x: 2100, y: 330, width: 60, height: 20 },
      { type: 'invisible_block', x: 2110, y: 220, width: 36, height: 36, hit: false },
      { type: 'spike', x: 1950, y: 470, width: 280, height: 30 },

      // Corredor final
      { type: 'ground', x: 2280, y: 400, width: 650, height: 100 },
      { type: 'fake_flag', x: 2540, y: 220, width: 40, height: 180, triggered: false },
      { type: 'invisible_block', x: 2500, y: 260, width: 36, height: 36, hit: false },
      { type: 'platform', x: 2680, y: 220, width: 90, height: 20 },
      { type: 'true_goal', x: 2820, y: 260, width: 60, height: 140 }
    ]
  }
];

// ----------------------------------------------------------------------------
// 4. CLASSE PRINCIPAL DO JOGO (GAME ENGINE)
// ----------------------------------------------------------------------------
class TrollPlatformerGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Estado geral
    this.currentLevelIndex = 0;
    this.level = null;
    this.entities = [];
    this.activeProjectiles = [];
    this.particles = [];
    this.floatingTexts = [];

    // Estatísticas do jogador
    this.totalDeaths = 0;
    this.stageDeaths = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = null;

    // Câmera
    this.camera = { x: 0, y: 0, width: 900, height: 500 };
    this.screenShake = 0;

    // Checkpoint
    this.checkpoint = null;

    // Gravidade normal / invertida
    this.gravity = 0.58;
    this.isGravityInverted = false;
    this.gravityInvertTimer = 0;

    // Jogador
    this.player = {
      x: 60,
      y: 340,
      width: 26,
      height: 34,
      vx: 0,
      vy: 0,
      speed: 3.8,
      jumpForce: -11.6,
      isGrounded: false,
      coyoteTimer: 0,
      jumpBuffer: 0,
      facing: 'right',
      isDead: false,
      deathBounceVy: 0,
      walkFrame: 0,
      blinkTimer: 0
    };

    // Entradas do teclado
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jumpBuffered: false
    };

    // Elementos do DOM
    this.dom = {
      deathCounter: document.getElementById('death-counter'),
      levelDisplay: document.getElementById('level-display'),
      timeDisplay: document.getElementById('time-display'),
      checkpointBadge: document.getElementById('checkpoint-badge'),
      deathBanner: document.getElementById('death-banner'),
      deathQuote: document.getElementById('death-quote'),
      startScreen: document.getElementById('start-screen'),
      levelClearScreen: document.getElementById('level-clear-screen'),
      victoryScreen: document.getElementById('victory-screen'),
      btnPlay: document.getElementById('btn-play'),
      btnRestart: document.getElementById('btn-restart'),
      btnSound: document.getElementById('btn-sound'),
      soundIcon: document.getElementById('sound-icon'),
      btnNextLevel: document.getElementById('btn-next-level'),
      btnRestartGame: document.getElementById('btn-restart-game'),
      stageDeaths: document.getElementById('stage-deaths'),
      stageTime: document.getElementById('stage-time'),
      finalDeaths: document.getElementById('final-deaths'),
      finalTime: document.getElementById('final-time'),
      finalRank: document.getElementById('final-rank'),
      finalTaunt: document.getElementById('final-taunt'),
      liveTrollComment: document.getElementById('live-troll-comment')
    };

    this.gameState = 'START'; // 'START', 'PLAYING', 'DEAD', 'LEVEL_CLEAR', 'VICTORY'
    this.lastFrameTime = performance.now();

    this.initEvents();
  }

  // Configuração dos ouvintes de eventos
  initEvents() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    this.dom.btnPlay.addEventListener('click', () => {
      this.startGame();
    });

    this.dom.btnRestart.addEventListener('click', () => {
      this.respawnPlayer(true);
    });

    this.dom.btnSound.addEventListener('click', () => {
      const active = AudioSys.toggleSound();
      this.dom.soundIcon.textContent = active ? '🔊' : '🔇';
    });

    this.dom.btnNextLevel.addEventListener('click', () => {
      this.nextLevel();
    });

    this.dom.btnRestartGame.addEventListener('click', () => {
      this.restartEntireGame();
    });

    // Inicia loop de renderização e lógica
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  handleKeyDown(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keys.left = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keys.right = true;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.keys.down = true;
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.keys.up = true;
      this.player.jumpBuffer = 8; // buffers jump for 8 frames
    }

    // Tecla R: Reiniciar instantâneo
    if (e.code === 'KeyR') {
      if (this.gameState === 'PLAYING' || this.gameState === 'DEAD') {
        this.respawnPlayer(false);
      }
    }

    // Tecla M: Alternar som
    if (e.code === 'KeyM') {
      const active = AudioSys.toggleSound();
      this.dom.soundIcon.textContent = active ? '🔊' : '🔇';
    }

    // Se estiver na tela de morte e apertar espaço, renasce
    if (this.gameState === 'DEAD' && (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp')) {
      this.respawnPlayer(false);
    }
  }

  handleKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keys.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keys.right = false;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.keys.down = false;
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.keys.up = false;
      // Pulo variável: soltar o botão corta a subida
      if (!this.isGravityInverted && this.player.vy < -3) {
        this.player.vy = -3;
      } else if (this.isGravityInverted && this.player.vy > 3) {
        this.player.vy = 3;
      }
    }
  }

  startGame() {
    AudioSys.init();
    AudioSys.startBGM();
    this.dom.startScreen.classList.remove('active');
    this.currentLevelIndex = 0;
    this.totalDeaths = 0;
    this.stageDeaths = 0;
    this.checkpoint = null;
    this.startTime = Date.now();
    this.loadLevel(this.currentLevelIndex);
    this.gameState = 'PLAYING';

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    if (this.gameState !== 'PLAYING') return;
    this.elapsedSeconds++;
    const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    this.dom.timeDisplay.textContent = `${mins}:${secs}`;
  }

  // Carrega e clona as entidades do nível para não alterar a definição original
  loadLevel(index) {
    const rawLevel = LEVELS[index];
    this.level = rawLevel;
    this.dom.levelDisplay.textContent = `${index + 1}/${LEVELS.length}`;
    this.isGravityInverted = false;
    this.gravityInvertTimer = 0;

    // Clonagem profunda dos objetos do nível
    this.entities = JSON.parse(JSON.stringify(rawLevel.entities));
    this.activeProjectiles = [];
    this.particles = [];
    this.floatingTexts = [];

    // Se houver checkpoint salvo neste nível
    if (this.checkpoint && this.checkpoint.levelIndex === index) {
      this.player.x = this.checkpoint.x;
      this.player.y = this.checkpoint.y;
      this.dom.checkpointBadge.style.display = 'flex';
    } else {
      this.player.x = rawLevel.spawnX;
      this.player.y = rawLevel.spawnY;
      this.dom.checkpointBadge.style.display = 'none';
      this.checkpoint = null;
    }

    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = false;
    this.player.isDead = false;

    this.camera.x = Math.max(0, this.player.x - 250);
  }

  // Respawn do jogador
  respawnPlayer(fromButton = false) {
    this.dom.deathBanner.classList.remove('show');
    this.loadLevel(this.currentLevelIndex);
    this.gameState = 'PLAYING';
  }

  // Morte com animação e frase sarcástica
  killPlayer(reason = "Armadilha mortal!") {
    if (this.player.isDead) return;
    this.player.isDead = true;
    this.gameState = 'DEAD';
    this.totalDeaths++;
    this.stageDeaths++;
    this.dom.deathCounter.textContent = this.totalDeaths;

    AudioSys.playDeath();
    AudioSys.playExplosion();
    this.screenShake = 15;

    // Explosão de partículas de sangue/confetes cômicos
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 9,
        size: Math.random() * 5 + 3,
        color: ['#ff2a5f', '#ffd166', '#00f5d4', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 45
      });
    }

    // Salto cômico de morte para o espaço
    this.player.deathBounceVy = -11;

    // Escolhe frase sarcástica aleatória
    const randomQuote = DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)];
    this.dom.deathQuote.textContent = `"${randomQuote}"`;

    // Atualiza comentário no rodapé
    this.dom.liveTrollComment.textContent = `Morte #${this.totalDeaths}: ${reason}`;

    // Mostra o modal de morte
    setTimeout(() => {
      if (this.gameState === 'DEAD') {
        this.dom.deathBanner.classList.add('show');
      }
    }, 400);
  }

  // Conclusão de Fase
  levelClear() {
    this.gameState = 'LEVEL_CLEAR';
    AudioSys.playWin();
    this.dom.stageDeaths.textContent = this.stageDeaths;
    const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    this.dom.stageTime.textContent = `${mins}:${secs}`;
    this.dom.levelClearScreen.classList.add('active');
  }

  nextLevel() {
    this.dom.levelClearScreen.classList.remove('active');
    this.currentLevelIndex++;
    this.stageDeaths = 0;
    this.checkpoint = null;

    if (this.currentLevelIndex < LEVELS.length) {
      this.loadLevel(this.currentLevelIndex);
      this.gameState = 'PLAYING';
    } else {
      this.gameVictory();
    }
  }

  // Vitória completa do jogo
  gameVictory() {
    this.gameState = 'VICTORY';
    AudioSys.playWin();

    const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
    this.dom.finalDeaths.textContent = this.totalDeaths;
    this.dom.finalTime.textContent = `${mins}:${secs}`;

    // Classificação sarcástica baseada no número de mortes
    let rank = "Detetive de Pegadinhas";
    let taunt = "Você tem reflexos sobre-humanos!";
    if (this.totalDeaths > 20) {
      rank = "Mártir da Paciência Suprema";
      taunt = "Sua determinação em sofrer é inspiradora.";
    } else if (this.totalDeaths > 10) {
      rank = "Vítima Frequente de Ciladas";
      taunt = "Caiu em quase todas as pegadinhas, mas sobreviveu!";
    } else if (this.totalDeaths === 0) {
      rank = "Hacker ou Vidente?";
      taunt = "Como você não morreu nenhuma vez?!";
    }

    this.dom.finalRank.textContent = rank;
    this.dom.finalTaunt.textContent = `"${taunt}"`;
    this.dom.victoryScreen.classList.add('active');
  }

  restartEntireGame() {
    this.dom.victoryScreen.classList.remove('active');
    this.totalDeaths = 0;
    this.stageDeaths = 0;
    this.elapsedSeconds = 0;
    this.currentLevelIndex = 0;
    this.checkpoint = null;
    this.dom.deathCounter.textContent = '0';
    this.loadLevel(0);
    this.gameState = 'PLAYING';
  }

  // --------------------------------------------------------------------------
  // LOOP PRINCIPAL DE JOGO (UPDATE + RENDER)
  // --------------------------------------------------------------------------
  gameLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = timestamp;

    this.update();
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // --------------------------------------------------------------------------
  // ATUALIZAÇÃO DA LÓGICA E FÍSICA
  // --------------------------------------------------------------------------
  update() {
    if (this.screenShake > 0) this.screenShake *= 0.9;

    // Atualização de partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravidade na partícula
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Textos flutuantes de troll
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Se o jogador estiver morto, animação de subir e cair no espaço
    if (this.gameState === 'DEAD') {
      this.player.y += this.player.deathBounceVy;
      this.player.deathBounceVy += 0.6;
      return;
    }

    if (this.gameState !== 'PLAYING') return;

    // 1. Movimentação Horizontal
    const currentSpeed = this.player.speed;
    if (this.keys.left) {
      this.player.vx = -currentSpeed;
      this.player.facing = 'left';
      this.player.walkFrame += 0.2;
    } else if (this.keys.right) {
      this.player.vx = currentSpeed;
      this.player.facing = 'right';
      this.player.walkFrame += 0.2;
    } else {
      this.player.vx = 0;
    }

    // 2. Temporizadores de Pulo (Coyote time & Jump buffer)
    if (this.player.isGrounded) {
      this.player.coyoteTimer = 6; // 6 frames de margem após sair da beirada
    } else {
      if (this.player.coyoteTimer > 0) this.player.coyoteTimer--;
    }

    if (this.player.jumpBuffer > 0) this.player.jumpBuffer--;

    // 3. Aplicação do Pulo
    const effGravity = this.isGravityInverted ? -this.gravity : this.gravity;
    const effJumpForce = this.isGravityInverted ? -this.player.jumpForce : this.player.jumpForce;

    if (this.player.jumpBuffer > 0 && (this.player.isGrounded || this.player.coyoteTimer > 0)) {
      this.player.vy = effJumpForce;
      this.player.isGrounded = false;
      this.player.coyoteTimer = 0;
      this.player.jumpBuffer = 0;
      AudioSys.playJump();

      // Partículas de poeira do pulo
      for (let i = 0; i < 5; i++) {
        this.particles.push({
          x: this.player.x + this.player.width / 2,
          y: this.isGravityInverted ? this.player.y : this.player.y + this.player.height,
          vx: (Math.random() - 0.5) * 3,
          vy: this.isGravityInverted ? 1 : -1,
          size: Math.random() * 3 + 2,
          color: '#e2e8f0',
          life: 18
        });
      }
    }

    // 4. Aplicação da Gravidade
    this.player.vy += effGravity;
    const maxFallSpeed = 12;
    if (this.player.vy > maxFallSpeed) this.player.vy = maxFallSpeed;
    if (this.player.vy < -maxFallSpeed) this.player.vy = -maxFallSpeed;

    // 5. Movimento & Colisões AABB com o cenário
    this.moveAndCollide();

    // 6. Atualização de Projéteis / Armadilhas ativas
    this.updateProjectiles();

    // 7. Atualização das Entidades (Inimigos invertidos, plataformas falsas)
    this.updateEntities();

    // 8. Queda no abismo
    if (this.player.y > this.level.height + 50 || this.player.y < -150) {
      this.killPlayer("Caiu no abismo infinito!");
    }

    // 9. Atualização da Câmera (Suave com look-ahead)
    const targetCamX = this.player.x - 300;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    if (this.camera.x < 0) this.camera.x = 0;
    if (this.camera.x > this.level.width - this.camera.width) {
      this.camera.x = this.level.width - this.camera.width;
    }
  }

  // --------------------------------------------------------------------------
  // COLISÃO AABB DO JOGADOR COM OBJETOS SÓLIDOS E TROLL
  // --------------------------------------------------------------------------
  moveAndCollide() {
    // Passo Horizontal
    this.player.x += this.player.vx;
    let pBox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };

    for (const ent of this.entities) {
      // Ignora entidades não sólidas horizontalmente
      if (['spike', 'sign', 'text_troll', 'troll_coin', 'gravity_zone', 'illusion_floor', 'checkpoint', 'fake_flag', 'true_goal'].includes(ent.type)) {
        continue;
      }
      // Bloco invisível só tem colisão se já foi descoberto
      if (ent.type === 'invisible_block' && !ent.hit) continue;

      if (this.checkAABB(pBox, ent)) {
        if (this.player.vx > 0) {
          this.player.x = ent.x - this.player.width;
        } else if (this.player.vx < 0) {
          this.player.x = ent.x + ent.width;
        }
        this.player.vx = 0;
        pBox.x = this.player.x;
      }
    }

    // Passo Vertical
    this.player.y += this.player.vy;
    this.player.isGrounded = false;
    pBox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };

    for (const ent of this.entities) {
      // Entidades sem colisão sólida
      if (['spike', 'sign', 'text_troll', 'troll_coin', 'gravity_zone', 'illusion_floor', 'checkpoint', 'fake_flag', 'true_goal'].includes(ent.type)) {
        continue;
      }

      // Bloco invisível: se o jogador vier de BAIXO (cabeçada), bate nele e descobre!
      if (ent.type === 'invisible_block') {
        if (!ent.hit && !this.isGravityInverted && this.player.vy < 0 && this.checkAABB(pBox, ent)) {
          // Bateu a cabeça no bloco invisível clássico de Cat Mario!
          ent.hit = true;
          this.player.y = ent.y + (ent.height || ent.width);
          this.player.vy = 2; // derruba o jogador imediatamente para baixo!
          AudioSys.playBump();
          if (ent.isSecretPath) {
            this.spawnFloatingText("CAMINHO SECRETO! 🪜", ent.x - 20, ent.y - 20, '#00f5d4');
          } else {
            AudioSys.playTrollLaugh();
            this.spawnFloatingText("TROUXA! 😂", ent.x, ent.y - 20, '#ff2a5f');
          }
          return;
        }

        // Se for do caminho secreto e o jogador pular por CIMA, também descobre e aterrissa!
        if (!ent.hit && ent.isSecretPath && !this.isGravityInverted && this.player.vy > 0 && this.checkAABB(pBox, ent)) {
          ent.hit = true;
          this.player.y = ent.y - this.player.height;
          this.player.vy = 0;
          this.player.isGrounded = true;
          AudioSys.playBump();
          this.spawnFloatingText("DESCOBERTO! ✨", ent.x - 10, ent.y - 20, '#00f5d4');
          return;
        }

        if (!ent.hit) continue;
      }

      if (this.checkAABB(pBox, ent)) {
        if (!this.isGravityInverted) {
          // Caindo no chão / plataforma
          if (this.player.vy > 0) {
            this.player.y = ent.y - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;

            // Se for plataforma falsa que cai
            if (ent.type === 'falling_platform') {
              if (!ent.triggered) {
                ent.triggered = true;
                ent.crumbleTimer = 18; // ~0.3s a 60fps
                AudioSys.playTrapTrigger();
                this.spawnFloatingText("Tremendo...", ent.x, ent.y - 15, '#ffd166');
              }
            }
          }
          // Batendo a cabeça por baixo
          else if (this.player.vy < 0) {
            this.player.y = ent.y + ent.height;
            this.player.vy = 0;
            this.handleBlockBump(ent);
          }
        } else {
          // Gravidade invertida: o "chão" é o teto!
          if (this.player.vy < 0) {
            this.player.y = ent.y + ent.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
          } else if (this.player.vy > 0) {
            this.player.y = ent.y - this.player.height;
            this.player.vy = 0;
            this.handleBlockBump(ent);
          }
        }
        pBox.y = this.player.y;
      }
    }
  }

  // --------------------------------------------------------------------------
  // BATIDA EM BLOCOS '?' TRAIÇOEIROS
  // --------------------------------------------------------------------------
  handleBlockBump(ent) {
    if (ent.type !== 'question_block' || ent.used) {
      AudioSys.playBump();
      return;
    }

    ent.used = true;
    AudioSys.playBump();

    // Reações troll baseadas na ação do bloco:
    switch (ent.action) {
      case 'spike_drop':
        // Espinho pontiagudo despenca direto na cabeça do jogador!
        AudioSys.playTrapTrigger();
        this.spawnFloatingText("SURPRESA! ⚡", ent.x - 10, ent.y - 20, '#ff2a5f');
        this.activeProjectiles.push({
          x: ent.x + 8,
          y: ent.y - 25,
          width: 20,
          height: 20,
          vx: 0,
          vy: 8,
          type: 'falling_spike'
        });
        break;

      case 'crush_down':
        // O próprio bloco desmorona em cima do jogador!
        AudioSys.playTrapTrigger();
        this.spawnFloatingText("ESMAGADO! 💥", ent.x - 10, ent.y - 20, '#ff2a5f');
        ent.isFalling = true;
        ent.vy = 7;
        break;

      case 'teleport_start':
        // Teleporta o jogador de volta ao início com som de risada
        AudioSys.playTeleport();
        AudioSys.playTrollLaugh();
        this.spawnFloatingText("VOLTOU PRO INÍCIO! 😂", this.player.x - 20, this.player.y - 20, '#00f5d4');
        setTimeout(() => {
          this.player.x = this.level.spawnX;
          this.player.y = this.level.spawnY;
          this.player.vx = 0;
          this.player.vy = 0;
        }, 150);
        break;

      case 'coin_explode':
        // Solta uma moeda que explode 0.5s depois
        AudioSys.playTrapTrigger();
        this.spawnFloatingText("CUIDADO! 💣", ent.x - 10, ent.y - 20, '#ff2a5f');
        this.activeProjectiles.push({
          x: ent.x + 8,
          y: ent.y - 30,
          width: 20,
          height: 20,
          vx: 0,
          vy: -2,
          timer: 30,
          type: 'troll_bomb'
        });
        break;
    }
  }

  // --------------------------------------------------------------------------
  // ATUALIZAÇÃO DE ENTIDADES (INIMIGOS INVERTIDOS, PLATAFORMAS FALSAS, CANOS)
  // --------------------------------------------------------------------------
  updateEntities() {
    const pBox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };

    // 0. Verificação de Zona Anti-Gravidade (Inverte dentro, volta ao normal imediatamente ao sair)
    let inGravityZone = false;
    for (const ent of this.entities) {
      if (ent.type === 'gravity_zone' && this.checkAABB(pBox, ent)) {
        inGravityZone = true;
        break;
      }
    }

    if (inGravityZone) {
      if (!this.isGravityInverted) {
        this.isGravityInverted = true;
        AudioSys.playTrapTrigger();
        this.screenShake = 8;
        this.spawnFloatingText("GRAVIDADE INVERTIDA! 🌀", this.player.x - 20, this.player.y - 20, '#ff2a5f');
      }
    } else {
      if (this.isGravityInverted) {
        this.isGravityInverted = false;
        this.player.isGrounded = false;
        this.player.vy = 2; // começa a cair para baixo
        AudioSys.playBump();
        this.spawnFloatingText("Gravidade Normal! ⬇️", this.player.x - 20, this.player.y - 20, '#00f5d4');
      }
    }

    for (let i = 0; i < this.entities.length; i++) {
      const ent = this.entities[i];

      // Ignora processamento duplicado da zona de gravidade
      if (ent.type === 'gravity_zone') {
        continue;
      }
      // Pular na cabeça NÃO mata o inimigo! Se você pular nele ou chegar perto,
      // ele pula agressivamente na sua direção APENAS UMA VEZ!
      if (ent.type === 'inverted_enemy') {
        if (ent.baseY === undefined) {
          ent.baseY = ent.y;
        }

        ent.x += ent.vx;
        if (ent.x <= ent.patrolLeft || ent.x + ent.width >= ent.patrolRight) {
          ent.vx = -ent.vx;
        }

        // Se o jogador estiver acima do inimigo tentando pular nele:
        // O inimigo salta para cima e intercepta o jogador (apenas UMA única vez)!
        const dx = (this.player.x + this.player.width / 2) - (ent.x + ent.width / 2);
        const dy = ent.y - (this.player.y + this.player.height);
        if (!ent.hasJumpedOnce && Math.abs(dx) < 45 && dy > 0 && dy < 95) {
          ent.hasJumpedOnce = true;
          ent.isJumping = true;
          ent.vy = -9;
          AudioSys.playTrapTrigger();
          this.spawnFloatingText("PEGUEI VOCÊ! 😈", ent.x - 10, ent.y - 20, '#ff2a5f');
        }

        if (ent.isJumping) {
          ent.y += ent.vy;
          ent.vy += 0.5; // gravidade
          if (ent.y >= ent.baseY) {
            ent.y = ent.baseY;
            ent.vy = 0;
            ent.isJumping = false; // Pousou e NÃO pula mais!
          }
        }

        // Colisão com jogador
        if (this.checkAABB(pBox, ent)) {
          this.killPlayer("Inimigo invertido: quem pula em você é ELE!");
          return;
        }
      }

      // 2. Plataforma que desmorona (Falling Platform)
      if (ent.type === 'falling_platform') {
        if (ent.triggered) {
          if (ent.crumbleTimer > 0) {
            ent.crumbleTimer--;
            // Efeito visual de tremer antes de despencar
            ent.shakeOffsetX = (Math.random() - 0.5) * 4;
          } else {
            // Cai em alta velocidade no abismo
            ent.y += 9;
            ent.shakeOffsetX = 0;
          }
        }
      }

      // 3. Bloco esmagador em queda
      if (ent.type === 'question_block' && ent.isFalling) {
        ent.y += ent.vy;
        if (this.checkAABB(pBox, ent)) {
          this.killPlayer("Esmagado pelo bloco que você mesmo bateu!");
          return;
        }
      }

      // 4. Espinho mortal
      if (ent.type === 'spike') {
        // Reduz levemente a hitbox do espinho para ser justo com pixels visuais
        const spikeBox = {
          x: ent.x + 4,
          y: ent.upsideDown ? ent.y : ent.y + 6,
          width: ent.width - 8,
          height: ent.height - 6
        };
        if (this.checkAABB(pBox, spikeBox)) {
          this.killPlayer("Espinho pontiagudo e impiedoso!");
          return;
        }
      }

      // 5. Moeda Troll Explosiva
      if (ent.type === 'troll_coin' && !ent.collected) {
        if (this.checkAABB(pBox, ent)) {
          ent.collected = true;
          AudioSys.playExplosion();
          AudioSys.playTrollLaugh();
          this.killPlayer("A moeda de ouro era dinamite disfarçada!");
          return;
        }
      }

      // 6. Cano de Sucção Reversa
      if (ent.type === 'suction_pipe') {
        const pCenterX = this.player.x + this.player.width / 2;

        // Área de sucção: na frente do cano (até 220px à esquerda) e na altura dele
        const inSuctionArea = (
          pCenterX >= ent.x - 220 &&
          pCenterX <= ent.x + ent.width + 20 &&
          this.player.y + this.player.height >= ent.y - 60 &&
          this.player.y <= ent.y + ent.height
        );

        if (inSuctionArea) {
          // Puxa ativamente o jogador para trás em direção aos espinhos!
          // Aplicação direta no x para não ser cancelada pelo teclado
          const pullForce = 4.3;
          this.player.x -= pullForce;

          // Partículas visuais de vento correndo em alta velocidade para dentro do cano
          for (let p = 0; p < 2; p++) {
            this.particles.push({
              x: ent.x - Math.random() * 180,
              y: ent.y + 6 + Math.random() * 32,
              vx: 6 + Math.random() * 4,
              vy: (Math.random() - 0.5) * 1.5,
              size: Math.random() * 3 + 2,
              color: 'rgba(255, 255, 255, 0.7)',
              life: 16
            });
          }
        }

        // Se o jogador estiver em cima do cano e apertar BAIXO (S ou Seta Baixo):
        const standingOnPipe = (
          this.player.isGrounded &&
          pCenterX >= ent.x &&
          pCenterX <= ent.x + ent.width &&
          Math.abs((this.player.y + this.player.height) - ent.y) < 6
        );

        if (standingOnPipe && this.keys.down) {
          AudioSys.playTrapTrigger();
          AudioSys.playTrollLaugh();
          this.screenShake = 12;
          this.spawnFloatingText("CANO DE SENTIDO ÚNICO! 🌀", ent.x - 60, ent.y - 30, '#ff2a5f');
          // Dispara o jogador violentamente de volta para trás nos espinhos!
          this.player.vx = -14;
          this.player.vy = -7;
          this.player.isGrounded = false;
        }
      }

      // 8. Checkpoint
      if (ent.type === 'checkpoint' && !ent.reached) {
        if (this.checkAABB(pBox, ent)) {
          ent.reached = true;
          this.checkpoint = {
            levelIndex: this.currentLevelIndex,
            x: ent.x,
            y: ent.y
          };
          AudioSys.playBump();
          this.dom.checkpointBadge.style.display = 'flex';
          this.spawnFloatingText("CHECKPOINT SALVO!", ent.x - 10, ent.y - 20, '#00f5d4');
        }
      }

      // 9. BANDEIRA FALSA! (O ápice do troll)
      if (ent.type === 'fake_flag' && !ent.triggered) {
        if (this.checkAABB(pBox, ent)) {
          ent.triggered = true;
          AudioSys.playTrapTrigger();
          AudioSys.playTrollLaugh();

          // Abre um buraco com espinhos exatamente sob os pés do jogador!
          this.spawnFloatingText("ACHOU QUE TINHA VENCIDO? KKKK 😈", ent.x - 80, ent.y - 30, '#ff2a5f');
          this.screenShake = 12;

          // Cria espinho e remove chão
          this.entities.push({
            type: 'spike',
            x: ent.x - 50,
            y: 450,
            width: 120,
            height: 30
          });

          // Derruba o jogador
          setTimeout(() => {
            this.killPlayer("Bandeira falsa! Dica: Pule antes da bandeira para achar a escada secreta!");
          }, 350);
          return;
        }
      }

      // 10. SAÍDA REAL (True Goal)
      if (ent.type === 'true_goal') {
        if (this.checkAABB(pBox, ent)) {
          this.levelClear();
          return;
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // ATUALIZAÇÃO DE PROJÉTEIS E ARMADILHAS ATIVAS
  // --------------------------------------------------------------------------
  updateProjectiles() {
    const pBox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };

    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      const proj = this.activeProjectiles[i];

      if (proj.type === 'falling_spike') {
        proj.y += proj.vy;
        if (this.checkAABB(pBox, proj)) {
          this.killPlayer("Espinho caiu direto do bloco '?' na sua cabeça!");
          this.activeProjectiles.splice(i, 1);
          continue;
        }
        if (proj.y > this.level.height + 50) {
          this.activeProjectiles.splice(i, 1);
        }
      } else if (proj.type === 'troll_bomb') {
        proj.timer--;
        proj.y += proj.vy;
        if (proj.timer <= 0) {
          AudioSys.playExplosion();
          this.screenShake = 14;
          // Se o jogador estiver perto da explosão:
          const dist = Math.hypot(
            (this.player.x + this.player.width / 2) - proj.x,
            (this.player.y + this.player.height / 2) - proj.y
          );
          if (dist < 80) {
            this.killPlayer("Bomba surpresa liberada pelo bloco!");
          }
          this.activeProjectiles.splice(i, 1);
        }
      }
    }
  }

  // Verificação de Interseção AABB Simples
  checkAABB(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  // Spawna texto flutuante cômico
  spawnFloatingText(text, x, y, color = '#ffffff') {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.2,
      color: color,
      life: 75
    });
  }

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO GRÁFICA NO CANVAS
  // --------------------------------------------------------------------------
  render() {
    this.ctx.save();

    // Screen Shake
    if (this.screenShake > 0.5) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(shakeX, shakeY);
    }

    // 1. Fundo com Gradiente Parallax e Nuvens Retrô
    this.renderBackground();

    // Translação de Câmera
    this.ctx.translate(-Math.floor(this.camera.x), 0);

    // 2. Renderização de Cenário e Entidades
    this.renderEntities();

    // 3. Renderização de Projéteis
    this.renderProjectiles();

    // 4. Renderização do Jogador
    this.renderPlayer();

    // 5. Renderização de Partículas
    this.renderParticles();

    // 6. Textos Flutuantes
    this.renderFloatingTexts();

    this.ctx.restore();
  }

  // Render do Céu, Montanhas e Nuvens Parallax
  renderBackground() {
    const bgTop = this.level ? this.level.bgColorTop : "#3a86ff";
    const bgBot = this.level ? this.level.bgColorBottom : "#a0c4ff";

    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    skyGrad.addColorStop(0, bgTop);
    skyGrad.addColorStop(1, bgBot);
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Montanhas Parallax
    this.ctx.save();
    const hillParallax = this.camera.x * 0.25;
    this.ctx.fillStyle = "rgba(46, 125, 50, 0.45)";
    for (let x = -200; x < this.canvas.width + 400; x += 320) {
      const hillX = x - (hillParallax % 320);
      this.ctx.beginPath();
      this.ctx.arc(hillX, 480, 160, Math.PI, 0);
      this.ctx.fill();
    }

    // Nuvens Retrô 8-bit flutuando
    const cloudParallax = this.camera.x * 0.15;
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let x = -100; x < this.canvas.width + 300; x += 240) {
      const cx = x - (cloudParallax % 240);
      this.drawRetroCloud(cx, 80);
      this.drawRetroCloud(cx + 110, 130, 0.7);
    }
    this.ctx.restore();
  }

  drawRetroCloud(x, y, scale = 1) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    this.ctx.fillRect(10, 10, 60, 20);
    this.ctx.fillRect(20, 0, 40, 30);
    this.ctx.fillRect(0, 15, 80, 15);
    this.ctx.restore();
  }

  // Renderiza todas as entidades do mundo
  renderEntities() {
    for (const ent of this.entities) {
      // Otimização: Não desenha o que está fora da visão da câmera
      if (ent.x + (ent.width || 0) < this.camera.x - 50 || ent.x > this.camera.x + this.camera.width + 50) {
        continue;
      }

      switch (ent.type) {
        case 'ground':
        case 'illusion_floor':
          // Ambos são desenhados de forma IDENTICA!
          // Essa é a essência do troll: o chão ilusório é indistinguível visualmente!
          this.drawGroundBlock(ent);
          break;

        case 'platform':
          this.drawPlatform(ent, '#8d5b4c', '#5c382c');
          break;

        case 'falling_platform':
          this.ctx.save();
          const ox = ent.shakeOffsetX || 0;
          this.ctx.translate(ox, 0);
          this.drawPlatform(ent, '#d4a373', '#a9714b');
          // Rachaduras se já foi acionada
          if (ent.triggered) {
            this.ctx.strokeStyle = '#3d2010';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(ent.x + 10, ent.y + 4);
            this.ctx.lineTo(ent.x + 25, ent.y + 16);
            this.ctx.lineTo(ent.x + 45, ent.y + 8);
            this.ctx.stroke();
          }
          this.ctx.restore();
          break;

        case 'invisible_block':
          // Só desenha se tiver sido atingido!
          if (ent.hit) {
            this.drawLaughingTrollBlock(ent);
          }
          break;

        case 'question_block':
          this.drawQuestionBlock(ent);
          break;

        case 'spike':
          this.drawSpikes(ent);
          break;

        case 'inverted_enemy':
          this.drawInvertedEnemy(ent);
          break;

        case 'sign':
          this.drawSign(ent);
          break;

        case 'troll_coin':
          if (!ent.collected) {
            this.drawCoin(ent);
          }
          break;

        case 'suction_pipe':
          this.drawPipe(ent);
          break;

        case 'gravity_zone':
          this.drawGravityZone(ent);
          break;

        case 'checkpoint':
          this.drawCheckpoint(ent);
          break;

        case 'fake_flag':
          this.drawFlag(ent, true);
          break;

        case 'true_goal':
          this.drawFlag(ent, false);
          break;

        case 'text_troll':
          this.ctx.font = '10px "Press Start 2P", monospace';
          this.ctx.fillStyle = '#ff2a5f';
          this.ctx.fillText(ent.text, ent.x, ent.y);
          break;
      }
    }
  }

  // Chão estilo Mario (Grama verde no topo, terra marrom quadriculada embaixo)
  drawGroundBlock(ent) {
    const x = ent.x;
    const y = ent.y;
    const w = ent.width;
    const h = ent.height;

    // Terra marrom
    this.ctx.fillStyle = '#78472a';
    this.ctx.fillRect(x, y, w, h);

    // Grama superior
    this.ctx.fillStyle = '#38b000';
    this.ctx.fillRect(x, y, w, 12);

    // Borda escura da grama
    this.ctx.fillStyle = '#208b00';
    this.ctx.fillRect(x, y + 10, w, 3);

    // Padrão de tijolo / pedrinhas na terra
    this.ctx.fillStyle = '#5c351f';
    for (let px = x + 8; px < x + w - 8; px += 24) {
      for (let py = y + 20; py < y + h - 10; py += 20) {
        this.ctx.fillRect(px, py, 12, 8);
      }
    }
  }

  drawPlatform(ent, color1, color2) {
    this.ctx.fillStyle = color1;
    this.ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
    this.ctx.fillStyle = color2;
    this.ctx.fillRect(ent.x, ent.y + ent.height - 4, ent.width, 4);
    this.ctx.fillRect(ent.x, ent.y, ent.width, 3);
  }

  // Bloco '?' clássico e animado
  drawQuestionBlock(ent) {
    const x = ent.x;
    const y = ent.y;
    const s = ent.width;

    if (ent.used) {
      // Bloco marrom usado / desativado
      this.ctx.fillStyle = '#8b5a2b';
      this.ctx.fillRect(x, y, s, s);
      this.ctx.fillStyle = '#5c3818';
      this.ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
    } else {
      // Bloco dourado brilhante com '?'
      const pulse = Math.sin(Date.now() * 0.005) * 15;
      this.ctx.fillStyle = '#fca311';
      this.ctx.fillRect(x, y, s, s);

      this.ctx.fillStyle = '#ffe49e';
      this.ctx.fillRect(x + 2, y + 2, s - 4, 3);
      this.ctx.fillRect(x + 2, y + 2, 3, s - 4);

      this.ctx.fillStyle = '#b16a00';
      this.ctx.fillRect(x + 2, y + s - 4, s - 4, 3);
      this.ctx.fillRect(x + s - 4, y + 2, 3, s - 4);

      // Ponto de interrogação piscando
      this.ctx.font = 'bold 16px "Press Start 2P", monospace';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('?', x + s / 2, y + s / 2 + 6);
      this.ctx.textAlign = 'left';
    }
  }

  // Bloco Invisível Descoberto (Rosto de Troll rindo ou Bloco de Caminho Secreto)
  drawLaughingTrollBlock(ent) {
    const x = ent.x;
    const y = ent.y;
    const s = ent.width;
    const h = ent.height || s;

    if (ent.isSecretPath) {
      // Bloco do caminho secreto revelado (estilo brilhante neon com estrela dourada)
      this.ctx.fillStyle = '#00f5d4';
      this.ctx.fillRect(x, y, s, h);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, s, h);

      this.ctx.fillStyle = '#0a0e17';
      this.ctx.font = 'bold 12px "Press Start 2P", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('★', x + s / 2, y + h / 2 + 5);
      this.ctx.textAlign = 'left';
    } else {
      this.ctx.fillStyle = '#e63946';
      this.ctx.fillRect(x, y, s, h);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '10px "Press Start 2P", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('XD', x + s / 2, y + h / 2 + 4);
      this.ctx.textAlign = 'left';
    }
  }

  // Espinhos triangulares
  drawSpikes(ent) {
    this.ctx.fillStyle = '#ced4da';
    const spikeWidth = 14;
    const count = Math.ceil(ent.width / spikeWidth);

    for (let i = 0; i < count; i++) {
      const sx = ent.x + i * spikeWidth;
      this.ctx.beginPath();
      if (!ent.upsideDown) {
        this.ctx.moveTo(sx, ent.y + ent.height);
        this.ctx.lineTo(sx + spikeWidth / 2, ent.y);
        this.ctx.lineTo(sx + spikeWidth, ent.y + ent.height);
      } else {
        this.ctx.moveTo(sx, ent.y);
        this.ctx.lineTo(sx + spikeWidth / 2, ent.y + ent.height);
        this.ctx.lineTo(sx + spikeWidth, ent.y);
      }
      this.ctx.closePath();
      this.ctx.fill();

      // Linha de contorno escura
      this.ctx.strokeStyle = '#495057';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  // Inimigo Invertido (Troll Shroom / Goomba do Mal)
  drawInvertedEnemy(ent) {
    const x = ent.x;
    const y = ent.y;
    const w = ent.width;
    const h = ent.height;

    // Cabeça de cogumelo roxo/vermelho malvado
    this.ctx.fillStyle = '#d90429';
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + 14, 14, Math.PI, 0);
    this.ctx.fill();

    // Corpo
    this.ctx.fillStyle = '#ffb703';
    this.ctx.fillRect(x + 4, y + 14, w - 8, h - 18);

    // Olhos maliciosos oblíquos (troll expression)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(x + 6, y + 8, 5, 6);
    this.ctx.fillRect(x + w - 11, y + 8, 5, 6);

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(x + 8, y + 10, 3, 4);
    this.ctx.fillRect(x + w - 9, y + 10, 3, 4);

    // Sorriso maquiavélico
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + 18, 5, 0, Math.PI);
    this.ctx.stroke();

    // Pés animados
    this.ctx.fillStyle = '#2b2d42';
    const footOffset = Math.sin(Date.now() * 0.01) * 3;
    this.ctx.fillRect(x + 2 + footOffset, y + h - 5, 9, 5);
    this.ctx.fillRect(x + w - 11 - footOffset, y + h - 5, 9, 5);
  }

  // Placas de aviso
  drawSign(ent) {
    // Haste de madeira
    this.ctx.fillStyle = '#8b5a2b';
    this.ctx.fillRect(ent.x + 16, ent.y + 20, 8, ent.height - 20);

    // Placa
    this.ctx.fillStyle = '#d4a373';
    this.ctx.fillRect(ent.x, ent.y, ent.width, 24);
    this.ctx.strokeStyle = '#5c3818';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(ent.x, ent.y, ent.width, 24);

    // Ponto de exclamação
    this.ctx.fillStyle = '#d90429';
    this.ctx.font = 'bold 12px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('!', ent.x + ent.width / 2, ent.y + 16);
    this.ctx.textAlign = 'left';
  }

  // Moeda giratória
  drawCoin(ent) {
    const cx = ent.x + ent.width / 2;
    const cy = ent.y + ent.height / 2;
    const widthScale = Math.abs(Math.sin(Date.now() * 0.006));

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.scale(Math.max(widthScale, 0.2), 1);
    this.ctx.fillStyle = '#ffb703';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#fb8500';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  // Canos verdes clássicos (com efeito de sucção)
  drawPipe(ent) {
    const x = ent.x;
    const y = ent.y;
    const w = ent.width;
    const h = ent.height;

    // Corpo do cano
    const grad = this.ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#1b4332');
    grad.addColorStop(0.3, '#40916c');
    grad.addColorStop(0.8, '#52b788');
    grad.addColorStop(1, '#081c15');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(x + 4, y + 16, w - 8, h - 16);

    // Bocal do cano
    this.ctx.fillRect(x, y, w, 16);
    this.ctx.strokeStyle = '#081c15';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, 16);

    // Abertura escura no topo do bocal
    this.ctx.fillStyle = '#081c15';
    this.ctx.fillRect(x + 4, y + 2, w - 8, 4);

    // Ondas dinâmicas de vento sendo sugadas para dentro do bocal
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 2;
    const offset = (Date.now() * 0.12) % 36;
    for (let wx = x - 130 + offset; wx < x - 10; wx += 36) {
      this.ctx.beginPath();
      this.ctx.moveTo(wx, y + 2);
      this.ctx.lineTo(wx + 14, y + 8);
      this.ctx.lineTo(wx, y + 14);
      this.ctx.stroke();
    }

    // Texto de aviso no cano
    this.ctx.fillStyle = '#ff2a5f';
    this.ctx.font = 'bold 9px monospace';
    this.ctx.fillText('SUCÇÃO', x + 5, y + 36);
    this.ctx.fillText('<<<', x + 12, y + 50);
    this.ctx.restore();
  }

  // Zona de gravidade invertida (campo de energia roxa)
  drawGravityZone(ent) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(157, 78, 221, 0.22)';
    this.ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
    this.ctx.strokeStyle = '#c77dff';
    this.ctx.setLineDash([6, 6]);
    this.ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
    this.ctx.setLineDash([]);

    // Setas indicando teto
    this.ctx.fillStyle = '#c77dff';
    this.ctx.font = '14px monospace';
    for (let py = ent.y + 40; py < ent.y + ent.height; py += 50) {
      this.ctx.fillText('▲ GRAVIDADE ▲', ent.x + 20, py);
    }
    this.ctx.restore();
  }

  // Checkpoint (mastro com bandeira)
  drawCheckpoint(ent) {
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.fillRect(ent.x + 4, ent.y, 4, ent.height);

    // Bandeirinha (verde se ativada, vermelha se ainda não)
    this.ctx.fillStyle = ent.reached ? '#00f5d4' : '#ff2a5f';
    this.ctx.beginPath();
    this.ctx.moveTo(ent.x + 8, ent.y + 4);
    this.ctx.lineTo(ent.x + 26, ent.y + 14);
    this.ctx.lineTo(ent.x + 8, ent.y + 24);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Bandeira final (Falsa ou Verdadeira)
  drawFlag(ent, isFake) {
    // Mastro
    this.ctx.fillStyle = '#ced4da';
    this.ctx.fillRect(ent.x + 6, ent.y, 6, ent.height);

    // Esfera dourada no topo
    this.ctx.fillStyle = '#ffd166';
    this.ctx.beginPath();
    this.ctx.arc(ent.x + 9, ent.y, 7, 0, Math.PI * 2);
    this.ctx.fill();

    // Bandeira no mastro
    this.ctx.fillStyle = isFake ? '#ff2a5f' : '#00f5d4';
    this.ctx.beginPath();
    this.ctx.moveTo(ent.x + 12, ent.y + 10);
    this.ctx.lineTo(ent.x + 42, ent.y + 26);
    this.ctx.lineTo(ent.x + 12, ent.y + 42);
    this.ctx.closePath();
    this.ctx.fill();

    // Se for verdadeira, castelo ao fundo
    if (!isFake) {
      this.ctx.fillStyle = '#4a4e69';
      this.ctx.fillRect(ent.x + 50, ent.y + 30, 80, 110);
      this.ctx.fillStyle = '#22223b';
      // Porta do castelo
      this.ctx.fillRect(ent.x + 75, ent.y + 80, 30, 60);
      // Almenas no teto do castelo
      this.ctx.fillStyle = '#4a4e69';
      this.ctx.fillRect(ent.x + 50, ent.y + 16, 20, 14);
      this.ctx.fillRect(ent.x + 80, ent.y + 16, 20, 14);
      this.ctx.fillRect(ent.x + 110, ent.y + 16, 20, 14);
    }
  }

  // Projéteis ativos (Espinhos caindo, bombas)
  renderProjectiles() {
    for (const proj of this.activeProjectiles) {
      if (proj.type === 'falling_spike') {
        this.ctx.fillStyle = '#ced4da';
        this.ctx.beginPath();
        this.ctx.moveTo(proj.x, proj.y);
        this.ctx.lineTo(proj.x + proj.width, proj.y);
        this.ctx.lineTo(proj.x + proj.width / 2, proj.y + proj.height);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (proj.type === 'troll_bomb') {
        this.ctx.fillStyle = '#111111';
        this.ctx.beginPath();
        this.ctx.arc(proj.x + 10, proj.y + 10, 10, 0, Math.PI * 2);
        this.ctx.fill();
        // Pavio
        this.ctx.fillStyle = '#ff2a5f';
        this.ctx.fillRect(proj.x + 8, proj.y - 2, 4, 4);
      }
    }
  }

  // Render do Herói / Jogador Pixelado
  renderPlayer() {
    const p = this.player;
    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    if (this.isGravityInverted) {
      this.ctx.scale(1, -1);
      this.ctx.translate(0, -p.height);
    }

    if (p.facing === 'left') {
      this.ctx.scale(-1, 1);
      this.ctx.translate(-p.width, 0);
    }

    // Corpo / Macacão azul
    this.ctx.fillStyle = '#0077b6';
    this.ctx.fillRect(4, 16, 18, 14);

    // Camiseta vermelha estilo retrô
    this.ctx.fillStyle = '#d90429';
    this.ctx.fillRect(2, 10, 22, 8);

    // Cabeça / Rosto cor de pele
    this.ctx.fillStyle = '#ffd166';
    this.ctx.fillRect(5, 4, 16, 9);

    // Boné vermelho
    this.ctx.fillStyle = '#d90429';
    this.ctx.fillRect(4, 0, 18, 5);
    this.ctx.fillRect(12, 3, 10, 3); // Aba do boné

    // Olhos
    this.ctx.fillStyle = '#000000';
    if (this.gameState === 'DEAD') {
      // Olhos com X em caso de morte
      this.ctx.font = 'bold 8px monospace';
      this.ctx.fillText('x', 14, 10);
    } else {
      this.ctx.fillRect(15, 6, 3, 3);
    }

    // Pernas animadas ao andar
    const legSwing = Math.sin(p.walkFrame) * 4;
    this.ctx.fillStyle = '#023e8a';
    this.ctx.fillRect(5 + legSwing, 28, 6, 6);
    this.ctx.fillRect(15 - legSwing, 28, 6, 6);

    // Sapato marrom
    this.ctx.fillStyle = '#5c3d2e';
    this.ctx.fillRect(4 + legSwing, 32, 8, 3);
    this.ctx.fillRect(14 - legSwing, 32, 8, 3);

    this.ctx.restore();
  }

  // Partículas
  renderParticles() {
    for (const p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  // Textos flutuantes cômicos
  renderFloatingTexts() {
    this.ctx.save();
    for (const ft of this.floatingTexts) {
      this.ctx.font = 'bold 10px "Press Start 2P", monospace';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      this.ctx.shadowBlur = 6;
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }
    this.ctx.restore();
  }
}

// Inicializa o jogo assim que a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new TrollPlatformerGame();
});
