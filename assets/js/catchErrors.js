import { Toast } from './Swal'

export default async function (errors, app) {
  if (errors.message === 'GraphQL error: Unauthenticated.') {
    Toast.fire({
      icon: 'warning',
      title: 'Session expired',
    })
    app.$apolloHelpers.onLogout()
    app.$router.push('/login')
  } else {
    Toast.fire({
      icon: 'warning',
      title: errors.message,
    })
  }
}
