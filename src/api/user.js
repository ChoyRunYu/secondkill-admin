import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data 登录传输的帐号密码
 * @returns
 */
export function login(data) {
  return request({
    url: '/api/auth/admin',
    method: 'post',
    data
  })
}

/**
 * 获取管理员信息接口
 * @returns
 */
export function getInfo() {
  return request({
    url: '/api/user/admin/info',
    method: 'get'
  })
}

/**
 * 退出登录接口
 * @returns
 */
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

/**
 * 根据分页获取商城会员列表
 * @param {*} page 分页页码
 * @returns
 */
export function listUser(page) {
  return request({
    url: '/api/user/admin/listUser/' + page,
    method: 'get'
  })
}

/**
 * 删除商城会员
 * @param {*} data 商城会员id
 * @returns
 */
export function delUser(data) {
  return request({
    url: '/api/user/admin/delUser',
    method: 'post',
    data
  })
}

/**
 * 启用/停用商城会员接口
 * @param {*} userId 用户id
 * @param {*} enable 是否启用
 * @returns
 */
export function updateUserIsEnable(userId, enable) {
  return request({
    url: '/api/user/admin/change/enable',
    method: 'post',
    data: { userId: userId, enable: enable }
  })
}

/**
 * 添加新的商城会员
 * @param {*} user
 * @returns
 */
export function addUser(user) {
  return request({
    url: '/api/user/admin/insertUser',
    method: 'post',
    data: user
  })
}

/**
 * 根据id获取商城会员信息
 * @param {*} id
 */
export function getUserById(id) {
  return request({
    url: '/api/user/admin/getUser/' + id,
    method: 'get'
  })
}

/**
 * 修改商城会员信息
 * @param {*} user
 * @returns
 */
export function updateUser(user) {
  return request({
    url: '/api/user/admin/updateUser',
    method: 'post',
    data: user
  })
}
