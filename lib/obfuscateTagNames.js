import crypto from 'crypto';

import transformTagNames from './transformTagNames';

const INCLUDE = [
  'b',
  'col',
  'colgroup',
  'del',
  'div',
  'em',
  'i',
  'ins',
  'mark',
  'p',
  's',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'td',
  'td',
  'tr',
  'tr',
  'u',
];
const NOT_FOUND = -1;
const PREFIX_LENGTH = 3;
const HASH_LENGTH = 5;
const HASH_ALGO = 'sha256';

const tagNameRE = /^([_a-zA-Z]+[_a-zA-Z0-9-]*)/;

export function obfuscateTagName({
  seed,
  include = INCLUDE,
  hashLength = HASH_LENGTH,
  hashAlgo = HASH_ALGO,
  prefixLength = PREFIX_LENGTH,
} = {}) {
  return (tagName) => {
    if(include.indexOf(tagName) === NOT_FOUND) {
      return tagName;
    }
    const hmac = crypto.createHmac(hashAlgo, seed).update(tagName).digest('hex');
    const letters = hmac.replace(/[^a-z]/g, () => '');
    const prefix = letters.slice(0, prefixLength);
    const suffix = hmac.slice(0, hashLength);
    return `${prefix}-${suffix}`;
  };
}

export function obfuscateTagNames({
  seed,
  include = INCLUDE,
  hashLength = HASH_LENGTH,
  hashAlgo = HASH_ALGO,
  prefixLength = PREFIX_LENGTH,
} = {}) {
  return transformTagNames(obfuscateTagName({ seed, include, hashLength, hashAlgo, prefixLength }));
}

export function obfuscateTagNamesInSelector({
  seed,
  include = INCLUDE,
  hashLength = HASH_LENGTH,
  hashAlgo = HASH_ALGO,
  prefixLength = PREFIX_LENGTH,
} = {}) {
  return (selector) => selector
    .split(/\s+/)
    .map(
      (token) => token.replace(
        tagNameRE,
        (match, tagName) => obfuscateTagName({ seed, include, hashLength, hashAlgo, prefixLength })(tagName),
      )
    )
    .join(' ')
  ;
}

export function createPostCSSPlugin(postcss) {
  return postcss.plugin(
    'postcss-obfuscate-tag-names',
    ({
      seed,
      include = INCLUDE,
      hashLength = HASH_LENGTH,
      hashAlgo = HASH_ALGO,
      prefixLength = PREFIX_LENGTH,
    } = {}) =>
      (root) => {
        root.walkRules((rule) => {
          if(!rule.selectors) {
            return rule;
          }
          rule.selectors = rule.selectors.map(obfuscateTagNamesInSelector({
            seed,
            include,
            hashLength,
            hashAlgo,
            prefixLength,
          }));
        });
      },
  );
}

obfuscateTagNames.obfuscateTagName = obfuscateTagName;
obfuscateTagNames.obfuscateTagNamesInSelector = obfuscateTagNamesInSelector;
obfuscateTagNames.createPostCSSPlugin = createPostCSSPlugin;

export default obfuscateTagNames;
