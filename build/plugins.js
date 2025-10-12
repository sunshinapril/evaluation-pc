import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import importToCDN from "vite-plugin-cdn-import";
import viteCompression from "vite-plugin-compression";
import path from "path";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import styleImport from "vite-plugin-style-import";
import removeConsole from "vite-plugin-remove-console";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export function getPluginsList() {
  return [
    // importToCDN({
    //   modules: [
    //     {
    //       // 引入cdn element-plus
    //       name: "icons-vue",
    //       var: "IconsVue",
    //       path: "//unpkg.com/@element-plus/icons-vue",
    //     }
    //   ],
    // }),
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver()
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    // 该插件2.0.0版本有问题，下载低版本
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: "element-plus",
    //       esModule: true,
    //       resolveStyle: (name) => {
    //         return `element-plus/theme-chalk/${name}.css`;
    //       },
    //     },
    //   ],
    // }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      // eslint-disable-next-line no-undef
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",

      /**
       * 自定义插入位置
       * @default: body-last
       */
      // inject?: "body-last" | "body-first"

      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      // customDomId: "__svg__icons__dom__",
    }),
    removeConsole(),
    viteCompression(),
  ];
}
