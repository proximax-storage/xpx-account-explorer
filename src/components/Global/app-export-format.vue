<template>
    <div class="home-indicator">
      <div class="child-indicator">
        <div>Recent transaction</div>
      </div>

      <div>
        <div class="child-indicator">
          <div class="cont-button" >
            <span>Export to:</span>
          </div>
          <div class="cont-button">
            <input type="button" value="PDF" class="proximax-btn">
          </div>
          <div class="cont-button">
            <input type="button" value="CSV" class="proximax-btn">
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'AppExportFormat',

  props: {
    dataExport: Array,
    myAccounts: String

  },
  mounted () {
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    exportCsv () {
      console.log(this.dataExport)
    }
  }
}
</script>

<style scoped>
@import url("../../style.css");
</style>
