// ===== 文档来源空间 =====

export interface DocSource {
  id: string
  name: string
  icon: string
  count: number
  parsed: number
  failed: number
  lastUpload: string
  dept: string
  color: string
}

export function getDocSourcesMock(): DocSource[] {
  return [
    { id: 's1', name: '公司制度文档', icon: 'Document', count: 68, parsed: 62, failed: 1, lastUpload: '2026-06-05', dept: '人力资源部', color: '#6366f1' },
    { id: 's2', name: '员工手册资料', icon: 'Notebook', count: 34, parsed: 30, failed: 2, lastUpload: '2026-06-04', dept: '人力资源部', color: '#10b981' },
    { id: 's3', name: '项目交接文档', icon: 'Connection', count: 22, parsed: 18, failed: 0, lastUpload: '2026-06-03', dept: '技术管理部', color: '#f59e0b' },
    { id: 's4', name: '项目技术文档', icon: 'Monitor', count: 126, parsed: 98, failed: 6, lastUpload: '2026-06-05', dept: '技术部', color: '#3b82f6' },
    { id: 's5', name: '福利政策文件', icon: 'Present', count: 18, parsed: 16, failed: 0, lastUpload: '2026-05-28', dept: '人力资源部', color: '#ec4899' },
    { id: 's6', name: '流程规范文件', icon: 'SetUp', count: 42, parsed: 38, failed: 0, lastUpload: '2026-06-02', dept: '运营部', color: '#14b8a6' },
    { id: 's7', name: '培训资料', icon: 'Reading', count: 28, parsed: 22, failed: 0, lastUpload: '2026-06-01', dept: '培训部', color: '#8b5cf6' },
    { id: 's8', name: '合同模板', icon: 'Tickets', count: 16, parsed: 14, failed: 0, lastUpload: '2026-05-25', dept: '法务部', color: '#f97316' },
    { id: 's9', name: '运维手册', icon: 'Tools', count: 24, parsed: 12, failed: 0, lastUpload: '2026-05-30', dept: '运维团队', color: '#64748b' },
    { id: 's10', name: '历史归档', icon: 'Box', count: 8, parsed: 2, failed: 0, lastUpload: '2026-03-15', dept: '行政部', color: '#94a3b8' }
  ]
}

// ===== 文档资产 =====

export type DocStatus = 'pending' | 'parsing' | 'parsed' | 'failed' | 'indexed' | 'disabled' | 'archived'
export type DocType = 'PDF' | 'Word' | 'Excel' | 'PPT' | 'Markdown' | 'TXT' | 'CSV'
export type AiRefStatus = 'allowed' | 'forbidden' | 'need_audit' | 'dept_only'

export interface DocumentAsset {
  id: string
  title: string
  type: DocType
  sourceId: string
  sourceName: string
  uploader: string
  uploadTime: string
  fileSize: string
  status: DocStatus
  segments: number
  indexed: boolean
  aiRef: AiRefStatus
  tags: string[]
  risk: string
  qualityScore: number
  dept: string
}

