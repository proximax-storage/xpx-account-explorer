import { Address, Listener } from 'tsjs-xpx-chain-sdk'

class WSConnection {
  constructor (store) {
    this.store = store
    this.connector = []
    this.currentWallet = null
  }

  connectnWs (node = '') {
    console.log(this.ws)
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
        }, (error) => {
          setTimeout(() => {
            console.error(error)
          }, 500)
        })
      })
    }
  }

  getConfirmedSocket (connector, audio, address) {
    console.log('address', address)
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
    console.log('address', address)
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

  setTransactionStatus (value) {
    console.log('statusTx')
    this.store.dispatch('statusTx', value)
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
