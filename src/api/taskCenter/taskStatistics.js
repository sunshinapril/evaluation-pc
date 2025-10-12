import request from "@/utils/request";

// 任务列表
export const jobPageList = (data) => {
  return request({
    url: "/task/job/pageList",
    method: "post",
    data,
  });
};

// 数据统计
export const jobSummaryData = (data) => {
  return request({
    url: "/task/job/summary",
    method: "get",
    params: data,
  });
};

// 删除任务
export const jobDelete = (data) => {
  return request({
    url: "/task/job/delete",
    method: "post",
    data,
  });
};

// 任务详情
export const jobDataDetail = (data) => {
  return request({
    url: "/task/job/detail",
    method: "get",
    params: data,
  });
};

// 任务详情列表数据
export const jobDataDetailList = (data) => {
  return request({
    url: "/task/job/resultItem",
    method: "post",
    data,
  });
};

// 导出短信记录
export const resultItemExport = (data) => {
  return request({
    url: `/task/job/resultItemExport`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};

// 新增任务策略
export const saveOrUpdateJob = (data) => {
  return request({
    url: "/task/job/saveOrUpdate",
    method: "post",
    data,
  });
};

// 客户经理
export const userAllList = (data) => {
  return request({
    url: "/qw/emp/allList",
    method: "get",
    params: data,
  });
};