export function getDocAssetsMock(): DocumentAsset[] {
  return [
    { id: 'd1', title: '员工请假管理制度.pdf', type: 'PDF', sourceId: 's1', sourceName: '公司制度文档', uploader: '张三', uploadTime: '2026-06-05 10:24', fileSize: '2.8 MB', status: 'indexed', segments: 36, indexed: true, aiRef: 'allowed', tags: ['考勤', '请假', '审批', 'HR'], risk: '', qualityScore: 92, dept: '人力资源部' },
    { id: 'd2', title: '差旅报销管理办法.pdf', type: 'PDF', sourceId: 's1', sourceName: '公司制度文档', uploader: '李四', uploadTime: '2026-06-05 09:10', fileSize: '3.2 MB', status: 'indexed', segments: 28, indexed: true, aiRef: 'allowed', tags: ['报销', '差旅', '财务'], risk: '', qualityScore: 88, dept: '财务部' },
    { id: 'd3', title: '新人入职指南.docx', type: 'Word', sourceId: 's2', sourceName: '员工手册资料', uploader: '王五', uploadTime: '2026-06-04 16:30', fileSize: '5.6 MB', status: 'indexed', segments: 52, indexed: true, aiRef: 'allowed', tags: ['新人', '入职', '指南'], risk: '', qualityScore: 85, dept: '人力资源部' },
    { id: 'd4', title: 'K8s 集群运维手册.pdf', type: 'PDF', sourceId: 's9', sourceName: '运维手册', uploader: '吴大伟', uploadTime: '2026-06-04 14:00', fileSize: '12.4 MB', status: 'parsed', segments: 86, indexed: false, aiRef: 'forbidden', tags: ['K8s', '运维', '容器'], risk: '文档超过 90 天未更新', qualityScore: 65, dept: '运维团队' },
    { id: 'd5', title: '项目上线发布规范.docx', type: 'Word', sourceId: 's6', sourceName: '流程规范文件', uploader: '赵六', uploadTime: '2026-06-03 11:20', fileSize: '1.8 MB', status: 'indexed', segments: 24, indexed: true, aiRef: 'allowed', tags: ['上线', '发布', '运维'], risk: '', qualityScore: 78, dept: '技术管理部' },
    { id: 'd6', title: '微服务链路追踪指南.md', type: 'Markdown', sourceId: 's4', sourceName: '项目技术文档', uploader: '赵鹏飞', uploadTime: '2026-06-03 09:45', fileSize: '0.8 MB', status: 'indexed', segments: 18, indexed: true, aiRef: 'allowed', tags: ['微服务', 'SkyWalking'], risk: '', qualityScore: 72, dept: '架构组' },
    { id: 'd7', title: '旧版权限申请说明.pdf', type: 'PDF', sourceId: 's10', sourceName: '历史归档', uploader: '周小丽', uploadTime: '2026-01-10 10:00', fileSize: '1.2 MB', status: 'archived', segments: 12, indexed: false, aiRef: 'forbidden', tags: ['权限', 'OA', '旧版'], risk: '文档已过期，建议归档', qualityScore: 20, dept: 'IT 运维组' },
    { id: 'd8', title: '员工福利补贴政策.pdf', type: 'PDF', sourceId: 's5', sourceName: '福利政策文件', uploader: '孙小红', uploadTime: '2026-06-02 15:30', fileSize: '2.1 MB', status: 'indexed', segments: 22, indexed: true, aiRef: 'allowed', tags: ['福利', '补贴', '五险一金'], risk: '', qualityScore: 85, dept: '人力资源部' },
    { id: 'd9', title: '代码规范与审查流程.md', type: 'Markdown', sourceId: 's4', sourceName: '项目技术文档', uploader: '张三', uploadTime: '2026-06-02 10:15', fileSize: '0.6 MB', status: 'indexed', segments: 30, indexed: true, aiRef: 'allowed', tags: ['代码规范', 'Review'], risk: '', qualityScore: 80, dept: '技术研发部' },
    { id: 'd10', title: 'MySQL 慢查询优化指南.pdf', type: 'PDF', sourceId: 's4', sourceName: '项目技术文档', uploader: '刘浩然', uploadTime: '2026-06-01 16:40', fileSize: '4.2 MB', status: 'failed', segments: 0, indexed: false, aiRef: 'forbidden', tags: ['MySQL', '性能优化'], risk: '解析失败：PDF 可能包含扫描图片', qualityScore: 0, dept: 'DBA 团队' },
    { id: 'd11', title: 'OKR 管理实施办法.docx', type: 'Word', sourceId: 's1', sourceName: '公司制度文档', uploader: '孙雅琪', uploadTime: '2026-06-01 14:20', fileSize: '1.5 MB', status: 'indexed', segments: 20, indexed: true, aiRef: 'allowed', tags: ['OKR', '绩效'], risk: '', qualityScore: 90, dept: '人力资源部' },
    { id: 'd12', title: 'SSO 单点登录集成指南.md', type: 'Markdown', sourceId: 's4', sourceName: '项目技术文档', uploader: '杨洁', uploadTime: '2026-06-01 11:00', fileSize: '0.4 MB', status: 'parsing', segments: 0, indexed: false, aiRef: 'need_audit', tags: ['SSO', 'OAuth'], risk: '', qualityScore: 0, dept: '安全团队' },
    { id: 'd13', title: '薪酬福利管理办法.xlsx', type: 'Excel', sourceId: 's5', sourceName: '福利政策文件', uploader: '陈七', uploadTime: '2026-05-31 16:30', fileSize: '3.8 MB', status: 'indexed', segments: 45, indexed: true, aiRef: 'dept_only', tags: ['薪酬', '福利'], risk: '疑似包含敏感薪资信息', qualityScore: 75, dept: '人力资源部' },
    { id: 'd14', title: '信息安全管理办法.pdf', type: 'PDF', sourceId: 's1', sourceName: '公司制度文档', uploader: '黄志刚', uploadTime: '2026-05-30 10:20', fileSize: '5.1 MB', status: 'indexed', segments: 48, indexed: true, aiRef: 'allowed', tags: ['安全', '保密'], risk: '', qualityScore: 82, dept: '安全团队' },
    { id: 'd15', title: '项目交接文档模板.docx', type: 'Word', sourceId: 's3', sourceName: '项目交接文档', uploader: '马晓丽', uploadTime: '2026-05-29 15:00', fileSize: '0.9 MB', status: 'pending', segments: 0, indexed: false, aiRef: 'forbidden', tags: ['交接', '模板'], risk: '缺少负责人', qualityScore: 0, dept: '技术管理部' },
    { id: 'd16', title: 'API 网关限流配置说明.md', type: 'Markdown', sourceId: 's4', sourceName: '项目技术文档', uploader: '周志强', uploadTime: '2026-05-28 11:30', fileSize: '0.3 MB', status: 'indexed', segments: 14, indexed: true, aiRef: 'allowed', tags: ['API', '网关', '限流'], risk: '', qualityScore: 68, dept: '架构组' },
    { id: 'd17', title: '年度培训计划.pptx', type: 'PPT', sourceId: 's7', sourceName: '培训资料', uploader: '林芳', uploadTime: '2026-05-27 14:00', fileSize: '8.6 MB', status: 'parsed', segments: 32, indexed: false, aiRef: 'need_audit', tags: ['培训', '年度计划'], risk: '', qualityScore: 70, dept: '培训部' },
    { id: 'd18', title: '劳动合同模板.docx', type: 'Word', sourceId: 's8', sourceName: '合同模板', uploader: '何律师', uploadTime: '2026-05-25 09:30', fileSize: '1.1 MB', status: 'indexed', segments: 16, indexed: true, aiRef: 'dept_only', tags: ['合同', '劳动', '法务'], risk: '敏感文档，仅限法务和HR引用', qualityScore: 88, dept: '法务部' },
    { id: 'd19', title: '数据库备份恢复手册.txt', type: 'TXT', sourceId: 's9', sourceName: '运维手册', uploader: '运维小张', uploadTime: '2026-05-24 16:20', fileSize: '0.2 MB', status: 'parsing', segments: 0, indexed: false, aiRef: 'forbidden', tags: ['数据库', '备份', '恢复'], risk: '', qualityScore: 0, dept: '运维团队' },
    { id: 'd20', title: '客户数据导出记录.csv', type: 'CSV', sourceId: 's10', sourceName: '历史归档', uploader: '数据组李', uploadTime: '2026-03-15 10:00', fileSize: '15.2 MB', status: 'disabled', segments: 0, indexed: false, aiRef: 'forbidden', tags: ['客户数据', '导出'], risk: '可能包含客户隐私数据', qualityScore: 0, dept: '数据组' }
  ]
}

