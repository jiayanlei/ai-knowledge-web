<template>
  <main class="login-page">
    <div class="cosmic-bg" aria-hidden="true">
      <span class="bg-line bg-line--one" />
      <span class="bg-line bg-line--two" />
      <span class="bg-line bg-line--three" />
      <span v-for="item in bgNodes" :key="item" class="bg-node" :class="`bg-node--${item}`" />
    </div>

    <header class="login-topbar">
      <AppLogo class="login-logo" />

      <button class="language-switch" type="button">
        <Connection class="language-icon" />
        <span>简体中文</span>
        <ArrowDown class="arrow-icon" />
      </button>
    </header>

    <section class="login-stage">
      <div class="nexus-panel" aria-hidden="true">
        <div class="nexus-title">
          <span>AI KNOWLEDGE NEXUS</span>
          <strong>知识星门已就绪</strong>
        </div>

        <div class="nexus-orbit">
          <span class="orbit orbit--outer" />
          <span class="orbit orbit--middle" />
          <span class="orbit orbit--inner" />
          <span v-for="item in orbitNodes" :key="item" class="orbit-node" :class="`orbit-node--${item}`" />

          <div class="nexus-core">
            <span class="core-grid" />
            <span class="core-scan" />
            <strong>AI</strong>
          </div>
        </div>

        <div class="signal-grid">
          <div v-for="item in signalList" :key="item.label" class="signal-card">
            <component :is="item.icon" />
            <div>
              <strong>{{ item.label }}</strong>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="access-panel">
        <div class="access-card">
          <div class="access-status">
            <span />
            <p>模拟身份通道在线</p>
          </div>

          <div class="access-heading">
            <p>ENTERPRISE AI ACCESS</p>
            <h1>进入知识中枢</h1>
            <span>使用默认演示账户接入智能知识网络</span>
          </div>

          <el-form
            ref="loginFormRef"
            class="login-form"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            @keyup.enter="submitLogin"
          >
            <el-form-item label="工号" prop="username">
              <el-input
                v-model.trim="loginForm.username"
                size="large"
                placeholder="请输入工号"
                autocomplete="username"
              >
                <template #prefix>
                  <User class="input-icon" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                size="large"
                placeholder="请输入密码"
                type="password"
                show-password
                autocomplete="current-password"
              >
                <template #prefix>
                  <Lock class="input-icon" />
                </template>
              </el-input>
            </el-form-item>

            <div class="form-actions">
              <button class="text-action" type="button" @click="handleForgotPassword">
                忘记密码？
              </button>
            </div>

            <el-button class="login-button" type="primary" :disabled="loginLoading" @click="submitLogin">
              进入智能工作台
            </el-button>

            <button class="apply-button" type="button" @click="handleApplyAccount">
              申请账号
            </button>
          </el-form>

          <div class="account-chip">
            <span>默认账户</span>
            <strong>{{ MOCK_ACCOUNT.username }}</strong>
            <em>{{ MOCK_ACCOUNT.password }}</em>
          </div>
        </div>
      </aside>
    </section>

    <footer class="copyright">
      安全连接中 <span>|</span> 版权所有 © 2024 智能体系知识问答，保留所有权利。
    </footer>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  ChatDotRound,
  Collection,
  Connection,
  Document,
  Key,
  Lock,
  Share,
  TrendCharts,
  User
} from '@element-plus/icons-vue'
import { MOCK_ACCOUNT, mockLogin } from '@/api/modules/auth'
import AppLogo from '@/components/AppLogo/index.vue'
import { HOME_PATH } from '@/constants/route'
import { setToken } from '@/utils/auth'
import {
  hideGlobalLoading,
  setGlobalLoadingText,
  showGlobalLoading
} from '@/utils/globalLoading'

const loginFormRef = ref<FormInstance>()
const router = useRouter()
const loginLoading = ref(false)
const bgNodes = [1, 2, 3, 4, 5, 6]
const orbitNodes = [1, 2, 3, 4, 5]

const loginForm = reactive({
  username: MOCK_ACCOUNT.username,
  password: MOCK_ACCOUNT.password
})

const loginRules: FormRules<typeof loginForm> = {
  username: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
}

const signalList = [
  { label: '知识沉淀', value: '128K+', icon: Collection },
  { label: '智能问答', value: '实时响应', icon: ChatDotRound },
  { label: '文档索引', value: '全域连接', icon: Document },
  { label: '权限安全', value: '可信接入', icon: Key },
  { label: '协同网络', value: '多端同步', icon: Share },
  { label: '数据洞察', value: '持续进化', icon: TrendCharts }
]

