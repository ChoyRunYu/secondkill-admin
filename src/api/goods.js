import request from '@/utils/request'

/**
 * 分页获取商品信息列表接口
 * @param {*} page
 * @returns
 */
export function listGoods(page) {
  return request({
    url: '/api/goods/admin/listGoods/' + page,
    method: 'get'
  })
}

/**
 * 删除单个商品或批量删除
 * @param {*} data
 * @returns
 */
export function delGoods(data) {
  return request({
    url: '/api/goods/admin/delGoods',
    method: 'post',
    data: { goodsIds: data }
  })
}

/**
 * 创建秒杀活动接口
 * @param {*} data
 * @returns
 */
export function addMsActivity(data) {
  return request({
    url: '/api/goods/admin/addMsGoods',
    method: 'post',
    data
  })
}

/**
 * 添加商品接口
 * @param {*} data
 * @returns
 */
export function addGoods(data) {
  return request({
    url: '/api/goods/admin/addGoods',
    method: 'post',
    data
  })
}

/**
 * 编辑商品信息接口
 * @param {*} data
 * @returns
 */
export function editGoods(data) {
  return request({
    url: '/api/goods/admin/editGoods',
    method: 'post',
    data
  })
}

/**
 * 获取商品详情信息
 * @param {*} id
 * @returns
 */
export function getGoodsById(id) {
  return request({
    url: '/api/goods/admin/getGoods/' + id,
    method: 'get'
  })
}
