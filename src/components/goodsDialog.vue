<template>
  <div class="goods-dialog">
    <el-dialog
      :title="isEdit == true ? '编辑商品' : '添加商品'"
      :visible="isShow"
      width="30%"
      @close="isShow = false"
      @open="getGoodsInfo"
    >
      <el-form ref="goodsForm" :model="goodsForm" status-icon :rules="goodsFormRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="goodsForm.goodsName" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品标题" prop="goodsTitle">
          <el-input v-model="goodsForm.goodsTitle" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品图片" prop="goodsImg">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
          >
            <img v-if="goodsForm.goodsImg" :src="goodsForm.goodsImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input-number v-model="goodsForm.goodsPrice" :step="0.01" :min="0.00" />
        </el-form-item>
        <el-form-item label="商品库存" prop="goodsStock">
          <el-input-number v-model="goodsForm.goodsStock" :step="1" :min="1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cleanForm">重 置</el-button>
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm('goodsForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { addGoods, getGoodsById, editGoods } from '@/api/goods'

export default {
  name: 'GoodsDialog',
  data() {
    return {
      goodsForm: {
        goodsId: this.editId,
        goodsName: '',
        goodsTitle: '',
        goodsImg: '',
        goodsPrice: 0.00,
        goodsStock: 1
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/goods/admin/uploadImg',
      headers: { Authorization: getToken() },
      goodsFormRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodsTitle: [
          { required: true, message: '请输入商品标题', trigger: 'blur' }
        ],
        goodsImg: [
          { required: true, message: '请上传商品图片', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goodsStock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isShow: {
      get: function() {
        return this.$store.getters.isShowGoodsDialog
      },
      set: function(value) {
        this.$store.commit('dialog/SET_GOODS_DIALOG_IS_SHOW', value)
      }
    },
    isEdit: {
      get: function() {
        return this.$store.getters.isEditGoods
      },
      set: function(value) {
        this.$store.commit('dialog/SET_IS_EDIT_GOODS', value)
      }
    },
    editId: {
      get: function() {
        console.log(this.$store.getters.editGoodsId)
        return this.$store.getters.editGoodsId
      }
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 上传成功后处理函数
     */
    handleAvatarSuccess(res, file) {
      this.goodsForm.goodsImg = res.data
      this.$message({
        type: res.code === 20000 ? 'success' : 'error',
        message: res.msg
      })
    },
    /**
     * 上传文件前处理函数，图片校验
     */
    beforeAvatarUpload(file) {
      const isJPG = file.type === ('image/jpeg' || 'image/png' || 'image/gif' || 'image/jpeg')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片格式不正确')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 关闭对话框
     */
    cancelDialog() {
      this.cleanForm()
      this.isShow = false
    },
    /**
     * 清除表单数据
     */
    cleanForm() {
      this.goodsForm = {
        goodsId: this.editId,
        goodsName: '',
        goodsTitle: '',
        goodsImg: '',
        goodsPrice: 0.00,
        goodsStock: 1
      }
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            editGoods(this.goodsForm).then(res => {
              if (res.code === 20000) {
                this.$message({ type: 'success', message: res.msg })
                this.cancelDialog()
                this.$parent.getListGoods(this.$parent.currentPage)
              }
            })
          } else {
            addGoods(this.goodsForm).then(res => {
              if (res.code === 20000) {
                this.$message({ type: 'success', message: res.msg })
                this.cancelDialog()
                this.$parent.getListGoods(this.$parent.currentPage)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 获取一条商品信息
     */
    getGoodsInfo() {
      if (!this.isEdit) return
      if (this.editId === 0) return
      getGoodsById(this.editId).then(res => {
        console.log(res.data)
        this.goodsForm = res.data
      })
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
