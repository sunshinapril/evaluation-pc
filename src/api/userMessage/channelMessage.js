import request from "@/utils/request";

// 所有平台信息
export const findAllPtList = (data) => {
  return request({
    url: "/clue/platform/findAllList",
    method: "get",
    params: data,
  });
};

// 根据平台查询所有渠道列表
export const findChannelList = (data) => {
  return request({
    url: "/clue/channel/findList/pId",
    method: "get",
    params: data,
  });
};

// 根据渠道id和时间分页查询线索清单
export const pageClueList = (data) => {
  return request({
    url: "/clue/channel/pageClueList",
    method: "post",
    data,
  });
};

// 新建修改渠道
export const saveOrUpdate = (data) => {
  return request({
    url: "/clue/channel/saveOrUpdate",
    method: "post",
    data,
  });
};

// 删除渠道
export const delClueChannel = (data) => {
  return request({
    url: "/clue/channel/delClueChannel",
    method: "post",
    data,
  });
};

// 导出线索列表
export const clueExportJl = (data) => {
  return request({
    url: `/clue/channel/exportPageClueList`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};

// 我的线索列表
export const myCluePage = (data) => {
  return request({
    url: "/clueOcean/myPage",
    method: "post",
    data,
  });
};

// 查询我的线索页面--统计
export const mySummary = (data) => {
  return request({
    url: "/clueOcean/mySummary",
    method: "get",
    params: data,
  });
};
