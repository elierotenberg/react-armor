import React from 'react';

function transformNode(node, transformElement) {
  if(typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  if(Array.isArray(node)) {
    return node.map((childNode) => transformNode(childNode, transformElement));
  }
  const { type, props, key, ref } = node;
  const { children } = props;
  return transformElement({
    type,
    props: {
      ...props,
      children: React.Children.map(children, transformElement),
    },
    key,
    ref,
  });
}

export default transformNode;
