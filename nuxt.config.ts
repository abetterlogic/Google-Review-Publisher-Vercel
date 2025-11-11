// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  app: {
    head: {
      title: 'Review Generator - ABL Smart Tech',
      meta: [
        { name: 'description', content: 'Generate reviews for ABL Smart Tech Private Company' }
      ]
    }
  }
})