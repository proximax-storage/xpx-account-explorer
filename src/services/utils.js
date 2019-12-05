import { TransactionType, Deadline } from 'tsjs-xpx-chain-sdk'

/**
 * Class to format the data in the explorer
 */
export default class Utils {
  /**
   * Method to format coin
   * @param data
   * @memberof Utils
   */
  static fmtAmountValue (data) {
    if (data === null) { return }
    if (!data) {
      return "<b>0.</b><span class='dim'>000000</span>"
    } else {
      let a = data / 1000000
      let b = a.toFixed(6).split('.')
      let r = "<span class='sep'><strong>" + b[0].split(/(?=(?:...)*$)/).join("<span class='sep'>,")
      return r + ".</strong><span class='dim'>" + b[1] + '</span>'
    }
  }
  static amountFormatterSimple (amount) {
    const amountDivisibility = Number(amount) / Math.pow(10, 6)
    return amountDivisibility.toLocaleString('en-us', {
      minimumFractionDigits: 6
    })
  }

  /**
   * Method to format integer with thousands separator
   * @param data
   * @memberof Utils
   */
  static fmtIntValue (data) {
    if (!data) {
      return '<b>0</b>'
    } else {
      let a = data.toString()
      let r = '<span class="sep"><strong>' + a.split(/(?=(?:...)*$)/).join('<span class="sep">,')
      return r + '</strong>'
    }
  }

  /**
   * Method for currency format depending on the divisibility
   * @param quantity
   * @param divisibility
   * @memberof Utils
   */
  static fmtDivisibility (quantity, divisibility) {
    let init = '1'
    for (let i = 0; i < divisibility; i++) {
      init += '0'
    }
    if (!quantity || quantity === null) {
      let vacio = 0 / parseFloat(init)
      let b = vacio.toFixed(divisibility).split('.')
      let r = "<span class='sep'><strong>" + b[0].split(/(?=(?:...)*$)/).join("<span class='sep'>,")
      return r + ".</strong><span class='dim'>" + b[1] + '</span>'
    } else {
      let a = parseFloat(quantity) / parseFloat(init)
      let b = a.toFixed(divisibility).split('.')
      let r = "<span class='sep'><strong>" + b[0].split(/(?=(?:...)*$)/).join("<span class='sep'>,")
      return r + ".</strong><span class='dim'>" + b[1] + '</span>'
    }
  }

  /**
   * Method for data format
   * @param format date with class date of js
   * @memberof Utils
   */
  static fmtTime (format) {
    let date = new Date(format)
    let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()
    let month = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()
    let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()
    let seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds()
    let final = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return final
  }

  /**
   * Method to calculate the duration of a namespace
   * @param duration of namespace
   */
  static calculateDuration (duration) {
    let seconds = duration * 15
    let days = Math.floor(seconds / (3600 * 24))
    seconds -= days * 3600 * 24
    let hrs = Math.floor(seconds / 3600)
    seconds -= hrs * 3600
    let mnts = Math.floor(seconds / 60)
    seconds -= mnts * 60
    const response = days + ' days, ' + hrs + ' Hrs, ' + mnts + ' Minutes, ' + seconds + ' Seconds'
    return response
  }

  static maskAddress (_address, end = 10) {
    if (_address == null) return false
    let address = _address
      .toString()
      .toUpperCase()
      .replace(/-/g, '')
    if (!address || address.length !== 40) return false
    let addressForm = address
      .toUpperCase()
      .replace(/-/g, '')
      .match(/.{1,6}/g)
      .join('-')
    let onePart = ''
    let twoPart = ''
    let mask = ''
    onePart = addressForm.slice(0, end)
    twoPart = addressForm.slice(
      addressForm.length - onePart.length,
      addressForm.length
    )
    mask = `${onePart}****${twoPart}`
    return mask
  }

  static getNameTypeTransaction (transactionId) {
    const arraTypeTransaction = {
      transfer: {
        id: TransactionType.TRANSFER,
        name: 'Transfer'
      },
      registerNameSpace: {
        id: TransactionType.REGISTER_NAMESPACE,
        name: 'Register namespace'
      },
      mosaicDefinition: {
        id: TransactionType.MOSAIC_DEFINITION,
        name: 'Mosaic definition'
      },
      mosaicSupplyChange: {
        id: TransactionType.MOSAIC_SUPPLY_CHANGE,
        name: 'Mosaic supply change'
      },
      modifyMultisigAccount: {
        id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
        name: 'Modify multisig account'
      },
      aggregateComplete: {
        id: TransactionType.AGGREGATE_COMPLETE,
        name: 'Aggregate complete'
      },
      aggregateBonded: {
        id: TransactionType.AGGREGATE_BONDED,
        name: 'Aggregate bonded'
      },
      lock: {
        id: TransactionType.LOCK,
        name: 'Lock'
      },
      secretLock: {
        id: TransactionType.SECRET_LOCK,
        name: 'Secret lock'
      },
      secretProof: {
        id: TransactionType.SECRET_PROOF,
        name: 'Secret proof'
      }
    }
    const x = Object.keys(arraTypeTransaction).find(element => {
      return arraTypeTransaction[element].id === transactionId
    })
    return arraTypeTransaction[x].name
  }

