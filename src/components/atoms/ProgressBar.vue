<template>
  <div class="progress">
    <div class="progress-bar progress-bar-buy" :style="getWidth(buyRatio)">
      買い
      <br>
      {{ buyRatio | formatRatio }}
      <span class="sr-only"></span>
    </div>
    <div class="progress-bar progress-bar-sell" :style="getWidth(sellRatio)">
      売り
      <br>
      {{ sellRatio | formatRatio }}
      <span class="sr-only"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sellRatio: {
      type: Number,
      required: true
    },
    buyRatio: {
      type: Number,
      required: true
    }
  },
  filters: {
    formatRatio: function(ratio) {
      return `${ratio}%`
    }
  },
  methods: {
    getWidth(ratio) {
      return `width: ${ratio}%;`
    }
  }
}
</script>

<style scoped>
.progress {
  display: -ms-flexbox;
  display: flex;
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: bold;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}
.progress {
  background-color: #ddd;
  border-radius: 3px;
  box-shadow: none;
  min-height: 30px;
}
@media (max-width: 767px) {
  .progress {
    font-size: 11px;
  }  
}
.progress-bar {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #007bff;
  transition: width 0.6s ease;
}
.progress-bar-buy {
  background-color: #029688;
}
.progress-bar-sell {
  background-color: #db524b;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
