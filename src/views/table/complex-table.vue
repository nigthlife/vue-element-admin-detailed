<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="filter-container">
      <!-- 关键字搜索 -->
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- imp选项 -->
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- type选项 -->
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <!-- 排序方式 -->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <!-- 导出按钮 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <!-- 显示评论家 -->
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <!-- 表格内容 -->
    <!-- border：是否带有纵向边框 -->
    <!-- fit：列的宽度是否自撑开 -->
    <!-- highlight-current-row：是否要高亮当前行 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- :class-name：根据升序降序动态改变样式  -->
      <!-- sortable：对应列是否可以排序，如果设置为 'custom'，
        则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
       -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <!-- 对row.timestamp的结果进行转换，并指定转换格式 -->
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!-- 对标题内容进行过滤器转换，将指定语言筛选出 -->
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 作者 -->
      <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <!-- 评论者，默认不可见 -->
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <!-- 级别 -->
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <!-- 阅读统计数 -->
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作类型 -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- 编辑当前行 -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <!-- 更改当前行为发布状态 -->
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <!-- 更改当前行为草稿状态 -->
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <!-- 删除当前行数据 -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 对话框 -->
    <!-- visible：是否显示 Dialog，支持 .sync 修饰符 -->
    <!--  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- 类型 -->
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- 级别 -->
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <!-- 评论 -->
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <div slot="footer" class="dialog-footer">
        <!-- 取消 -->
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <!-- 确定 -->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- 阅读统计模态框 -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <!-- 表格内容 -->
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <!-- 渠道 -->
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <!-- 设置页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 接口方法
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive 波浪指令
import { parseTime } from '@/utils' // 解析时间工具类
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件

