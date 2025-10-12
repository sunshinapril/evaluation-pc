import request from "@/utils/request";

// ---- 系统自建标签 ----

// 新建组标签
export const groupSave = (data) => {
  return request({
    url: "/self/tag/group/save",
    method: "post",
    data,
  });
};

// 系统自建标签列表
export const codeAllList = (data) => {
  return request({
    url: "/self/tag/allList",
    method: "get",
    params: data,
  });
};

// 系统自建标签总列表
export const allGroupList = (data) => {
  return request({
    url: "/self/tag/allGroupList",
    method: "get",
    params: data,
  });
};

// 系统自建标签组列表
export const groupList = (data) => {
  return request({
    url: "/self/tag/group/list",
    method: "get",
    params: data,
  });
};

// 修改组标签
export const groupUpdate = (data) => {
  return request({
    url: "/self/tag/group/update",
    method: "post",
    data,
  });
};

// 删除组标签
export const groupDelete = (data) => {
  return request({
    url: "/self/tag/group/delete",
    method: "post",
    data,
  });
};

// 删除标签
export const tagDelete = (data) => {
  return request({
    url: "/self/tag/delete",
    method: "post",
    data,
  });
};

// ---- 企业客户标签 ----

// 新建组标签
export const groupSaveWe = (data) => {
  return request({
    url: "/cust/tag/group/save",
    method: "post",
    data,
  });
};

// 标签列表
export const codeAllListWe = (data) => {
  return request({
    url: "/cust/tag/allList",
    method: "get",
    params: data,
  });
};

// 标签总列表
export const allGroupListWe = (data) => {
  return request({
    url: "/cust/tag/allGroupList",
    method: "get",
    params: data,
  });
};

// 标签组
export const groupListWe = (data) => {
  return request({
    url: "/cust/tag/group/list",
    method: "get",
    params: data,
  });
};

// 修改组名称
export const groupUpdateWe = (data) => {
  return request({
    url: "/cust/tag/group/update",
    method: "post",
    data,
  });
};

// 删除组
export const groupDeleteWe = (data) => {
  return request({
    url: "/cust/tag/group/delete",
    method: "post",
    data,
  });
};

// 删除标签
export const tagDeleteWe = (data) => {
  return request({
    url: "/cust/tag/delete",
    method: "post",
    data,
  });
};