  static async getStructureDashboard (transaction, config, provider) {
    let structureCsv = []
    let structureTx = []
    let message = ''
    let transactionName = ''
    transaction.forEach(async element => {
      try {
        let block = await provider.blockHttp.getBlockByHeight(element.transactionInfo.height.compact()).toPromise()
        element.block = this.fmtTime(block.timestamp.compact() + (Deadline.timestampNemesisBlock * 1000))
      } catch (error) {
        element.block = null
        console.warn('Error in block', error)
      }
      switch (element.type) {
        case TransactionType.TRANSFER:
          element.totalAmount = 0
          element.mosaics.forEach(mosaic => {
            mosaic.id = mosaic.id.toHex()
            mosaic.amount = mosaic.amount.compact()
            if (mosaic.id === config.coin.mosaic.id) {
              element.totalAmount += mosaic.amount
              element.lllll = mosaic.amount
            } else if (mosaic.id === config.coin.namespace.id) {
              element.totalAmount += mosaic.amount
            }
          })
          message = (element.message.type === 0) ? element.message.payload : '<encrypted>'
          transactionName = this.getNameTypeTransaction(element.type)
          structureCsv.push({
            Sender: element.signer.address.pretty(),
            Recipient: element.recipient.address,
            Transaction: transactionName,
            Amount: this.amountFormatterSimple(element.totalAmount),
            Message: message,
            Hash: element.transactionInfo.hash,
            Fee: this.amountFormatterSimple(element.maxFee.compact()),
            Mosaic: 'XPX',
            Timestamp: element.block
          })
          structureTx.push(element)
          break
        case TransactionType.AGGREGATE_BONDED:
          element.totalAmount = 0
          if (element.innerTransactions.length > 0) {
            for (let init of element.innerTransactions) {
              if (init.type === TransactionType.TRANSFER) {
                init.mosaics.forEach(mosaic => {
                  mosaic.id = mosaic.id.toHex()
                  mosaic.amount = mosaic.amount.compact()
                  if (mosaic.id === config.coin.mosaic.id) {
                    element.totalAmount += mosaic.amount
                    element.lllll = mosaic.amount
                  } else if (mosaic.id === config.coin.namespace.id) {
                    element.totalAmount += mosaic.amount
                  }
                })
              }
            }
          }
          message = (element.innerTransactions[0].message.type === 0) ? element.innerTransactions[0].message.payload : '<encrypted>'
          transactionName = this.getNameTypeTransaction(element.type)
          structureCsv.push({
            Sender: element.signer.address.pretty(),
            Recipient: element.innerTransactions[0].recipient.address,
            Transaction: transactionName,
            Amount: this.amountFormatterSimple(element.totalAmount),
            Message: message,
            Hash: element.transactionInfo.hash,
            Fee: this.amountFormatterSimple(element.maxFee.compact()),
            Mosaic: 'XPX',
            Timestamp: element.block
          })
          structureTx.push(element)
          break
      }
    })
    return {
      transactions: structureTx,
      structureCsv: structureCsv
    }
  }
  static getStructureCsv (data) {
    let dataStructure = []
    for (let element of data) {
      console.log('element', element)
      switch (element.type) {
        case TransactionType.TRANSFER:
          const message = (element.message.type === 0) ? element.message.payload : '<encrypted>'
          const transactionName = this.getNameTypeTransaction(element.type)
          dataStructure.push({
            Sender: element.signer.address.pretty(),
            Recipient: element.recipient.address,
            Transaction: transactionName,
            Amount: this.amountFormatterSimple(element.totalAmount),
            Message: message,
            Hash: element.transactionInfo.hash,
            Fee: this.amountFormatterSimple(element.maxFee.compact()),
            Mosaic: 'XPX',
            Timestamp: element.block
          })
          break
      }
    }
    return dataStructure
  }
}