// 语言类型选项
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
// 数组转换对象
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  // 指令
  directives: { waves },
  // 过滤器
  filters: {
    // 状态过滤器
    // 动态改变table中status的值
    statusFilter(status) {
      const statusMap = {
        // 出版
        published: 'success',
        // 草稿
        draft: 'info',
        // 已删除
        deleted: 'danger'
      }
      return statusMap[status]
    },
    // 类型过滤器
    typeFilter(type) {
      // 日历类型键值
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      // 用于优化table渲染
      tableKey: 0,
      // 用于存储需要显示的数据
      list: null,
      // 用于存储数据总条数
      total: 0,
      // 用于控制数据加载
      listLoading: true,
      // 用于存储数据查询数据
      listQuery: {
        // 页码
        page: 1,
        // 每页显示数据条数
        limit: 20,
        // 重要程度
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // 重用程度级别
      importanceOptions: [1, 2, 3],
      // 语言类型选项
      calendarTypeOptions,
      // 排序选项
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // 状态选项
      statusOptions: ['published', 'draft', 'deleted'],
      // 控制显示评论者
      showReviewer: false,
      // 临时变量
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      // 模态框可见状态
      dialogFormVisible: false,
      // 模态框操作状态
      dialogStatus: '',
      // 用于控制操作状态
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // 阅读统计可见状态
      dialogPvVisible: false,
      // 阅读数据
      pvData: [],
      // 验证规则
      rules: {
        type: [
          {
            // required是否必需验证
            required: true,
            message: '类型是必需的',
            // 应用于change事件
            trigger: 'change'
          }
        ],
        timestamp: [
          {
            // 数据类型
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            message: 'title is required',
            // 应用于焦点事件
            trigger: 'blur'
          }
        ]
      },
      downloadLoading: false
    }
  },
  // 实例被创建后执行
  created() {
    this.getList()
  },
  methods: {

    // 初始化获取数据
    getList() {
      // 设置显示正在加载
      this.listLoading = true

      // 调用接口并处理返回数据
      fetchList(this.listQuery).then(response => {
        // 获取数据
        this.list = response.data.items
        // 获取数据总数
        this.total = response.data.total

        // 模拟请求时间
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    // 用于查询等重新获取数据操作
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    // 修改状态处理，用于table表格动态修改status值
    handleModifyStatus(row, status) {
      // 消息弹框
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      // 设置当前行status数据
      row.status = status
    },

    // 排序更改，用于根据id升序或降序
    sortChange(data) {
      const { prop, order } = data
      // 根据id排序
      if (prop === 'id') {
        this.sortByID(order)
      }
    },

    // id排序
    sortByID(order) {
      // order：排序顺序
      if (order === 'ascending') {
        // 升序
        this.listQuery.sort = '+id'
      } else {
        // 降序
        this.listQuery.sort = '-id'
      }

      // 重新获取数据
      this.handleFilter()
    },

    // 恢复temp默认值
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },

    // 新增前预处理
    handleCreate() {
      // 重设默认值
      this.resetTemp()

      // 设置模态框操作状态为新增
      this.dialogStatus = 'create'

      // 设置模态框可见
      this.dialogFormVisible = true

      // $nextTick：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
      // 使用nextTick可立即使用更完的DOM
      this.$nextTick(() => {
        // 移除表单校验结果
        this.$refs['dataForm'].clearValidate()

        // 移除校验结果并重置字段值 (未测试)
        // this.$refs['dataForm'].resetFields()
      })

      /**
       * 原理：Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新 -> Vue 是异步执行 DOM 更新的
       *
       * 异步执行的运行机制:
       *  1、所有同步任务都在主线程上执行，形成一个执行栈
       *  2、主线程之外，还存在一个"任务队列"，只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
       *  3、一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，那些对应的异步任务，结束等待状态，进入执行栈，开始执行。
       *  4、主线程不断重复上面的第三步。
       *
       *
       * 事件循环：
       *  简单来说，Vue 在修改数据后，视图不会立刻更新，
       *  而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。
       *
       * 应用场景
       *  1、需要在视图更新之后，基于新的视图进行操作
       *  2、在 created 和 mounted 阶段，如果需要操作渲染后的试图，也要使用 nextTick 方法。
       *
       * 其他应用场景
       *  1、点击按钮显示原本以 v-show = false 隐藏起来的输入框，并获取焦点。
       *  2、点击获取元素宽度 -> this.$refs.myWidth.offsetWidth
       *
       * 参考地址：https://segmentfault.com/a/1190000012861862
       */
    },

    // 新增
    createData() {
      // 表单验证
      this.$refs['dataForm'].validate((valid) => {
        // 验证通过执行
        if (valid) {
          // 模拟id
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // 设置作者
          this.temp.author = 'vue-element-admin'

          // 新增接口
          createArticle(this.temp).then(() => {
            // 追加新增数据
            this.list.unshift(this.temp)
            // 模态框不可见
            this.dialogFormVisible = false
            // 提示信息
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              // 持续时间
              duration: 2000
            })
          })
        }
      })
    },

    // 更新前预处理
    handleUpdate(row) {
      // 复制需要更新的内容
      this.temp = Object.assign({}, row) // copy obj
      // 时间戳转换
      this.temp.timestamp = new Date(this.temp.timestamp)

      // 设置操作状态为更新
      this.dialogStatus = 'update'

      // 模态框可见
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // 清除表单验证结果
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 更新数据
    updateData() {
      // 表单验证
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // Object.assign(target, source1, source2)方法用于对象的合并，将源对象（ source ）的所有可枚举属性，复制到目标对象（ target ）。
          // 合并对象
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // 执行更新方法
          updateArticle(tempData).then(() => {
            // 查找目标元素，返回元素位置，找不到就返回-1
            const index = this.list.findIndex(v => v.id === this.temp.id)

            // 通过删除或替换现有元素或者原地添加新的元素来修改数组,
            // 并以数组形式返回被修改的内容。此方法会改变原数组
            this.list.splice(index, 1, this.temp)
            // 模态框不可见
            this.dialogFormVisible = false

            // 消息弹框
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 删除处理
    handleDelete(row, index) {
      // 消息弹框
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      // 删除数组中指定元素
      this.list.splice(index, 1)
    },

    // 阅读统计处理
    handleFetchPv(pv) {
      // 请求获取统计数据
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        // 设置统计模态框可见
        this.dialogPvVisible = true
      })
    },

    // 下载处理
    handleDownload() {
      // 设置下载加载状态
      this.downloadLoading = true

      // 导入Excel
      import('@/vendor/Export2Excel').then(excel => {
        // 设置Excel头部
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        // 过滤值
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        // 表格数据格式化
        const data = this.formatJson(filterVal)

        // 导出json为Excel
        excel.export_json_to_excel({
          // 头部
          header: tHeader,
          // 数据体
          data,
          // 导出Excel名称
          filename: 'table-list'
        })
        // 取消加载状态
        this.downloadLoading = false
      })
    },

    // json格式化，时间戳类型处理
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        // 判断值类型是否为时间戳
        if (j === 'timestamp') {
          // 解析时间，将一个时间范围解析成datetime格式或者timestamp格式
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    // 获取排序类，默认升序
    getSortClass: function(key) {
      console.log('key => ' + key)
      // key：默认值为id
      // 获取排序状态，升序或者降序
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
