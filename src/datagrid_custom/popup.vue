<template>
    <span class="link link-icon" @click="getData">
    <span class="svg-icon">
      <inline-svg src="/assets/icons/duotone/Communication/Clipboard-check.svg"/>
    </span>
      <!--{{ this.params.value }}-->
    Харах
  </span>
  <a-modal
    v-model:open="showInfoModal"
    title="Дэлгэрэнгүй мэдээлэл"
    :footer="null"
  >
    <div>
      <h3>Дэлгэрэнгүй мэдээлэл: {{ this.params.value }}</h3>

      <table class="example-info-table">
        <thead>
        <tr>
          <th>Туршилтын</th>
          <th>Текстийн</th>
          <th>Хүснэгт</th>
          <th>Жишээ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Туршилтын 1</td>
          <td>Текстийн 1</td>
          <td>Хүснэгт 1</td>
          <td>Жишээ 1</td>
        </tr>
        <tr>
          <td>Туршилтын 2</td>
          <td>Текстийн 2</td>
          <td>Хүснэгт 2</td>
          <td>Жишээ 2</td>
        </tr>
        <tr>
          <td>Туршилтын 3</td>
          <td>Текстийн 3</td>
          <td>Хүснэгт 3</td>
          <td>Жишээ 3</td>
        </tr>
        <tr>
          <td>Туршилтын 4</td>
          <td>Текстийн 4</td>
          <td>Хүснэгт 4</td>
          <td>Жишээ 4</td>
        </tr>
        </tbody>
      </table>
    </div>
  </a-modal>
</template>

<script>

export default {
  data() {
    return {
      showInfoModal: false
    }
  },
  methods: {
    getData() {
        this.showInfoModal = true;
    }
  }
};
</script>
<style scoped lang="scss">
.example-info-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
}
.dark {
  .example-info-table {
    th {
      background-color: #010102;

    }
  }
}
</style>
