import React from 'react';
import ReactDOMServer from 'react-dom/server';
import bgBase64 from './background.png';
import config from './config.json';
import getSettings from '../../settings';

/**
 * Template for HTML page generation
 *
 * @param {Campaign} { title }
 * @param {string} wifQR
 * @returns {string}
 */
const template = ({ title }: Campaign, wifQR: string): string => {
  const bodyStyle = {
    padding: 0,
    margin: 0,
    height: config.pdf.height,
    width: config.pdf.width,
  };

  const containerStyle = {
    height: '100%',
    position: 'relative' as 'relative',
    backgroundSize: 'cover',
    backgroundImage: `url(${bgBase64})`,
  };

  const { left, top, size } = config.qrcode;
  const imageStyle = {
    position: 'absolute' as 'absolute',
    top,
    left,
    height: size,
  };

  const html = (
    <html lang={getSettings().locale}>
      <head>
        <title>{title}</title>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <img style={imageStyle} src={`${wifQR}`} alt="WIF QR Code" />
        </div>
      </body>
    </html>
  );

  return ReactDOMServer.renderToString(html);
};

export default template;
