<template>
  <section class="study-demo">
    <h2>{{ props.title }}</h2>
    <div class="study-extra">
      <slot>
        <p>这里可以放父组件传入的内容。</p>
      </slot>
    </div>
    <el-input
      v-model.trim="studyForm.name"
      placeholder="请输入你的名字"
      clearable
    />

    <p v-if="studyForm.name">你好，{{ studyForm.name }}！</p>
    <p v-else>还没有填写名字。</p>
    <el-select
      v-model="studyForm.direction"
      placeholder="请选择学习方向"
      clearable
    >
      <el-option label="前端开发" value="frontend" />
      <el-option label="后端开发" value="backend" />
      <el-option label="全栈开发" value="fullstack" />
    </el-select>

    <div class="study-hours">
      <span>每周计划学习</span>

      <el-input-number v-model="studyForm.weeklyHours" :min="1" :max="40" />

      <span>小时</span>
    </div>
    <div class="study-result">
      <p>姓名：{{ studyForm.name || '未填写' }}</p>
      <p>方向：{{ directionLabel }}</p>
      <p>每周学习：{{ studyForm.weeklyHours }} 小时</p>
      <p>预计全年学习：{{ yearlyStudyHours }} 小时</p>

      <el-progress :percentage="studyIntensity" :stroke-width="10" />

      <p class="study-suggestion">
        {{ studySuggestion }}
      </p>
      <p>组件挂载时间：{{ mountedTime }}</p>
      <p>本次页面停留：{{ studySeconds }} 秒</p>
    </div>
    <div class="study-tip">
      <slot name="tip">
        <span v-if="tipLoading">学习建议加载中...</span>
        <span v-else>{{ studyTip }}</span>
      </slot>
    </div>

    <p>你已经点击了 {{ studyCount }} 次。</p>

    <p v-if="studyCount >= 5">你已经点击 5 次，继续保持！</p>

    <div class="study-actions">
      <el-button type="primary" @click="increaseStudyCount">
        完成一次学习
      </el-button>

      <el-button @click="resetStudy"> 重置练习 </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
// 定义组件的 props 类型和默认值 接收父组件传递的 title 属性
const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'Vue 响应式练习',
  },
)
// 定义事件类型向父组件传递数据
const emit = defineEmits<{
  completed: [count: number]
  reset: []
}>()

const savedStudyCount = Number(localStorage.getItem('vue_study_count') || 0)

const studyCount = ref(savedStudyCount)
const increaseStudyCount = () => {
  studyCount.value++
  emit('completed', studyCount.value)
}
const STUDY_FORM_KEY = 'vue_study_form'
const studyForm = reactive({
  name: '',
  direction: '',
  weeklyHours: 1,
})

const savedStudyForm = localStorage.getItem(STUDY_FORM_KEY)
if (savedStudyForm) {
  try {
    const parsedForm = JSON.parse(savedStudyForm)
    Object.assign(studyForm, parsedForm)
  } catch (error) {
    console.error('学习计划读取失败：', error)
  }
}
watch(
  studyForm,
  (newForm) => {
    localStorage.setItem(STUDY_FORM_KEY, JSON.stringify(newForm))
  },
  {
    deep: true,
  },
)
const yearlyStudyHours = computed(() => {
  return studyForm.weeklyHours * 52
})
watch(studyCount, (newCount) => {
  localStorage.setItem('vue_study_count', String(newCount))
})
watch(
  () => studyForm.direction,
  (newDirection, oldDirection) => {
    console.log('学习方向变化：', oldDirection, '→', newDirection)
  },
)

const directionLabel = computed(() => {
  if (studyForm.direction === 'frontend') {
    return '前端开发'
  }
  if (studyForm.direction === 'backend') {
    return '后端开发'
  }
  if (studyForm.direction === 'fullstack') {
    return '全栈开发'
  }
  return '未选择'
})

const studySuggestion = computed(() => {
  if (studyForm.weeklyHours < 5) {
    return '建议保持轻量学习，先建立稳定习惯。'
  }

  if (studyForm.weeklyHours < 10) {
    return '学习节奏适中，可以配合小项目练习。'
  }

  return '投入时间较多，建议制定明确的阶段目标。'
})
const studyIntensity = computed(() => {
  return Math.round((studyForm.weeklyHours / 40) * 100)
})
const resetStudy = () => {
  studyForm.name = ''
  studyForm.direction = ''
  studyForm.weeklyHours = 1
  studyCount.value = 0
  studySeconds.value = 0
  emit('reset')
}
const mountedTime = ref('')

const studyTip = ref('')
const tipLoading = ref(false)

const loadStudyTip = async () => {
  tipLoading.value = true

  try {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 800)
    })

    studyTip.value = '先掌握 Vue 基础，再尝试拆分组件。'
  } finally {
    tipLoading.value = false
  }
}
const studySeconds = ref(0)

let studyTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  mountedTime.value = new Date().toLocaleTimeString()
  loadStudyTip()
  studyTimer = setInterval(() => {
    studySeconds.value++
  }, 1000)

  console.log('StudyDemo 已挂载')
})

onUnmounted(() => {
  if (studyTimer !== undefined) {
    clearInterval(studyTimer)
  }

  console.log('StudyDemo 已卸载，定时器已清理')
})
</script>

<style scoped>
.study-demo {
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
}
.study-suggestion {
  color: #5eead4;
  line-height: 1.6;
}
.study-actions {
  display: flex;
  gap: 10px;
}
.study-hours {
  display: flex;
  align-items: center;
  gap: 10px;
}

.study-result {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-left: 3px solid #14b8a6;
  background: rgba(2, 8, 23, 0.3);
}
</style>