// ===== 解析流水线 =====

export type PipeStepStatus = 'pending' | 'processing' | 'success' | 'failed' | 'skipped'

export interface PipeStep {
  key: string
  label: string
  status: PipeStepStatus
  detail: string
  time: string
}

export interface PipelineRecord {
  docId: string
  docTitle: string
  steps: PipeStep[]
}

export function getPipelineMock(): PipelineRecord[] {
  return [
    { docId: 'd1', docTitle: '员工请假管理制度.pdf', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '10:24:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 4820 字', time: '10:24:06' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '10:24:18' },
      { key: 'segment', label: '智能分段', status: 'success', detail: '生成 36 个知识片段', time: '10:24:24' },
      { key: 'summary', label: '摘要提取', status: 'success', detail: '摘要生成完成', time: '10:24:28' },
      { key: 'tag', label: '标签生成', status: 'success', detail: '生成 4 个标签', time: '10:24:30' },
      { key: 'index', label: '向量索引', status: 'success', detail: '索引建立完成', time: '10:24:31' },
      { key: 'ai', label: 'AI 引用', status: 'success', detail: '已开启 AI 引用', time: '10:24:33' }
    ]},
    { docId: 'd12', docTitle: 'SSO 单点登录集成指南.md', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '11:00:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 3200 字', time: '11:00:04' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '11:00:10' },
      { key: 'segment', label: '智能分段', status: 'processing', detail: '正在分析文档结构...', time: '' },
      { key: 'summary', label: '摘要提取', status: 'pending', detail: '', time: '' },
      { key: 'tag', label: '标签生成', status: 'pending', detail: '', time: '' },
      { key: 'index', label: '向量索引', status: 'pending', detail: '', time: '' },
      { key: 'ai', label: 'AI 引用', status: 'pending', detail: '', time: '' }
    ]},
    { docId: 'd10', docTitle: 'MySQL 慢查询优化指南.pdf', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '16:40:01' },
      { key: 'extract', label: '文本提取', status: 'failed', detail: 'PDF 可能为扫描图片，无法提取文本', time: '16:40:08' },
      { key: 'clean', label: '内容清洗', status: 'skipped', detail: '前置步骤失败，已跳过', time: '' },
      { key: 'segment', label: '智能分段', status: 'skipped', detail: '', time: '' },
      { key: 'summary', label: '摘要提取', status: 'skipped', detail: '', time: '' },
      { key: 'tag', label: '标签生成', status: 'skipped', detail: '', time: '' },
      { key: 'index', label: '向量索引', status: 'skipped', detail: '', time: '' },
      { key: 'ai', label: 'AI 引用', status: 'skipped', detail: '', time: '' }
    ]},
    { docId: 'd19', docTitle: '数据库备份恢复手册.txt', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '16:20:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 1800 字', time: '16:20:03' },
      { key: 'clean', label: '内容清洗', status: 'processing', detail: '正在清洗格式...', time: '' },
      { key: 'segment', label: '智能分段', status: 'pending', detail: '', time: '' },
      { key: 'summary', label: '摘要提取', status: 'pending', detail: '', time: '' },
      { key: 'tag', label: '标签生成', status: 'pending', detail: '', time: '' },
      { key: 'index', label: '向量索引', status: 'pending', detail: '', time: '' },
      { key: 'ai', label: 'AI 引用', status: 'pending', detail: '', time: '' }
    ]},
    { docId: 'd3', docTitle: '新人入职指南.docx', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '16:30:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 8600 字', time: '16:30:08' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '16:30:20' },
      { key: 'segment', label: '智能分段', status: 'success', detail: '生成 52 个知识片段', time: '16:30:30' },
      { key: 'summary', label: '摘要提取', status: 'success', detail: '摘要生成完成', time: '16:30:36' },
      { key: 'tag', label: '标签生成', status: 'success', detail: '生成 3 个标签', time: '16:30:38' },
      { key: 'index', label: '向量索引', status: 'success', detail: '索引建立完成', time: '16:30:40' },
      { key: 'ai', label: 'AI 引用', status: 'success', detail: '已开启 AI 引用', time: '16:30:42' }
    ]},
    { docId: 'd5', docTitle: '项目上线发布规范.docx', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '11:20:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 3400 字', time: '11:20:05' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '11:20:12' },
      { key: 'segment', label: '智能分段', status: 'success', detail: '生成 24 个知识片段', time: '11:20:18' },
      { key: 'summary', label: '摘要提取', status: 'success', detail: '摘要生成完成', time: '11:20:22' },
      { key: 'tag', label: '标签生成', status: 'success', detail: '生成 3 个标签', time: '11:20:24' },
      { key: 'index', label: '向量索引', status: 'success', detail: '索引建立完成', time: '11:20:26' },
      { key: 'ai', label: 'AI 引用', status: 'success', detail: '已开启 AI 引用', time: '11:20:28' }
    ]},
    { docId: 'd17', docTitle: '年度培训计划.pptx', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '14:00:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 5200 字', time: '14:00:10' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '14:00:22' },
      { key: 'segment', label: '智能分段', status: 'success', detail: '生成 32 个知识片段', time: '14:00:32' },
      { key: 'summary', label: '摘要提取', status: 'success', detail: '摘要生成完成', time: '14:00:38' },
      { key: 'tag', label: '标签生成', status: 'success', detail: '生成 2 个标签', time: '14:00:40' },
      { key: 'index', label: '向量索引', status: 'pending', detail: '等待建立索引', time: '' },
      { key: 'ai', label: 'AI 引用', status: 'pending', detail: '', time: '' }
    ]},
    { docId: 'd8', docTitle: '员工福利补贴政策.pdf', steps: [
      { key: 'upload', label: '上传成功', status: 'success', detail: '文件上传完成', time: '15:30:01' },
      { key: 'extract', label: '文本提取', status: 'success', detail: '提取 2800 字', time: '15:30:05' },
      { key: 'clean', label: '内容清洗', status: 'success', detail: '清洗完成', time: '15:30:12' },
      { key: 'segment', label: '智能分段', status: 'success', detail: '生成 22 个知识片段', time: '15:30:18' },
      { key: 'summary', label: '摘要提取', status: 'success', detail: '摘要生成完成', time: '15:30:22' },
      { key: 'tag', label: '标签生成', status: 'success', detail: '生成 3 个标签', time: '15:30:24' },
      { key: 'index', label: '向量索引', status: 'success', detail: '索引建立完成', time: '15:30:26' },
      { key: 'ai', label: 'AI 引用', status: 'success', detail: '已开启 AI 引用', time: '15:30:28' }
    ]}
  ]
}

