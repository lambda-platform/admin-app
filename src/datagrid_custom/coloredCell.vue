<template>
    <span style="color: red"> {{ params.value }}</span>
</template>

<script>

export default {
  mounted () {
    console.log(this.params)
    if(this.params.value === 60) {
      // this.params.eGridCell.classList.add("cell-red")
      //this.params.eGridCell.offsetParent.classList.add("cell-red")
    } else {
      // this.params.eGridCell.classList.add("cell-green")
    }



  }
};
</script>
<style>
.cell-red{
  background-color: red !important;

}
.cell-green{
  background-color: green;
}
</style>
