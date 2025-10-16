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
    path: '/hospital',
    name: 'Hospital',
    component: 'Layout',
    meta: {
      title: '医院管理',
      icon: 'icon-1',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        name: 'HospitalIndex',
        component: '/hospital/index',
        meta: {
          title: '医院管理',
          icon: 'icon-1',
          hidden: false,
        }
      }
    ]

  },
  {
    path: '/doctor',
    name: 'Doctor',
    component: 'Layout',
    meta: {
      title: '医生管理',
      icon: 'icon-1',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        name: 'DoctorIndex',
        component: '/doctor/index',
        meta: {
          title: '医生管理',
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