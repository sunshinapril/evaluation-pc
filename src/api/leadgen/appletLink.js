import request from "@/utils/request";

// 小程序列表
export const pageList = (data) => {
  return request({
    url: "/miniUrl/pageList",
    method: "post",
    data,
  });
};

//
// 删除群二维码
export const miniDelete = (data) => {
  return request({
    url: "/miniUrl/del",
    method: "post",
    data,
  });
};

// 保存
export const miniUrlSave = (data) => {
  return request({
    url: "/miniUrl/save",
    method: "post",
    data,
  });
};
