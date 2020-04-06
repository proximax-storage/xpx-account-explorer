<template>
    <div class='home-indicator'>
      <div class='child-indicator'>
        <div>Recent transaction</div>
      </div>

      <div>
        <div class='child-indicator'>
          <div class='cont-button' >
            <span>Export to:</span>
          </div>
          <div class='cont-button'>
            <button   style="cursor: pointer;"  class='proximax-btn' v-on:click="createPDF"> PDF </button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'GiftExport',

  mounted () {
  },

  data () {
    return {
      foldLabel: 'More Info',
      nodeInfoVisible: false,
      jsonData: [{}],
      dataFile: 'export.csv',
      fields: ['Sender', 'Recipient', 'Transaction', 'Amount', 'Message', 'Hash', 'Fee', 'Amount', 'Mosaic', 'Timestamp'],
      labels: {
        fname: 'First Name',
        lname: 'Last Name'
      },
      isExported: false
    }
  },

  methods: {
    createPDF () {
      window.print()
    }
  }
}
</script>

<style scoped>
@import url('../../style.css');
</style>
