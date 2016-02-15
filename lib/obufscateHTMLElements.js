import React from 'react';
import seedrandom from 'seedrandom';
import traverse, { transformComponents, wrapRender } from 'react-traverse';

const MIN_DEPTH = 0;
const MAX_DEPTH = 5;

function randInInterval(rng, min, max) {
  const range = max - min;
  return min + Math.round(rng() * range);
}

export function obfuscateHTMLElementsInNode({ seed, className, minDepth = MIN_DEPTH, maxDepth = MAX_DEPTH } = {}) {
  return (node) => {
    const rng = seedrandom(seed);
    return traverse(node, {
      DOMElement(path) {
        const depth = randInInterval(rng, minDepth, maxDepth);
        const originalNode = path.node;
        const traversedChildren = path.traversedChildren();
        let lastNode = originalNode;
        for(let k = 0; k < depth; k = k + 1) {
          const nextNode = React.createElement('div');
          if(className) {
            nextNode.props.className = className;
          }
          else {
            nextNode.props.style = {
              display: 'inherit',
              width: '100%',
              height: '100%',
            };
          }
          lastNode.props.children = [nextNode];
          lastNode = nextNode;
        }
        lastNode.children = traversedChildren;
        return originalNode;
      },
    });
  };
}

export default function obfuscateHTMLElements({ seed, className, minDepth = MIN_DEPTH, maxDepth = MAX_DEPTH } = {}) {
  return transformComponents(wrapRender(obfuscateHTMLElementsInNode({ seed, className, minDepth, maxDepth })));
}
