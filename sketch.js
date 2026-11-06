
let batmanX = 200;
let items = [];
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
let spawnTimer = 0;
let invincible = 0;

function setup() {
  createCanvas(400, 500);
  textFont("Arial");
  resetGame();
}

function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  items = [];
  spawnTimer = 0;
  invincible = 0;
  gameOver = false;
  batmanX = 200;
}

function draw() {
  background(8, 12, 30);
  drawCity();

  if (gameOver) {
    drawGameOver();
    return;
  }

  level = floor(score / 100) + 1;

  // マウスでバットマンを左右に動かす
  batmanX = constrain(mouseX, 25, 375);

  // アイテムを発生させる
  spawnTimer++;

  let spawnInterval = max(12, 42 - level * 3);

  if (spawnTimer >= spawnInterval) {
    items.push({
      x: random(25, 375),
      y: -25,
      speed: random(2.5, 4.5) + level * 0.7,
      bomb: random() < min(0.65, 0.3 + level * 0.04)
    });

    spawnTimer = 0;
  }

  // アイテムを動かす
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];

    item.y += item.speed;

    if (item.bomb) {
      drawJoker(item.x, item.y);
    } else {
      drawStar(item.x, item.y);
    }

    // バットマンとの当たり判定
    if (
      abs(item.x - batmanX) < 28 &&
      item.y > 407 &&
      item.y < 470
    ) {
      if (item.bomb) {
        if (invincible <= 0) {
          lives--;
          invincible = 55;
        }
      } else {
        score += 10;
      }

      items.splice(i, 1);

      if (lives <= 0) {
        gameOver = true;
      }

      continue;
    }

    // 画面外のアイテムを削除
    if (item.y > 520) {
      items.splice(i, 1);
    }
  }

  if (invincible > 0) {
    invincible--;
  }

  drawBatman();
  drawHUD();
}

// ゴッサムシティの背景
function drawCity() {
  noStroke();

  // 月
  fill(255, 225, 120, 40);
  circle(330, 80, 95);

  fill(255, 235, 160);
  circle(330, 80, 65);

  // ビル
  for (let x = 0; x < width; x += 55) {
    let h = 120 + (x * 7) % 110;

    fill(18, 25, 48);
    rect(x, height - h, 50, h);

    fill(255, 205, 60, 130);

    for (let y = height - h + 15; y < height - 15; y += 25) {
      rect(x + 10, y, 8, 11);
      rect(x + 30, y, 8, 11);
    }
  }

  fill(8, 10, 20);
  rect(0, 485, width, 15);
}

// バットマン
function drawBatman() {
  push();
  translate(batmanX, 435);

  // ダメージを受けたら点滅
  if (invincible > 0 && frameCount % 8 < 4) {
    pop();
    return;
  }

  noStroke();

  // マント
  fill(5, 5, 12);
  triangle(-20, -10, 20, -10, 0, 55);

  // 体
  fill(65, 70, 80);
  rect(-16, -10, 32, 43, 5);

  // 頭
  fill(12, 15, 25);
  rect(-13, -31, 26, 25, 4);

  // 耳
  triangle(-13, -25, -13, -43, -3, -28);
  triangle(13, -25, 13, -43, 3, -28);

  // 目
  fill(255);
  ellipse(-6, -20, 7, 3);
  ellipse(6, -20, 7, 3);

  // 胸のマーク
  fill(255, 210, 0);
  ellipse(0, 7, 26, 14);

  fill(0);
  textAlign(CENTER);
  textSize(11);
  text("★", 0, 11);

  // ベルト
  fill(255, 205, 0);
  rect(-16, 23, 32, 6);

  pop();
}

// 黄色い星
function drawStar(x, y) {
  push();
  translate(x, y);
  noStroke();

  // 光
  fill(255, 220, 0, 45);
  circle(0, 0, 44);

  fill(255, 220, 0);
  circle(0, 0, 29);

  fill(0);
  textAlign(CENTER);
  textSize(19);
  text("★", 0, 7);

  pop();
}

// ジョーカー
function drawJoker(x, y) {
  push();
  translate(x, y);
  noStroke();

  // 紫色の服
  fill(105, 35, 155);
  ellipse(0, 13, 30, 18);

  // 緑色の髪
  fill(35, 190, 55);
  ellipse(0, -11, 30, 20);

  // 白い顔
  fill(245, 245, 235);
  ellipse(0, 0, 27, 28);

  // 緑色の前髪
  fill(25, 175, 45);
  triangle(-14, -9, -7, -19, -3, -8);
  triangle(-5, -12, 2, -21, 7, -8);
  triangle(5, -11, 13, -17, 12, -5);

  // 黒い眉毛
  stroke(20);
  strokeWeight(2);
  line(-10, -4, -3, -6);
  line(3, -6, 10, -4);

  // 目
  noStroke();
  fill(25);
  ellipse(-6, 0, 4, 5);
  ellipse(6, 0, 4, 5);

  // 赤い笑顔
  noFill();
  stroke(220, 20, 45);
  strokeWeight(3);
  arc(0, 5, 19, 14, 0, PI);

  line(-10, 5, -12, 2);
  line(10, 5, 12, 2);

  pop();
}

// スコアとライフ
function drawHUD() {
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, width, 52);

  fill(255, 220, 30);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(17);
  text("SCORE: " + score, 12, 22);

  fill(255);
  textSize(14);
  text("LEVEL: " + level, 12, 42);

  textAlign(RIGHT);
  fill(255, 80, 80);
  textSize(19);
  text("LIVES: " + lives, 388, 30);
}

// ゲームオーバー画面
function drawGameOver() {
  noStroke();
  fill(0, 0, 0, 220);
  rect(0, 0, width, height);

  textAlign(CENTER);
  textStyle(BOLD);

  fill(255, 70, 70);
  textSize(38);
  text("GAME OVER", 200, 200);

  fill(255, 220, 40);
  textSize(24);
  text("SCORE: " + score, 200, 250);

  fill(255);
  textSize(17);
  text("CLICK TO RESTART", 200, 310);
}

// クリックで再スタート
function mousePressed() {
  if (gameOver) {
    resetGame();
  }
}
