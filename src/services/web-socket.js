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
    const audio = new Audio('assets/audio/ding.ogg')
    // const audio2 = new Audio('assets/audio/ding2.ogg')

    if (this.currentWallet) {
      this.currentWallet.forEach(element => {
        const connection = new Listener(url, WebSocket)
        const address = Address.createFromRawAddress(element.address)
        connection.open().then(() => {
          this.getUnConfirmedAddedSocket(connection, audio, address)
        }, (error) => {
          setTimeout(() => {
            console.error(error)
          }, 500)
        })
      })
    }
  }
  getUnConfirmedAddedSocket (connector, audio, address) {
    console.log('address', address)
    connector.unconfirmedAdded(address).subscribe(async unconfirmedAdded => {
      console.log('asdasdasdsad', unconfirmedAdded)
      this.setTransactionStatus({
        type: 'unconfirmed',
        hash: unconfirmedAdded.transactionInfo.hash
      })
      audio.play()
    })
  }
  setTransactionStatus (value) {
    console.log(value)
    let tmpObj = {
      active: true,
      type: 'error',
      title: 'load failed',
      message: value.type
    }
    this.store.dispatch('newNotification', tmpObj)
  }
  open () {
    return this.ws
  }
  close () {}
}

export { WSConnection }
