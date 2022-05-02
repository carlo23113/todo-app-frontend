<template>
  <div class="login-container">
    <v-row no-gutters>
      <v-col cols="12" lg="6">
        <div id="graphics-div">
          <div id="app-title">TO-DO APP</div>
          <v-img id="vector" :src="vector" />
          <div id="quote">Keep your day on track.</div>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
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
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                rounded
                >Login</v-btn
              >

              <div id="social-logins-label"><span>Or Login with</span></div>

              <div id="social-logins">
                <v-btn icon
                  ><v-img class="social-icons" :src="google" />
                </v-btn>
                <v-btn icon
                  ><v-img class="social-icons" :src="facebook" />
                </v-btn>
                <v-btn icon
                  ><v-img class="social-icons" :src="github" />
                </v-btn>
              </div>
              <div id="sign-up">
                Don't have an account?
                <nuxt-link to="/signup">Sign up for free</nuxt-link>
              </div>
            </v-form>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import vector from '@/assets/todo-vector.svg'
import google from '@/assets/google-icon.png'
import facebook from '@/assets/facebook-icon.png'
import github from '@/assets/github-icon.png'
import { login } from '@/graphql/Auth.js'
import { Toast } from '@/assets/js/Swal.js'
export default {
  layout: 'none',
  middleware: ['unauthenticated'],
  data: () => ({
    vector,
    google,
    facebook,
    github,
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
              this.$apolloHelpers.onLogin(jwt)
              this.$router.push('/');
            }
            this.loading = false
          })
          .catch(() => (this.loading = false))
      } else this.loading = false
    },
  },
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}

#graphics-div {
  height: 100vh;
  width: 100%;
  padding: 3rem 2rem;
  position: relative;
  background-color: rgb(247, 247, 247);
  text-align: center;
}

#app-title {
  color: #ff8a80;
  font-weight: bold;
  font-size: 1.5rem;
}

#quote {
  color: #757575;
}

#vector {
  width: 80%;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#login-form-div {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}

#login-form {
  width: 50%;
}

#login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ff8a80;
}

#login-subtitle {
  margin-bottom: 2rem;
  font-size: 0.8rem;
  color: #757575;
}

#social-logins {
  display: grid;
  grid-template-columns: 20% 20% 20%;
  place-content: center;
}

.social-icons {
  width: 20px;
}

#social-logins-label {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #757575;
  color: #757575;
  line-height: 0.1em;
  margin: 2rem 0;
}

#social-logins-label span {
  background: #fff;
  padding: 0 10px;
}

#sign-up {
  margin-top: 1.5rem;
  font-size: 0.8em;
  text-align: center;
}
</style>
