import request from "@/utils/request";

// 菜单管理列表
export const getTreeList = (params) => {
  return request({
    url: '/sys/menu/treeList',
    method: 'get',
    params
  })
}

// 根据id查询菜单
export const getMenu = (id) => {
  return request({
    url: `/sys/menu/${id}`,
    method: 'get',
  })
}

// 删除菜单
export const delMenu = (id) => {
  return request({
    url: `/sys/menu/delete/${id}`,
    method: 'get',
  })
}


// 编辑或者更新菜单
export const saveOrUpdate = (data) => {
  return request({
    url: '/sys/menu/save',
    method: 'POST',
    data:data
  })
}

