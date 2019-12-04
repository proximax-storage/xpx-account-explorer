<template>
  <div class="Error box-grey">
    <div class="error">
      <h1>{{ title }}</h1>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppError',

  props: {
    title: String,
    text: String
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
