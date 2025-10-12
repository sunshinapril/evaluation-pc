export default 
 [
  {
    path: '/homePage',
    name: 'homePage',
    component: 'Layout',
    meta: {
      title: '主页',
      icon: 'icon-1',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        component: '/homePage/index',
        meta: {
          title: '主页',
          icon: 'icon-1',
          hidden: false,
        }
      }
    ]

  },
  {
    path: '/system',
    name: 'UserManagement',
    component: 'Layout',
    meta: {
      title: '系统管理',
      icon: 'icon-1',
      hidden: false,
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: '/system/user',
        meta: {
          title: '用户管理',
          icon: 'icon-1',
          hidden: false,
        },
      },
      // {
      //   path: 'role',
      //   name: 'SystemRole',
      //   component: '/system/role',
      //   meta: {
      //     title: '角色管理',
      //     icon: 'icon-1',
      //     hidden: false,
      //   },
      // },
      // {
      //   path: 'menu',
      //   name: 'SystemMenu',
      //   component: '/system/menu',
      //   meta: {
      //     title: '菜单管理',
      //     icon: 'icon-1',
      //     hidden: false,
      //   },
      // },
    ],
  }
];