// ===== 知识片段 =====

export interface KnowledgeSegment {
  id: string
  docId: string
  title: string
  content: string
  pageNum: string
  charCount: number
  tags: string[]
  citeable: boolean
}

export function getSegmentsMock(): KnowledgeSegment[] {
  return [
    { id: 'seg1', docId: 'd1', title: '请假申请要求', content: '员工请假需要提前在 OA 系统提交申请，并说明请假类型、时间和原因。请假 1 天以内由直属上级审批，1-3 天需部门负责人审批，3 天以上需分管副总审批。', pageNum: '第 2 页', charCount: 86, tags: ['请假', 'OA', '审批'], citeable: true },
    { id: 'seg2', docId: 'd1', title: '病假材料要求', content: '病假需要上传医院证明或相关医疗材料。连续病假超过 3 天需提供三甲医院诊断证明。', pageNum: '第 3 页', charCount: 64, tags: ['病假', '证明材料'], citeable: true },
    { id: 'seg3', docId: 'd1', title: '年假计算规则', content: '入职满 1 年享有 5 天年假，满 5 年享有 10 天年假，满 10 年享有 15 天年假。年假可以拆分使用，最小单位为半天。', pageNum: '第 4 页', charCount: 78, tags: ['年假', '工龄'], citeable: true },
    { id: 'seg4', docId: 'd1', title: '婚假产假条款', content: '婚假为 3 天，晚婚增加 7 天。产假按照国家规定执行，女员工 98 天，男员工陪产假 15 天。', pageNum: '第 5 页', charCount: 72, tags: ['婚假', '产假', '晚婚'], citeable: true },
    { id: 'seg5', docId: 'd1', title: '请假审批节点', content: '所有请假申请最终由 HR 部门备案。审批节点包括：直属上级 → 部门负责人 → 分管副总（3天以上）→ HR 备案。', pageNum: '第 6 页', charCount: 82, tags: ['审批', '流程', 'HR'], citeable: true },
    { id: 'seg6', docId: 'd2', title: '差旅报销标准', content: '国内差旅住宿标准：一线城市 500 元/晚，二线城市 400 元/晚，其他城市 300 元/晚。交通费用实报实销。', pageNum: '第 2 页', charCount: 88, tags: ['差旅', '住宿标准'], citeable: true },
    { id: 'seg7', docId: 'd2', title: '报销审批流程', content: '报销需在出差结束后 5 个工作日内提交，经部门负责人审批后由财务部审核打款。', pageNum: '第 3 页', charCount: 58, tags: ['报销', '审批'], citeable: true },
    { id: 'seg8', docId: 'd3', title: '入职第一天安排', content: '新员工入职第一天需要完成：领取办公设备、开通企业邮箱、注册 OA 系统账号、参加新人培训。', pageNum: '第 1 页', charCount: 72, tags: ['入职', '第一天'], citeable: true },
    { id: 'seg9', docId: 'd3', title: '试用期考核标准', content: '试用期为 3 个月，期间需要完成部门安排的考核任务。考核通过后方可转正。', pageNum: '第 4 页', charCount: 62, tags: ['试用期', '考核'], citeable: true },
    { id: 'seg10', docId: 'd8', title: '五险一金缴纳标准', content: '公司按照员工实际工资基数缴纳五险一金，其中公积金缴纳比例为 12%。', pageNum: '第 2 页', charCount: 56, tags: ['五险一金', '公积金'], citeable: true },
    { id: 'seg11', docId: 'd8', title: '餐补和交通补贴', content: '公司提供每月 500 元餐补和 300 元交通补贴，随工资一同发放。', pageNum: '第 3 页', charCount: 48, tags: ['餐补', '交通补贴'], citeable: true },
    { id: 'seg12', docId: 'd5', title: '灰度发布流程', content: '所有上线变更必须先经过灰度发布，灰度比例从 5% 开始，逐步扩大到 20%、50%、100%。每个阶段需观察至少 30 分钟。', pageNum: '第 3 页', charCount: 92, tags: ['灰度', '发布', '运维'], citeable: true }
  ]
}

