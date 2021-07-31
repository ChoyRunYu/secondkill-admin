import request from '@/utils/request'

/**
 * 分页获取订单列表接口
 * @param {*} page
 * @returns
 */
export function listOrderByPage(page) {
  return request({
    url: '/api/order/admin/listOrder/' + page,
    method: 'get'
  })
}

/**
 * 删除订单接口
 * @param {*} ids
 */
export function delOrder(ids) {
  return request({
    url: '/api/order/admin/delOrder',
    method: 'post',
    data: { orderIds: ids }
  })
}
