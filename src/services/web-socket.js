import { Address, Listener } from 'tsjs-xpx-chain-sdk'

class WSConnection {
  constructor (store) {
    this.store = store
    this.connector = []
    this.currentWallet = null
    this.block = null
  }

  connectnWs (node = '') {
    this.connector = []
    const route = (node === '') ? localStorage.getItem('currentNode') : node
    const protocol = (window.location.protocol === 'http:') ? 'ws' : 'wss'
    const port = (window.location.protocol === 'http:') ? '3000' : '443'
    const url = `${protocol}://${route}:${port}`
    this.currentWallet = (localStorage.getItem('myAccounts')) ? JSON.parse(localStorage.getItem('myAccounts')) : null
    const audio = new Audio('../assets/audio/ding.ogg')
    // const audio2 = new Audio('assets/audio/ding2.ogg')

    if (this.currentWallet) {
      this.currentWallet.forEach(element => {
        const connection = new Listener(url, WebSocket)
        this.connector.push(connection)
        const address = Address.createFromRawAddress(element.address)
        connection.open().then(() => {
          this.getConfirmedSocket(connection, audio, address)
          this.getUnConfirmedAddedSocket(connection, audio, address)
          this.getStatusSocket(connection, audio, address)
          this.getBlockSocket(connection)
        }, (error) => {
          setTimeout(() => {
            console.error(error)
          }, 500)
        })
      })
    }
  }

  getConfirmedSocket (connector, audio, address) {
    connector.confirmed(address).subscribe(async confirmed => {
      let tmpObj = {
        active: true,
        type: 'success',
        title: 'confirmed',
        message: 'transaction confirmed'
      }
      this.setTransactionStatus({
        type: 'confirmed',
        hash: confirmed.transactionInfo.hash
      })
      this.store.dispatch('newNotification', tmpObj)
      audio.play()
    })
  }

  getUnConfirmedAddedSocket (connector, audio, address) {
    connector.unconfirmedAdded(address).subscribe(async unconfirmedAdded => {
      let tmpObj = {
        active: true,
        type: 'info',
        title: 'unconfirmed',
        message: 'transaction unconfirmed'
      }
      this.setTransactionStatus({
        type: 'unconfirmed',
        hash: unconfirmedAdded.transactionInfo.hash
      })
      this.store.dispatch('newNotification', tmpObj)
      audio.play()
    })
  }

  getStatusSocket (connector, audio, address) {
    let tmpObj = {
      active: true,
      type: 'error',
      title: 'load failed',
      message: 'file not allowed'
    }
    connector.status(address).subscribe(status => {
      tmpObj.message = status.status.split('_').join(' ')
      this.store.dispatch('newNotification', tmpObj)
      this.setTransactionStatus({
        type: 'status',
        hash: status.hash
      })
    })
  }

  getBlockSocket (connector) {
    connector.newBlock().subscribe((blockInfo) => {
      this.saveBlockInfo(blockInfo)
    }, err => {
      let tmpObj = {
        active: true,
        type: 'error',
        title: 'load failed',
        message: err
      }
      this.store.dispatch('newNotification', tmpObj)
    })
  }

  saveBlockInfo (blockInfo) { // Update-sdk-dragon
    if (blockInfo !== null) {
      this.block = blockInfo.height.compact()
      this.validateBlock(blockInfo)
      return
    }
    this.block = null
  }

  setTransactionStatus (value) {
    this.store.dispatch('statusTx', value)
  }
  validateBlock (blockInfo) {
    console.log(blockInfo)
    if (blockInfo.numTransactions && blockInfo.numTransactions >= 1) {
      const blocksStorage = localStorage.getItem('sw-blocks')
      if (blocksStorage) {
        const parsedData = JSON.parse(blocksStorage)
        parsedData.unshift(blockInfo)
        localStorage.setItem('sw-blocks', JSON.stringify(parsedData.slice(0, 100)))
      } else {
        localStorage.setItem('sw-blocks', JSON.stringify([blockInfo]))
      }
    }
  }
  reconnect () {
    if (this.connector) {
      console.log('Destruye conexion con el websocket')
      this.connector.forEach(element => {
        element.close()
        element.terminate()
      })
    }
    this.connectnWs()
  }

  close () {
    if (this.connector.length > 0) {
      console.log('Destruye conexion con el websocket')
      this.connector.forEach(element => {
        element.close()
        element.terminate()
      })
    }
  }
}

export { WSConnection }
