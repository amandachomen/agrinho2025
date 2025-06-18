let ruralHouses = [];
let cityBuildings = []; // Agora conterá prédios, mercados e lojas
let cars = [];
let manWithTractor; // Variável para o homem com o trator
let womanInFactory; // Variável para a mulher na fábrica

function setup() {
  createCanvas(800, 400); // Tela ampla para mostrar os dois lados

  // Inicializa casas rurais em uma fileira
  let ruralStartX = 50; // Posição X inicial para as casas rurais
  let ruralSpacing = 150; // Espaçamento entre as casas
  for (let i = 0; i < 3; i++) {
    let houseWidth = random(60, 80);
    let houseHeight = random(40, 60);
    let x = ruralStartX + i * ruralSpacing;
    let y = height - 50 - houseHeight; // Posiciona a base da casa no chão
    ruralHouses.push(new RuralHouse(x, y, houseWidth, houseHeight));
  }

  // Inicializa prédios, mercados e lojas urbanos em uma fileira
  let urbanStartX = width / 2 + 50; // Posição X inicial para os elementos urbanos
  let urbanSpacing = 100; // Espaçamento entre os elementos
  let urbanTypes = ['building', 'market', 'shop']; // Tipos de elementos urbanos
  for (let i = 0; i < 5; i++) {
    let type = random(urbanTypes); // Escolhe um tipo aleatoriamente
    let buildingWidth, buildingHeight;

    // Define dimensões baseadas no tipo
    if (type === 'building') {
      buildingWidth = random(40, 70);
      buildingHeight = random(80, 180);
    } else if (type === 'market') {
      buildingWidth = random(80, 120); // Mercado é mais largo
      buildingHeight = random(50, 80); // Mercado é mais baixo
    } else { // type === 'shop'
      buildingWidth = random(50, 90);
      buildingHeight = random(60, 100);
    }

    let x = urbanStartX + i * urbanSpacing;
    let y = height - 50 - buildingHeight; // Posiciona a base do elemento no chão
    cityBuildings.push(new CityBuilding(x, y, buildingWidth, buildingHeight, type));
  }

  // Inicializa carros
  for (let i = 0; i < 2; i++) {
    cars.push(new Car(random(width/2 + 10, width - 10), height - 30));
  }

  // Inicializa as novas classes de personagem
  manWithTractor = new ManWithTractor();
  womanInFactory = new WomanInFactory();
}

function draw() {
  // Cor de fundo que transiciona suavemente
  let skyColorRural = color(135, 206, 235); // Céu azul claro
  let skyColorUrban = color(70, 130, 180); // Céu azul mais escuro
  let blendFactor = map(mouseX, 0, width, 0, 1);
  let blendedSkyColor = lerpColor(skyColorRural, skyColorUrban, blendFactor);
  background(blendedSkyColor);

  // Desenha o chão
  drawGround(blendFactor);

  // Desenha os elementos do campo
  drawRuralElements(blendFactor);

  // Desenha os elementos da cidade
  drawUrbanElements(blendFactor);

  // Adiciona a "conexão" visual no centro
  drawConnectionLine(blendFactor);

  // Desenha o homem com o trator se a tecla 'A' estiver pressionada
  if (keyIsDown(65)) { // 65 é o código da tecla 'A'
    manWithTractor.display(map(blendFactor, 0, 1, 1, 0.5)); // Transição de opacidade/escala
  }

  // Desenha a mulher na fábrica se a tecla 'S' estiver pressionada
  if (keyIsDown(83)) { // 83 é o código da tecla 'S'
    womanInFactory.display(map(blendFactor, 0, 1, 0.5, 1)); // Transição de opacidade/escala
  }

  // Texto descritivo
  drawInstructions();
}

