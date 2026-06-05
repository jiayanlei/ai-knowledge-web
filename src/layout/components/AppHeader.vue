<template>
  <header class="app-header">
    <AppLogo class="header-logo" />

    <div class="header-search">
      <el-input
        v-model="keyword"
        clearable
        placeholder="搜索知识库、文档、问题或关键词..."
      >
        <template #prefix>
          <Search class="search-icon" />
        </template>
        <template #suffix>
          <span class="shortcut-key">Ctrl K</span>
        </template>
      </el-input>
    </div>

    <div class="header-actions">
      <el-popover
        popper-class="header-notice-popover"
        placement="bottom-end"
        trigger="click"
        :width="348"
      >
        <template #reference>
          <el-badge :value="unreadNoticeCount" :hidden="unreadNoticeCount === 0" class="notice-badge">
            <el-button :icon="Bell" circle aria-label="消息通知" />
          </el-badge>
        </template>

        <div class="notice-panel">
          <div class="notice-header">
            <div>
              <strong>消息通知</strong>
              <span>{{ unreadNoticeCount }} 条未读</span>
            </div>
            <button type="button" @click="markAllRead">全部已读</button>
          </div>

          <div class="notice-list">
            <button
              v-for="notice in notices"
              :key="notice.id"
              type="button"
              class="notice-item"
              :class="{ 'is-read': notice.read }"
              @click="openNotice(notice)"
            >
              <span class="notice-type" :class="`notice-type--${notice.type}`">
                <AppIcon :name="notice.icon" />
              </span>
              <span class="notice-content">
                <strong>{{ notice.title }}</strong>
                <em>{{ notice.desc }}</em>
                <time>{{ notice.time }}</time>
              </span>
            </button>
          </div>
        </div>
      </el-popover>

      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="user-entry">
          <el-avatar :size="34" class="user-avatar">{{ userInitial }}</el-avatar>
          <div class="user-meta">
            <span class="company-name">{{ userInfo.company }}</span>
            <span class="user-name">{{ userInfo.name }} · {{ userInfo.department }}</span>
          </div>
          <ArrowDown class="dropdown-icon" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <AppIcon name="User" />
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="account">
              <AppIcon name="Setting" />
              账号设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <AppIcon name="SwitchButton" />
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>

  <el-dialog v-model="profileVisible" title="个人中心" width="520px" class="header-user-dialog" append-to-body>
    <div class="profile-card">
      <el-avatar :size="58" class="profile-avatar">{{ userInitial }}</el-avatar>
      <div>
        <h3>{{ userInfo.name }}</h3>
        <p>{{ userInfo.company }} · {{ userInfo.department }}</p>
      </div>
    </div>

    <div class="info-grid">
      <span>账号编号</span>
      <strong>{{ userInfo.id }}</strong>
      <span>所属公司</span>
      <strong>{{ userInfo.company }}</strong>
      <span>所属部门</span>
      <strong>{{ userInfo.department }}</strong>
      <span>当前角色</span>
      <strong>知识库管理员</strong>
    </div>

    <template #footer>
      <el-button @click="profileVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="accountVisible" title="账号设置" width="560px" class="header-user-dialog" append-to-body>
    <div class="settings-list">
      <div class="settings-item">
        <span class="settings-icon">
          <AppIcon name="Lock" />
        </span>
        <div>
          <strong>登录密码</strong>
          <p>建议定期更新密码，确保账号安全。</p>
        </div>
        <el-button size="small" @click="showAccountTip">修改</el-button>
      </div>

      <div class="settings-item">
        <span class="settings-icon">
          <AppIcon name="Message" />
        </span>
        <div>
          <strong>消息提醒</strong>
          <p>文档解析、审核结果和系统公告会在右上角提醒。</p>
        </div>
        <el-button size="small" @click="showAccountTip">管理</el-button>
      </div>

      <div class="settings-item">
        <span class="settings-icon">
          <AppIcon name="Connection" />
        </span>
        <div>
          <strong>最近登录</strong>
          <p>今天 09:12 · 内网办公终端</p>
        </div>
        <el-button size="small" @click="showAccountTip">查看</el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="accountVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown, Bell, Search } from '@element-plus/icons-vue'
