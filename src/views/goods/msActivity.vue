<template>
  <div class="goods-manage">
    <div class="goods-manage-btn">
      <el-button type="danger" @click="deleteMsGoodsListBtn">批量删除</el-button>
    </div>
    <div class="goods-manage-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          fixed
          prop="msGoodsId"
          label="秒杀商品id"
          width="80"
        />
        <el-table-column
          prop="goodsImg"
          label="预览图"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 120px; height: 120px"
              :src="scope.row.goodsImg"
              :preview-src-list="[scope.row.goodsImg]"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsTitle"
          label="商品标题"
        />
        <el-table-column
          prop="msPrice"
          label="秒杀价格"
        />
        <el-table-column
          prop="msGoodsStock"
          label="秒杀库存"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          prop="createTime"
          label="订单状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.start === 0">未开始</el-tag>
            <el-tag v-else-if="scope.row.start === 1" type="success">进行中</el-tag>
            <el-tag v-else type="info">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="openMsActivity(scope.row.msGoodsId)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteMsGoodsBtnAction(scope.row.msGoodsId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="goods-manage-page">
      <el-pagination
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 修改秒杀活动对话框 -->
    <el-dialog
      title="修改秒杀活动"
      width="30%"
      :visible.sync="editMsActivityDialog"
      @close="flushEditMsForm"
    >
      <el-form ref="editMsActivityForm" :model="editMsActivityFrom" :rules="editMsActivityRule" label-position="left" label-width="80px">
        <el-form-item label="秒杀价" prop="msPrice">
          <el-input-number v-model="editMsActivityFrom.msPrice" :precision="2" :step="0.1" size="small" :min="1" />
        </el-form-item>
        <el-form-item label="秒杀库存" prop="msGoodsStock">
          <el-input-number v-model="editMsActivityFrom.msGoodsStock" size="small" :min="1" :max="currGoodsStock" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="editMsActivityFrom.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="editMsActivityFrom.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="flushEditMsForm">重 置</el-button>
        <el-button @click="cancelEditMsActivity">取 消</el-button>
        <el-button type="primary" @click="submitEditMsActivity('editMsActivityForm')">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listMsGoods, delMsGoods } from '@/api/msGoods'
import { updateMsActivity, getMsActivityById } from '@/api/msGoods'

export default {
  name: 'GoodsManage',
  data() {
    var validateEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择开始时间'))
      } else if (new Date() > new Date(this.editMsActivityFrom.endTime)) {
        callback(new Error('结束时间不能小于当前时间'))
      } else if (new Date(this.editMsActivityFrom.endTime) <= new Date(this.editMsActivityFrom.startTime)) {
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        callback()
      }
    }
    return {
      selectIds: [],
      tableData: [],
      currentPage: 1,
      totalPage: 1,

      // 当前创建秒杀活动的商品库存
      currGoodsStock: 0,
      editMsActivityDialog: false,
      editMsActivityFrom: {
        goodsId: 0,
        msPrice: 0.00,
        msGoodsStock: 1,
        startTime: '',
        endTime: ''
      },
      editMsActivityRule: {
        msPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        msGoodsStock: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
          { validator: validateEndTime, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted() {
    // 获取商品信息列表
    this.getListMsGoods(1)
  },
  methods: {
    /** 获取商品列表信息 */
    getListMsGoods(page) {
      listMsGoods(page).then(res => {
        this.totalPage = res.data.total
        var newMsGoodsList = []
        res.data.msGoodsList.forEach(element => {
          const now = new Date()
          const startTime = new Date(element.startTime)
          const endTime = new Date(element.endTime)
          if (now < startTime) {
            // 活动即将开始
            element.start = 0
          } else if (now > startTime && now < endTime) {
            // 立即钱够
            element.start = 1
          } else {
            // 活动结束
            element.start = 2
          }
          newMsGoodsList.push(element)
        })
        this.tableData = newMsGoodsList
      })
    },
    /**
     * 处理分页改变
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListMsGoods(val)
    },
    /**
     * 处理多选框
     */
    handleSelectionChange(val) {
      var ids = []
      val.forEach(element => {
        ids.push(element.msGoodsId)
      })
      this.selectIds = ids
    },
    /**
     * 删除按钮行为
     */
    deleteMsGoodsBtnAction(goodsId) {
      this.$confirm('此操作将永久删除该秒杀活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(goodsId)
        // 调用删除会员即接口
        this.delMsGoodsApi(ids)
      }).catch(() => {})
    },
    /**
     * 调用删除接口
     */
    delMsGoodsApi(ids) {
      delMsGoods(ids).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          // 重新请求数据
          this.getListMsGoods(this.currentPage)
        }
      })
    },
    /**
     * 批量删除
     */
    deleteMsGoodsListBtn() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择秒杀活动',
          type: 'warning'
        })
        return
      }
      // 询问是否删除再执行删除操作
      this.$confirm('此操作将永久删除秒杀活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除会员即接口
        this.delMsGoodsApi(this.selectIds)
      }).catch(() => {})
    },
    /**
     * 打开创建秒杀活动对话框
     */
    openMsActivity(id, stock) {
      getMsActivityById(id).then(res => {
        if (res.code === 20000) {
          this.editMsActivityFrom = res.data
          this.currGoodsStock = res.data.goodsStock
          this.editMsActivityFrom.goodsId = id
          this.editMsActivityDialog = true
        }
      })
    },
    /**
     * 清除表单
     */
    flushEditMsForm() {
      this.editMsActivityFrom = {
        goodsId: 0,
        msPrice: 0.00,
        msGoodsStock: 0,
        startTime: '',
        endTime: ''
      }
    },
    /**
     * 取消创建秒杀活动
     */
    cancelEditMsActivity() {
      this.flushEditMsForm()
      this.editMsActivityDialog = false
    },
    /**
     * 创建秒杀
     */
    submitEditMsActivity(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 修改秒杀活动信息操作
          updateMsActivity(this.editMsActivityFrom).then(res => {
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.getListMsGoods(this.currentPage)
              this.cancelEditMsActivity()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scpoed>
.goods-manage{
  padding: 20px;

  .goods-manage-table{
    margin-top: 30px;

    .goods-img{
      width: 120px;
      height: 120px;
    }
  }

  .goods-manage-page{
    margin-top: 40px;
    text-align: center;
  }
}
</style>

