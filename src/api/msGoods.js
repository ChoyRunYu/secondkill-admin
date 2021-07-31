import request from '@/utils/request'

/**
 * 分页获取秒杀信息列表
 * @param {*} page
 * @returns
 */
export function listMsGoods(page) {
  return request({
    url: '/api/goods/admin/listMsGoods/' + page,
    method: 'get'
  })
}

/**
 * 删除秒杀活动
 * @param {*} data
 * @returns
 */
export function delMsGoods(data) {
  return request({
    url: '/api/goods/admin/delMsGoods',
    method: 'post',
    data: { msGoodsIds: data }
  })
}

/**
 * 获取一条秒杀活动信息
 * @param {*} msGoodsId
 * @returns
 */
export function getMsActivityById(msGoodsId) {
  return request({
    url: '/api/goods/admin/getMsGoods/' + msGoodsId,
    method: 'get'
  })
}

/**
 * 修改秒杀活动信息
 * @param {*} data
 * @returns
 */
export function updateMsActivity(data) {
  return request({
    url: '/api/goods/admin/editMsGoods',
    method: 'post',
    data
  })
}
