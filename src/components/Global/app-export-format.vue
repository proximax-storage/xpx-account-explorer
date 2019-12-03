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
          <!-- <div class='cont-button'>
            <input type='button' value='PDF' class='proximax-btn'>
          </div> -->
          <div class='cont-button'>

            <download-csv :data="dataTx" :name="dataFile" :labels="labels" :fields="fields">
              <input type='button' value='CSV' class='proximax-btn'>
            </download-csv>
          <!-- <button class='button'  v-on:click='exportCsv()' >CSV</button> -->
            <!-- <download-csv class='proximax-btn' :data='dataExport' :name='dataFile' :labels='labels' :fields='fields'>
            <button class='button'>CSV</button>
            </download-csv> -->
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'AppExportFormat',

  props: {
    dataTx: Array

  },
  mounted () {
  },
  data () {
    return {
      moduleName: '',
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
  }
}
</script>

<style scoped>
@import url('../../style.css');
</style>
