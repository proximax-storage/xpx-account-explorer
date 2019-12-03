<template>
  <div class="node-info">
    <div class="cont">
      <div class="box-grey">
        <div class="subtitle txt-left">Network Name</div>
        <div class="value txt-left">{{ networkName }}</div>
      </div>

      <div class="box-grey">
        <div class="subtitle txt-left">Network Type</div>
        <div class="value txt-left">{{ networkNumber }}</div>
      </div>
    </div>

    <div class="cont">
      <div class="box-grey">
        <div class="subtitle txt-left">Mosaic Id</div>
        <div class="value txt-left upper">{{ mosaicId }}</div>
      </div>

      <div class="box-grey">
        <div class="subtitle txt-left">Namespace Id</div>
        <div class="value txt-left upper">{{ namespaceId }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeInfo',

  data () {
    return {
      currentNode: this.$localStorage.get('currentBuildNode'),
      networkName: this.$config.network.name,
      networkNumber: this.$config.network.number,
      mosaicId: this.$config.coin.mosaic.id,
      namespaceId: this.$config.coin.namespace.id
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
