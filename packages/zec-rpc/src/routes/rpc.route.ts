import RPC from "../rpc/rpc";
import { Wallet } from "../wallet";

const state: { wallet: Wallet | null } = {
  wallet: null,
};

export default {
  ping: function(_, context, callback) {
    callback(null, 'pong');
  },
  init: async function(args, context, callback) {
    const { ufvk } = args;
    state.wallet = new Wallet(ufvk);
    // const res = await state.wallet.createNewWallet();
    // console.log({ res });
    callback(null, 'Success');
  },
  export: async function(_, context, callback) {
    const res = await RPC.getUfvk();
    callback(null, res);
  },
  transactions: async function(args, context, callback) {
    const res = await state.wallet?.transactions;
    callback(null, res);
  },
  addresses: async function(_, context, callback) {
    const res = await state.wallet?.addresses;
    callback(null, res);
  },
  encryptMessage: async function(args, context, callback) {
    const { address, memo } = args;
    const res = await RPC.encryptMessage(address, memo);
    callback(null, res);
  },
  decryptMessage: async function(args, context, callback) {
    const { message } = args;
    console.log({ message });
    const res = await RPC.decryptMessage(message);
    callback(null, res);
  }
}