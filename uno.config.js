import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),       // 启用 Tailwind 风格的原子类 (如 text-xl, p-4)
    presetAttributify(), // 启用属性模式 (如 <div text="xl red">)
  ],
})
