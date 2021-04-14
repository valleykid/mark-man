import { MarkManConfig, GetDescription } from './types';
import { ignoreTag, getKeywords, modifyNode } from './utils';

class MarkMan {
  private keywords: string[];
  private watcher?: MutationObserver;
  private getDesc: GetDescription;

  constructor(config?: MarkManConfig) {
    this.keywords = config ? getKeywords(config.keywords) : [];
    this.getDesc = (kw: string) => `这是在解释 ${kw}`;
  }

  init(config?: MarkManConfig) {
    if (config) {
      const { keywords, getDescription } = config;
      const newKeywords = getKeywords(keywords);
      newKeywords.forEach(
        (kw) => !this.keywords.includes(kw) && this.keywords.push(kw)
      );
      if (getDescription) this.getDesc = getDescription;
    }

    // dom 加载完成
    document.addEventListener('DOMContentLoaded', () => {
      this.keywords.forEach((kw) => {
        const desc = this.getDesc(kw);
        modifyNode(document.body, kw, desc);
      });
    });

    // dom 更新
    this.watcher = new MutationObserver((list: MutationRecord[]) => {
      list.forEach((item) => {
        const node = item.target as any;
        if (!ignoreTag(node.tagName)) {
          this.keywords.forEach((kw) => {
            const desc = this.getDesc(kw);
            modifyNode(node, kw, desc);
          });
        }
      });
    });
    this.watcher.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export const markMan = new MarkMan();
export default MarkMan;
