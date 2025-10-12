import request from "@/utils/request";

// 客户合并
export const mergeClueCust = (data) => {
  return request({
    url: "/clue/ocean/mergeClueCust",
    method: "post",
    data,
  });
};

// 根据手机号和客户姓名模糊查询所有线索
export const findClueListByPhoneName = (data) => {
  return request({
    url: "/clue/ocean/findClueListByPhoneName",
    method: "get",
    params: data,
  });
};

// 客户合并
export const saveClue = (data) => {
  return request({
    url: "/clue/ocean/saveClue",
    method: "post",
    data,
  });
};

// 文件导入
export const importExcel = (data) => {
  return request({
    url: "/clue/ocean/importExcel",
    method: "post",
    data,
  });
};

// 下载模板
export const downloadExcel = (data) => {
  return request({
    url: "/clue/ocean/downloadExcel",
    method: "post",
    data,
  });
};

// 导出列表
export const exportData = (data) => {
  return request({
    url: "/clue/ocean/export",
    method: "post",
    data,
  });
};

// 查询所有的派发方案列表
export const dispCuleList = (data) => {
  return request({
    url: "/clue/assign/list",
    method: "get",
    params: data,
  });
};

// 新增修改派发方案
export const saveOrUpdateDisp = (data) => {
  return request({
    url: "/clue/assign/saveOrUpdate",
    method: "post",
    data,
  });
};

// 删除方案
export const deleteDisp = (data) => {
  return request({
    url: "/clue/assign/delete",
    method: "post",
    data,
  });
};
