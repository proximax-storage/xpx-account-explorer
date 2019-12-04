<template>
  <div class="filter">
    <div class="filter-cont">

      <div>
        <span>Filter by:</span>
      </div>

      <div>
        <select name="TransactionType" id="select" placeholder="Type" class="proximax-btn-white" @change="sendType" v-model="selectValue">
          <option value="all">All</option>
          <option value="transfer">Transfer</option>
          <option value="bonded">Aggregate Bonded</option>
          <option value="regnam">Register Namespace</option>
          <option value="addali">Address Alias</option>
          <option value="mosali">Mosaic Alias</option>
          <option value="mosdef">Mosaic Definition</option>
          <option value="mosuch">Mosaic Supply Change</option>
          <option value="momuacc">Modify Multisig Account</option>
          <option value="complete">Aggregate Complete</option>
          <option value="lock">Lock</option>
          <option value="selock">Secret Lock</option>
          <option value="seproof">Secret Proof</option>
        </select>
      </div>

    </div>
  </div>
</template>

<script>
export default {

  name: 'AppFilter',

  data () {
    return {
      selectValue: 'all',
      all: [
        16724,
        16718,
        16974,
        17230,
        16717,
        16973,
        16725,
        16705,
        16961,
        16712,
        16722,
        16978,
        16720,
        16976,
        17232,
        16716,
        16701,
        16957,
        17213,
        16727,
        16728,
        16729
      ]
    }
  },

  methods: {
    sendType () {
      switch (this.selectValue) {
        case 'all':
          this.$emit('transactionType', this.all)
          break
        case 'transfer':
          this.$emit('transactionType', [16724])
          break
        case 'bonded':
          this.$emit('transactionType', [16961])
          break
        case 'regnam':
          this.$emit('transactionType', [16718])
          break
        case 'addali':
          this.$emit('transactionType', [16974])
          break
        case 'mosali':
          this.$emit('transactionType', [17230])
          break
        case 'mosuch':
          this.$emit('transactionType', [16973])
          break
        case 'momuacc':
          this.$emit('transactionType', [16725])
          break
        case 'complete':
          this.$emit('transactionType', [16705])
          break
        case 'lock':
          this.$emit('transactionType', [16712])
          break
        case 'selock':
          this.$emit('transactionType', [16718])
          break
        case 'seproof':
          this.$emit('transactionType', [16978])
          break
        case 'modaccresadd':
          this.$emit('transactionType', [16720])
          break
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
