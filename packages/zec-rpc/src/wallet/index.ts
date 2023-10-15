import deepDiff from 'deep-diff';
import fetch from 'node-fetch';
import { isEqual } from 'lodash.isequal';
import { zingolib_wallet_exists, zingolib_initialize_existing, zingolib_deinitialize, zingolib_initialize_new, zingolib_initialize_new_from_ufvk } from '@elemental-zcash/zingo-node';
// const  = pkg;


import { Address, AddressType, RPCConfig, Transaction } from '../models';
import RPC from '../rpc/rpc';

type State = {
  url: string,
  dataDir: string,
  chain: 'main',
  ufvk?: string,
  transactions?: Transaction[],
  addresses?: Address[],
}

const setTotalBalance = () => {

};
const setAddresses = () => {

};
const setTransactionList = () => {

};
const setInfo = () => {

};
const setZecPrice = () => {

};
const setWalletSettings = () => {

};
const setVerificationProgress = () => {

};

// FIXME: Fix this hack, add a binding to get this from lightwalletd server
const getBlockHeight = async () => {
  const apiUrl = `https://api.blockchair.com/zcash/blocks?s=id%28desc%29&limit=1&offset=0&page=0`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();

  // Extracting block height from the response
  const blockHeightFromResponse = (data as any)?.data[0].id;

  return blockHeightFromResponse;
}


export class Wallet {
  state: State = {
    url: 'https://mainnet.lightwalletd.com:9067',
    dataDir: 'data',
    chain: 'main',
    ufvk: null,
  }
  rpc: RPC
  constructor(ufvk) {
    this.rpc = new RPC(
      setTotalBalance,
      this.setAddresses,
      this.setTransactionList,
      setInfo,
      setZecPrice,
      setWalletSettings,
      setVerificationProgress
    );
    if (ufvk) {
      this.setState({ ufvk });
    }
    this.initialize(ufvk);
  }

  setTransactionList = (transactions: Transaction[]) => {
    if (deepDiff(transactions, this.state.transactions)) {
      this.setState({ transactions });
    }
  }

  get addresses() {
    return this.state.addresses;
  }

  get transactions() {
    return this.state.transactions;
  }

  setAddresses = (addresses: Address[]) => {
    if (deepDiff(addresses, this.state.addresses)) {
      console.log('=============== addresses', addresses.length);
      this.setState({ addresses });
    }
  }

  async initialize(ufvk) {
    const { url, chain, dataDir } = this.state;
    if (!zingolib_wallet_exists(chain, dataDir)) {
      console.log('!zingolib_wallet_exists')
      // Show the wallet creation screen
      if (ufvk || this.state.ufvk) {
        // await this.createNewWalletFromUfvk(this.state.ufvk, /*RPC.fetchWalletHeight()*/ null);
        // const birthday = await RPC.fetchWalletHeight();
        // console.log({ birthday });
        const blockHeight = await getBlockHeight();
        console.log('createNewWalletFromUfvk');
        
        await this.createNewWalletFromUfvk(ufvk || this.state.ufvk, Number(blockHeight));
      } else {
        console.log('createNewWallet');
        await this.createNewWallet();
      }

      const rpcConfig = new RPCConfig();
      rpcConfig.url = url;
      rpcConfig.chain = chain;
  
      this.rpc.configure(rpcConfig);
    } else {
      console.log('zingolib_wallet_exists');
      const result: string =
        zingolib_initialize_existing(url, chain, dataDir);
      if (result !== "OK") {
        throw new Error('Error Initializing Lightclient')
      }
      const rpcConfig = new RPCConfig();
      rpcConfig.url = url;
      rpcConfig.chain = chain;
      rpcConfig.dataDir = dataDir;

      this.rpc.configure(rpcConfig);
    }
  }

  deinitialize() {
    this.rpc.rpcConfig = null;
    this.rpc.clearTimers();
    return zingolib_deinitialize();
  }

  setState(newState: Partial<State>) {
    const state = this.state;
    this.state = {
      ...state,
      ...newState,
    };
  }

  // addresses = async () => {
  //   // return await RPC.createNewAddress(AddressType.sapling);
  //   return await RPC.addresses();
  // }

  encryptMessage = async () => {
    // await RPC.encryptMessage()
  }

  createNewWallet = async () => {
    const { url, chain, dataDir } = this.state;
    const result: string = zingolib_initialize_new(url, chain, dataDir);
  
    if (result.toLowerCase().startsWith("error")) {
      console.log(result);
      // this.setState({ walletScreen: 2, newWalletError: result });
    } else {
      const seed: string = await RPC.fetchSeed();
      // console.log({ seed });
      // this.setState({ walletScreen: 2, seed });
    }
  };

  createNewWalletFromUfvk = async (ufvk, birthday, overwrite = false) => {
    const { url, chain, dataDir } = this.state;
    const result: string = zingolib_initialize_new_from_ufvk(url, ufvk, birthday, overwrite, chain, dataDir);
  
    if (result.toLowerCase().startsWith("error")) {
      console.log(result);
      // this.setState({ walletScreen: 2, newWalletError: result });
    } else {
      const seed: string = await RPC.fetchSeed();
      // console.log({ seed });
      // this.setState({ walletScreen: 2, seed });
    }
  };
}