function drawGround(blendFactor) {
  noStroke();
  // Grama e rua transicionando
  let ruralGroundColor = color(100, 150, 50); // Verde grama
  let urbanGroundColor = color(80, 80, 80); // Cinza rua
  let blendedGroundColor = lerpColor(ruralGroundColor, urbanGroundColor, blendFactor);
  fill(blendedGroundColor);
  rect(0, height - 50, width, 50); // Chão base

  // Estrada de terra e rua se unindo
  fill(139, 69, 19); // Cor da estrada de terra
  beginShape();
  vertex(0, height - 40);
  bezierVertex(width/4, height - 60, width/2 - 50, height - 30, width/2, height - 30);
  vertex(width/2, height - 10);
  vertex(0, height - 10);
  endShape(CLOSE);

  fill(50, 50, 50); // Cor da rua
  beginShape();
  vertex(width, height - 40);
  bezierVertex(width * 3/4, height - 60, width/2 + 50, height - 30, width/2, height - 30);
  vertex(width/2, height - 10);
  vertex(width, height - 10);
  endShape(CLOSE);
}

function drawRuralElements(blendFactor) {
  // Desenha árvores
  for (let i = 0; i < 5; i++) {
    let treeX = map(i, 0, 4, 50, width/2 - 50);
    let treeY = height - 100 - sin(frameCount * 0.02 + i) * 10; // Balanço suave
    drawTree(treeX, treeY, map(blendFactor, 0, 1, 1, 0.5)); // Transição de opacidade/escala
  }
  // Desenha casas rurais
  for (let house of ruralHouses) {
    house.display(map(blendFactor, 0, 1, 1, 0.5));
  }
}

function drawUrbanElements(blendFactor) {
  // Desenha prédios, mercados e lojas
  for (let building of cityBuildings) {
    building.display(map(blendFactor, 0, 1, 0.5, 1)); // Transição de opacidade/escala
  }
  // Desenha carros
  for (let car of cars) {
    car.update();
    car.display(map(blendFactor, 0, 1, 0.5, 1));
  }
}

function drawTree(x, y, opacity) {
  push();
  translate(x, y);
  scale(opacity); // Árvores podem ficar mais transparentes/menores na transição
  fill(139, 69, 19); // Tronco marrom
  rect(-10, 0, 20, 50);
  fill(34, 139, 34); // Copa verde
  ellipse(0, -30, 60, 60);
  ellipse(-20, -10, 40, 40);
  ellipse(20, -10, 40, 40);
  pop();
}

class RuralHouse {
  // Construtor agora aceita largura e altura
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display(opacity) {
    push();
    translate(this.x, this.y);
    scale(opacity);
    fill(200, 150, 100); // Corpo da casa
    rect(0, 0, this.width, this.height);
    fill(150, 75, 0); // Telhado
    triangle(0, 0, this.width, 0, this.width/2, -this.height/2);
    pop();
  }
}

class CityBuilding {
  // Construtor agora aceita largura, altura e o tipo de construção
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 'building', 'market', 'shop'
  }

  display(opacity) {
    push();
    translate(this.x, this.y);
    scale(opacity);

    if (this.type === 'building') {
      fill(100, 100, 100); // Corpo do prédio
      rect(0, 0, this.width, this.height);
      // Janelas
      fill(255, 255, 100); // Amarelo para janelas
      for (let i = 0; i < this.height / 20 - 2; i++) {
        for (let j = 0; j < this.width / 20 - 1; j++) {
          rect(j * 20 + 5, i * 20 + 5, 10, 10);
        }
      }
    } else if (this.type === 'market') {
      fill(180, 150, 100); // Cor do mercado (tons de marrom/bege)
      rect(0, 0, this.width, this.height);
      // Toldo
      fill(200, 50, 50); // Vermelho para o toldo
      triangle(0, 0, this.width, 0, this.width - 20, -20);
      triangle(0, 0, 20, -20, this.width - 20, -20); // Ajuste para cobrir melhor

      // Entrada/Vitrine
      fill(220); // Cor da vitrine
      rect(this.width / 4, this.height * 0.4, this.width / 2, this.height * 0.5);
      fill(50); // Porta
      rect(this.width / 2 - 10, this.height * 0.6, 20, this.height * 0.4);
      
      // Placa "Mercado"
      fill(255);
      textSize(this.width * 0.15);
      textAlign(CENTER);
      text("MERCADO", this.width / 2, this.height * 0.25);

    } else { // type === 'shop'
      fill(random(150, 250), random(150, 250), random(150, 250)); // Cores variadas para lojas
      rect(0, 0, this.width, this.height);
      // Vitrine grande
      fill(220, 240, 255); // Azul claro para a vitrine
      rect(this.width * 0.1, this.height * 0.2, this.width * 0.8, this.height * 0.6);
      // Porta
      fill(50);
      rect(this.width * 0.4, this.height * 0.8, this.width * 0.2, this.height * 0.2);
    }
    pop();
  }
}

