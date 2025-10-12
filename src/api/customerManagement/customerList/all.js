import request from "@/utils/request";
const service = import.meta.env.VITE_HWApi;

/**
 * 获取全部客户列表-全部客户
 */
export const getAllCstList = (params) => {
  return request({
    url:  service + '/myCst/getAllCstList',
    method: 'GET',
    params,
  })
}

/**
 * 获取全部客户列表-全部客户总数
 */
export const getAllCstListCount = (params) => {
  return request({
    url: service + '/myCst/getAllCstListCount',
    method: 'GET',
    params,
  })
}
