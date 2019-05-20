/**
 * Created by Joe on 4/23/2019.
 */

class Block {
  constructor(low, high, side) {
    this.low = parseInt(low);
    this.high = parseInt(high);
    this.side = side.toUpperCase();
  }

  isInBlock(houseNum) {
    let n = parseInt(houseNum);
    if (n < this.low || n > this.high) return false;
    if (this.side == "B") return true;
    let isEven = (n % 2) == 0;
    return (isEven == this.side);
  }
}