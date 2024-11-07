// Variáveis globais
let score = 0; //pontuação inicial
let target;
let soundAlvo;
let soundErro;
let mic;
let flechasRestantes = 10; //número inicial de flechas
let penalizacao = 2;
let currentScreen = 0; // 0: Ecrã inicial, 1: Ecrã de jogo, 2: Ecrã de reinício
let textSizeOriginal = 24;
let textAlignOriginal;
let volumeLimite = 0.5; 
let lastShotTime = 0; // tempo atual do último tiro
let cooldown = 1000;
let hits = [];// guarda a pontuação
let alvoTimeout = 3000; // 3 segundos
let lastAlvoTime = 0; // tempo do ultimo alvo
let arcoImg; // imagem do cursor
let fundoInicial; // Imagem de fundo para o ecrã inicial


function preload() {
  soundAlvo = loadSound("assets/seta2.mp3"); // som quando se acerta o alvo
  soundErro = loadSound("assets/erro.mp3"); // som quando se falha o alvo
  arcoImg = loadImage("assets/arco.png"); // arco para o rato
  fundoInicial = loadImage("assets/OLIMPIADA.gif"); // imagem de fundo para o ecrã inicial
  imagemVencedor = loadImage("assets/vencedor.gif"); //imagem de fundo para o ecrã de reinicio
  imagemPerdedor = loadImage("assets/perdedor.gif");//imagem de fundo para o ecrã de reinicio
  
}

function setup() {
  createCanvas(1036, 518);
  textSizeOriginal = 24;
  textAlignOriginal = LEFT;
  textSize(textSizeOriginal);
  textAlign(textAlignOriginal);
  textFont('Arial');
  mic = new p5.AudioIn();
  mic.start();
 
}

function draw() {
  if (currentScreen === 0) {
    // Ecrã inicial
    image(fundoInicial, 0, 0, 1030, 518); // Exibe a imagem de fundo

    // Verifica se o botão de início foi clicado
    if (keyIsPressed && key === 'Enter') {
      currentScreen = 1; // Muda para o ecrã de jogo
      cursor(); // Mostra o cursor padrão
      newTarget(); // Inicia o jogo criando um novo alvo
    }
  } else if (currentScreen === 1) {
    // Ecrã de jogo
    background(135, 206, 250);

    let volume = mic.getLevel();
    let currentTime = millis();
    getAudioContext().resume(); // Inicia o contexto de áudio se não estiver em execução

    let y = map(volume, 0, 1, height, 0);
    let yLimite = map(volumeLimite, 0, 1, height, 0);
    noStroke();
    fill(250);
    rect(10, 100, 30, height);
    fill(0);
    rect(10, y, 30, y);
    stroke(0);
    line(10, yLimite, 30, yLimite);

    target.display();

    let timeSinceLastAlvo = currentTime - lastAlvoTime;

    // Verifica se é hora de criar um novo alvo
    if (timeSinceLastAlvo >= alvoTimeout) {
      newTarget();
    }

    // Mostra a pontuação no canto superior esquerdo
    textSize(textSizeOriginal);
    textAlign(textAlignOriginal);
    fill(0);
    text("Pontuação: " + score, 20, 30);

    // Mostra o número de flechas restantes no canto superior direito
    text("Flechas Restantes: " + flechasRestantes, width - 260, 30);

    // Texto no canto inferior direito
    textSize(16);
    text("Patrícia Pereira, 22304, ECGM", width - 250, height - 20);

    /**
     *  Verifica se o volume atual do microfone é maior que o limite de volume 
     * e se o tempo passado desde o último disparo é maior que o tempo de recarga.
     */
    if (volume > volumeLimite && currentTime - lastShotTime >= cooldown) {
        // Verifica se o cursor do mouse colide com o alvo.
      if (target.checkCollision(mouseX, mouseY)) {
       // Calcula os pontos obtidos com base na posição do cursor em relação ao alvo.
        let points = target.getPoints(mouseX, mouseY);
        // Incrementa a pontuação do jogador com os pontos obtidos.
        score += points;
        // Regista o hit (tiro bem-sucedido) atual, armazenando a posição e o tempo do hit.
        hits.push({ x: mouseX, y: mouseY, timer: millis() });
        soundAlvo.play(); // Toca o som de acerto no alvo.
      } else {
        score -= penalizacao; // Penaliza o jogador, subtraindo a penalização da pontuação.
        soundErro.play(); // Toca o som de erro (tiro falhado).
      }
      flechasRestantes--;  // Decrementa o número de flechas restantes.
      lastShotTime = currentTime;    // Atualiza o tempo do último disparo para o tempo atual.
    }

    // Remove hits que passaram 2 segundos
    for (let i = hits.length - 1; i >= 0; i--) {
      if (currentTime - hits[i].timer >= 2000) {
        hits.splice(i, 1);
      }
    }

    // Desenha os tiros no alvo
    fill(0);
    for (let hit of hits) {
      ellipse(hit.x, hit.y, 10, 10);
    }

    if (flechasRestantes <= 0 || score < 0) {
      currentScreen = 2;
    }

    // Substitui o cursor pelo arco
    cursor('none');
    image(arcoImg, mouseX - 50, mouseY - 50, 100, 100); // O arco é centralizado no cursor

  } else if (currentScreen === 2) {
    // Ecrã de reinício
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);

    if (score > 0) {
      // Caso a pontuação seja maior que 0
      image(imagemVencedor, 0,0, width, height);
      text("Pontuação: " + score, width/2, height/2 + 40)
      
    } else {
      // Caso a pontuação seja menor ou igual a 0
      image(imagemPerdedor,  0,0, width, height);
      text("Pontuação: 0", width/2, height/2 + 40)
      
    }

    //esvazia o array
    hits = [];
  }
}

function touchStarted() {

  // Verifica se o ecrã atual é a de reinício
  if (currentScreen === 2) {
    // Redefine a pontuação, flechas restantes e muda para o ecrã de jogo
    score = 0;
    flechasRestantes = 10;
    currentScreen = 1;
    redraw(); // Redesenha o ecrã para atualizar as alterações
  }
}


function newTarget() {
  // Gera coordenadas x e y aleatórias dentro das áreas específicas
  let x = random(200, 700);
  let y = random(200, 400);
  
  // Cria um novo objeto 'Alvo' com as coordenadas geradas
  target = new Alvo(x, y);
  
  // Regista o tempo atual (em milissegundos) para controlar o intervalo desde o último alvo
  lastAlvoTime = millis();
}

