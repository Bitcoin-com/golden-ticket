# Creating templates

A template is during the [configuring a campaign](./configure-campaign.md) process to generate the PDF and HTML files for distribution/printing.

Templates can be created to allow for custom designs and print specifications. A template consists of three files - `background.png`, `config.json` and `index.html` files.

To create a new template, simply copy/paste the default template and modify the files. Details below.

## background.png

The background of the tempalte. It's used for both html and pdf generation.

## index.html

This is used during HTML generation, it's a simple html file with `handlebar like` values to inject different template elements.

| Value        | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| `{{locale}}` | The locale from the main settings.json file                               |
| `{{width}}`  | `html.width` from `config.json`                                           |
| `{{height}}` | `html.height` from `config.json`                                          |
| `{{image}}`  | `image` from `config.json`                                                |
| `{{top}}`    | `html.qrTop` from `config.json`                                           |
| `{{left}}`   | `html.qrLeft` from `config.json`                                          |
| `{{size}}`   | `html.qrSize` from `config.json`                                          |
| `{{qrcode}}` | the matching qrcode png image from `./output/[campaign]/qr/[address].png` |

```html
<html lang="{{locale}}">
  <head>
    <title>{{title}}</title>
    <style>
      body,
      html {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }
      .container {
        position: relative;
        width: '{{width}}';
        height: '{{height}}';
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url({{image}});
      }
      .qrcode {
        position: absolute;
        top: '{{top}}';
        left: '{{left}}';
        width: '{{size}}';
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img class="qrcode" src="{{qrcode}}" alt="WIF QR Code" />
    </div>
  </body>
</html>
```

## config.json

The main configuration file contains all the settings needed for HTML and PDF generation to work correcly. Modify these settings to adjust size and positioning of different elements.

```json
{
  "title": "Default" /* the title of the template displayed in menus */,
  "name": "default" /* MUST BE THE NAME OF THE TEMPLATE DIRECTORY */,
  "image": "background.png" /* the main ticket image */,
  "pdf": {
    /* PDF generation settings */
    "size": [6270, 9691] /* PDF page size, must be number - [width, height] */,
    "qrWidth": 1560 /* the size (height and width) of the qrcode */,
    "qrTop": 3600 /* qrcode distance from top of page */,
    "qrLeft": 2355 /* qrcode distance from left of page */
  },
  "html": {
    /* HTML generation settings */
    "width": "170mm" /* {{width}} the width of image wrapper */,
    "height": "260mm" /* {{height}} the height of image wrapper */,
    "qrSize": "38mm" /* {{size}} qrcode size */,
    "qrLeft": "66mm" /* {{left}} qrcode distance from left of wrapper */,
    "qrTop": "99mm" /* {{top}} qrcode distance from top of wrapper */
  },
  "qrcode": {
    /* QR Code generation settings - full option descriptions here - https://www.npmjs.com/package/qrcode#qr-code-options*/
    "margin": 2 /* margin around qrcode */,
    "width": 500 /* width of the qrcode (in pixels) */,
    "scale": 4 /* scale of qrcode */,
    "color": {
      "dark": "#000000ff" /* the dark color of the qr */,
      "light": "#ffffffff" /* the light color of the qr */
    }
  }
}
```
