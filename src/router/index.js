import { createRouter, createWebHistory } from "vue-router";
import { setPageTitle, goZhLogin } from "@/utils";
import { getToken } from "@/utils/cookies";
import useUser from "@/store/modules/user";
import usePermission, { filterAsyncRouter } from "@/store/modules/permission";
import { buildMenus } from "@/api/feature/menu";
import { getInfo } from "@/api/feature/login";

export const constantRouterMap = [
  {
    path: "/forbidden",
    name: "forbidden",
    hidden: true,
    component: () => import("@/views/feature/Forbidden.vue"),
  },
  {
    path: "/404",
    hidden: true,
    component: () => import("@/views/feature/404.vue"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/feature/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    hidden: true,
    component: () => import("@/views/dashboard/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouterMap,
});

const whiteList = ["/login"]; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    setPageTitle(to.meta.title);
  }
  if (getToken() && to.path !== "/login") {
    if (!useUser().getUserInfo) {
      try {
        const res = await getInfo();
        useUser().setUserInfo(res.date);
        const p = await loadMenus(to);
        addPathMatch();
        next(p);
      } catch (e) {
        // next("/login");
        // goZhLogin();
      }
    } else {
      next();
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      // goZhLogin();
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
  }
});

function addPathMatch() {
  if (!router.hasRoute("pathMatch")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "pathMatch",
      redirect: "/404",
    });
  }
}

const handleMenu = (data) => {
  return data.map((item) => {
    item.name = item.menuName;
    item.meta = {
      title: item.menuName,
      icon: item.icon,
    };
    item.path = item.menuPath;
    // 过滤掉非菜单的数据
    if (item.children && item.children.length) {
      if (item.children[0].menuType == "F") {
        item.children = [];
      } else {
        router.children = handleMenu(item.children);
      }
    }
    return item;
  });
};

export const loadMenus = (to) => {
  return buildMenus()
    .then((res) => {
      const data = handleMenu(res.date);
      const asyncRouter = filterAsyncRouter(data);
      console.log(asyncRouter, "asyncRouter");
      // 处理输入/路由的情况
      if (asyncRouter && asyncRouter.length) {
        asyncRouter.push({
          path: "/",
          redirect: `${asyncRouter[0].path}`,
          hidden: true,
        });
      }
      return usePermission()
        .setRouters(asyncRouter)
        .then(() => {
          const rots = [...constantRouterMap, ...asyncRouter];
          rots.map((v) => {
            if (
              router.options.routes?.findIndex(
                (value) => value.path === v.path
              ) !== -1
            ) {
              return;
            } else {
              // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
              if (!router.hasRoute(v?.path)) router.addRoute(v);
            }
          });
          router.options.routes = rots;
          // 判断是否从登陆页面过来
          if (to.redirectedFrom === "/") {
            return { path: asyncRouter[0].path };
          } else {
            return { ...to, replace: true };
          }
        });
    })
    .catch((e) => {
      console.log(e, "e");
    });
};

export default router;
