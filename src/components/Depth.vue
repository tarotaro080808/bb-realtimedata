<template>
  <div>
    <p class="heading">デプスチャート</p>
    <div class="settings">
      <p>自動更新タイミング</p>
      <div
        v-for="settingTime in settingTimes"
        :key="settingTime.id"
        class="form-checkbox form-checkbox-radio"
      >
        <label :for="settingTime.id" class="form-checkbox-label">
          <input
            :id="settingTime.id"
            type="radio"
            class="form-checkbox-input"
            v-model="setting"
            :value="settingTime.value"
          >
          {{ settingTime.label }}
          <span class="form-checkbox-sign"></span>
        </label>
      </div>
    </div>
    <div class="chartdiv" ref="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_dark from '@amcharts/amcharts4/themes/dark'
am4core.useTheme(am4themes_dark)
let chart = null
let res = [400]

export default {
  data() {
    return {
      setting: 10000,
      settingTimes: [
        { id: 't0', label: '5秒', value: 5000 },
        { id: 't1', label: '10秒', value: 10000 },
        { id: 't2', label: '30秒', value: 30000 },
        { id: 't3', label: '1分', value: 60000 },
        { id: 't4', label: '自動更新しない', value: 'off' }
      ]
    }
  },
  watch: {
    setting: function(val) {
      if (val === 'off') {
        chart.dataSource.reloadFrequency = undefined
      } else {
        // Validation
        const target = this.settingTimes.some(
          settingTime => settingTime.value === val
        )
        if (target) {
          chart.dataSource.reloadFrequency = Number(val)
        }
      }
      chart.dataSource.load()
    }
  },
  methods: {
    processData(list, type, desc) {
      for (var i = 0; i < list.length; i++) {
        list[i] = {
          value: Number(list[i][0]),
          volume: Number(list[i][1])
        }
      }
      list.sort(function(a, b) {
        if (a.value > b.value) {
          return 1
        } else if (a.value < b.value) {
          return -1
        } else {
          return 0
        }
      })
      if (desc) {
        for (i = list.length - 1; i >= 0; i--) {
          if (i < list.length - 1) {
            list[i].totalvolume = list[i + 1].totalvolume + list[i].volume
          } else {
            list[i].totalvolume = list[i].volume
          }
          let dp = {}
          dp['value'] = list[i].value
          dp[type + 'volume'] = list[i].volume
          dp[type + 'totalvolume'] = list[i].totalvolume
          res.unshift(dp)
        }
      } else {
        for (i = 0; i < list.length; i++) {
          if (i > 0) {
            list[i].totalvolume = list[i - 1].totalvolume + list[i].volume
          } else {
            list[i].totalvolume = list[i].volume
          }
          let dp = {}
          dp['value'] = list[i].value
          dp[type + 'volume'] = list[i].volume
          dp[type + 'totalvolume'] = list[i].totalvolume
          res.push(dp)
        }
      }
    }
  },
  mounted() {
    chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.dataSource.url = 'https://public.bitbank.cc/xrp_jpy/depth'
    chart.dataSource.reloadFrequency = 10000
    chart.dataSource.adapter.add('parsedData', data => {
      res = []
      this.processData(data.data.bids, 'bids', true)
      this.processData(data.data.asks, 'asks', false)
      return res
    })
    chart.numberFormatter.numberFormat = '#,###.###'

    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'value'
    xAxis.renderer.minGridDistance = 50
    xAxis.title.text = 'Price (XRP/JPY)'

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis())
    yAxis.title.text = 'Volume'

    // Create series
    let series = chart.series.push(new am4charts.StepLineSeries())
    series.dataFields.categoryX = 'value'
    series.dataFields.valueY = 'bidstotalvolume'
    series.strokeWidth = 2
    series.stroke = am4core.color('#0f0')
    series.fill = series.stroke
    series.fillOpacity = 0.1
    series.tooltipText =
      'Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidsvolume}[/]'

    let series2 = chart.series.push(new am4charts.StepLineSeries())
    series2.dataFields.categoryX = 'value'
    series2.dataFields.valueY = 'askstotalvolume'
    series2.strokeWidth = 2
    series2.stroke = am4core.color('#f00')
    series2.fill = series2.stroke
    series2.fillOpacity = 0.1
    series2.tooltipText =
      'Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{asksvolume}[/]'

    // ボリューム（現在未使用）
    // let series3 = chart.series.push(new am4charts.ColumnSeries());
    // series3.dataFields.categoryX = "value";
    // series3.dataFields.valueY = "bidsvolume";
    // series3.strokeWidth = 1;
    // series3.fill = am4core.color("#000");
    // series3.fillOpacity = 0.2;

    // let series4 = chart.series.push(new am4charts.ColumnSeries());
    // series4.dataFields.categoryX = "value";
    // series4.dataFields.valueY = "asksvolume";
    // series4.strokeWidth = 1;
    // series4.fill = am4core.color("#000");
    // series4.fillOpacity = 0.2;

    chart.cursor = new am4charts.XYCursor()
  },
  beforeDestroy() {
    if (chart) {
      chart.dispose()
    }
  }
}
</script>

<style scoped>
.chartdiv {
  width: 100%;
  height: 300px;
}
@media (max-width: 767px) {
  .chartdiv {
    height: 200px;
  }
}
.chartdiv {
  font-size: 12px;
}
.form-checkbox {
  margin-top: 0.5rem;
  padding-left: 0;
}
.form-checkbox {
  position: relative;
  display: block;
  padding-left: 1.25rem;
  display: inline;
}
.form-checkbox:first-of-type {
  padding-left: 0;
}
.form-checkbox-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: -1.25rem;
}
input[type='checkbox'],
input[type='radio'] {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
}
.form-checkbox-radio input[type='radio'],
.form-checkbox-radio input[type='radio'] + .form-checkbox-sign:after {
  opacity: 0;
}
.form-checkbox .form-checkbox-sign:after,
.form-checkbox .form-checkbox-sign:before {
  content: ' ';
  display: inline-block;
  position: absolute;
  width: 17px;
  height: 17px;
  left: 0;
  cursor: pointer;
  border-radius: 3px;
  top: 0;
  border: 1px solid #818181;
  -webkit-transition: opacity 0.3s linear;
  transition: opacity 0.3s linear;
}
.form-checkbox-radio .form-checkbox-sign:after,
.form-checkbox-radio .form-checkbox-sign:before {
  content: ' ';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #818181;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 3px;
  padding: 1px;
  -webkit-transition: opacity 0.3s linear;
  transition: opacity 0.3s linear;
}
.form-checkbox-radio input[type='radio'],
.form-checkbox-radio input[type='radio'] + .form-checkbox-sign:after {
  opacity: 0;
}
.form-checkbox-radio input[type='radio']:checked + .form-checkbox-sign:after {
  width: 6px;
  height: 6px;
  background-color: #e1534e;
  border-color: #e1534e;
  top: 9px;
  left: 6px;
}
.form-checkbox-radio input[type='radio']:checked + .form-checkbox-sign:after {
  opacity: 1;
}
.form-checkbox-radio input[type='radio']:checked + .form-checkbox-sign:before {
  border-color: #e1534e;
}
.form-checkbox .form-checkbox-label {
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding-left: 25px;
  line-height: 18px;
  margin-bottom: 0;
  -webkit-transition: color 0.3s linear;
  transition: color 0.3s linear;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.form-checkbox-radio .form-checkbox-label {
  padding-top: 3px;
}
.settings p {
  font-size: 15px;
}
</style>
