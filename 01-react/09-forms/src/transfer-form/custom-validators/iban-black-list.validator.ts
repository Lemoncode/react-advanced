import { isIBANInBlackList } from "../transfer-form.api";

export const ibanBlackList = ({ value }) =>
  isIBANInBlackList(value).then((isInBlackList) => ({
    type: "IBAN_BLACK_LIST",
    succeeded: !isInBlackList,
    message: isInBlackList ? "This IBAN is not allowed" : "",
  }));
