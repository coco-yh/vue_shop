<!--
 * @Author: coco
 * @Date: 2020-04-13 10:31:20
 * @LastEditTime: 2020-04-13 20:48:04
 * @LastEditors: coco
 * @Description: 
 * @FilePath: /vue_shop/src/components/power/Roles.vue
 * @https://github.com/android-coco
 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2===0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="rolesRuleForm"
        :rules="rolesRules"
        ref="rolesRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesDialogClosed"
    >
      <el-form
        :model="editRolesForm"
        :rules="reditRolesRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      //添加角色对话框显示与隐藏
      addRolesDialogVisible: false,
      // 添加角色表单
      rolesRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则
      rolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //修改角色对话框显示与隐藏
      editRolesDialogVisible: false,
      // 修改用户角色数据保存
      editRolesForm: {},
      // 修改用户角色表单规则
      reditRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点Id值数组
      defKeys: [],
      //即将分配权限的id
      roleId: ''
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles', {})
      // console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 点击添加角色
    addRoles() {
      // 1.表单预校验
      this.$refs.rolesRuleFormRef.validate(async valid => {
        // console.log(valid)
        // 如果通过预校验则可以发起网络请求，否则返回
        if (!valid) return
        // 可以发起添加角色网络请求
        const { data: res } = await this.$http.post('roles', this.rolesRuleForm)
        // console.log('addroles', res)

        if (res.meta.status !== 201) {
          // 添加失败，提示消息
          return this.$message.error('添加角色失败')
        }
        // 添加成功，提示消息
        this.$message.success('添加角色成功')
        // 隐藏添加角色对话框
        this.addRolesDialogVisible = false
        // 重新获取数据列表
        this.getRolesList()
      })
    },
    //监听添加角色对话框的关闭事件
    addRolesDialogClosed() {
      this.$refs.rolesRuleFormRef.resetFields()
    },
    // 展示编辑角色的对话框
    async showEditRoles(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色列表失败')
      }
      this.editRolesForm = res.data
      this.editRolesDialogVisible = true
    },
    //监听编辑角色对话框关闭事件
    editRolesDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },
    //修改角色信息并提交
    editRolesInfo() {
      // 预校验表单
      this.$refs.editRolesFormRef.validate(async valid => {
        // console.log(valid)
        // 校验失败，直接返回
        if (!valid) return
        // 校验成功，可以发起编辑角色的网络请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        )
        // console.log('editroles', res)
        // 更新失败提示消息
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        // 更新成功提示消息
        this.$message.success('更新角色信息成功')
        // 关闭编辑角色对话框
        this.editRolesDialogVisible = false
        // 更新角色列表数据
        this.getRolesList()
      })
    },

    //删除用户角色信息
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      // console.log('delete', res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //根据id删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      //this.getRolesList()不用这种方式，渲染会合上页面
      role.children = res.data
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限列表数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log('`````', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据保存到data中
      this.rightsList = res.data
      console.log(this.rightsList)
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      //显示设置权限对话框
      this.setRightDialogVisible = true
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)

      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },

  created() {
    this.getRolesList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>