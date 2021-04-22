# mark-man

Insert marks when page loaded or dom changed

## Install

```bash
npm install mark-man --save # yarn add mark-man
```

## Usage

```js
import MarkMan, { markMan } from 'mark-man';

markMain.init({
  keywords: ['平台', '半导体'], // '平台|半导体'
  getDescription: (k) => `自定义描述 ${k}`,
});

/*
  // or use class
  (new MarkMan({
    keywords: ['平台', '半导体'], // '平台|半导体'
    getDescription: (k) => `自定义描述 ${k}`,
  })).init();
*/
```

**Browser usage**

```js
// <script src="https://unpkg.com/mark-man@0.0.1/lib/index.js"></script>
// 直接引用脚本，使用下面的方式调用插入。因为 window.markMan = { markMan, default: MarkMan }

markMan.markMan.init({
  keywords: ['平台', '半导体'],
  getDescription: (k) => `自定义描述 ${k}`,
});
```
