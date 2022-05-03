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
          @submit.prevent="signup()"
          lazy-validation
        >
          <div id="login-title">Register</div>
          <div id="login-subtitle">Register an account.</div>
          <v-text-field
            v-model="signupData.email"
            label="Email"
            dense
            outlined
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            v-model="signupData.username"
            label="Username"
            dense
            outlined
            :rules="usernameRules"
          ></v-text-field>
          <v-text-field
            v-model="signupData.password"
            type="password"
            label="Password"
            dense
            outlined
            :rules="passwordRules"
          ></v-text-field>
          <v-btn type="submit" color="primary" block rounded :loading="loading"
            >Signup</v-btn
          >
          <div id="social-logins-label"><span>Or Signup with</span></div>
          <social-logins />
          <div id="sign-up">
            Already have an account?
            <nuxt-link to="/login">Login</nuxt-link>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import vector from '@/assets/todo-vector.svg'
import { register } from '@/graphql/Auth.js'
import { Toast } from '@/assets/js/Swal.js'
export default {
  layout: 'none',
  middleware: ['unauthenticated'],
  data: () => ({
    vector,
    signupData: {
      email: '',
      password: '',
      username: '',
    },
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    usernameRules: [(v) => !!v || 'Username is required'],
    passwordRules: [(v) => !!v || 'Password is required'],
    valid: false,
    loading: false,
  }),
  methods: {
    async signup() {
      this.loading = true
      this.errorMessage = ''
      await this.$refs.form.validate()

      if (this.valid) {
        this.$apollo
          .mutate({
            mutation: register,
            variables: {
              email: this.signupData.email,
              username: this.signupData.username,
              password: this.signupData.password,
            },
          })
          .then((result) => {
            const data = result.data
            if (data.createUser.__typename === 'Error') {
              Toast.fire({
                icon: 'warning',
                title: data.createUser.message,
              })
            } else {
              Toast.fire({
                icon: 'success',
                title: data.createUser.message,
              })
              this.$router.push('/login')
            }
            this.loading = false
          })
          .catch(() => (this.loading = false))
      } else this.loading = false
    },
  },
}
</script>
