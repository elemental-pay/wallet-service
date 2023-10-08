export default class RPCConfig {
  url: string;
  chain: 'main' | 'test' | 'regtest' | "";
  dataDir: string;

  constructor() {
    this.url = "";
    this.chain = "";
    this.dataDir = "";
  }
}
