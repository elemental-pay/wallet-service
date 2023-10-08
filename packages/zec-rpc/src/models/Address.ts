/* Source - https://github.com/zingolabs/zingo-pc/blob/0b64b58e7720ae571415daddc2a71c1d92b630bc/src/components/appstate/components/Address.ts
  License for code from zingo-pc – MIT License
*/

import AddressType from "./AddressType";
import ReceiverType from "./ReceiverType"; 

export default class Address {
    address: string;
    type: AddressType;
    balance: number;
    containsPending: boolean;

    receivers?: ReceiverType[];
  
    constructor(address: string, balance: number, type: AddressType) {
      this.address = address;
      this.balance = balance;
      this.type = type;

      this.containsPending = false;
    }
  }