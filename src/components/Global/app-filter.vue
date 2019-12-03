<template>
  <div class="filter">
    <div class="filter-cont">

      <div>
        <span>Filter by:</span>
      </div>

      <div>
        <select name="TransactionType" id="select" placeholder="Type" class="proximax-btn-white">
          <option value="">All</option>
          <option value="">Transfer</option>
          <option value="">Aggregate Bonded</option>
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
      title: 'Hola mundo 2'
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
