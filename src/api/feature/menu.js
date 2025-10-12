// import request from "@/utils/request";
import MenuList from "@/router/menu";

// 获取路由
// export const buildMenus = () => {
//   return request({
//     url: '/sys/menu/role/treeList',
//     method: 'get',
//   })
// }

// 获取路由
export const buildMenus = () => {
  return new Promise((resolve) => {
    resolve({
      date: MenuList,
      code: 200,
      msg: "success",
    });
  })
}
