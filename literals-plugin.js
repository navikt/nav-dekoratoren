/* eslint-disable @typescript-eslint/no-unused-vars */
const processed = Symbol('processed');

function processRule(rule) {
  rule.selector = rule.selector.replace(
    /(\.[a-zA-Z0-9-_]+)|(#\w+)/g,
    (match, classMatch, idMatch) => {
      if (classMatch) {
        return '.prefix-' + classMatch.substring(1);
      } else if (idMatch) {
        return '#prefix-' + idMatch.substring(1);
      }
      return match;
    },
  );
}

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'literals',
    Once(root) {
      // Calls once per file, since every file has single Root
      // console.log(root)
    },
    Rule(rule) {
      if (!rule[processed]) {
        processRule(rule);
        rule[processed] = true;
      }
    },
    Declaration(node, { Rule }) {
      // // Check if it's a var
      // if (node.prop[0] !== '#') return
      //
      // let newRule = new Rule({ selector: 'a', source: node.source })
      // node.root().append(newRule)
      // newRule.append(node)
    },

    Comment(atRule) {
      // console.log(atRule.text)
      // console.log(atRule)
    },
  };
};
module.exports.postcss = true;
