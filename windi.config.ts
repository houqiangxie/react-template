/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-03-07 14:18:56
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-03-07 14:19:08
 */
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  attributify: true,
  safelist: [
    range(20).map((i) => `row-span-${i} col-span-${i}  grid-cols-${i}`), //row-span-1-10  col-span-1-10
  ],
  theme: {
    extend: {
      colors: {
        // 主色
        primary: "#1c90dc",
        // 选中主色
        "primary-active": "#31b4f5",
        // 背景色
        background: "#020b26",
      },
    },
  },
});

function range(size, startAt = 1) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}
