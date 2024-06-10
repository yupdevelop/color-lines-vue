export default class BallGenerator {
  constructor(colors) {
    this.colors = colors;
  }

  generateRandomBall(big = false) {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      color: color,
      size: big ? 'big' : 'small',
    };
  }
}