function submitLogin() {
  if (loginLoading.value) return

  loginFormRef.value?.validate(async (valid) => {
    if (!valid) return

    loginLoading.value = true
    showGlobalLoading('智能体正在校验身份')

    try {
      await waitLoading(260)
      const { token } = await mockLogin(loginForm)
      setGlobalLoadingText('正在进入智能工作台')
      setToken(token)
      await waitLoading(420)
      await router.replace(HOME_PATH)
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '登录失败')
    } finally {
      hideGlobalLoading()
      loginLoading.value = false
    }
  })
}

function waitLoading(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function handleForgotPassword() {
  ElMessage.info('请联系系统管理员重置密码')
}

function handleApplyAccount() {
  ElMessage.info('请联系系统管理员开通账号')
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #10204f;
  background:
    radial-gradient(circle at 18% 18%, rgba(52, 211, 255, 0.28), transparent 27%),
    radial-gradient(circle at 82% 16%, rgba(127, 95, 255, 0.22), transparent 29%),
    radial-gradient(circle at 52% 86%, rgba(42, 111, 255, 0.18), transparent 34%),
    linear-gradient(135deg, #f7fbff 0%, #edf6ff 46%, #f4f0ff 100%);
}

.login-page,
.login-page * {
  box-sizing: border-box;
}

.cosmic-bg,
.cosmic-bg::before,
.cosmic-bg::after,
.bg-line,
.bg-node {
  position: absolute;
  pointer-events: none;
}

.cosmic-bg {
  inset: 0;
  overflow: hidden;
}

.cosmic-bg::before {
  inset: -20%;
  content: "";
  opacity: 0.58;
  background-image:
    linear-gradient(rgba(57, 126, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(57, 126, 255, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  transform: rotate(-8deg);
}

.cosmic-bg::after {
  left: -18%;
  right: -18%;
  bottom: -24%;
  height: 48%;
  content: "";
  border-radius: 50% 50% 0 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(93, 145, 255, 0.16)),
    rgba(219, 232, 255, 0.36);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.bg-line {
  left: 50%;
  top: 50%;
  width: 70vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(50, 198, 255, 0.34), transparent);
  transform-origin: left center;
}

.bg-line--one {
  transform: rotate(-24deg) translateX(-35vw);
}

.bg-line--two {
  transform: rotate(14deg) translateX(-24vw);
}

.bg-line--three {
  transform: rotate(38deg) translateX(-28vw);
}

.bg-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #70eaff;
  box-shadow: 0 0 24px rgba(60, 216, 255, 0.72);
  animation: node-float 5s ease-in-out infinite;
}

.bg-node--1 {
  left: 12%;
  top: 24%;
}

.bg-node--2 {
  left: 30%;
  bottom: 20%;
  background: #8a7dff;
  animation-delay: -1s;
}

.bg-node--3 {
  left: 52%;
  top: 16%;
  animation-delay: -1.8s;
}

.bg-node--4 {
  right: 16%;
  top: 28%;
  background: #a792ff;
  animation-delay: -2.5s;
}

.bg-node--5 {
  right: 11%;
  bottom: 22%;
  animation-delay: -3.2s;
}

.bg-node--6 {
  left: 58%;
  bottom: 14%;
  background: #2e80ff;
  animation-delay: -4s;
}

.login-topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 44px 0;
}

.login-logo {
  padding: 8px 14px 8px 10px;
  border: 1px solid rgba(198, 216, 244, 0.64);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 0 16px 36px rgba(54, 98, 170, 0.1);
  backdrop-filter: blur(16px);
}

.language-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 18px;
  border: 1px solid rgba(185, 205, 236, 0.82);
  border-radius: 999px;
  color: #17376e;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 14px 32px rgba(54, 98, 170, 0.1);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(16px);
}

.language-icon,
.arrow-icon {
  width: 16px;
  height: 16px;
}

.login-stage {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 480px);
  gap: clamp(28px, 5vw, 78px);
  width: min(1280px, calc(100% - 72px));
  min-height: calc(100vh - 116px);
  margin: 0 auto;
  padding: 44px 0 68px;
  align-items: center;
}

.nexus-panel {
  min-width: 0;
}

.nexus-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;

  span {
    color: #3d65c9;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  strong {
    max-width: 660px;
    color: #071d58;
    font-size: clamp(44px, 5.2vw, 76px);
    font-weight: 900;
    line-height: 1.04;
    letter-spacing: 0;
  }
}

.nexus-orbit {
  position: relative;
  width: min(560px, 80vw);
  aspect-ratio: 1;
  margin: 14px 0 0 28px;
}

.orbit,
.orbit-node,
.nexus-core {
  position: absolute;
  left: 50%;
  top: 50%;
}

