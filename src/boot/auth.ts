import { defineBoot } from '#q-app/wrappers'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { setUnauthorizedHandler } from 'src/utils/api-client'

export default defineBoot(async ({ router, store }) => {
  const authStore = useAuthStore(store)

  await authStore.initialize()

  setUnauthorizedHandler(async () => {
    if (!authStore.isAuthenticated) {
      return
    }

    authStore.clearAuth()

    const currentRoute = router.currentRoute.value
    const isOnLogin = currentRoute.name === 'login'

    if (!isOnLogin) {
      Notify.create({
        type: 'warning',
        message: 'セッションの有効期限が切れました。再度ログインしてください。',
      })

      const redirectQuery = currentRoute.fullPath ? { redirect: currentRoute.fullPath } : undefined
      await router.replace({
        name: 'login',
        ...(redirectQuery ? { query: redirectQuery } : {}),
      })
    }
  })

  router.beforeEach((to) => {
    const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta?.requiresGuest)

    if (requiresAuth && !authStore.isAuthenticated) {
      const redirect = to.fullPath && to.fullPath !== '/auth/login' ? { redirect: to.fullPath } : undefined
      return {
        name: 'login',
        query: redirect,
      }
    }

    if (requiresGuest && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }

    return true
  })
})
