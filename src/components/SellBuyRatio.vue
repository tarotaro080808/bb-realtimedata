<template>
  <div>
    <p class="heading">取引ボリューム比率</p>
    <progress-bar :sellRatio="sell.ratio" :buyRatio="buy.ratio"/>
    <p class="reset-ratio align-right" @click="resetRatio">リセット</p>
  </div>
</template>

<script>
import ProgressBar from '@/components/atoms/ProgressBar'
import { BigNumber } from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 4 })

export default {
  props: {
    latestItem: {
      type: Object,
      required: true
    }
  },
  components: {
    ProgressBar
  },
  data() {
    return {
      sell: {
        ratio: 50,
        amount: 0
      },
      buy: {
        ratio: 50,
        amount: 0
      },
      totalAmount: 0
    }
  },
  watch: {
    latestItem: function(obj) {
      this.totalAmount = new BigNumber(this.totalAmount, 10)
        .plus(obj.amount)
        .toNumber()
      if (obj.side === 'buy') {
        this.buy.amount = new BigNumber(this.buy.amount, 10)
          .plus(obj.amount)
          .toNumber()
      } else if (obj.side === 'sell') {
        this.sell.amount = new BigNumber(this.sell.amount, 10)
          .plus(obj.amount)
          .toNumber()
      }
      this.buy.ratio = new BigNumber(this.buy.amount, 10)
        .div(this.totalAmount)
        .times(100)
        .toNumber()
      this.sell.ratio = new BigNumber(100, 10).minus(this.buy.ratio).toNumber()
    }
  },
  methods: {
    resetRatio: function() {
      this.sell = {
        ratio: 50,
        amount: 0
      }
      this.buy = {
        ratio: 50,
        amount: 0
      }
      this.totalAmount = 0
    }
  }
}
</script>

<style scoped>
.reset-ratio {
  cursor: pointer;
  font-size: 12px;
}
.reset-ratio:hover {
  text-decoration: underline;
}
.align-right {
  text-align: right;
}
</style>
