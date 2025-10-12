import request from "@/utils/request";

// 用户列表
export const getUserList = (data) => {
  return request({
    url: '/sys/user/list',
    method: 'POST',
    data: data
  })
}

// 更新用户授权角色
export const updateUserGrantRole = (uid,data) => {
  return request({
    url: `/sys/user/grantRole/${uid}`,
    method: 'POST',
    data: data
  })
}


// 添加或者修改用户
export const saveOrUpdateUser = (data) => {
  return request({
    url: `/sys/user/save`,
    method: 'POST',
    data: data
  })
}