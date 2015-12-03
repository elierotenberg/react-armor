/*
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 *
 * The decorator may be used on classes or methods
 * ```
 * @autobind
 * class FullBound {}
 *
 * class PartBound {
 *   @autobind
 *   method () {}
 * }
 * ```
 */

 /*
  * Return a descriptor removing the value and returning a getter
  * The getter will return a .bind version of the function
  * and memoize the result against a symbol on the instance
  */
function boundMethod(target, key, descriptor) {
  const fn = descriptor.value;

  if(typeof fn !== 'function') {
    throw new Error(`@autobind decorator can only be applied to methods not: ${typeof fn}`);
  }

  return {
    configurable: true,
    get() {
      if (this === target.prototype) {
        return fn;
      }
      const boundFn = fn.bind(this);
      Reflect.defineProperty(this, key, {
        value: boundFn,
        configurable: true,
        writable: true,
      });
      return boundFn;
    },
  };
}

 /*
  * Use boundMethod to bind all methods on the target.prototype
  */
function boundClass(target) {
 // (Using reflect to get all keys including symbols)
  const keys = Reflect.ownKeys(target.prototype);

  keys.forEach((key) => {
   // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, key);

   // Only methods need binding
    if (typeof descriptor.value === 'function') {
      Reflect.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

export default function autobind(...args) {
  if(args.length === 1) {
    return boundClass(...args);
  }
  return boundMethod(...args);
}
