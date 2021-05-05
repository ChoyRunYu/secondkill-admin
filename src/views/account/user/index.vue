<template>
  <div class="user-manage">
    <div class="user-manage-btn">
      <el-button type="primary" @click="openOptionUserDialog(false)">添加会员</el-button>
      <el-button type="danger" @click="deleteUserListBtn">批量删除</el-button>
    </div>
    <div class="user-manage-table">
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
          label="id"
          width="100"
        />
        <el-table-column
          prop="username"
          label="用户名"
        />
        <el-table-column
          prop="nickname"
          label="昵称"
        />
        <!-- <el-table-column
          prop="phone"
          label="手机号码"
        /> -->
        <el-table-column
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          label="停用/启用"
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
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="default"
              size="small"
              @click="handleClick(scope.row)"
            >查看</el-button> -->
            <el-button
              type="primary"
              size="small"
              @click="openEditUserDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteUserBtnAction(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user-manage-page">
      <el-pagination
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="isModify ? '修改会员' : '添加会员' "
      width="30%"
      :visible.sync="addUserDialog"
    >
      <el-form ref="addUserForm" :model="addUserForm" :rules="addUserFormRules" label-position="left" label-width="80px">
        <el-form-item label="帐号" prop="username">
          <el-input v-model="addUserForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addUserForm.nickname" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="text" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="手机号码" prop="phone">
          <el-input v-model.number="addUserForm.phone" />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cleanForm">重置</el-button>
        <el-button @click="closeAddUserForm">取 消</el-button>
        <el-button type="primary" @click="submitAddUser('addUserForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, delUser, updateUserIsEnable, addUser, getUserById, updateUser } from '@/api/user'
import md5 from 'md5'

export default {
  name: 'User',
  data() {
    /**
     * 校验手机号
     */
    // var validatePhone = (rule, value, callback) => {
    //   const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    //   if (value === '') {
    //     callback(new Error('请输入手机号'))
    //   } else if (!reg.test(value)) {
    //     callback(new Error('手机格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // 当前页面
      currentPage: 1,
      // 对话框是否为编辑
      isModify: false,
      // 总页数
      totalPage: 0,
      // 表格数据
      tableData: [],
      // 选择的行id
      selectIds: [],
      // 是否显示添加会员对话框
      addUserDialog: false,
      // 表单数据
      addUserForm: {
        id: 1,
        username: '',
        nickname: '',
        password: '',
        phone: ''
      },
      // 表单校验规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入会员帐号', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请选择昵称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // phone: [
        //   { required: true, validator: validatePhone, trigger: 'blur' }
        // ]
      }
    }
  },
  mounted() {
    // 获取商城会员列表
    this.getListUser(1)
  },
  methods: {
    /**
     * 获取商城会员列表
     */
    getListUser: function(page) {
      listUser(page).then(res => {
        this.totalPage = res.data.total
        this.tableData = res.data.userlist
      })
    },
    /**
     * 处理多选框选中
     */
    handleSelectionChange(val) {
      var ids = []
      val.forEach(element => {
        ids.push(element.id)
      })
      this.selectIds = ids
    },
    /**
     * 处理改变分页页码
     */
    handleCurrentChange: function(currPage) {
      this.currentPage = currPage
      this.getListUser(currPage)
    },
    /**
     * 删除商城会员
     */
    deleteUserBtnAction(id) {
      // 询问是否删除再执行删除操作
      this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(id)
        // 调用删除会员即接口
        this.delUserApi(ids)
      }).catch(() => {})
    },
    /**
     * 启用/停用商城会员开关
     */
    changeUserEnable(event, data) {
      var msg = event === 0 ? '此操作将禁用该会员, 是否继续?' : '此操作将启用该会员, 是否继续?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用启用/停用会员接口
        updateUserIsEnable(data.id, event).then(res => {
          if (res.code === 20000) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          }
        })
      }).catch(() => {
        // 取消修改
        data.isEnable = !data.isEnable === true ? 1 : 0
      })
    },
    /**
     * 批量删除按钮
     */
    deleteUserListBtn() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择会员',
          type: 'warning'
        })
        return
      }
      // 询问是否删除再执行删除操作
      this.$confirm('此操作将永久删除会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除会员即接口
        this.delUserApi(this.selectIds)
      }).catch(() => {})
    },
    /**
     * 调用删除会员接口
     */
    delUserApi(ids) {
      delUser({ ids: ids }).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          // 重新请求数据
          this.getListUser(this.currentPage)
        }
      })
    },
    /**
     * 打开添加会员对话框
     */
    openOptionUserDialog(flag) {
      this.isModify = flag
      this.addUserDialog = true
    },
    /**
     * 清空表单
     */
    cleanForm() {
      this.addUserForm = {
        id: 1,
        username: '',
        nickname: '',
        password: '',
        checkPass: '',
        phone: ''
      }
    },
    /**
     * 关闭对话框
     */
    closeAddUserForm() {
      this.addUserDialog = false
      this.cleanForm()
    },
    /**
     * 添加会员
     */
    submitAddUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addUserForm.password = md5(this.addUserForm.password)
          if (this.isModify) {
            // 修改会员操作
            updateUser(this.addUserForm).then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.getListUser(this.currentPage)
                this.closeAddUserForm()
              }
            })
          } else {
            // 添加会员操作
            addUser(this.addUserForm).then(res => {
              if (res.code === 20000) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.getListUser(this.currentPage)
                this.closeAddUserForm()
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
     * 编辑会员信息
     */
    openEditUserDialog(id) {
      getUserById(id).then(res => {
        if (res.code === 20000) {
          this.addUserForm = res.data
          this.getListUser(this.currentPage)
        }
      })
      this.openOptionUserDialog(true)
    }
  }
}
</script>

<style lang="scss">
.user-manage {
  padding: 20px;

  .user-manage-btn {
    margin-bottom: 30px;
  }

  .user-manage-page {
    margin-top: 40px;
    text-align: center;
  }
}
</style>

