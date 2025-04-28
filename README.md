A simple node.js tool for checking for new content on the web - it displays the new content in the terminal. For now it only parses:
- [nyaa.si](https://nyaa.si/)
- [1337x.to](https://1337x.to/)

...but you can add more yourself with very basic DOM manipulations. 
The page you're checking needs to be accessible for bots.

## how to use
Requires Node 18+
1. clone this repo
2. `npm install`
3. create a `sources.mjs` file in the root directory
4. `npm run check` or use the batch file if you're on windows

## defining sources
`sources.mjs` should export an array of source objects. It should look something like this:
```js
export default [
  {
    name: 'optional custom name, only displayed for you',
    type: 'nyaa',  // filename of the file exporting the handler
    url: 'https://url-of-the-resource',
  },
  {
    type: '1337x',
    url: 'https://url-of-the-other-resource',
    customKey: 'custom value',
  },
  // ...
];

```

## adding handlers
You can create any number of `*.mjs` files in the `handlers/` directory. Each one must have a function as the default export. The function receives the DOM (actual DOM, not just the HTML) and the source object that called it (so you can pass custom arguments). It needs to return an array of objects where each at minimum contains a `name` and the `url`. Check the example files - they're just 5 lines of code: [`handlers/nyaa.mjs`](https://github.com/weterynarzfred/curl-compare/blob/master/handlers/nyaa.mjs) and [`handlers/1337x.mjs`](https://github.com/weterynarzfred/curl-compare/blob/master/handlers/1337x.mjs).

The script will compare the returned objects and display any that are new.

## opening the links automatically
If you want the new links to be opened in the browser, edit the `openLinks.mjs` file. Example: `spawn('C:/Program Files/Waterfox/waterfox', [element.url]);`.