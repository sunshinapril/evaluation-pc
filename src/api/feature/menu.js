import request from "@/utils/request";

// 获取路由
export const buildMenus = () => {
  return request({
    url: '/sys/menu/role/treeList',
    method: 'get',
  })
}
