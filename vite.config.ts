/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-05-08 14:14:15
 * @LastEditors: houqiangxie
 * @LastEditTime: 2024-01-11 10:17:23
 */
import {  defineConfig,  loadEnv,  UserConfigExport,  ConfigEnv,  searchForWorkspaceRoot,} from "vite";
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url";
import { resolve, join } from "path";
import viteCompression from "vite-plugin-compression";
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from 'unocss/vite'
import postcsspxtoviewport from "postcss-px-to-viewport";
import Pages from "vite-plugin-pages";
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 环境变量
  const env = loadEnv(mode, process.cwd());
  // 开发环境判断
  const isDev = command == "serve";
  // vite插件
  const plugins = [
    react(),
    Pages({
      dirs: [{ dir: "src/views", baseRoute: "" }],
      extensions: ["tsx", "jsx", "ts", "js"],
      exclude: [],
      importMode: "async",
      moduleId: "~index-route",
    }),
    // 自动引入
    AutoImport({
      include: [/\.[tj]sx?$/],
      imports: [
        "react",
        "react-router-dom",
        { from: "valtio", imports: ["useSnapshot", "proxy", "subscribe"] },
        { from: "valtio/utils", imports: ["useProxy"] },
      ],
      resolvers: [],
      dirs: ["./src/components/**"],
      dts: "src/auto-import.d.ts",
    }),
    UnoCSS(),
  ];
  if (!isDev) {
    plugins.push(
      // gzip插件，打包压缩代码成gzip  文档： https://github.com/anncwb/vite-plugin-compression
      viteCompression()
    );
  }
  return defineConfig({
    plugins,
    server: {
      // 设置代理，根据我们项目实际情况配置
      open: false, // 设置服务启动时是否自动打开浏览器
      cors: true, // 允许跨域
      port: 81,
      hmr: { overlay: false },
      host: "0.0.0.0",
      // https: true,
      proxy: {
        "/gateway": {
          target: "http://172.17.30.184:8899/",
          changeOrigin: true, // 是否跨域
          secure: false,
          rewrite: (path) => path.replace(/^\/gateway/, ""),
        },
      },
    },
    resolve: {
      alias: [
        {find: "@",replacement: fileURLToPath(new URL("./src", import.meta.url)),},
      ],
    },
    base: env.VITE_BUILD_URL, // 设置打包路径   base打包环境需要绝对地址，否则打包替换url时候会报错
    build: {
      target: "es2015",
      outDir: env.VITE_outputDir,
      assetsDir: "assets",
      assetsInlineLimit: 2048,
      cssCodeSplit: true,
      // Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。
      minify: isDev ? "esbuild" : "terser",
      terserOptions: {
        compress: {
          // 生产环境去除console
          drop_console: !isDev,
        },
      },
      rollupOptions: {
        // input: {
        //   main: resolve(__dirname, "index.html"),
        //   // app: resolve(__dirname, "app/index.html"),
        // },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
    css: {
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: `
      //       @use "@/assets/scss/variables.scss" as *;
      //     `,
      //   },
      // },
      postcss: {
        plugins: [
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 1366, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            exclude: [],
            landscape: false // 是否处理横屏情况
          })
        ]
      }
    },
  });
};