import AppIcon from '@/components/AppIcon/index.vue'
import AppLogo from '@/components/AppLogo/index.vue'
import { LOGIN_PATH } from '@/constants/route'
import { useUserStore } from '@/stores/modules/user'
import { clearToken } from '@/utils/auth'
import {
  hideGlobalLoading,
  setGlobalLoadingText,
  showGlobalLoading
} from '@/utils/globalLoading'

const keyword = ref('')
const logoutLoading = ref(false)
const profileVisible = ref(false)
const accountVisible = ref(false)
const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const userInitial = computed(() => userInfo.value.name.slice(0, 1))
const notices = ref([
  {
    id: 1,
    type: 'document',
    icon: 'Document',
    title: '新员工入职指南已完成同步',
    desc: '文档中心新增 1 份制度文档，可进入知识库查看。',
    time: '今天 09:15',
    read: false
  },
  {
    id: 2,
    type: 'question',
    icon: 'ChatDotRound',
    title: 'AI 问答命中率较昨日提升',
    desc: '今日已处理 128 次问答，命中率保持在 96%。',
    time: '今天 08:40',
    read: false
  },
  {
    id: 3,
    type: 'system',
    icon: 'Bell',
    title: '待审核文档需要处理',
    desc: '还有 18 份文档等待审核，请及时跟进。',
    time: '昨天 16:40',
    read: false
  }
])
const unreadNoticeCount = computed(() => notices.value.filter((notice) => !notice.read).length)

type UserCommand = 'profile' | 'account' | 'logout'

async function handleLogout() {
  if (logoutLoading.value) return

  logoutLoading.value = true
  showGlobalLoading('正在退出登录')

  try {
    await waitLoading(360)
    clearToken()
    setGlobalLoadingText('正在返回登录页')
    await waitLoading(320)
    await router.replace(LOGIN_PATH)
  } finally {
    hideGlobalLoading()
    logoutLoading.value = false
  }
}

function waitLoading(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function handleUserCommand(command: UserCommand) {
  if (command === 'profile') {
    profileVisible.value = true
    return
  }

  if (command === 'account') {
    accountVisible.value = true
    return
  }

  handleLogout()
}

function openNotice(notice: { read: boolean; title: string }) {
  notice.read = true
  ElMessage.info(notice.title)
}

function markAllRead() {
  notices.value.forEach((notice) => {
    notice.read = true
  })
}

function showAccountTip() {
  ElMessage.info('当前为演示账号信息，后续可接入真实账号接口。')
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--app-header-height);
  padding: 0 20px;
  border-bottom: 1px solid var(--app-border-color);
  background: #fff;
  box-shadow: none;
  z-index: 2;
}

.header-logo {
  flex: 0 0 calc(var(--app-sidebar-width) - 6px);
}

.header-search {
  width: min(610px, 42vw);

  :deep(.el-input__wrapper) {
    height: 36px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #dce5f2 inset;
  }

  :deep(.el-input__inner) {
    color: #1f2a44;
    font-size: 14px;
  }
}

.search-icon {
  width: 16px;
  color: #94a3b8;
}

.shortcut-key {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 7px;
  border: 1px solid #dce5f2;
  border-radius: 6px;
  color: #98a2b3;
  font-size: 12px;
  line-height: 1;
}

.header-actions,
.user-entry {
  display: flex;
  align-items: center;
}

.header-actions {
  gap: 13px;

  :deep(.el-button.is-circle) {
    width: 34px;
    height: 34px;
    border: 0;
    color: #172554;
    background: transparent;

    &:hover {
      color: #2563eb;
      background: #f1f6ff;
    }
  }
}

.notice-badge {
  line-height: 1;
}