// ===== 解析日志 =====

export interface ParseLog {
  id: string
  time: string
  step: string
  status: 'success' | 'failed' | 'info'
  duration: string
  detail: string
}

export function getParseLogsMock(): ParseLog[] {
  return [
    { id: 'pl1', time: '10:24:01', step: '文件上传', status: 'success', duration: '1.2s', detail: '文件上传成功，大小 2.8 MB' },
    { id: 'pl2', time: '10:24:06', step: '文本提取', status: 'info', duration: '7.3s', detail: '开始提取 PDF 文本内容' },
    { id: 'pl3', time: '10:24:13', step: '文本提取', status: 'success', duration: '7.3s', detail: '提取完成，共 4820 字' },
    { id: 'pl4', time: '10:24:18', step: '内容清洗', status: 'success', duration: '5.1s', detail: '清洗完成，去除页眉页脚和冗余空白' },
    { id: 'pl5', time: '10:24:24', step: '智能分段', status: 'success', duration: '6.2s', detail: '生成 36 个知识片段，平均字数 72 字' },
    { id: 'pl6', time: '10:24:28', step: '摘要提取', status: 'success', duration: '4.0s', detail: '自动摘要生成完成，共 156 字' },
    { id: 'pl7', time: '10:24:30', step: '标签生成', status: 'success', duration: '2.1s', detail: '生成 4 个标签：考勤、请假、审批、HR' },
    { id: 'pl8', time: '10:24:31', step: '向量索引', status: 'success', duration: '1.8s', detail: '36 个片段全部完成向量索引' },
    { id: 'pl9', time: '10:24:33', step: 'AI 引用', status: 'success', duration: '0.5s', detail: '文档进入 AI 可引用状态' },
    { id: 'pl10', time: '16:40:08', step: '文本提取', status: 'failed', duration: '6.8s', detail: 'PDF 可能为扫描图片，无法直接提取文本。建议启用 OCR 解析或上传可复制文字版本' }
  ]
}

