import request from "@/utils/request";

// 左侧客户详情
export const findCustClueById = (data) => {
  return request({
    url: "/custclue/findCustClueById",
    method: "get",
    params: data,
  });
};

// 更新手机号
export const updateCustPhone = (data) => {
  return request({
    url: "/custclue/updateCustPhone",
    method: "post",
    data,
  });
};

// 更新跟进信息
export const updateCustClue = (data) => {
  return request({
    url: "/clue/ocean/updateCustClue",
    method: "post",
    data,
  });
};

// 客户画像
export const findCustProfile = (data) => {
  return request({
    url: "/custclue/findCustProfile",
    method: "get",
    params: data,
  });
};

// 更新系统标签
export const updateSysTag = (data) => {
  return request({
    url: "/custclue/updateSysTag",
    method: "post",
    data,
  });
};

// 更新企微标签
export const updateCustTag = (data) => {
  return request({
    url: "/custclue/updateCustTag",
    method: "post",
    data,
  });
};

// 服务轨迹
export const findUserTrace = (data) => {
  return request({
    url: "/custclue/findUserTrace",
    method: "get",
    params: data,
  });
};

// 客户动态
export const findCustTrace = (data) => {
  return request({
    url: "/custclue/findCustTrace",
    method: "get",
    params: data,
  });
};

// 资产账户
export const findCustAccounts = (data) => {
  return request({
    url: "/custclue/findOpenAccount",
    method: "get",
    params: data,
  });
};

// 资产账户-银行信息
export const findBindBankCard = (data) => {
  return request({
    url: "/custclue/findBindBankCard",
    method: "get",
    params: data,
  });
};

// 资产账户-银行信息
export const findGrantProductPerm = (data) => {
  return request({
    url: "/custclue/findGrantProductPerm",
    method: "get",
    params: data,
  });
};
