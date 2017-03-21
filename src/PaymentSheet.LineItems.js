import { currencies } from "./currencies.js";
import PaymentCurrencyAmount from "./PaymentCurrencyAmount";
import hyperHTML from "hyperhtml/hyperhtml.js";
const privates = new WeakMap();


export default class LineItems {
  constructor() {
    const priv = privates.set(this, new Map()).get(this);
    const containerElem = document.createElement("section");
    containerElem.id = "payment-sheet-line-items";
    const table = document.createElement("table");
    table.id = "line-items-table";
    containerElem.appendChild(table);
    priv.set("containerElem", containerElem);
    priv.set("renderer", hyperHTML.bind(table));
  }

  render(requestData) {
    let currency = "USD";
    let value = "0";
    const { displayItems } = requestData;
    const renderer = privates.get(this).get("renderer");
    const { symbol } = currencies.get(currency);
    const lineItemsHTML = displayItems.map(toTR);
    if (requestData.total) {
      currency = requestData.total.amount.currency
      value = requestData.total.amount.value;
    }
    return renderer `${
      lineItemsHTML.length ? lineItemsHTML : hyperHTML.wire()`<tr><td colspan="2">No line items</td></tr>`
    }`;
  }

  get containerElem() {
    return privates.get(this).get("containerElem");
  }

}

function toTR(lineItem) {
  const { label, dir, lang, amount } = lineItem;
  const { currency, value } = amount;
  const { symbol } = currencies.get(currency);
  return hyperHTML.wire(lineItem)
  `<tr>
      <td lang="${lang}" dir="${dir}">${label}</td>
      <td>${symbol}${value} ${currency}</td>
  </tr>
  `
}
