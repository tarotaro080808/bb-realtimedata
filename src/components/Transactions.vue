<template>
  <div>
    <table>
      <tbody>
        <tr>
          <th colspan="3"><p class="heading">歩み値</p></th>
        </tr>
        <tr>
          <th>時間</th>
          <th>価格</th>
          <th>数量</th>
        </tr>
        <tr v-for="item in items" v-bind:key="item.transaction_id">
          <td>{{ item.executed_at | time }}</td>
          <td class="type-def" v-bind:class="{ type: isBuy(item.side) }">{{ item.price }}</td>
          <td class="align-right">{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  filters: {
    // タイムフォーマット
    time: function(value) {
      return moment(value).format('HH:mm:ss')
    }
  },
  methods: {
    // sell or buy 判定
    isBuy: function(side) {
      if (side === 'sell') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
