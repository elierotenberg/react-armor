import crypto from 'crypto';

import transformClassNames from './transformClassNames';

const HASH_LENGTH = 8;
const HASH_ALGO = 'sha256';

export function obfuscateClassName(className, { key, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) {
  return crypto.createHmac(hashAlgo, key).update(className).digest('hex').slice(0, hashLength);
}

export function obfuscateClassNames({
  key,
  hashLength = HASH_LENGTH,
  hashAlgo = HASH_ALGO,
} = {}) {
  return transformClassNames(
    (className) => obfuscateClassName(className, { key, hashLength, hashAlgo }),
  );
}

export function obfuscateSelector(selector, { key, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) {
  const classNameSelector = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  return selector.replace(
    classNameSelector,
    (match, className) => `.${obfuscateClassName(className, { key, hashLength, hashAlgo })}`,
  );
}

export function createPostCSSPlugin(postcss) {
  return postcss.plugin(
    'postcss-obfuscate-class-names',
    ({ key, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) =>
      (root) => {
        root.walkRules((rule) => {
          if(!rule.selectors) {
            return rule;
          }
          rule.selectors = rule.selectors.map(
            (selector) => obfuscateSelector(selector, { key, hashLength, hashAlgo })
          );
        });
      },
  );
}

obfuscateClassNames.obfuscateClassName = obfuscateClassName;
obfuscateClassNames.obfuscateSelector = obfuscateSelector;
obfuscateClassNames.createPostCSSPlugin = createPostCSSPlugin;

export default obfuscateClassNames;