.orbit {
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit--outer {
  width: 94%;
  height: 94%;
  border: 1px solid rgba(65, 114, 255, 0.15);
  background: conic-gradient(from 30deg, transparent 0 16%, rgba(53, 216, 255, 0.5), transparent 32% 64%, rgba(127, 94, 255, 0.5), transparent 82% 100%);
  -webkit-mask: radial-gradient(circle, transparent 62%, #000 63% 66%, transparent 67%);
  mask: radial-gradient(circle, transparent 62%, #000 63% 66%, transparent 67%);
  animation: rotate-orbit 15s linear infinite;
}

.orbit--middle {
  width: 70%;
  height: 70%;
  border: 1px dashed rgba(35, 143, 255, 0.3);
  animation: rotate-orbit-reverse 18s linear infinite;
}

.orbit--inner {
  width: 46%;
  height: 46%;
  border: 1px solid rgba(72, 220, 255, 0.34);
  background: radial-gradient(circle, rgba(72, 220, 255, 0.08), transparent 68%);
  animation: pulse-orbit 4s ease-in-out infinite;
}

.orbit-node {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.86);
  border-radius: 50%;
  background: #51dfff;
  box-shadow: 0 0 28px rgba(61, 214, 255, 0.72);
}

.orbit-node--1 {
  transform: translate(-206px, -84px);
}

.orbit-node--2 {
  background: #8270ff;
  transform: translate(124px, -190px);
}

.orbit-node--3 {
  transform: translate(208px, 34px);
}

.orbit-node--4 {
  background: #496eff;
  transform: translate(-134px, 188px);
}

.orbit-node--5 {
  background: #b7a5ff;
  transform: translate(64px, 190px);
}

.nexus-core {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 170px;
  height: 170px;
  overflow: hidden;
  border: 1px solid rgba(194, 235, 255, 0.86);
  border-radius: 44px;
  background:
    radial-gradient(circle at 35% 28%, rgba(103, 246, 255, 0.88), transparent 18%),
    radial-gradient(circle at 66% 70%, rgba(123, 99, 255, 0.5), transparent 28%),
    linear-gradient(135deg, #103c96 0%, #185dff 52%, #2fe0ff 100%);
  box-shadow:
    0 0 54px rgba(56, 203, 255, 0.44),
    0 28px 80px rgba(55, 96, 210, 0.24);
  transform: translate(-50%, -50%);
  animation: breathe-core 3.4s ease-in-out infinite;

  strong {
    position: relative;
    z-index: 2;
    color: #fff;
    font-size: 48px;
    font-weight: 900;
    letter-spacing: 0;
    text-shadow: 0 0 24px rgba(194, 248, 255, 0.62);
  }
}

.core-grid,
.core-scan {
  position: absolute;
  inset: 0;
}

.core-grid {
  opacity: 0.42;
  background-image:
    linear-gradient(rgba(230, 252, 255, 0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(230, 252, 255, 0.22) 1px, transparent 1px);
  background-size: 20px 20px;
}

.core-scan {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.52), transparent);
  transform: translateX(-120%);
  animation: scan-core 2.8s ease-in-out infinite;
}

.signal-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 690px;
  margin-top: -26px;
}

.signal-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(202, 219, 244, 0.72);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.54);
  box-shadow: 0 18px 42px rgba(66, 103, 170, 0.1);
  backdrop-filter: blur(16px);

  svg {
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    color: #246fff;
  }

  div {
    min-width: 0;
  }

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #152757;
    font-size: 14px;
    font-weight: 800;
  }

  span {
    margin-top: 4px;
    color: #6b7895;
    font-size: 12px;
  }
}

.access-panel {
  min-width: 0;
}

.access-card {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border: 1px solid rgba(204, 221, 247, 0.78);
  border-radius: 34px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.84), rgba(244, 249, 255, 0.46)),
    rgba(255, 255, 255, 0.52);
  box-shadow:
    0 34px 90px rgba(61, 93, 161, 0.17),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(22px);
}

.access-card::before {
  position: absolute;
  inset: 0;
  content: "";
  background:
    radial-gradient(circle at 16% 12%, rgba(51, 214, 255, 0.18), transparent 26%),
    radial-gradient(circle at 92% 8%, rgba(121, 102, 255, 0.16), transparent 24%);
  pointer-events: none;
}

.access-card > * {
  position: relative;
  z-index: 1;
}

.access-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(115, 189, 255, 0.36);
  border-radius: 999px;
  color: #2d63bf;
  background: rgba(237, 247, 255, 0.72);
  font-size: 12px;
  font-weight: 800;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #31d7ff;
    box-shadow: 0 0 14px rgba(49, 215, 255, 0.86);
  }

  p {
    margin: 0;
  }
}

.access-heading {
  margin-top: 22px;

  p {
    margin: 0;
    color: #5c72b6;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.16em;
  }

  h1 {
    margin: 10px 0 0;
    color: #071d58;
    font-size: 36px;
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: 0;
  }

  span {
    display: block;
    margin-top: 10px;
    color: #60708e;
    font-size: 14px;
    line-height: 1.7;
  }
}

