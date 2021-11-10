<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      // 生成测试数据
      const xData = (function() {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + 'month')
        }
        return data
      }())
      this.chart.setOption({
        // 背景色，默认无背景
        backgroundColor: '#344b58',
        // 标题组件，包含主标题和副标题。
        title: {
          // 主标题文本，支持使用 \n 换行
          text: 'statistics',
          x: '20',
          // title 组件离容器上侧的距离。
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        // 提示框组件。
        tooltip: {
          // 触发类型。
          trigger: 'axis',
          // 坐标轴指示器配置项。
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        // 直角坐标系内绘图网格，
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        // 图例组件。-> https://echarts.apache.org/zh/option.html#legend
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['female', 'male', 'average']
        },
        // 显示或隐藏手柄（手柄能拖拽改变值域
        calculable: true,
        // 直角坐标系 grid 中的 x 轴
        xAxis: [{
          // 坐标轴类型。
          type: 'category',
          // 坐标轴轴线相关设置。
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          // 坐标轴在 grid 区域中的分隔线。
          splitLine: {
            show: false
          },
          // 坐标轴刻度相关设置。
          axisTick: {
            show: false
          },
          // 坐标轴在 grid 区域中的分隔区域，默认不显示。
          splitArea: {
            show: false
          },
          // 坐标轴刻度标签的相关设置。
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        // 直角坐标系 grid 中的 y 轴，
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],

        // dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
        // https://echarts.apache.org/zh/option.html#dataZoom-slider.show
        dataZoom: [{
          // 是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
          show: true,
          height: 30,
          // 设置 dataZoom-slider 组件控制的 x轴
          xAxisIndex: [
            0
          ],
          // dataZoom-slider组件离容器下侧的距离
          bottom: 30,
          // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%
          start: 10,
          // 数据窗口范围的结束百分比。范围是：0 ~ 100。
          end: 80,
          // 两侧缩放手柄的 icon 形状，支持路径字符串，-> https://echarts.apache.org/zh/option.html#dataZoom-slider.handleIcon
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          // 控制手柄的尺寸，可以是像素大小，也可以是相对于 dataZoom 组件宽度的百分比，默认跟 dataZoom 宽度相同。
          handleSize: '110%',
          // 两侧缩放手柄的样式配置
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          // 边框颜色。
          borderColor: '#90979c'

        }, {
          // 内置型数据区域缩放组件（dataZoomInside）
          type: 'inside',
          show: true,
          height: 15,
          // 内置型数据区域缩放组件（dataZoomInside）
          start: 1,
          // 数据窗口范围的结束百分比。范围是：0 ~ 100。
          end: 35
        }],
        series: [{
          name: 'female',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            709,
            1917,
            2455,
            2610,
            1719,
            1433,
            1544,
            3285,
            5208,
            3372,
            2484,
            4078
          ]
        },

        {
          name: 'male',
          type: 'bar',
          // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            327,
            1776,
            507,
            1200,
            800,
            482,
            204,
            1390,
            1001,
            951,
            381,
            220
          ]
        }, {
          name: 'average',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            1036,
            3693,
            2962,
            3810,
            2519,
            1915,
            1748,
            4675,
            6209,
            4323,
            2865,
            4298
          ]
        }
        ]
      })
    }
  }
}
</script>
