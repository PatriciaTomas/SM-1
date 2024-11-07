
class Alvo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.raioTotal = random(20, 100); // Gera um raio aleatório entre 50 e 100
  }

  display() {
    noStroke();
    let raioTotal = this.raioTotal;
    let raio1 = raioTotal;
    let raio2 = raioTotal - raioTotal * 0.3; // 30% do raioTotal
    let raio3 = raioTotal - raioTotal * 0.6; // 60% do raioTotal

    fill(color(255, 0, 0));
    ellipse(this.x, this.y, raio1 * 2);
    fill(color(255, 255, 255));
    ellipse(this.x, this.y, raio2 * 2);
    fill(color(0, 0, 255));
    ellipse(this.x, this.y, raio3 * 2);
  }

  checkCollision(x, y) {
    let d = dist(x, y, this.x, this.y);
    return d < this.raioTotal;
  }

  getPoints(x, y) {
    let d = dist(x, y, this.x, this.y);
    if (d < this.raioTotal - 60) {
      return 10;
    } else if (d < this.raioTotal - 30) {
      return 5;
    } else {
      return 1;
    }
  }
}
