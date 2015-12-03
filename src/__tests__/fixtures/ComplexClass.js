import autobind from './autobind';

class Base {
  constructor(v) {
    this.v = v;
  }
}

function multiply(by) {
  return function $multiply(target, name, descriptor) {
    return {
      ...descriptor,
      value(...args) {
        return by * Reflect.apply(descriptor.value, this, args);
      },
    };
  };
}

const FIVE = 5;
const SEVEN = 7;

@autobind
class Complex extends Base {
  @multiply(SEVEN)
  multiplyByFortyFive() {
    return FIVE * this.v;
  }
}

export default Complex;