// ===== 引用记录 =====

export interface CitationRecord {
  id: string
  time: string
  module: string
  question: string
  segment: string
  user: string
  hit: boolean
}

export function getCitationsMock(): CitationRecord[] {
  return [
    { id: 'ct1', time: '2026-06-05 14:20', module: 'AI 问答', question: '请假流程怎么走？', segment: '请假申请要求', user: '李晓婷', hit: true },
    { id: 'ct2', time: '2026-06-05 11:30', module: 'AI 问答', question: '年假有几天？', segment: '年假计算规则', user: '王建国', hit: true },
    { id: 'ct3', time: '2026-06-04 16:45', module: '知识库', question: '关联知识推荐', segment: '病假材料要求', user: '系统', hit: true },
    { id: 'ct4', time: '2026-06-04 10:15', module: 'AI 问答', question: '婚假怎么申请？', segment: '婚假产假条款', user: '陈思雨', hit: true },
    { id: 'ct5', time: '2026-06-03 15:30', module: '员工搜索', question: '请假制度', segment: '请假申请要求', user: '刘浩然', hit: true },
    { id: 'ct6', time: '2026-06-03 09:20', module: 'AI 问答', question: '差旅住宿标准是多少？', segment: '差旅报销标准', user: '孙雅琪', hit: true },
    { id: 'ct7', time: '2026-06-02 14:00', module: '知识库', question: '相关制度关联', segment: '报销审批流程', user: '系统', hit: true },
    { id: 'ct8', time: '2026-06-01 16:30', module: 'AI 问答', question: '新人入职需要准备什么？', segment: '入职第一天安排', user: '新员工小张', hit: true }
  ]
}

