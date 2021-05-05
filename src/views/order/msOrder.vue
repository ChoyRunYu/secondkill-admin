<template>
  <div class="goods-manage">
    <div class="goods-manage-btn">
      <el-button type="danger" @click="deleteOrderListBtn">批量删除</el-button>
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
          prop="id"
          label="订单id"
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
          prop="unitPrice"
          label="秒杀价格"
        />
        <el-table-column
          prop="count"
          label="抢购数量"
        />
        <el-table-column
          prop="username"
          label="购买用户
          "
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          prop="payTime"
          label="支付时间"
        />
        <el-table-column
          prop="createTime"
          label="订单状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderState === 0" type="success">已支付</el-tag>
            <el-tag v-else-if="scope.row.orderState === 1" type="warn">待支付</el-tag>
            <el-tag v-else type="info">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteOrderBtnAction(scope.row.id)"
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
  </div>
</template>

<script>
import { listOrderByPage, delOrder } from '@/api/order'

export default {
  name: 'OrderManage',
  data() {
    return {
      selectIds: [],
      tableData: [],
      currentPage: 1,
      totalPage: 1

    }
  },
  mounted() {
    // 获取商品信息列表
    this.getListOrder(1)
  },
  methods: {
    /** 获取商品列表信息 */
    getListOrder(page) {
      listOrderByPage(page).then(res => {
        this.totalPage = res.data.total
        this.tableData = res.data.orderList
      })
    },
    /**
     * 处理分页改变
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListOrder(val)
    },
    /**
     * 处理多选框
     */
    handleSelectionChange(val) {
      var ids = []
      val.forEach(element => {
        ids.push(element.id)
      })
      this.selectIds = ids
    },
    /**
     * 删除按钮行为
     */
    deleteOrderBtnAction(orderId) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(orderId)
        // 调用删除会员即接口
        this.delOrderApi(ids)
      }).catch(() => {})
    },
    /**
     * 调用删除接口
     */
    delOrderApi(ids) {
      delOrder(ids).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          // 重新请求数据
          this.getListOrder(this.currentPage)
        }
      })
    },
    /**
     * 批量删除
     */
    deleteOrderListBtn() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择秒杀订单',
          type: 'warning'
        })
        return
      }
      // 询问是否删除再执行删除操作
      this.$confirm('此操作将永久删除订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除会员即接口
        this.delOrderApi(this.selectIds)
      }).catch(() => {})
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