.notice-panel {
  color: var(--notice-text, #172554);
}

.notice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 2px 12px;
  border-bottom: 1px solid var(--notice-border, #e6eef8);

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 15px;
    font-weight: 800;
  }

  span {
    margin-top: 3px;
    color: var(--notice-muted, #64748b);
    font-size: 12px;
  }

  button {
    flex: 0 0 auto;
    border: 0;
    color: #2563eb;
    background: transparent;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
}

.notice-item {
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--notice-border, #e6eef8);
  border-radius: 10px;
  color: inherit;
  background: var(--notice-card-bg, #f8fbff);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.36);
    background: var(--notice-hover-bg, #f1f6ff);
  }

  &.is-read {
    opacity: 0.62;
  }
}

.notice-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #2563eb;
  background: #eaf3ff;

  .app-icon {
    width: 17px;
    height: 17px;
  }
}

.notice-type--question {
  color: #0f9f72;
  background: #e6f8f1;
}

.notice-type--system {
  color: #f97316;
  background: #fff0e5;
}

.notice-content {
  min-width: 0;

  strong,
  em,
  time {
    display: block;
  }

  strong {
    color: var(--notice-text, #172554);
    font-size: 13px;
    font-weight: 800;
    line-height: 1.35;
  }

  em {
    margin-top: 4px;
    color: var(--notice-muted, #64748b);
    font-size: 12px;
    font-style: normal;
    line-height: 1.45;
  }

  time {
    margin-top: 5px;
    color: var(--notice-time, #94a3b8);
    font-size: 12px;
  }
}

.user-entry {
  gap: 10px;
  padding-left: 4px;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    .company-name {
      color: #2563eb;
    }
  }
}

.user-avatar {
  color: #fff;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent),
    linear-gradient(135deg, #1e3a8a, #60a5fa);
  box-shadow: 0 5px 14px rgba(37, 99, 235, 0.18);
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.company-name {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
}

.user-name {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
}

.dropdown-icon {
  width: 14px;
  color: #94a3b8;
}

:deep(.el-dropdown-menu__item) {
  gap: 8px;

  .app-icon {
    width: 15px;
    height: 15px;
  }
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--dialog-border, #e6eef8);
  border-radius: 12px;
  background: var(--dialog-soft-bg, #f8fbff);

  h3 {
    margin: 0;
    color: var(--dialog-text, #172554);
    font-size: 20px;
    font-weight: 800;
  }

  p {
    margin: 6px 0 0;
    color: var(--dialog-muted, #64748b);
    font-size: 13px;
  }
}

.profile-avatar {
  color: #fff;
  background: linear-gradient(135deg, #1e3a8a, #60a5fa);
}

.info-grid {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px 16px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--dialog-border, #e6eef8);
  border-radius: 12px;

  span {
    color: var(--dialog-muted, #64748b);
    font-size: 13px;
  }

  strong {
    min-width: 0;
    color: var(--dialog-text, #172554);
    font-size: 13px;
    font-weight: 700;
  }
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-item {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--dialog-border, #e6eef8);
  border-radius: 12px;
  background: var(--dialog-soft-bg, #f8fbff);

  strong {
    display: block;
    color: var(--dialog-text, #172554);
    font-size: 14px;
    font-weight: 800;
  }

  p {
    margin: 5px 0 0;
    color: var(--dialog-muted, #64748b);
    font-size: 12px;
    line-height: 1.45;
  }
}

.settings-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  color: #2563eb;
  background: #eaf3ff;

  .app-icon {
    width: 18px;
    height: 18px;
  }
}

:global(.header-notice-popover) {
  --notice-bg: #ffffff;
  --notice-card-bg: #f8fbff;
  --notice-hover-bg: #f1f6ff;
  --notice-border: #e6eef8;
  --notice-text: #172554;
  --notice-muted: #64748b;
  --notice-time: #94a3b8;
  padding: 14px;
  border-color: var(--notice-border);
  background: var(--notice-bg);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

:global(.header-user-dialog) {
  --dialog-bg: #ffffff;
  --dialog-soft-bg: #f8fbff;
  --dialog-border: #e6eef8;
  --dialog-text: #172554;
  --dialog-muted: #64748b;
  background: var(--dialog-bg);
}

:global(.header-user-dialog .el-dialog__title) {
  color: var(--dialog-text);
  font-weight: 800;
}

:global(.header-user-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: var(--dialog-muted);
}

:global(html.dark) .app-header {
  border-bottom-color: #1f2937;
  background: #111827;
}

:global(html.dark) .header-search {
  :deep(.el-input__wrapper) {
    background: #0f172a;
    box-shadow: 0 0 0 1px #273449 inset;
  }

  :deep(.el-input__inner) {
    color: #e5e7eb;
  }
}

:global(html.dark) .shortcut-key {
  border-color: #273449;
  color: #94a3b8;
  background: #111827;
}

:global(html.dark) .header-actions {
  :deep(.el-button.is-circle) {
    color: #dbeafe;

    &:hover {
      color: #93c5fd;
      background: #1e293b;
    }
  }
}

:global(html.dark) .company-name {
  color: #f8fafc;
}

:global(html.dark) .user-name,
:global(html.dark) .dropdown-icon {
  color: #94a3b8;
}

:global(html.dark) .user-entry:hover .company-name {
  color: #93c5fd;
}

:global(html.dark .header-notice-popover),
:global(html.dark .header-user-dialog) {
  --notice-bg: #111827;
  --notice-card-bg: #172033;
  --notice-hover-bg: #1e293b;
  --notice-border: #273449;
  --notice-text: #f8fafc;
  --notice-muted: #cbd5e1;
  --notice-time: #94a3b8;
  --dialog-bg: #111827;
  --dialog-soft-bg: #172033;
  --dialog-border: #273449;
  --dialog-text: #f8fafc;
  --dialog-muted: #cbd5e1;
  color: #f8fafc;
}

@media (prefers-color-scheme: dark) {
  .app-header {
    border-bottom-color: #1f2937;
    background: #111827;
  }

  .header-search {
    :deep(.el-input__wrapper) {
      background: #0f172a;
      box-shadow: 0 0 0 1px #273449 inset;
    }

    :deep(.el-input__inner) {
      color: #e5e7eb;
    }
  }

  .shortcut-key {
    border-color: #273449;
    color: #94a3b8;
    background: #111827;
  }

  .header-actions {
    :deep(.el-button.is-circle) {
      color: #dbeafe;

      &:hover {
        color: #93c5fd;
        background: #1e293b;
      }
    }
  }

  .company-name {
    color: #f8fafc;
  }

  .user-name,
  .dropdown-icon {
    color: #94a3b8;
  }

  .user-entry:hover .company-name {
    color: #93c5fd;
  }

  :global(.header-notice-popover),
  :global(.header-user-dialog) {
    --notice-bg: #111827;
    --notice-card-bg: #172033;
    --notice-hover-bg: #1e293b;
    --notice-border: #273449;
    --notice-text: #f8fafc;
    --notice-muted: #cbd5e1;
    --notice-time: #94a3b8;
    --dialog-bg: #111827;
    --dialog-soft-bg: #172033;
    --dialog-border: #273449;
    --dialog-text: #f8fafc;
    --dialog-muted: #cbd5e1;
    color: #f8fafc;
  }
}

@media (max-width: 1080px) {
  .header-search {
    width: 320px;
  }

  .company-name {
    display: none;
  }
}

@media (max-width: 760px) {
  .app-header {
    gap: 12px;
    padding: 0 14px;
  }

  .header-logo {
    flex: 0 0 auto;
  }

  .header-search {
    flex: 1;
    width: auto;
  }

  .user-meta,
  .dropdown-icon {
    display: none;
  }

  .header-actions {
    gap: 6px;
  }
}
</style>
