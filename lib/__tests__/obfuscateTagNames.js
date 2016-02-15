const { describe, it } = global;
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import postcss from 'postcss';
import should from 'should/as-function';

import { obfuscateTagNames } from '..';
const { obfuscateTagName, obfuscateTagNamesInSelector, createPostCSSPlugin } = obfuscateTagNames;

const seed = 'foobar';

describe('obfuscateTagNames', () => {
  describe('.obfuscateTagName', () => {
    it('hashes tag name', () => {
      const actual = obfuscateTagName({ seed })('div');
      const expected = 'ecb-ec1b6';
      should(actual).be.exactly(expected);
    });
  });
  describe('.obfuscateTagNamesInSelector', () => {
    it('hashes complex selectors', () => {
      const obfuscated = _(['div', 'span', 'p'])
        .map((tagName) => [tagName, obfuscateTagName({ seed })(tagName)])
      .fromPairs()
      .value();
      const actual = obfuscateTagNamesInSelector({ seed })(
        'div.App span.Component[attr=\'val\'].state:hover p#main.span',
      );
      const expected =
        `${obfuscated.div}.App ${obfuscated.span}.Component[attr=\'val\'].state:hover ${obfuscated.p}#main.span`
      ;
      should(actual).be.exactly(expected);
    });
  });
  describe('.createPostCSSPlugin', () => {
    it('transforms complex stylesheets', () => {
      const plugin = createPostCSSPlugin(postcss);
      const obfuscated = _(['div', 'span', 'p'])
        .map((className) => [className, obfuscateTagName({ seed })(className)])
      .fromPairs()
      .value();
      const originalCss = `
        div.Foo span.Bar[attr='val'].Bar--module:hover iframe {
          background-color: 'red';
        }
        ul li .Bar--module.Bar:visited p {
          background-color: 'green';
        }
      `;
      const transformedCss = postcss([plugin({ seed })]).process(originalCss).css;
      const expectedCss = `
        ${obfuscated.div}.Foo ${obfuscated.span}.Bar[attr='val'].Bar--module:hover iframe {
          background-color: 'red';
        }
        ul li .Bar--module.Bar:visited ${obfuscated.p} {
          background-color: 'green';
        }
      `;
      should(transformedCss).be.exactly(expectedCss);
    });
  });
  describe('.obfuscateTagNames', () => {
    it('obfuscates deeply nested tagNames', () => {
      const obfuscated = _(['span', 'p', 'div'])
        .map((tagName) => [tagName, obfuscateTagName({ seed })(tagName)])
      .fromPairs()
      .value();

      function Bar() {
        return <div className='Bar'>{'bar'}</div>;
      }

      @obfuscateTagNames({ seed })
      class Foo extends React.Component {
        render() {
          return <span className='Foo'><Bar /></span>;
        }
      }

      const actual = ReactDOMServer.renderToStaticMarkup(<Foo />);
      const expected = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          obfuscated.span,
          { 'class': 'Foo' },
          React.createElement(
            obfuscated.div,
            { 'class': 'Bar' },
            'bar',
          ),
        ),
      );
      should(actual).be.exactly(expected);
    });

    it('obfuscates top-level React Elements', () => {
      const obfuscated = _(['span', 'p', 'div'])
        .map((tagName) => [tagName, obfuscateTagName({ seed })(tagName)])
      .fromPairs()
      .value();

      function Bar() {
        return <div className='Bar'>{'bar'}</div>;
      }

      class Foo extends React.Component {
        render() {
          return <span className='Foo'><Bar /></span>;
        }
      }

      const actual = ReactDOMServer.renderToStaticMarkup(obfuscateTagNames({ seed })(
        <Foo />
      ));
      const expected = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          obfuscated.span,
          { 'class': 'Foo' },
          React.createElement(
            obfuscated.div,
            { 'class': 'Bar' },
            'bar',
          ),
        ),
      );
      should(actual).be.exactly(expected);
    });
  });
});