class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 3);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.x -= this.speed;
    if (this.x < width/2 + 10) { // Limita o movimento à área urbana
      this.x = width - 10;
    }
  }

  display(opacity) {
    push();
    translate(this.x, this.y);
    scale(opacity);
    fill(this.color);
    rect(0, 0, 40, 20); // Corpo do carro
    fill(50);
    ellipse(10, 20, 10, 10); // Rodas
    ellipse(30, 20, 10, 10);
    pop();
  }
}

function drawConnectionLine(blendFactor) {
  // Uma linha sutil ou gradiente no meio que reforça a união
  let lineColorRural = color(150, 200, 100, 100); // Verde suave e transparente
  let lineColorUrban = color(100, 100, 150, 100); // Azul suave e transparente
  let blendedLineColor = lerpColor(lineColorRural, lineColorUrban, blendFactor);
  noFill();
  stroke(blendedLineColor);
  strokeWeight(5);
  line(width/2, 0, width/2, height);
}

function drawInstructions() {
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  text("Mova o mouse para transitar entre Campo e Cidade!", width/2, 20);
  text("Pressione 'A' para ver um homem com seu trator.", width/4, 40);
  text("Pressione 'S' para ver uma mulher trabalhando na fábrica.", width * 3/4, 40);
}

class ManWithTractor {
  constructor() {
    this.x = width / 4; // Posição fixa no lado rural para alinhar com a fileira de casas
    this.y = height - 70;
  }

  display(opacity) {
    push();
    translate(this.x, this.y);
    scale(opacity);

    // Corpo do Trator
    fill(200, 50, 50); // Vermelho para o trator
    rect(0, 0, 80, 30); // Base do trator
    rect(20, -20, 30, 20); // Cabine

    // Rodas do Trator
    fill(50); // Cor das rodas
    ellipse(15, 30, 25, 25); // Roda dianteira
    ellipse(65, 30, 35, 35); // Roda traseira

    // Homem no Trator
    fill(0); // Cor do corpo do homem
    rect(30, -30, 15, 25); // Corpo
    fill(255, 200, 150); // Cor da pele
    ellipse(37.5, -35, 15, 15); // Cabeça

    // Implemento de plantio (simples)
    fill(100, 100, 100);
    rect(80, 10, 20, 10); // Implemento atrás do trator
    fill(0, 150, 0);
    rect(85, 20, 10, 5); // Pequena planta

    pop();
  }
}

class WomanInFactory {
  constructor() {
    this.x = width * 3 / 4; // Posição fixa no lado urbano para alinhar com a fileira de prédios
    this.y = height - 100;
  }

  display(opacity) {
    push();
    translate(this.x, this.y);
    scale(opacity);

    // Fábrica (simples)
    fill(120, 120, 120); // Cinza para a fábrica
    rect(0, 0, 120, 80); // Corpo principal da fábrica
    fill(80, 80, 80);
    rect(20, -20, 20, 20); // Chaminé
    rect(80, -20, 20, 20); // Outra chaminé
    fill(255, 255, 100); // Janelas da fábrica
    rect(10, 10, 20, 20);
    rect(40, 10, 20, 20);
    rect(70, 10, 20, 20);

    // Mulher
    fill(0); // Cor do corpo da mulher
    rect(50, 40, 15, 30); // Corpo
    fill(255, 200, 150); // Cor da pele
    ellipse(57.5, 35, 15, 15); // Cabeça
    fill(100, 0, 100); // Detalhe de roupa ou avental
    rect(50, 50, 15, 10);

    // Máquina ou bancada de trabalho (simples)
    fill(150, 150, 150);
    rect(30, 70, 60, 10); // Bancada
    fill(180, 180, 180);
    rect(40, 60, 40, 10); // Parte da máquina

    pop();
  }
}
