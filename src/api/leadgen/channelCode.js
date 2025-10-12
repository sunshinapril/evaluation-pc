import request from "@/utils/request";

const server = import.meta.env.VITE_BASE_CRM_BASE_API;
// 素材列表
export const materialList = (params) => {
  return request({
    url: `${server}/material/queries?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    method: "post",
    data: params.condition,
  });
};

// 渠道二维码列表
export const channelCodeList = (data) => {
  return request({
    url: "/cust/get/qr/code/list",
    method: "post",
    data,
  });
};

// 删除二维码
export const channelCodeDelete = (data) => {
  return request({
    url: "/cust/get/qr/code/delete",
    method: "post",
    data,
  });
};

// 渠道列表
export const allChannelList = () => {
  return request({
    url: `/channel/allList`,
    method: "get",
  });
};

// 员工列表
export const userList = (data) => {
  return request({
    url: "/qw/emp/list",
    method: "post",
    data,
  });
};

// 标签列表
export const followtagList = () => {
  return request({
    url: "/cust/tag/allList",
    method: "get",
  });
};

// 标签列表
export const codeSave = (data) => {
  return request({
    url: "/cust/get/qr/code/save",
    method: "post",
    data,
  });
};

// 客户统计
export const todaySummary = (data) => {
  return request({
    url: `/cust/emp/todaySummary`,
    method: "get",
    params: data,
  });
};

// 数据列表信息
export const dataPageList = (data) => {
  return request({
    url: "/cust/emp/pageList",
    method: "post",
    data,
  });
};

// 导出
export const exportData = (data) => {
  return request({
    url: `/cust/emp/page/export`,
    method: "get",
    responseType: "blob",
    params: data,
  });
};

// 素材列表
export const mediaPageList = (data) => {
  return request({
    url: "/qw/media/pageList",
    method: "post",
    data,
  });
};

// 素材列表
export const mediasaveOrUpdate = (data) => {
  return request({
    url: "/qw/media/saveOrUpdate",
    method: "post",
    data,
  });
};

// 删除素材
export const mediadelete = (data) => {
  return request({
    url: "/qw/media/delete",
    method: "post",
    data,
  });
};

// 获取素材列表
export const mediaAll = (data) => {
  return request({
    url: `/qw/media/findAll`,
    method: "get",
    params: data,
  });
};
