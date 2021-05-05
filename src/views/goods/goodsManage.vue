<template>
  <div class="goods-manage">
    <div class="goods-manage-btn">
      <el-button type="primary" @click="openOptionGoodsDialog(false)">发布商品</el-button>
      <el-button type="danger" @click="deleteGoodsListBtn">批量删除</el-button>
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
          prop="goodsId"
          label="商品id"
          width="100"
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
          prop="goodsName"
          label="商品名称"
        />
        <el-table-column
          prop="goodsTitle"
          label="商品标题"
        />
        <el-table-column
          prop="goodsPrice"
          label="商品价格"
        />
        <el-table-column
          prop="goodsStock"
          label="商品库存"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <!-- <el-table-column
          label="启用/停用"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isEnable"
              :active-value="1"
              :inactive-value="0"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="changeUserEnable($event, scope.row)"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              type="default"
              size="small"
              @click="openMsActivity(scope.row.goodsId, scope.row.goodsStock)"
            >创建秒杀活动</el-button>
            <el-button
              type="primary"
              size="small"
              @click="openEditGoodsDialog(scope.row.goodsId)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteGoodsBtnAction(scope.row.goodsId)"
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

    <!-- 创建秒杀活动对话框 -->
    <el-dialog
      title="创建秒杀活动"
      width="30%"
      :visible.sync="addMsActivityDialog"
      @close="flushAddMsForm"
    >
      <el-form ref="addMsActivityForm" :model="addMsActivityFrom" :rules="addMsActivityRule" label-position="left" label-width="80px">
        <el-form-item label="秒杀价" prop="msPrice">
          <el-input-number v-model="addMsActivityFrom.msPrice" :precision="2" :step="0.01" size="small" :min="1" @change="changeMsPrice" />
        </el-form-item>
        <el-form-item label="秒杀库存" prop="msGoodsStock">
          <el-input-number v-model="addMsActivityFrom.msGoodsStock" size="small" :min="1" :max="currAddGoodsStock" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="addMsActivityFrom.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="addMsActivityFrom.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="flushAddMsForm">重 置</el-button>
        <el-button @click="cancelAddMsActivity">取 消</el-button>
        <el-button type="primary" @click="submitAddMsActivity('addMsActivityForm')">创 建</el-button>
      </span>
    </el-dialog>
    <goods-dialog />
  </div>
</template>

<script>
import GoodsDialog from '@/components/goodsDialog'
import { listGoods, delGoods, addMsActivity } from '@/api/goods'

export default {
  name: 'GoodsManage',
  components: {
    GoodsDialog
  },
  data() {
    var validateEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择开始时间'))
      } else if (new Date() > new Date(this.addMsActivityFrom.endTime)) {
        callback(new Error('结束时间不能小于当前时间'))
      } else if (new Date(this.addMsActivityFrom.endTime) <= new Date(this.addMsActivityFrom.startTime)) {
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
      currAddGoodsStock: 0,
      addMsActivityDialog: false,
      addMsActivityFrom: {
        goodsId: 0,
        msPrice: '0.00',
        msGoodsStock: 1,
        startTime: '',
        endTime: ''
      },
      addMsActivityRule: {
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
    this.getListGoods(1)
  },
  methods: {
    /** 获取商品列表信息 */
    getListGoods(page) {
      listGoods(page).then(res => {
        this.totalPage = res.data.total
        this.tableData = res.data.goodsList
      })
    },
    /**
     * 处理分页改变
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListGoods(val)
    },
    /**
     * 处理多选框
     */
    handleSelectionChange(val) {
      var ids = []
      val.forEach(element => {
        ids.push(element.goodsId)
      })
      this.selectIds = ids
    },
    /**
     * 删除按钮行为
     */
    deleteGoodsBtnAction(goodsId) {
      this.$confirm('此操作将永久删除该商品,同时删除对应的秒杀活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(goodsId)
        // 调用删除会员即接口
        this.delGoodsApi(ids)
      }).catch(() => {})
    },
    /**
     * 调用删除接口
     */
    delGoodsApi(ids) {
      delGoods(ids).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          // 重新请求数据
          this.getListGoods(this.currentPage)
        }
      })
    },
    /**
     * 批量删除
     */
    deleteGoodsListBtn() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择商品',
          type: 'warning'
        })
        return
      }
      // 询问是否删除再执行删除操作
      this.$confirm('此操作将永久删除商品,同时删除对应的秒杀活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除会员即接口
        this.delGoodsApi(this.selectIds)
      }).catch(() => {})
    },
    /**
     * 打开创建秒杀活动对话框
     */
    openMsActivity(id, stock) {
      this.currAddGoodsStock = stock
      this.addMsActivityFrom.goodsId = id
      this.addMsActivityDialog = true
    },
    /**
     * 清除表单
     */
    flushAddMsForm() {
      this.addMsActivityFrom = {
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
    cancelAddMsActivity() {
      this.flushAddMsForm()
      this.addMsActivityDialog = false
    },
    changeMsPrice(value) {
      console.log(value)
      return value.toFixed(2).toString()
    },
    /**
     * 创建秒杀
     */
    submitAddMsActivity(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMsActivityFrom.msPrice = this.addMsActivityFrom.msPrice.toFixed(2)
          // 添加会员操作
          addMsActivity(this.addMsActivityFrom).then(res => {
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.getListGoods(this.currentPage)
              this.cancelAddMsActivity()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 打开添加商品对话框
     */
    openOptionGoodsDialog(isEditGoods) {
      this.$store.commit('dialog/SET_GOODS_DIALOG_IS_SHOW', true)
      this.$store.commit('dialog/SET_IS_EDIT_GOODS', isEditGoods)
    },
    /**
     * 打开编辑商品对话框
     */
    openEditGoodsDialog(val) {
      this.$store.commit('dialog/SET_GOODS_ID', val)
      this.$store.commit('dialog/SET_GOODS_DIALOG_IS_SHOW', true)
      this.$store.commit('dialog/SET_IS_EDIT_GOODS', true)
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

