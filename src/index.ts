import { MarkManConfig, GetDescription } from './types';
import { isIgnoredTag, getRealConfig, modifyNode } from './utils';

class MarkMan {
  private keywords: string[];
  private watcher?: MutationObserver;
  private getDesc: GetDescription;

  constructor(config?: MarkManConfig) {
    const { keywords, getDesc } = getRealConfig(config);
    this.keywords = keywords;
    this.getDesc = getDesc;
  }

  init(config?: MarkManConfig) {
    if (config) {
      const { keywords: newKeywords, getDesc } = getRealConfig(config);
      newKeywords.forEach((kw) => {
        if (!this.keywords.includes(kw)) {
          this.keywords.push(kw);
        }
      });
      if (getDesc) this.getDesc = getDesc;
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
        if (!isIgnoredTag(node.tagName)) {
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
