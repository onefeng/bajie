<template>
  <main class="dashboard-shell">
    <aside class="side-nav">
      <div class="logo-block">
        <span>BJ</span>
        <div>
          <strong>八戒 TokenOps</strong>
          <small>Consumption Center</small>
        </div>
      </div>

      <nav>
        <button class="nav-item active" type="button">总览</button>
        <button class="nav-item" type="button">项目预算</button>
        <button class="nav-item" type="button">消耗明细</button>
        <button class="nav-item" type="button">告警策略</button>
      </nav>

      <div class="quota-card">
        <span>本月额度健康度</span>
        <strong>82%</strong>
        <div class="quota-line">
          <i style="width: 82%"></i>
        </div>
      </div>
    </aside>

    <section class="content-area">
      <header class="top-bar">
        <div>
          <p class="eyebrow">TOKEN CONSUMPTION MANAGEMENT</p>
          <h1>Tokens 消耗管理首页</h1>
        </div>
        <div class="top-actions">
          <span class="user-chip">{{ username }}</span>
          <el-button type="primary">导出报表</el-button>
          <el-button @click="logout">退出</el-button>
        </div>
      </header>

      <section class="hero-grid">
        <div class="hero-panel">
          <div class="hero-copy">
            <span>实时预算雷达</span>
            <h2>本月已消耗 1,284.6 万 Tokens</h2>
            <p>较上周增长 12.8%，图像检索链路占比最高，建议重点关注批量任务和夜间峰值。</p>
          </div>
          <div class="orbital-meter" aria-label="本月 token 消耗百分比">
            <div class="meter-core">
              <strong>64%</strong>
              <span>月度消耗</span>
            </div>
          </div>
        </div>

        <div class="alert-panel">
          <span>风险提示</span>
          <strong>3</strong>
          <p>项目接近预算阈值</p>
          <el-button plain size="small">查看策略</el-button>
        </div>
      </section>

      <section class="metric-grid">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small :class="{ positive: metric.trend.startsWith('+') }">{{ metric.trend }}</small>
        </article>
      </section>

      <section class="main-grid">
        <article class="panel trend-panel">
          <div class="panel-heading">
            <div>
              <span>7 日消耗趋势</span>
              <h3>Token Usage Flow</h3>
            </div>
            <el-segmented v-model="activeRange" :options="['7D', '14D', '30D']" size="small" />
          </div>
          <div class="chart-bars">
            <div v-for="item in dailyUsage" :key="item.day" class="bar-item">
              <div class="bar-track">
                <i :style="{ height: `${item.rate}%` }"></i>
              </div>
              <span>{{ item.day }}</span>
            </div>
          </div>
        </article>

        <article class="panel project-panel">
          <div class="panel-heading">
            <div>
              <span>项目消耗排行</span>
              <h3>Budget Heatmap</h3>
            </div>
          </div>
          <div class="project-list">
            <div v-for="project in projects" :key="project.name" class="project-row">
              <div>
                <strong>{{ project.name }}</strong>
                <span>{{ project.owner }}</span>
              </div>
              <div class="project-usage">
                <small>{{ project.tokens }}</small>
                <div class="usage-track">
                  <i :style="{ width: `${project.rate}%` }"></i>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel activity-panel">
          <div class="panel-heading">
            <div>
              <span>最近调用</span>
              <h3>Live Requests</h3>
            </div>
          </div>
          <div class="activity-list">
            <div v-for="item in activities" :key="item.id" class="activity-row">
              <span :class="['status-dot', item.status]"></span>
              <div>
                <strong>{{ item.name }}</strong>
                <small>{{ item.model }} · {{ item.tokens }}</small>
              </div>
              <em>{{ item.time }}</em>
            </div>
          </div>
        </article>

        <article class="panel policy-panel">
          <div class="panel-heading">
            <div>
              <span>治理策略</span>
              <h3>Control Rules</h3>
            </div>
          </div>
          <div class="policy-stack">
            <label v-for="policy in policies" :key="policy.name" class="policy-item">
              <el-switch v-model="policy.enabled" />
              <div>
                <strong>{{ policy.name }}</strong>
                <span>{{ policy.desc }}</span>
              </div>
            </label>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearLoginSession, getUsername } from '@/utils/auth'