.login-form {
  margin-top: 28px;

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    margin-bottom: 9px;
    color: #172753;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.2;
  }

  :deep(.el-form-item__label::before) {
    display: none;
  }

  :deep(.el-input__wrapper) {
    height: 54px;
    padding: 0 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow:
      0 0 0 1px rgba(194, 210, 233, 0.9) inset,
      0 12px 28px rgba(48, 91, 161, 0.06);
    transition: all 0.2s ease;
  }

  :deep(.el-input__wrapper:hover) {
    box-shadow:
      0 0 0 1px rgba(86, 153, 255, 0.72) inset,
      0 16px 32px rgba(48, 91, 161, 0.1);
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow:
      0 0 0 1px #2f77ff inset,
      0 0 0 5px rgba(47, 119, 255, 0.1);
  }

  :deep(.el-input__inner) {
    color: #10204f;
    font-size: 15px;
    font-weight: 700;
  }

  :deep(.el-input__inner::placeholder) {
    color: #98a6bd;
    font-weight: 500;
  }

  :deep(.el-input__suffix-inner),
  :deep(.el-input__password) {
    color: #8495b0;
  }

  :deep(.el-form-item__error) {
    padding-top: 4px;
    color: #2f77ff;
  }
}

.input-icon {
  width: 18px;
  height: 18px;
  color: #7890af;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin: -6px 0 18px;
}

.text-action {
  padding: 0;
  border: 0;
  color: #236dff;
  background: transparent;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 17px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.26), transparent 38%),
    linear-gradient(135deg, #2bd7ff 0%, #2c72ff 46%, #7b5dff 100%);
  box-shadow: 0 18px 36px rgba(48, 111, 255, 0.28);
  font-size: 16px;
  font-weight: 900;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 22px 42px rgba(48, 111, 255, 0.34);
  }

  &.is-disabled {
    color: rgba(255, 255, 255, 0.82);
    background: linear-gradient(135deg, #82cfff, #8aa6ff);
  }
}

.apply-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  margin-top: 14px;
  border: 1px solid rgba(74, 124, 255, 0.58);
  border-radius: 16px;
  color: #235fff;
  background: rgba(255, 255, 255, 0.38);
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #235fff;
    background: rgba(239, 246, 255, 0.8);
  }
}

.account-chip {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
  gap: 8px;
  align-items: center;
  margin-top: 18px;
  padding: 12px;
  border: 1px solid rgba(187, 205, 236, 0.72);
  border-radius: 16px;
  background: rgba(246, 250, 255, 0.6);

  span {
    color: #687894;
    font-size: 12px;
    font-weight: 800;
  }

  strong,
  em {
    overflow: hidden;
    color: #10204f;
    font-size: 13px;
    font-style: normal;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  em {
    color: #2c65d8;
  }
}

.copyright {
  position: absolute;
  left: 50%;
  bottom: 18px;
  z-index: 2;
  width: min(92vw, 760px);
  color: #6b7895;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  transform: translateX(-50%);

  span {
    margin: 0 10px;
    color: #a1aec4;
  }
}

@keyframes node-float {
  50% {
    opacity: 0.6;
    transform: translateY(-12px) scale(0.86);
  }
}

@keyframes rotate-orbit {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes rotate-orbit-reverse {
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes pulse-orbit {
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes breathe-core {
  50% {
    box-shadow:
      0 0 72px rgba(56, 203, 255, 0.56),
      0 34px 90px rgba(55, 96, 210, 0.3);
    transform: translate(-50%, -50%) scale(1.04);
  }
}

@keyframes scan-core {
  0% {
    transform: translateX(-120%);
  }

  58%,
  100% {
    transform: translateX(120%);
  }
}

@media (max-width: 1180px) {
  .login-stage {
    grid-template-columns: minmax(0, 1fr);
    width: min(720px, calc(100% - 48px));
    padding-top: 34px;
  }

  .nexus-panel {
    display: none;
  }

  .access-card {
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .login-page {
    min-height: 100vh;
    overflow-y: auto;
  }

  .login-topbar {
    padding: 18px 16px 0;
  }

  .login-logo {
    padding-right: 10px;
  }

  .language-switch {
    height: 34px;
    padding: 0 12px;
    font-size: 12px;
  }

  .login-stage {
    width: calc(100% - 32px);
    min-height: auto;
    padding: 42px 0 82px;
  }

  .access-card {
    padding: 26px 20px 22px;
    border-radius: 26px;
  }

  .access-heading h1 {
    font-size: 30px;
  }

  .account-chip {
    grid-template-columns: 1fr;
  }
}
</style>
