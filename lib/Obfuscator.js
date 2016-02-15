import React from 'react';
import seedrandom from 'seedrandom';

const ALLOWED_ELEMENTS = [
  'div',
  'span',
];
const MIN_DEPTH = 10;
const MAX_DEPTH = 10;

function randInInterval(rng, min, max) {
  const range = max - min;
  return min + Math.round(rng() * range);
}

export default function Obfuscator({
  allowedElements = ALLOWED_ELEMENTS,
  children,
  injectedProps = {},
  maxDepth = MAX_DEPTH,
  minDepth = MIN_DEPTH,
  seed,
  ...otherProps,
}) {
  const rng = seedrandom(seed);
  const depth = randInInterval(rng, minDepth, maxDepth);
  let prevNode = children;
  for(let k = 0; k < depth; k = k + 1) {
    const type = allowedElements[randInInterval(rng, 0, allowedElements.length - 1)];
    prevNode = React.createElement(
      type,
      typeof injectedProps === 'function' ? injectedProps(depth - k - 1, depth, type) : injectedProps,
      ...(Array.isArray(prevNode) ? prevNode : [prevNode]),
    );
  }
  return React.cloneElement(prevNode, otherProps);
}
Obfuscator.propTypes = {
  allowedElements: (props, propName, componentName) => {
    const val = props[propName];
    if(Array.isArray(val)) {
      return new TypeError(
        `props.allowedElements should be an array in ${componentName}`,
      );
    }
    if(typeof val === 'undefined') {
      return null;
    }
    if(val.length === 0) {
      return new TypeError(
        `props.allowedElements should contain at least one element in ${componentName}`,
      );
    }
    return null;
  },
  children: React.PropTypes.node,
  injectedProps: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func,
  ]),
  maxDepth: React.PropTypes.number,
  minDepth: React.PropTypes.number,
  seed: React.PropTypes.any.isRequired,
};
