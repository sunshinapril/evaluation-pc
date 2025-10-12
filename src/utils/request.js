import axios from "axios";
import q from "q";
import router from "@/router";
import { getToken, removeToken } from "./cookies";

// 不跳登录接口
const requestUrl = ["/sys/user/loginUser", "/sys/menu/role/treeList"];

// 导出接口
const exportUrl = [
  "/cust/emp/page/export",
  "/cust/chat/page/export",
  "/user/sms/page/export",
  "/clue/channel/exportPageClueList",
  "/clue/ocean/downloadExcel",
  "/clue/ocean/export",
];

function request(config) {
  const _config = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      // Authorization: 'Bearer ' + getToken(),
      token: getToken(),
      // token:
      //   config.url !==
      //   "http://101.133.174.132:8088/api/material/queries?pageNum=1&pageSize=1000"
      //     ? getToken()
      //     : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIxNzI2MTA2OTczMzk1MDAwMTMiLCJlbXBfbm8iOiIxNzUyMTI3NzMxNCIsInVzZXJfbmFtZSI6InlhbmdndW94aW5nIiwicGhvbmVfbnVtIjoiMTc1MjEyNzczMTQiLCJhY2NvdW50X3N0YXR1cyI6IjAiLCJkZXB0X2lkIjoiMzYiLCJleHAiOjE3NDEzODMzMDIsImNybV90b2tlbiI6ImV5SmhiR2NpT2lKSVV6VXhNaUo5LmV5SmhjSEJzYVdOaGRHbHZiaTF1WVcxbElqb2liV2xrWkd4bElpd2lkWE5sY2w5MGVYQmxJam9pTURRaUxDSjFjMlZ5WDJsa0lqb3hPRGN5TVRVeE1EQTJPVGM0TnprM05UY3dMQ0pzYjJkcGJsOTBlWEJsSWpvaVRHbHVhMWRsUTJoaGRFRlFTU0lzSW5WelpYSmZibUZ0WlNJNklubGhibWRuZFc5NGFXNW5JaXdpZFhObGNsOXJaWGtpT2lKbE9XVXdZbUkxWVMwMU56QmlMVFEzTURZdE9EUmhPUzAxWkdGaU16Y3hZekF6TXpnaUxDSmtaWEIwWDI1aGJXVWlPaUxrdjZIbWdhX21pb0RtbktfcGc2Z2lMQ0pqYjNKd1gyNWhiV1VpT2lMbW5KX29nWlRucDVIbWlvQWlMQ0prWlhCMFgybGtJam8yTlRFNE1EUTJNemM0TlN3aVkyOXljRjlwWkNJNkluZDNOV05oTjJZME16VTBOVE5sT0RRd01DSXNJbVJoZEdGZmMyTnZjR1VpT2lJMUluMC4xN0t2eW5jM0wwZkRqVHl6bklwVjR5UUl6VlJ0bEVydWljYXB1RklIeFFoYjU4WXNFSWlVUEdkbE04YlJhb3N4d0RYN3daYzJsTWo0ZkNfSmlLQ0pwQSJ9.JEoK6Jf5NDJ6zCuQAns4YkhTYm60nuSrzDVeQkJU3kY",
      "Content-Type": "application/json",
    },
    ...config,
  };
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return error.response?.data ?? error.response;
    }
  );
  return q
    .resolve(
      axios(_config)
        .then((res) => {
          switch (res.status) {
            case 200:
              return JSON.stringify(exportUrl).includes(config.url) ||
                config.url == "/task/job/resultItemExport" ||
                config.url == "/sms/tem/history/export"
                ? res
                : res.data;
            case 501: // 登录态失效
              removeToken();
              if (JSON.stringify(window.location.href).includes("localhost")) {
                router.push({
                  path: "/login",
                });
              }
              if (!JSON.stringify(requestUrl).includes(config.url)) {
                window.parent.postMessage("501", "*");
                return Promise.reject();
              }
          }
          throw new Error(res?.msg ?? `服务端错误，状态码: ${res.status}`);
        })
        .then((res) => {
          if (_config.useRowData) {
            return res;
          }
          if (!res || typeof res === "string") {
            throw new Error("服务端错误");
          }
          switch (res.code) {
            case "200":
              return res;
            case 200:
              return res;
            case "501": // 登录态失效
              removeToken();
              // 开发
              if (JSON.stringify(window.location.href).includes("localhost")) {
                router.push({
                  path: "/login",
                });
              }

              if (!JSON.stringify(requestUrl).includes(config.url)) {
                window.parent.postMessage("501", "*");
              }
              break;
          }
          if (
            JSON.stringify(exportUrl).includes(config.url) ||
            config.url == "/task/job/resultItemExport" ||
            config.url == "/sms/tem/history/export"
          ) {
            return res;
          }
          if (!JSON.stringify(requestUrl).includes(config.url)) {
            throw new Error(res.msg || "请求错误");
          }
        })
    )
    .catch((e) => {
      // console.log("err", e);
      ElNotification({
        title: e ?? "系统错误",
        type: "error",
      });
      return q.reject(e);
    });
}

export default request;
