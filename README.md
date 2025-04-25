A simple node.j tool for checking for new content on the web. For now it only parses nyaa.si and 1337x.to.

To use create a `sources.mjs` file in the root directory with a content like this:
```js
export default [
  {
    name: 'optional custom name, only displayed for you',
    type: 'nyaa',
    url: 'https://url-of-the-resource',
  },
  {
    type: 'nyaa',
    url: 'https://url-of-the-other-resource',
  },
  // ...
];

```

then run `npm run check` or use the `check.bat` file
