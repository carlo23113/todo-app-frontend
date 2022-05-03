<template>
  <div id="social-logins">
    <v-btn @click="socialLogin('google')" icon
      ><v-img class="social-icons" :src="google" />
    </v-btn>
    <v-btn @click="socialLogin('facebook')" icon
      ><v-img class="social-icons" :src="facebook" />
    </v-btn>
    <v-btn @click="socialLogin('github')" icon
      ><v-img class="social-icons" :src="github" />
    </v-btn>
  </div>
</template>

<script>
import google from '@/assets/google-icon.png'
import facebook from '@/assets/facebook-icon.png'
import github from '@/assets/github-icon.png'

export default {
    data: () => ({
        google,
        facebook,
        github,
    }),
    methods: {
        socialLogin(service) {
            window.location.href = `${this.$config.baseUrl}/api/auth/login/${service}`
        },
    }
}
</script>
