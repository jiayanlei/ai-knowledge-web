import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/modules/app'

export function useLayout() {
  const appStore = useAppStore()
  const { sidebarCollapsed } = storeToRefs(appStore)

  return {
    sidebarCollapsed,
    toggleSidebar: appStore.toggleSidebar
  }
}
