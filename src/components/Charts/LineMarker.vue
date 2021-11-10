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

      this.chart.setOption({
        // 背景颜色
        backgroundColor: '#394056',
        // 标题组件，包含主标题和副标题
        title: {
          // title 组件离容器上侧的距离。-> https://echarts.apache.org/zh/option.html#title.top
          top: 20,
          // 主标题文本，支持使用 \n 换行。
          text: 'Requests',
          // 文本样式
          textStyle: {
            // 主标题文字字体的粗细。-> https://echarts.apache.org/zh/option.html#title.textStyle.fontWeight
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          // title 组件离容器左侧的距离
          left: '1%'
        },
        // 提示框组件。
        tooltip: {
          // 触发类型。-> https://echarts.apache.org/zh/option.html#tooltip.trigger
          trigger: 'axis',
          // 坐标轴指示器配置项。
          axisPointer: {
            // https://echarts.apache.org/zh/option.html#tooltip.axisPointer.lineStyle
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          // 图例组件离容器上侧的距离。
          top: 20,
          // 图例项的 icon。-> https://echarts.apache.org/zh/option.html#legend.icon
          icon: 'rect',
          // 图例标记的图形宽度。
          itemWidth: 14,
          // 图例标记的图形高度。
          itemHeight: 5,
          // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔
          itemGap: 13,
          // 图例的数据数组 -> https://echarts.apache.org/zh/option.html#legend.data
          data: ['CMCC', 'CTCC', 'CUCC'],
          // 图例组件离容器右侧的距离。
          right: '4%',
          // 图例的公用文本样式。
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        // 直角坐标系内绘图网格，可以在网格上绘制折线图，柱状图，散点图（气泡图）
        grid: {
          // grid 组件离容器上侧的距离。
          top: 100,
          // grid 组件离容器左侧的距离。
          left: '2%',
          // grid 组件离容器右侧的距离。
          right: '2%',
          // grid 组件离容器下侧的距离
          bottom: '2%',
          // grid 区域是否包含坐标轴的刻度标签。-> https://echarts.apache.org/zh/option.html#grid.containLabel
          containLabel: true
        },

        // 直角坐标系 grid 中的 x 轴，一般情况下单个 grid 组件最多只能放上下两个 x 轴，
        // 多于两个 x 轴需要通过配置 offset 属性防止同个位置多个 x 轴的重叠。
        xAxis: [{
          // 坐标轴类型。-> https://echarts.apache.org/zh/option.html#xAxis.type
          type: 'category',
          // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
          boundaryGap: false,
          // 坐标轴轴线相关设置。
          axisLine: {
            lineStyle: {
              // 坐标轴线线的颜色。
              color: '#57617B'
            }
          },
          // 类目数据，在类目轴（type: 'category'）中有效。-> https://echarts.apache.org/zh/option.html#xAxis.data
          data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
        }],

        // 直角坐标系 grid 中的 y 轴，一般情况下单个 grid 组件最多只能放左右两个 y 轴，
        // 多于两个 y 轴需要通过配置 offset 属性防止同个位置多个 Y 轴的重叠。
        yAxis: [{
          // 坐标轴类型。-> https://echarts.apache.org/zh/option.html#yAxis.type
          type: 'value',
          // 坐标轴名称。
          name: '(%)',
          // 坐标轴刻度相关设置。
          axisTick: {
            // 是否显示坐标轴刻度。
            show: false
          },
          // 坐标轴轴线相关设置。
          axisLine: {
            lineStyle: {
              // 坐标轴线线的颜色。
              color: '#57617B'
            }
          },
          // 坐标轴刻度标签的相关设置。
          axisLabel: {
            // 刻度标签与轴线之间的距离
            margin: 10,
            textStyle: {
              // 文字的字体大小。文字水平对齐方式，默认自动。文字垂直对齐方式，默认自动。
              fontSize: 14
            }
          },
          // 坐标轴在 grid 区域中的分隔线。
          splitLine: {
            lineStyle: {
              // 坐标轴线线的颜色。
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'CMCC',
          type: 'line', // 折线/面积图
          smooth: true, // 是否平滑曲线显示。
          symbol: 'circle', // 标记的图形。-> https://echarts.apache.org/zh/option.html#series-line.symbol
          symbolSize: 5, // 标记的大小，
          showSymbol: false, // 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示。
          // 线条样式。
          lineStyle: {
            normal: {
              // 线宽。
              width: 1
            }
          },
          // 区域填充样式。设置后显示成区域面积图。
          areaStyle: {
            normal: {
              // https://echarts.apache.org/zh/option.html#graphic.id
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              // 阴影颜色。
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              // 图形阴影的模糊大小
              shadowBlur: 10
            }
          },
          // 折线拐点标志的样式。
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              // 图形的描边颜色
              borderColor: 'rgba(137,189,2,0.27)',
              // 描边线宽。为 0 时无描边。
              borderWidth: 12

            }
          },
          // 系列中的数据内容数组
          data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        }, {
          name: 'CTCC',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
        }, {
          name: 'CUCC',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
        }]
      })
    }
  }
}
</script>