const router = useRouter()
const username = getUsername()
const activeRange = ref('7D')

const metrics = [
  { label: '今日消耗', value: '86.2 万', trend: '+8.4%' },
  { label: '剩余额度', value: '715.4 万', trend: '-12.8%' },
  { label: '平均单次', value: '2,418', trend: '+3.1%' },
  { label: '异常请求', value: '17', trend: '-6.5%' },
]

const dailyUsage = [
  { day: 'Mon', rate: 42 },
  { day: 'Tue', rate: 58 },
  { day: 'Wed', rate: 49 },
  { day: 'Thu', rate: 76 },
  { day: 'Fri', rate: 63 },
  { day: 'Sat', rate: 84 },
  { day: 'Sun', rate: 68 },
]

const projects = [
  { name: '图像检索服务', owner: 'Vision Team', tokens: '482.1 万', rate: 88 },
  { name: '向量入库任务', owner: 'DataOps', tokens: '316.8 万', rate: 64 },
  { name: '运营问答助手', owner: 'Growth', tokens: '224.5 万', rate: 46 },
  { name: '质检分析链路', owner: 'QA Lab', tokens: '178.2 万', rate: 35 },
]

const activities = [
  { id: 1, name: 'batch-image-embedding', model: 'embedding-v1', tokens: '42,184', time: '2 min', status: 'ok' },
  { id: 2, name: 'semantic-search-prod', model: 'retrieval-v2', tokens: '18,932', time: '9 min', status: 'warn' },
  { id: 3, name: 'report-agent', model: 'reasoning-lite', tokens: '8,405', time: '16 min', status: 'ok' },
  { id: 4, name: 'nightly-import', model: 'embedding-v1', tokens: '96,118', time: '31 min', status: 'hot' },
]

const policies = reactive([
  { name: '超过预算 80% 自动告警', desc: '发送站内提醒并标记项目风险', enabled: true },
  { name: '夜间批量任务限流', desc: '防止离线任务挤占线上额度', enabled: true },
  { name: '异常峰值二次确认', desc: '单任务消耗突增时暂停执行', enabled: false },
])

const logout = async () => {
  clearLoginSession()
  ElMessage.success('已退出登录')
  await router.replace({ name: 'login' })
}
</script>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  background:
    radial-gradient(circle at 28% 4%, rgba(20, 184, 166, 0.28), transparent 24%),
    radial-gradient(circle at 78% 18%, rgba(249, 115, 22, 0.16), transparent 22%),
    linear-gradient(135deg, #06111f 0%, #111827 48%, #172033 100%);
  color: #f8fafc;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px 20px;
  border-right: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(2, 8, 23, 0.52);
  backdrop-filter: blur(20px);
}

.logo-block {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.logo-block > span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, #14b8a6, #2563eb);
  font-weight: 850;
  box-shadow: 0 0 28px rgba(20, 184, 166, 0.42);
}

.logo-block strong,
.logo-block small {
  display: block;
}

.logo-block strong {
  font-size: 15px;
}

.logo-block small,
.quota-card span,
.panel-heading span,
.metric-card span,
.project-row span,
.activity-row small,
.policy-item span {
  color: #94a3b8;
}

nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  height: 42px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #cbd5e1;
  text-align: left;
  padding: 0 14px;
  cursor: pointer;
}

.nav-item.active,
.nav-item:hover {
  border-color: rgba(45, 212, 191, 0.32);
  background: rgba(20, 184, 166, 0.14);
  color: #ffffff;
}

.quota-card {
  margin-top: auto;
  padding: 16px;
  border: 1px solid rgba(45, 212, 191, 0.24);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
}

.quota-card strong {
  display: block;
  margin: 8px 0 12px;
  font-size: 32px;
}

.quota-line,
.usage-track {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
}

.quota-line i,
.usage-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #14b8a6, #f97316);
}

.content-area {
  min-width: 0;
  padding: 30px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #5eead4;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 900;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-chip {
  padding: 8px 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  color: #dbeafe;
  background: rgba(15, 23, 42, 0.6);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 18px;
  margin-bottom: 18px;
}

