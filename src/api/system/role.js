import request from "@/utils/request";

// 角色列表
export const getRoleList = (data) => {
  return request({
    url: '/sys/role/list',
    method: 'POST',
    data: data
  })
}

// 角色新增或更新
export const saveOrUpdateRole = (data) => {
  return request({
    url: '/sys/role/save',
    method: 'POST',
    data: data
  })
}

// 更新角色权限信息
export const updateRoleMenus = (id, data) => {
  return request({
    url: `/sys/role/updateMenus/${id}`,
    method: 'POST',
    data
  })
}

// 获取当前角色的权限菜单ID集合
export const getRoleMenus = (id) => {
  return request({
    url: `/sys/role/menus/${id}`,
    method: 'GET',
  })
}

// 查询所有角色
export const getRoleListAll = () => {
  return request({
    url: `/sys/role/listAll`,
    method: 'GET',
  })
}




