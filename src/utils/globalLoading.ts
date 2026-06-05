import { reactive } from 'vue'

const DEFAULT_LOADING_TEXT = 'AI 知识引擎加载中'

export const globalLoadingState = reactive({
  visible: false,
  text: DEFAULT_LOADING_TEXT
})

export function showGlobalLoading(text = DEFAULT_LOADING_TEXT) {
  globalLoadingState.text = text
  globalLoadingState.visible = true
}

export function hideGlobalLoading() {
  globalLoadingState.visible = false
}

export function setGlobalLoadingText(text: string) {
  globalLoadingState.text = text || DEFAULT_LOADING_TEXT
}
