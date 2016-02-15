import crypto from 'crypto';

import transformClassNames from './transformClassNames';

const HASH_LENGTH = 8;
const HASH_ALGO = 'sha256';

export function obfuscateClassName({ seed, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) {
  return (className) => crypto.createHmac(hashAlgo, seed).update(className).digest('hex').slice(0, hashLength);
}

export function obfuscateClassNames({
  seed,
  hashLength = HASH_LENGTH,
  hashAlgo = HASH_ALGO,
} = {}) {
  return transformClassNames(obfuscateClassName({ seed, hashLength, hashAlgo }));
}

export function obfuscateClassNamesInSelector({ seed, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) {
  return (selector) => {
    const classNameSelector = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
    return selector.replace(
      classNameSelector,
      (match, className) => `.${obfuscateClassName({ seed, hashLength, hashAlgo })(className)}`,
    );
  };
}

export function createPostCSSPlugin(postcss) {
  return postcss.plugin(
    'postcss-obfuscate-class-names',
    ({ seed, hashLength = HASH_LENGTH, hashAlgo = HASH_ALGO } = {}) =>
      (root) => {
        root.walkRules((rule) => {
          if(!rule.selectors) {
            return rule;
          }
          rule.selectors = rule.selectors.map(obfuscateClassNamesInSelector({ seed, hashLength, hashAlgo }));
        });
      },
  );
}

obfuscateClassNames.obfuscateClassName = obfuscateClassName;
obfuscateClassNames.obfuscateClassNamesInSelector = obfuscateClassNamesInSelector;
obfuscateClassNames.createPostCSSPlugin = createPostCSSPlugin;

export default obfuscateClassNames;
