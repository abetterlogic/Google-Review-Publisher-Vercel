// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    public: {
      googleReviewUrl: process.env.GOOGLE_REVIEW_URL,
      businessName: process.env.BUSINESS_NAME,
      reviewTopics: process.env.REVIEW_TOPICS,
      whatWeSell: process.env.WHAT_WE_SELL,
      teamLeaders: process.env.TEAM_LEADERS
    }
  },
  app: {
    head: {
      title: 'Review Generator - ABL Smart Tech',
      meta: [
        { name: 'description', content: 'Generate reviews for ABL Smart Tech Private Company' }
      ]
    }
  }
})