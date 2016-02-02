import React from 'react';
import treeCoordinates from './treeCoordinates';

const ReactElement = React.Element;

class ArmorElement extends React.Element {
  static propTypes = {
    [treeCoordinates]: React.PropTypes.shape({
      depth: React.PropTypes.number,
      offset: React.PropTypes.number,
    }),
  };

  render(...args) {
    if(this.render === ArmorElement.render) {
      throw new Error(`Component ${this.constructor.displayName} should define a render() function.`);
    }
    const element = this.render(...args);
  }
}

React.Element = ArmorElement;

export function restoreReactElement() {
  React.Element = ReactElement;
  return React.Element;
}

export default React;