// ===== 风险提示 =====

export interface RiskAlert {
  id: string
  docId: string
  type: 'duplicate' | 'expired' | 'parse_fail' | 'sensitive' | 'no_owner' | 'no_index' | 'no_access' | 'unreviewed'
  message: string
  level: 'high' | 'medium' | 'low'
}

export function getRiskAlertsMock(): RiskAlert[] {
  return [
    { id: 'r1', docId: 'd7', type: 'expired', message: '《旧版权限申请说明》已超过 120 天未更新，建议归档或替换为新版本', level: 'high' },
    { id: 'r2', docId: 'd10', type: 'parse_fail', message: '《MySQL 慢查询优化指南》解析失败，PDF 可能为扫描图片，建议启用 OCR 解析', level: 'high' },
    { id: 'r3', docId: 'd13', type: 'sensitive', message: '《薪酬福利管理办法》疑似包含敏感薪资信息，建议禁止 AI 引用', level: 'high' },
    { id: 'r4', docId: 'd20', type: 'sensitive', message: '《客户数据导出记录》可能包含客户隐私数据，已禁止 AI 引用', level: 'medium' },
    { id: 'r5', docId: 'd15', type: 'no_owner', message: '《项目交接文档模板》缺少负责人，建议指定文档负责人', level: 'medium' },
    { id: 'r6', docId: 'd4', type: 'expired', message: '《K8s 集群运维手册》已超过 90 天未更新，建议确认内容是否仍然有效', level: 'medium' }
  ]
}

// ===== 标签选项 =====
export const docTagOptions = ['考勤', '请假', '审批', '报销', '差旅', '新人', '入职', 'K8s', 'MySQL', 'SSO', 'OKR', '安全', '福利', '代码规范', '上线', '发布', '合同', '培训']

// ===== 上传人选项 =====
export const uploaderOptions = ['张三', '李四', '王五', '赵六', '吴大伟', '赵鹏飞', '杨洁', '刘浩然']

// ===== 文档类型选项 =====
export const docTypeOptions = [
  { value: 'PDF', label: 'PDF' },
  { value: 'Word', label: 'Word' },
  { value: 'Excel', label: 'Excel' },
  { value: 'PPT', label: 'PPT' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'TXT', label: 'TXT' },
  { value: 'CSV', label: 'CSV' }
]

// ===== 文档状态选项 =====
export const docStatusOptions = [
  { value: 'pending', label: '待解析' },
  { value: 'parsing', label: '解析中' },
  { value: 'parsed', label: '已解析' },
  { value: 'failed', label: '解析失败' },
  { value: 'indexed', label: '已索引' },
  { value: 'disabled', label: '已停用' },
  { value: 'archived', label: '已归档' }
]

// ===== 顶部统计 =====

export interface DocTopStats {
  total: number
  parsed: number
  parsing: number
  failed: number
  pendingCount: number
  segments: number
  vectors: number
  todayUpload: number
}

export function getDocTopStatsMock(): DocTopStats {
  return { total: 386, parsed: 312, parsing: 18, failed: 9, pendingCount: 47, segments: 12860, vectors: 11240, todayUpload: 26 }
}

// ===== 解析质量评分 =====

export interface QualityDimension {
  name: string
  score: number
  comment: string
}

export interface QualityReport {
  docId: string
  overall: number
  dimensions: QualityDimension[]
}

