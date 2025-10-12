import request from "@/utils/request";

// 群二维码列表
export const chatCodeList = (data) => {
  return request({
    url: "/cust/chat/qr/code/list",
    method: "post",
    data,
  });
};

// 删除群二维码
export const chatCodeDelete = (data) => {
  return request({
    url: "/cust/chat/qr/code/delete",
    method: "post",
    data,
  });
};

// 保存
export const chatCodeSave = (data) => {
  return request({
    url: "/cust/chat/qr/code/save",
    method: "post",
    data,
  });
};

// 查询所有企微群
export const chartFindAll = () => {
  return request({
    url: `/cust/chat/findAll`,
    method: "get",
  });
};

// 客户统计
export const todaySummary = (data) => {
  return request({
    url: `/cust/chat/todaySummary`,
    method: "get",
    params: data,
  });
};

// 数据列表信息
export const dataPageList = (data) => {
  return request({
    url: "/cust/chat/members/pageList",
    method: "post",
    data,
  });
};

// 导出
export const exportData = (data) => {
  return request({
    url: `/cust/chat/page/export`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};
