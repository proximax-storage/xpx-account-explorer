import {
  // QueryParams,
  // Address,
  // Id,
  // MosaicId,
  // TransactionType,
  // PublicAccount,
  // MosaicInfo,
  // MosaicService,
  // NetworkType
  AccountHttp,
  BlockHttp,
  ChainHttp,
  MosaicHttp,
  NamespaceHttp,
  TransactionHttp
} from 'tsjs-xpx-chain-sdk'

class Connections {
  constructor (node) {
    this.node = node
    this.mosaicHttp = new MosaicHttp(this.node)
    this.blockHttp = new BlockHttp(this.node)
    this.chainHttp = new ChainHttp(this.node)
    this.accountHttp = new AccountHttp(this.node)
    this.namespaceHttp = new NamespaceHttp(this.node)
    this.transactionHttp = new TransactionHttp(this.node)
  }
}

class ConnectionData {
  constructor () {
    this.url = ''
  }

  static getBuildUrl (node, protocol) {
    switch (protocol) {
      case 'http':
        this.url = `${protocol}://${node}:3000`
        break
      case 'https':
        this.url = `${protocol}://${node}:443`
        break
    }

    return this.url
  }
}

export { Connections, ConnectionData }
