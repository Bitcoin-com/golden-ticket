// imports
import { BITBOX } from "bitbox-sdk";
import { HDNode } from "bitcoincashjs-lib";
import * as fs from "fs";
import { PDF, Config } from "../interfaces";

import generateConfig from "../helpers/generateConfig";
import bgBase64 from "../assets/bgBase64";
import getUserInput from "./getUserInput";

// consts
const bitbox: BITBOX = new BITBOX();
const QRCode: any = require("qrcode");
const touch: any = require("touch");
const mkdirp: any = require("mkdirp");
const pdf: any = require("html-pdf");
const emoji: any = require("node-emoji");
const chalk: any = require("chalk");
// const addresses: string[] = []
const sleep: any = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const main: any = async (): Promise<any> => {
  try {
    // get settings from generated config
    const { strings }: Config = generateConfig("CREATE_TICKETS");

    const config = await getUserInput(strings);
    const { title, hdAccount, ticketCount } = config;

    if (title) return;
    // create needed directory structure
    mkdirp(`./html`, (err: any): void => {});
    mkdirp(`./html/${title}`, (err: any): void => {});
    mkdirp(`./html/${title}/privKeyWIFs`, (err: any): void => {});

    mkdirp(`./pdf`, (err: any): void => {});
    mkdirp(`./pdf/${title}`, (err: any): void => {});
    mkdirp(`./pdf/${title}/privKeyWIFs`, (err: any): void => {});

    const wallet = { mnemonic: "" };
    // root seed buffer
    const rootSeed: Buffer = bitbox.Mnemonic.toSeed(wallet.mnemonic);

    // master HDNode
    const masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed);

    // BIP44
    const bip44: HDNode = bitbox.HDNode.derivePath(masterHDNode, "m/44'/145'");

    for (let i: number = 0; i < ticketCount; i++) {
      console.log(`html: ${i}`);
      await sleep(100);
      // derive the ith external change address from the BIP44 account HDNode
      const node: HDNode = bitbox.HDNode.derivePath(
        bip44,
        `${hdAccount ? hdAccount : 0}'/0/${i}`
      );

      // get the priv key in wallet import format
      const wif: string = bitbox.HDNode.toWIF(node);
      // addresses.push({
      //   wif: wif
      // })

      // create empty html file
      touch(`./html/${title}/privKeyWIFs/paper-wallet-wif-${i}.html`);

      // create qr code
      QRCode.toDataURL(wif, (err: any, wifQR: any): void => {
        // save to html file
        fs.writeFileSync(
          `./html/${title}/privKeyWIFs/paper-wallet-wif-${i}.html`,
          [
            `<body style="padding: 0; margin: 0;">`,
            `<div style="height: 100%; background-size: cover; background-position: no-repeat left center; background-image: url('${bgBase64}')">`,
            `<img style='position: absolute; top: 280px; left: 180px; height: 120px;' src='${wifQR}' />`,
            `</div></body>`
          ].join("")
        );
      });
    }

    for (let i: number = 0; i < ticketCount; i++) {
      console.log(`pdf: ${i}`);
      await sleep(2000);

      // save to pdf
      let pdfConfig: PDF = {
        width: "170mm",
        height: "260mm"
      };

      // get html file
      const privKeyWIFsHtml: string = fs.readFileSync(
        `./html/${title}/privKeyWIFs/paper-wallet-wif-${i}.html`,
        "utf8"
      );

      // save to pdf
      pdf
        .create(privKeyWIFsHtml, pdfConfig)
        .toFile(
          `./pdf/${title}/privKeyWIFs/paper-wallet-wif-${i}.pdf`,
          (err: any) => {
            if (err) return console.log(err);
          }
        );
    }
    console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));
    console.log(
      emoji.get(":rocket:"),
      `html and pdfs written successfully to html/${title} and pdf/${title} respectively.`
    );
  } catch (err) {
    console.log(
      `Could not open mnemonic.json. Generate a mnemonic with generate-wallet first.
  Exiting.`
    );
    process.exit(0);
  }
};

export default main();
