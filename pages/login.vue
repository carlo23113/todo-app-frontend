<template>
  <div class="login-container">
    <div id="graphics-div">
      <div id="app-title">TO-DO APP</div>
      <v-img id="vector" :src="vector" />
      <div id="quote">Keep your day on track.</div>
    </div>
    <div id="login-form-div">
      <div id="login-form">
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="login()"
          lazy-validation
        >
          <div id="login-title">Login</div>
          <div id="login-subtitle">
            Welcome back! Please login your account to continue.
          </div>
          <v-text-field
            v-model="loginData.email"
            label="Email"
            dense
            outlined
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            v-model="loginData.password"
            type="password"
            label="Password"
            dense
            outlined
            :rules="passwordRules"
          ></v-text-field>
          <v-btn :loading="loading" type="submit" color="primary" block rounded
            >Login</v-btn
          >

          <div id="social-logins-label"><span>Or Login with</span></div>

          <social-logins />
          <div id="sign-up">
            Don't have an account?
            <nuxt-link to="/signup">Sign up for free</nuxt-link>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import vector from '@/assets/todo-vector.svg'
import { login } from '@/graphql/Auth.js'
import { Toast } from '@/assets/js/Swal.js'
export default {
  layout: 'none',
  middleware: ['unauthenticated'],
  data: () => ({
    vector,
    loginData: {
      email: '',
      password: '',
    },
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [(v) => !!v || 'Password is required'],
    valid: false,
    loading: false,
  }),
  created() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const token = urlParams.get('token')
    if (token) {
      this.loginWithToken(token)
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.errorMessage = ''
      await this.$refs.form.validate()

      if (this.valid) {
        this.$apollo
          .mutate({
            mutation: login,
            variables: {
              email: this.loginData.email,
              password: this.loginData.password,
            },
          })
          .then((result) => {
            const data = result.data
            if (data.login.__typename === 'Error') {
              Toast.fire({
                icon: 'warning',
                title: data.login.message,
              })
            } else {
              const jwt = data.login.access_token
              this.loginWithToken(jwt)
            }
            this.loading = false
          })
          .catch(() => (this.loading = false))
      } else this.loading = false
    },

    loginWithToken(token) {
      this.$apolloHelpers.onLogin(token)
      this.$router.push('/')
    },
  },
}
</script>
