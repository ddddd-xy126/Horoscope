<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// 渲染容器
const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!container.value) return

  /** ================= 场景与相机 ================= */
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x160016)

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 16, 31)

  /** ================= 渲染器 ================= */
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  /** ================= 控制器 ================= */
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false

  /** ================= 全局 Uniform ================= */
  const gu = {
    time: { value: 0 },
  }

  /** ================= 点数据生成 ================= */
  const sizes: number[] = []
  const shift: number[] = []

  const pushShift = () => {
    shift.push(
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
      (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
      Math.random() * 0.9 + 0.1
    )
  }

  // 中心球体点
  const pts: THREE.Vector3[] = new Array(50000).fill(0).map(() => {
    sizes.push(Math.random() * 1.5 + 0.5)
    pushShift()
    return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5)
  })

  // 外层随机点
  for (let i = 0; i < 100000; i++) {
    const r = 10, R = 40
    const rand = Math.pow(Math.random(), 1.5)
    const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r)
    pts.push(new THREE.Vector3().setFromCylindricalCoords(radius, Math.random() * 2 * Math.PI, (Math.random() - 0.5) * 2))
    sizes.push(Math.random() * 1.5 + 0.5)
    pushShift()
  }

  /** ================= 几何体 ================= */
  const geometry = new THREE.BufferGeometry().setFromPoints(pts)
  geometry.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1))
  geometry.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4))

  /** ================= 材质（自定义 Shader） ================= */
  const material = new THREE.PointsMaterial({
    size: 0.125,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })
  material.onBeforeCompile = (shader: any) => {
    shader.uniforms.time = gu.time

    // 顶点着色器
    shader.vertexShader = `
        uniform float time;
        attribute float sizes;
        attribute vec4 shift;
        // define two-pi constant used below
        const float PI2 = 6.283185307179586;
        ${shader.vertexShader}
      `
      // 动态点大小 用自定义的sizes属性乘以基础大小，实现大小随机化
      .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
      .replace(
        `#include <color_vertex>`,
        `
          #include <color_vertex>
          // 颜色渐变
          // 中心是金黄色(227,155,0)，边缘是紫色(100,50,255)，形成渐变
          float d = length(abs(position) / vec3(40.,10.,40));
          d = clamp(d, 0., 1.);
          vColor = mix(vec3(227.,155.,0.), vec3(100.,50.,255.), d) / 255.;
        `
      )
      .replace(
        `#include <begin_vertex>`,
        `
          #include <begin_vertex>
          // 动态位置变换 使用三角函数和时间变量，让每个星点按照预设的shift参数进行球面运动
          float t = time;
          float moveT = mod(shift.x + shift.z * t, PI2);
          float moveS = mod(shift.y + shift.z * t, PI2);
          transformed += vec3(
            cos(moveS) * sin(moveT),
            cos(moveT),
            sin(moveS) * sin(moveT)
          ) * shift.w;
        `
      )

    // 片元着色器
    shader.fragmentShader = `
        float d;
        ${shader.fragmentShader}
      `
      .replace(
        `#include <clipping_planes_fragment>`,
        `
          #include <clipping_planes_fragment>
          // 计算点内距离
          float d = length(gl_PointCoord.xy - 0.5);
        `
      )
      .replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        // 根据距离值进行渐变，实现圆形淡出效果
        `vec4 diffuseColor = vec4(vColor, 1.0 - smoothstep(0.1, 0.5, d));`
      )
  }

  /** ================= 点云对象 ================= */
  const points = new THREE.Points(geometry, material)
  points.rotation.order = "ZYX"
  points.rotation.z = 0.2
  scene.add(points)

  /** ================= 动画 ================= */
  const clock = new THREE.Clock()

  const animate = () => {
    const t = clock.getElapsedTime() * 0.5
    gu.time.value = t * Math.PI
    points.rotation.y = t * 0.05
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()

  /** ================= 监听窗口变化 ================= */
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener("resize", onResize)

  /** ================= 组件卸载清理 ================= */
  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize)
    renderer.dispose()
    geometry.dispose()
    material.dispose()
  })
})
</script>

<style scoped>
.three-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}
</style>
