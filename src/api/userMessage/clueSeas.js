import request from "@/utils/request";

// 企业客户列表
export const oceanPageList = (data) => {
  return request({
    url: "/clue/ocean/pageList",
    method: "post",
    data,
  });
};

// 线索统计
export const culeOceanSummary = (data) => {
  return request({
    url: "/clue/ocean/culeOceanSummary",
    method: "get",
    params: data,
  });
};

// 来源列表
export const sourceList = (data) => {
  return request({
    url: "/clue/ocean/sourceList",
    method: "get",
    params: data,
  });
};

// 分配
export const batchAssign = (data) => {
  return request({
    url: "/clue/ocean/batchAssign",
    method: "post",
    data,
  });
};

// 线索列表
export const findClueListByPhoneName = (data) => {
  return request({
    url: "/clue/ocean/findClueListByPhoneName",
    method: "get",
    params: data,
  });
};

// 客户合并
export const mergeClueCust = (data) => {
  return request({
    url: "/clue/ocean/mergeClueCust",
    method: "post",
    data,
  });
};

// 线索状态
export const clueStatusList = (data) => {
  return request({
    url: "/clue/ocean/clueStatusList",
    method: "get",
    params: data,
  });
};
