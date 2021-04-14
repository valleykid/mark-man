import { Keywords } from './types';

export function ignoreTag(tagName: string) {
  return /style|script|textarea/i.test(tagName);
}

export function getKeywords(kws: Keywords) {
  if (!kws) return [];
  if (Array.isArray(kws)) return [...kws];
  return kws.includes('|') ? kws.split('|') : [kws];
}

function getKwNumberByText(kws: Keywords, text?: string) {
  const keywords = Array.isArray(kws) ? kws : kws ? [kws] : [];
  const kwNumberMap: { [key: string]: number } = {};
  if (!kws.length) return {};

  keywords.forEach((kw) => {
    if (!text) kwNumberMap[kw] = 0;
    else {
      const regExp = new RegExp(kw, 'gi');
      const matchs = text.match(regExp);
      kwNumberMap[kw] = matchs ? matchs.length : 0;
    }
  });
  return kwNumberMap;
}

export function modifyNode(node: any, kw: string, desc: string) {
  const text = node.innerText;
  const kwNum = getKwNumberByText(kw, text);
  const kwNodes = node.querySelectorAll(`mm[data-keyword="${kw}"]`);

  // 数量不同则需要修改
  if (kwNodes.length !== kwNum) {
    const childNodes = node.childNodes;
    [...childNodes].forEach((cn, pos) => {
      const { nodeType, nodeValue } = cn;
      if (nodeType === 1) {
        if (ignoreTag(node.tagName)) return;
        modifyNode(cn, kw, desc);
      } else if (nodeType === 3) {
        const val = nodeValue.replace(/\r|\n|\s/g, '');
        if (
          cn.parentNode.tagName.toLocaleLowerCase() !== 'mm' &&
          val.includes(kw)
        ) {
          const splits: string[] = nodeValue.split(kw);
          const newNodes: ChildNode[] = [];

          splits.forEach((s, i) => {
            if (i === 0) cn.nodeValue = s;
            else {
              const textNode = document.createTextNode(s);
              const mmNode = document.createElement('mm');
              mmNode.setAttribute('data-keyword', kw);
              mmNode.setAttribute('data-description', desc);
              mmNode.textContent = kw;

              newNodes.push(textNode, mmNode);
            }
          });

          if (newNodes.length) {
            newNodes.forEach((dom) =>
              node.insertBefore(dom, childNodes[pos + 1])
            );
          }
        }
      }
    });
  }
}
