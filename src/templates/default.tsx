import React from "react";
import ReactDOMServer from "react-dom/server";
import bgBase64 from "../../assets/bgBase64";
import settings from "../../settings.json";
import { Campaign } from "../interfaces";

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
    height: settings.pdfConfig.height,
    width: settings.pdfConfig.width
  };

  const containerStyle = {
    height: "100%",
    position: "relative" as "relative",
    backgroundSize: "cover",
    backgroundImage: `url(${bgBase64})`
  };

  const { left, top, height } = settings.qrcode;
  const imageStyle = {
    position: "absolute" as "absolute",
    top,
    left,
    height
  };

  const html = (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <img style={imageStyle} src={`${wifQR}`} />
        </div>
      </body>
    </html>
  );

  return ReactDOMServer.renderToString(html);
};

export default template;
