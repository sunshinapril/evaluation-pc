import request from "@/utils/request";

// 企业客户列表
export const linkList = (data) => {
  return request({
    url: "/cust/list",
    method: "post",
    data,
  });
};

// 企业客户列表统计数据
export const summaryData = () => {
  return request({
    url: "/cust/summary",
    method: "get",
  });
};

// 企业群列表
export const chatPageList = (data) => {
  return request({
    url: "/cust/chat/pageList",
    method: "post",
    data,
  });
};

// 企业群列表统计数据
export const pageSummaryData = () => {
  return request({
    url: "/cust/chat/pageSummary",
    method: "get",
  });
};

// 所有群
export const findAllList = () => {
  return request({
    url: "/cust/chat/findAll",
    method: "get",
  });
};

// 群成员统计
export const todaySummary = (data) => {
  return request({
    url: "/cust/chat/members/pageSummary",
    method: "get",
    params: data,
  });
};

// 企业群列表
export const todaySummaryPageList = (data) => {
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