export function getQualityReportsMock(): QualityReport[] {
  return [
    { docId: 'd1', overall: 92, dimensions: [
      { name: '文本提取完整度', score: 95, comment: '文本提取完整，无明显遗漏' },
      { name: '分段合理性', score: 90, comment: '分段结构清晰，主题划分合理' },
      { name: '标题识别准确度', score: 92, comment: '标题识别正常，层级关系正确' },
      { name: '表格识别质量', score: 88, comment: '表格识别基本完整' },
      { name: '图片内容识别', score: 80, comment: '少量图片未识别文字内容' },
      { name: '乱码检测', score: 98, comment: '未发现明显乱码' },
      { name: '重复片段检测', score: 95, comment: '无重复片段' },
      { name: 'AI 引用适配度', score: 90, comment: '适合 AI 问答引用' }
    ]},
    { docId: 'd2', overall: 88, dimensions: [
      { name: '文本提取完整度', score: 90, comment: '提取完整' },
      { name: '分段合理性', score: 85, comment: '分段基本合理' },
      { name: '标题识别准确度', score: 90, comment: '标题识别正常' },
      { name: '表格识别质量', score: 82, comment: '少量表格缺失' },
      { name: '图片内容识别', score: 78, comment: '部分图表未识别' },
      { name: '乱码检测', score: 96, comment: '无乱码' },
      { name: '重复片段检测', score: 92, comment: '无明显重复' },
      { name: 'AI 引用适配度', score: 88, comment: '适合引用' }
    ]},
    { docId: 'd4', overall: 65, dimensions: [
      { name: '文本提取完整度', score: 70, comment: '部分章节提取不完整' },
      { name: '分段合理性', score: 60, comment: '分段偏大，建议细化' },
      { name: '标题识别准确度', score: 68, comment: '部分嵌套标题未识别' },
      { name: '表格识别质量', score: 55, comment: '表格识别质量较低' },
      { name: '图片内容识别', score: 50, comment: '大量架构图未识别' },
      { name: '乱码检测', score: 80, comment: '少量特殊字符异常' },
      { name: '重复片段检测', score: 72, comment: '存在少量重复内容' },
      { name: 'AI 引用适配度', score: 65, comment: '建议人工审核后再引用' }
    ]},
    { docId: 'd10', overall: 0, dimensions: [
      { name: '文本提取完整度', score: 0, comment: '提取失败' },
      { name: '分段合理性', score: 0, comment: '未执行' },
      { name: '标题识别准确度', score: 0, comment: '未执行' },
      { name: '表格识别质量', score: 0, comment: '未执行' },
      { name: '图片内容识别', score: 0, comment: '未执行' },
      { name: '乱码检测', score: 0, comment: '未执行' },
      { name: '重复片段检测', score: 0, comment: '未执行' },
      { name: 'AI 引用适配度', score: 0, comment: '不可引用' }
    ]},
    { docId: 'd3', overall: 85, dimensions: [
      { name: '文本提取完整度', score: 88, comment: '提取基本完整' },
      { name: '分段合理性', score: 82, comment: '分段合理' },
      { name: '标题识别准确度', score: 86, comment: '大部分标题正确' },
      { name: '表格识别质量', score: 80, comment: '表格基本完整' },
      { name: '图片内容识别', score: 75, comment: '部分图片未识别' },
      { name: '乱码检测', score: 92, comment: '无明显乱码' },
      { name: '重复片段检测', score: 88, comment: '无重复' },
      { name: 'AI 引用适配度', score: 85, comment: '适合引用' }
    ]},
    { docId: 'd13', overall: 75, dimensions: [
      { name: '文本提取完整度', score: 82, comment: 'Excel 提取基本完整' },
      { name: '分段合理性', score: 70, comment: '表格数据分段较粗' },
      { name: '标题识别准确度', score: 78, comment: 'Sheet 名称识别正常' },
      { name: '表格识别质量', score: 75, comment: '部分合并单元格丢失' },
      { name: '图片内容识别', score: 60, comment: '嵌入图表未识别' },
      { name: '乱码检测', score: 88, comment: '少量编码异常' },
      { name: '重复片段检测', score: 80, comment: '存在少量重复行' },
      { name: 'AI 引用适配度', score: 62, comment: '含敏感数据，建议限制引用' }
    ]}
  ]
}

// ===== 文档摘要 mock =====
export const docSummaries: Record<string, string> = {
  d1: '该文档主要说明员工请假的类型、申请方式、审批节点、材料要求和 HR 备案规则。涵盖年假、病假、婚假、产假等多种假期类型的详细规定。',
  d2: '该文档规定了公司员工差旅期间的住宿标准、交通费用、餐饮补贴和报销审批流程，适用于所有出差场景。',
  d3: '该文档为新人入职提供全面指引，包括入职准备、账号开通、设备领取、试用期考核和转正流程。',
  d4: '该文档详细描述了 K8s 集群的日常运维操作，包括节点管理、Pod 调度、故障排查和性能监控。',
  d5: '该文档规范了项目上线发布的完整流程，包括代码审查、测试验证、灰度发布和回滚方案。',
  d8: '该文档说明了公司为员工提供的各项福利补贴政策，包括五险一金、餐补、交通补贴和节日福利。'
}
