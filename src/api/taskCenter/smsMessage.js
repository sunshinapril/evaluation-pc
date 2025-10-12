import request from "@/utils/request";

// 短信模板列表
export const smsPageList = (data) => {
  return request({
    url: "/sms/tem/pageList",
    method: "post",
    data,
  });
};

// 新增修改短信
export const smsSaveOrUpdate = (data) => {
  return request({
    url: "/sms/tem/saveOrUpdate",
    method: "post",
    data,
  });
};

// 删除短信
export const smsDelete = (data) => {
  return request({
    url: "/sms/tem/delete",
    method: "post",
    data,
  });
};

// 历史版本
export const smsHistory = (data) => {
  return request({
    url: "/sms/tem/history",
    method: "get",
    params: data,
  });
};

// 导出
export const smsExport = (data) => {
  return request({
    url: `/sms/tem/history/export`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};

// 变量列表
export const smsVariable = (data) => {
  return request({
    url: "/sms/tem/variable",
    method: "get",
    params: data,
  });
};

// 部们列表
export const qwList = (data) => {
  return request({
    url: "/sys/dept/allList",
    method: "get",
    params: data,
  });
};

// 审核
export const smsAudit = (data) => {
  return request({
    url: "/sms/tem/audit",
    method: "post",
    data,
  });
};

// 短信发送记录-数据统计
export const smsSummaryData = (data) => {
  return request({
    url: "/user/sms/summary",
    method: "get",
    params: data,
  });
};

// 短信记录
export const smsPageListJl = (data) => {
  return request({
    url: "/user/sms/pageList",
    method: "post",
    data,
  });
};

// 导出短信记录
export const smsExportJl = (data) => {
  return request({
    url: `/user/sms/page/export`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};
