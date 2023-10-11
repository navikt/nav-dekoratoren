import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

const prefixClassAndId = (code) => {
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });

  traverse.default(ast, {
    TemplateLiteral(path) {
      path.node.quasis.forEach((node) => {
        if (node.type === 'TemplateElement') {
          node.value.raw = node.value.raw.replace(
            /\sclass="/g,
            ' class="prefix-',
          );
          node.value.raw = node.value.raw.replace(/\s#"/g, ' #"prefix-');
        }
      });
    },
  });

  return generate.default(ast).code;
};

export default function PrefixClassIdPlugin() {
  return {
    name: 'prefix-class-id',
    transform(src) {
      if (src.includes('class="') || src.includes('id="')) {
        return prefixClassAndId(src);
      }
    },
  };
}
