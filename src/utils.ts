import { GetDescription, Keywords, MarkManConfig } from './types';

interface Result {
  keywords: string[];
  getDesc: GetDescription;
}

function getKeywords(words: Keywords) {
  if (!words) return [];
  if (Array.isArray(words)) return [...words];
  return words.includes('|') ? words.split('|') : [words];
}

export function getRealConfig(config?: MarkManConfig) {
  const result: Result = {
    keywords: [],
    getDesc: (word: string) => `这是在解释 ${word}`,
  };
  if (config) {
    const { keywords, getDescription } = config;
    result.keywords = getKeywords(keywords);
    if (getDescription) result.getDesc = getDescription;
  }
  return result;
}

function getCountByText(words: Keywords, text?: string) {
  const keywords = getKeywords(words);
  const countMap: { [key: string]: number } = {};
  if (!words.length) return {};

  keywords.forEach((word) => {
    if (!text) countMap[word] = 0;
    else {
      const regExp = new RegExp(word, 'gi');
      const matchs = text.match(regExp);
      countMap[word] = matchs ? matchs.length : 0;
    }
  });
  return countMap;
}

export function isIgnoredTag(tagName: string) {
  return /style|script|textarea/i.test(tagName);
}

export function modifyNode(wrapNode: any, word: string, desc: string) {
  const text = wrapNode.innerText;
  const count = getCountByText(word, text);
  const nodes = wrapNode.querySelectorAll(`mm[data-keyword="${word}"]`);

  // 数量不同则需要修改
  if (nodes.length !== count) {
    const childNodes = wrapNode.childNodes;
    [...childNodes].forEach((node) => {
      const { nodeType, nodeValue } = node;
      if (nodeType === 1 && !isIgnoredTag(wrapNode.tagName)) {
        modifyNode(node, word, desc);
      } else if (nodeType === 3) {
        const parentNodeTag = node.parentNode.tagName.toLocaleLowerCase();
        const val = nodeValue.replace(/\r|\n|\s/g, '');

        if (parentNodeTag !== 'mm' && val.includes(word)) {
          const splits: string[] = nodeValue.split(word);
          const newNodes: ChildNode[] = [];

          splits.forEach((s, i) => {
            if (i === 0) node.nodeValue = s;
            else {
              const textNode = document.createTextNode(s);
              const mmNode = document.createElement('mm');
              mmNode.setAttribute('data-keyword', word);
              mmNode.setAttribute('data-description', desc);
              mmNode.textContent = word;

              newNodes.push(mmNode, textNode);
            }
          });

          while (newNodes.length) {
            const el = newNodes.pop();
            wrapNode.insertBefore(el, node.nextSibling);
          }
        }
      }
    });
  }
}
