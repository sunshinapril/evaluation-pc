import request from "@/utils/request";

// 企微短链列表
export const linkList = (data) => {
  return request({
    url: "/cust/get/link/list",
    method: "post",
    data,
  });
};

//
// 删除短链
export const linkDelete = (data) => {
  return request({
    url: "/cust/get/link/del",
    method: "post",
    data,
  });
};

// 保存
export const linkCodeSave = (data) => {
  return request({
    url: "/cust/get/link/save",
    method: "post",
    data,
  });
};
