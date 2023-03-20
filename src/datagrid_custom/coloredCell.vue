<template>
    <span>{{ params.value }}</span>
</template>
<script>
export default {
  mounted() {
    if(this.params.value >= 1) {
      this.params.eGridCell.classList.add("cell-green");
    } else {
      this.params.eGridCell.classList.add("cell-red");
    }
  }
};
</script>
<style >
.cell-red{
  background-color: #f54f4f;
}
.cell-green{
  background-color: rgba(0, 128, 0, 0.85);
}
</style>
