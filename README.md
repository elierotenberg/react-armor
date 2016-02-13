react-armor
===========

React Armor is a collection of utilies to protect your React-powered DOM from third-party tampering.

### Motivation

In a React app, it is often crucial to make sure that the actual DOM doesn't get changed behind your back, so that the
virtual DOM and the actual DOM stay in sync, under your control, enforcing your invariants.

However, third-party scripts often mess with your DOM, violating your invariants. Such third-party scripts include
browser extensions (adblockers...), userscripts, invasive ads, and many more. Most of these scripts hook into your DOM
using its tree structure and more specifically, using CSS selectors to target your DOM (using either injected
stylesheets, plain `document.querySelector`, not to mention `$()`).

React Armor provides several tools to make hard, if not impossible, for any script not encapsulated in your React app,
to hook into your DOM.

The tools are designed to be efficient, easy-to-use, and play very well with the rest of the React/JS ecosystem.


### Tool 1: Class names obfuscation

Most selectors are simply based on class names. This tool makes class names determinist but cryptographically
unpredictable, making it practically impossible to target DOM elements using class names selectors, using
`react-traverse`.

The following JS:
```js
import { obfuscateClassNames } from 'react-armor';

function Bar() {
  return <div className='Bar'>{'bar'}</div>;
}

@obfuscateClassNames({ key: 'foobar' })
class Foo extends React.Component {
  render() {
    return <div className='Foo'><Bar /></div>;
  }
}

React.render(<Foo />);
```
... renders to the following HTML:
```html
<div class="11f5b410"><div class="34ac2cc1">bar</div></div>
```

We also provide a tool to apply the exact same transformation to your stylesheets, so that you can keep
writing CSS (or CSS-in-JSS) as normal, and keep everything working.

The following JS:
```js
import { obfuscateClassNames } from 'react-armor';

postcss([obfuscateClassNames.createPostCSSPlugin({ key: 'foobar '})]).process(`
  .Foo .Bar[attr='val'].Bar--module:hover {
    background-color: 'red';
  }
  ul li .Bar--module.Bar:visited {
    background-color: 'green';
  }
`);
```
... generates the following CSS:
```css
  .11f5b410 .34ac2cc1[attr='val'].6faed2d1:hover {
    background-color: 'red';
  }
  ul li .6faed2d1.34ac2cc1:visited {
    background-color: 'green';
  }
```

In order for this tool to be efficient at preventing CSS selectors to work, you should change the key often, eg.
change it automatically once a day, or generate a new random key at every request (but this is costly since you must
then regenerate your stylesheet once per request too, preventing browser-caching).

### Tool 2: Tree structure obfuscation

Work in progress.

### More tools...
