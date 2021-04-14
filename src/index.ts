import { MarkManConfig } from './types';
import { ignoreTag, getKeywords, modifyNode } from './utils';

class MarkMan {
  private keywords: string[];
  private watcher: MutationObserver | null;

  constructor(config?: MarkManConfig) {
    this.keywords = config ? getKeywords(config.keywords) : [];
    this.watcher = null;
  }

  init(config?: MarkManConfig) {
    if (config && config.keywords) {
      const newKeywords = getKeywords(config.keywords);
      newKeywords.forEach(
        (kw) => !this.keywords.includes(kw) && this.keywords.push(kw)
      );
    }

    // dom 加载完成
    document.addEventListener('DOMContentLoaded', () => {
      this.keywords.forEach((kw) => modifyNode(document.body, kw));
    });

    // dom 更新
    this.watcher = new MutationObserver((list: MutationRecord[]) => {
      list.forEach((item) => {
        const node = item.target as any;
        if (!ignoreTag(node.tagName)) {
          this.keywords.forEach((kw) => modifyNode(node, kw));
        }
      });
    });
    this.watcher.observe(document.body, { childList: true, subtree: true });
  }
}

export const markMan = new MarkMan();
export default MarkMan;