.hero-panel,
.alert-panel,
.metric-card,
.panel {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.68);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
}

.hero-panel {
  min-height: 260px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  align-items: center;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.hero-panel::before {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(94, 234, 212, 0.14);
  border-radius: 8px;
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-copy span,
.alert-panel span {
  color: #5eead4;
  font-size: 13px;
  font-weight: 750;
}

.hero-copy h2 {
  margin-top: 14px;
  max-width: 680px;
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.08;
  font-weight: 900;
}

.hero-copy p {
  margin-top: 18px;
  max-width: 560px;
  color: #b6c3d4;
  line-height: 1.8;
}

.orbital-meter {
  width: 218px;
  height: 218px;
  display: grid;
  place-items: center;
  justify-self: center;
  border-radius: 50%;
  background:
    conic-gradient(from 210deg, #14b8a6 0 64%, rgba(148, 163, 184, 0.16) 64% 100%),
    radial-gradient(circle, rgba(37, 99, 235, 0.22), rgba(15, 23, 42, 0.2));
  box-shadow: 0 0 52px rgba(20, 184, 166, 0.34);
}

.meter-core {
  width: 150px;
  height: 150px;
  display: grid;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background: #08111f;
}

.meter-core strong {
  font-size: 42px;
}

.meter-core span {
  color: #94a3b8;
}

.alert-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(160deg, rgba(249, 115, 22, 0.2), rgba(15, 23, 42, 0.72)),
    rgba(15, 23, 42, 0.68);
}

.alert-panel strong {
  margin-top: 12px;
  font-size: 76px;
  line-height: 1;
}

.alert-panel p {
  margin: 8px 0 20px;
  color: #fed7aa;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.metric-card {
  padding: 18px;
}

.metric-card strong {
  display: block;
  margin: 12px 0 8px;
  font-size: 30px;
}

.metric-card small {
  color: #fca5a5;
}

.metric-card small.positive {
  color: #5eead4;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 18px;
}

.panel {
  padding: 22px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.panel-heading h3 {
  margin-top: 6px;
  font-size: 20px;
}

.chart-bars {
  height: 240px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 12px;
}

.bar-item {
  min-width: 0;
  display: grid;
  gap: 10px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

.bar-track {
  height: 200px;
  display: flex;
  align-items: end;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.1);
}

.bar-track i {
  width: 100%;
  display: block;
  border-radius: inherit;
  background: linear-gradient(180deg, #5eead4, #2563eb);
  box-shadow: 0 0 22px rgba(94, 234, 212, 0.24);
}

.project-list,
.activity-list,
.policy-stack {
  display: grid;
  gap: 14px;
}

.project-row,
.activity-row,
.policy-item {
  display: grid;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 8px;
  background: rgba(2, 8, 23, 0.34);
}

.project-row {
  grid-template-columns: minmax(0, 1fr) 150px;
}

.project-row strong,
.project-row span,
.activity-row strong,
.activity-row small,
.policy-item strong,
.policy-item span {
  display: block;
}

.project-usage {
  display: grid;
  gap: 8px;
  text-align: right;
}

.activity-row {
  grid-template-columns: 10px minmax(0, 1fr) 52px;
}

.activity-row em {
  color: #7dd3fc;
  font-size: 12px;
  font-style: normal;
  text-align: right;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
}

.status-dot.warn {
  background: #f59e0b;
}

.status-dot.hot {
  background: #ef4444;
}

.policy-item {
  grid-template-columns: 44px minmax(0, 1fr);
}

@media (max-width: 1180px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .side-nav {
    display: none;
  }

  .main-grid,
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .content-area {
    padding: 20px 14px;
  }

  .top-bar,
  .top-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-panel {
    grid-template-columns: 1fr;
  }

  .metric-grid {
    grid-template-columns: 1fr 1fr;
  }

  .project-row {
    grid-template-columns: 1fr;
  }

  .project-usage {
    text-align: left;
  }
}

@media (max-width: 460px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .orbital-meter {
    width: 180px;
    height: 180px;
  }

  .meter-core {
    width: 124px;
    height: 124px;
  }
}
</style>
