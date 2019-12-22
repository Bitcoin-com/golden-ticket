import { TransactionBuilder, BitcoinCash } from "bitbox-sdk";
import { AddressUtxoResult } from "bitcoin-com-rest";
import { ticketSpread } from "../settings.json";

const buildTransaction = async ({
  ticketCount
}: {
  ticketCount: number;
}): Promise<string> => {
  try {
    return "";
  } catch (error) {
    return error;
  }
};

export default buildTransaction;
