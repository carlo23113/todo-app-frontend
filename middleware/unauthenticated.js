export default async function ({app, redirect}) {
    const hasToken = !!app.$apolloHelpers.getToken()
    if (hasToken) {
        return redirect('/');
    }
}