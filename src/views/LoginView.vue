<template>
  <div class="login-page">
    <section class="brand-panel">
      <div class="brand-mark">BJ</div>
      <div>
        <p class="eyebrow">Token Governance Console</p>
        <h1>八戒智能检索平台</h1>
        <p class="brand-copy">统一管理模型调用、额度消耗、团队预算和异常用量。</p>
      </div>
    </section>

    <section class="login-card" aria-label="用户登录">
      <div class="card-heading">
        <h2>用户登录</h2>
        <span>API: /api/v1/user/login</span>
      </div>

      <el-form
        ref="loginFormRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="submitLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username" autocomplete="username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="current-password"
            placeholder="请输入密码"
            show-password
            type="password"
          />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha_code">
          <div class="captcha-row">
            <el-input
              v-model.trim="form.captcha_code"
              autocomplete="off"
              maxlength="6"
              placeholder="请输入验证码"
            />
            <button
              class="captcha-button"
              type="button"
              :disabled="captchaLoading"
              @click="loadCaptcha"
            >
              <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
              <span v-else>{{ captchaLoading ? '加载中' : '刷新' }}</span>
            </button>
          </div>
        </el-form-item>

        <el-button class="login-button" type="primary" :loading="loginLoading" @click="submitLogin">
          登录进入控制台
        </el-button>
      </el-form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCaptcha, login } from '@/api/user'
import { saveLoginSession } from '@/utils/auth'
import { getErrorMessage } from '@/utils/http'

const router = useRouter()

const loginFormRef = ref<FormInstance>()
const captchaImage = ref('')
const captchaLoading = ref(false)
const loginLoading = ref(false)

const form = reactive({
  username: 'admin',
  password: 'ps_12345678',
  captcha_id: '',
  captcha_code: '',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const loadCaptcha = async () => {
  captchaLoading.value = true

  try {
    const captcha = await getCaptcha()

    form.captcha_id = captcha.captcha_id || ''
    captchaImage.value = captcha.captcha_image || ''
    form.captcha_code = ''

    if (!form.captcha_id || !captchaImage.value) {
      ElMessage.warning('验证码返回数据不完整')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '验证码加载失败'))
  } finally {
    captchaLoading.value = false
  }
}

const submitLogin = async () => {
  if (!loginFormRef.value) return

  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true

  try {
    const result = await login({
      username: form.username,
      password: form.password,
      captcha_id: form.captcha_id,
      captcha_code: form.captcha_code,
    })

    saveLoginSession(form.username, result.data, result.raw)

    ElMessage.success(result.message || '登录成功')
    await router.replace({ name: 'home' })
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '登录失败'))
    await loadCaptcha()
  } finally {
    loginLoading.value = false
  }
}

onMounted(() => {
  loadCaptcha()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 48px;
  align-items: center;
  padding: 48px clamp(24px, 6vw, 96px);
  color: #f8fbff;
  background:
    linear-gradient(115deg, rgba(8, 19, 36, 0.9), rgba(13, 22, 43, 0.72)),
    radial-gradient(circle at 24% 24%, rgba(28, 181, 176, 0.62), transparent 28%),
    radial-gradient(circle at 80% 18%, rgba(244, 114, 54, 0.32), transparent 25%),
    #07111f;
}

.brand-panel {
  display: grid;
  grid-template-columns: 76px minmax(0, 680px);
  gap: 24px;
  align-items: start;
}

.brand-mark {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(132, 247, 238, 0.38);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(18, 184, 164, 0.9), rgba(40, 96, 183, 0.88));
  color: #ffffff;
  font-size: 26px;
  font-weight: 850;
  box-shadow: 0 0 34px rgba(38, 222, 205, 0.4);
}

.eyebrow {
  margin: 0 0 14px;
  color: #88f7ed;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 720px;
  font-size: clamp(40px, 6vw, 76px);
  line-height: 1.04;
  font-weight: 900;
}

.brand-copy {
  margin: 24px 0 0;
  max-width: 520px;
  color: #bfd0e6;
  font-size: 18px;
  line-height: 1.8;
}

.login-card {
  width: 100%;
  padding: 30px;
  border: 1px solid rgba(136, 247, 237, 0.22);
  border-radius: 8px;
  background: rgba(8, 17, 31, 0.78);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.card-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 26px;
}

.card-heading h2 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
}

.card-heading span {
  color: #8aa0b7;
  font-size: 12px;
  white-space: nowrap;
}

.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px;
  gap: 12px;
  width: 100%;
}

.captcha-button {
  height: 40px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(136, 247, 237, 0.28);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  cursor: pointer;
}

.captcha-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.captcha-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-button {
  width: 100%;
  margin-top: 6px;
}

:deep(.el-form-item__label) {
  color: #dbeafe;
  font-weight: 650;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    gap: 28px;
    align-items: start;
    padding: 30px 18px;
  }

  .brand-panel {
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 16px;
  }

  .brand-mark {
    width: 54px;
    height: 54px;
    font-size: 18px;
  }

  h1 {
    font-size: 36px;
  }

  .brand-copy {
    margin-top: 14px;
    font-size: 15px;
  }

  .login-card {
    padding: 22px;
  }

  .card-heading {
    align-items: start;
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 420px) {
  .captcha-row {
    grid-template-columns: 1fr;
  }

  .captcha-button {
    width: 128px;
  }
}
</style>
