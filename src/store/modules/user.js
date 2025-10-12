import { defineStore } from "pinia";
import { removeToken, setToken, getToken } from "@/utils/cookies";
import { login, logout, getInfo } from "@/api/feature/login";

const useUser = defineStore({
  id: "user-pinia",
  state: () => ({
    isCollapse: true,
    userInfo: null,
    corpInfo: null,
    token: getToken(),
    permissions: [],
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    setIsCollapse(data) {
      this.isCollapse = data;
    },
    setUserInfo(info) {
      console.log(info, "info");
      this.userInfo = info;
      this.setPermissions(info.permissions);
      this.setcorpInfo(info.corpInfo);
    },
    setcorpInfo(corpInfo) {
      this.corpInfo = corpInfo;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    logout() {
      return Promise.resolve(() => {
        removeToken();
        this.SET_TOKEN("");
        this.setPermissions([]);
        this.setcorpInfo({});
      });
    },
    SET_TOKEN(token) {
      this.token = token;
    },
    // 登录
    Login(userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.token);
            this.SET_TOKEN(res.token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    LoginSys(data) {
      return new Promise((resolve) => {
        window.parent.postMessage("token：" + data.token, "*");
        setToken(data.token);
        this.SET_TOKEN(data.token);
        resolve();
      });
    },
  },
});

export default useUser;
