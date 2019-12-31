# vscode settings

add to vscode settings (workspace)

## Extensions

- [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis) - Automatically generates detailed JSDoc comments in TypeScript and JavaScript files.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Integrates ESLint JavaScript into VS Code.
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) - All you need to write Markdown (keyboard shortcuts, table of contents, auto preview and more)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter using prettier
- [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports) - Sort ES6 imports automatically.

## Settings

```json
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
],
"editor.formatOnSave": true,

"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```
