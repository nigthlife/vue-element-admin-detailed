<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>

import echarts from 'echarts' // 导入echarts
import resize from './mixins/resize' // 调整大小

export default {
  // 混入(mixin) 分发Vue 组件中的可复用功能
  mixins: [resize],
  props: {
    // 控制样式
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
  // 在实例挂载完成后被调用
  mounted() {
    this.initChart()
  },
  // 实例销毁之前调用
  beforeDestroy() {
    if (!this.chart) {
      // chart为空结束调用
      return
    }
    // 释放echarts对象，避免内存泄露
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 图表初始化
    initChart() {
      // 通过 echarts.init 创建的实例。
      this.chart = echarts.init(document.getElementById(this.id))

      // x 轴数据
      const xAxisData = []
      const data = []
      const data2 = []
      for (let i = 0; i < 50; i++) {
        // 设置x 轴数据
        xAxisData.push(i)

        // 设置第一组数据
        data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
        // 设置第二组数据
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3)
      }

      /**
       * title            // 标题设置
       * legend           // 图例控制
       * grid             // 图例内网格控制
       * xAxis            // X轴
       * yAxis            // Y轴
       * polar            // 极坐标
       * radiusAxis       // 极坐标系径向轴
       * angleAxis        // 极坐标系的角度轴。
       * radar            // 雷达图坐标系组件
       * dataZoom         // 图表缩放控件
       * visualMap        // 视觉映射组件
       * tooltip          // 提示框控件
       * axisPointer      // 坐标轴指示器（axisPointer）的全局公用设置。
       * toolbox          // 工具栏。内置有导出图片，数据视图，动态类型切换，数据区域 缩放，重置五个工具。
       * brush            // 区域选择组件，用户可以选择图中一部分数据，从而便于向用户展示被选中数据，或者他们的一些统计计算结果。
       * geo              // 地理坐标系组件
       * parallel         // 平行坐标系（Parallel Coordinates） 是一种常用的可视化高维数据的图表。
       * parallelAxis     // 这个组件是平行坐标系中的坐标轴。
       * singleAxis       // 单轴。可以被应用到散点图中展现一维数据
       * timeline         // 时间轴控件，提供了在多个 ECharts option 间进行切换、播放等操作的功能。
       * graphic          // 原生图形元素组件。可以支持的图形元素包括：
       * calendar         // 日历坐标系组件。
       * dataset          // 数据集，用于单独的数据集声明
       * aria             // 无障碍富互联网应用规范集
       * series           // 系列列表。每个系列通过 type 决定自己的图表类型、
       * color            // 调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色。
       * backgroundColor  // 背景色
       * textStyle        // 全局的字体样式。
       * animation        // 是否开启动画
       * animationThreshold       // 是否开启动画的阈值，当单个系列显示的图形数量大于这个阈值时会关闭动画。
       * animationDuration        // 初始动画的时长，支持回调函数，可以通过每个数据返回不同的时长实现更戏剧的初始动画效果：
       * animationEasing          // 初始动画的缓动效果。
       * animationDelay           // 初始动画的延迟，支持回调函数，
       * animationDurationUpdate  // 数据更新动画的时长，支持回调函数
       * animationEasingUpdate    // 数据更新动画的缓动效果。
       * animationDelayUpdate     // 数据更新动画的延迟，支持回调函数，
       * blendMode                // 图形的混合模式
       * hoverLayerThreshold      // 图形数量阈值
       * useUTC                   // 是否使用 UTC 时间。
       * image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group。
       */
      // 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过 setOption 完成
      this.chart.setOption({
        // 设置背景颜色
        backgroundColor: '#08263a',
        // 网格大小
        grid: {
          left: '5%',
          right: '5%'
        },
        // x 轴数据
        xAxis: [{
          show: false,
          data: xAxisData
        }, {
          show: false,
          data: xAxisData
        }],
        // 视觉映射
        visualMap: {
          show: false,
          min: 0,
          max: 50,
          dimension: 0,
          inRange: {
            color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
          }
        },
        // y 轴数据
        yAxis: {
          // 轴线
          axisLine: {
            show: false
          },
          // 轴线标签
          axisLabel: {
            // 标签样式
            textStyle: {
              color: '#4a657a'
            }
          },
          // 分割线
          splitLine: {
            show: true,
            // 线条样式
            lineStyle: {
              color: '#08263f'
            }
          },
          // 坐标轴
          axisTick: {
            show: false
          }
        },
        // 设置系列列表。每个系列通过 type 决定自己的图表类型、
        series: [
          {
            // 底部数据
            name: 'back', // 系列名称，用于tooltip的显示，
            type: 'bar', // 设置图表类型 => 柱状图

            // series: [{
            //     data: [
            //         // 维度X   维度Y   其他维度 ...
            //         [  3.4,    4.5,   15,   43],
            //         [  4.2,    2.3,   20,   91],
            //         [  10.8,   9.5,   30,   18],
            //         [  7.2,    8.8,   18,   57]
            //     ]
            // }]
            // 在 直角坐标系 (grid) 中『维度X』和『维度Y』会默认对应于 xAxis 和 yAxis。
            // 在 极坐标系 (polar) 中『维度X』和『维度Y』会默认对应于 radiusAxis 和 angleAxis。
            // 只有一个轴为类目轴（axis.type 为 'category'）的时候，数据可以简化用一个一维数组表示
            data: data2,
            z: 1, // 控制图形的前后顺序。z值小的图形会被z值大的图形覆盖。
            // 图形样式。
            itemStyle: {
              // 正常情况显示
              normal: {
                // 不透明度 支持从 0 到 1 的数字，为 0 时不绘制该图形。
                opacity: 0.4,
                // 条边框半径
                barBorderRadius: 5,
                // 阴影模糊 -> 图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
                // shadowOffsetX: 阴影水平方向上的偏移距离。
                // shadowOffsetY: 阴影垂直方向上的偏移距离。
                shadowBlur: 3,
                // 阴影颜色
                shadowColor: '#111'
              }
            }
          },
          {
            // 模拟阴影
            name: 'Simulate Shadow',
            type: 'line', // 折线/面积图
            data,
            z: 2,
            // 显示符号 -> 如果 false 则只有在 tooltip hover 的时候显示。
            showSymbol: false,
            // 初始动画的延迟 -> 支持回调函数 详情：https://echarts.apache.org/zh/option.html#series-line.animationDelay
            animationDelay: 0,
            // 初始动画的缓动效果 -> 详情：https://echarts.apache.org/examples/zh/editor.html?c=line-easing
            animationEasing: 'linear',
            // 初始动画的时长，支持回调函数，详情：https://echarts.apache.org/zh/option.html#series-line.animationDuration
            animationDuration: 1200,
            // 线条样式 详情：https://echarts.apache.org/zh/option.html#series-line.lineStyle
            lineStyle: {
              // 正常显示
              normal: {
                // 颜色透明 默认从全局调色盘 option.color 获取颜色。
                color: 'transparent'
              }
            },
            // 区域填充样式 设置后显示成区域面积图。
            areaStyle: {
              normal: {
                color: '#08263a',
                // 图形阴影的模糊大小。
                shadowBlur: 50,
                // 阴影颜色
                shadowColor: '#000'
              }
            }
          },
          {
            // 正面
            name: 'front',
            type: 'bar',
            data,
            // x轴索引
            xAxisIndex: 1,
            z: 3,
            // 元素样式
            itemStyle: {
              normal: {
                // 条边框半径
                barBorderRadius: 5
              }
            }
          }
        ],
        // 初始动画的缓动效果 弹性输出 详情：https://echarts.apache.org/examples/zh/editor.html?c=line-easing
        animationEasing: 'elasticOut',
        // 数据更新动画的缓动效果 弹性输出
        animationEasingUpdate: 'elasticOut',
        // 初始动画的延迟，支持回调函数 详情：https://echarts.apache.org/zh/option.html#animationDelay
        animationDelay(idx) {
          return idx * 20
        },
        // 数据更新动画的延迟，支持回调函数 详情：https://echarts.apache.org/zh/option.html#animationDelayUpdate
        animationDelayUpdate(idx) {
          return idx * 20
        }
      })
    }
  }
}
</script>
