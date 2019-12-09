<template>
  <div class="transactions">
    <module-header :name="moduleName"/>

    <div class="transaction-cont">
      <div class="box-grey mb-10">
        <h1 class="title txt-left">File selection</h1>
        <form action="">
          <input type="file" id="fileSelect" style="display: none" @change="readFile">
          <label for="fileSelect" class="proximax-btn">Choose file</label>
          <div class="mt-10 fold" v-if="fileName !== null">{{ fileName }}</div>
        </form>

        <div class="mt-10 fold">
          <input type="button" @click="changeState">
        </div>
      </div>

      <div v-if="fileExist === null">
        <h1 class="title txt-left">Example table</h1>
        <table class="table-setting">
          <tr>
            <th class="txt-left">Sender</th>
            <th class="txt-left">Recipient</th>
            <th class="txt-left">Address</th>
            <th class="txt-left">Mosaic</th>
            <th class="txt-left">Value</th>
          </tr>
          <tr>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
          </tr>
        </table>
      </div>

      <div v-if="fileExist !== null">
        <h1 class="title txt-left">File table</h1>
        <table class="table-setting">
          <tr>
            <th class="txt-left">Sender</th>
            <th class="txt-left">Recipient</th>
            <th class="txt-left">Address</th>
            <th class="txt-left">Mosaic</th>
            <th class="txt-left">Value</th>
          </tr>
          <tr>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
            <td class="txt-left">hola</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'

export default {
  name: 'Transactions',

  components: {
    ModuleHeader
  },

  data () {
    return {
      moduleName: 'Transactions (CSV file)',
      fileName: null,
      fileExist: null
    }
  },

  methods: {
    readFile (event) {
      console.log(event.target.files)
      if ([undefined, null].includes(event.target.files) === false) {
        console.log(event.target.files[0].name)
        this.fileName = event.target.files[0].name
      }
    },

    changeState () {
      this.fileExist = (this.fileExist === null) ? 'algo' : null
    }
  }
}
</script>

<style scoped>
 @import url('../style.css');
</style>
