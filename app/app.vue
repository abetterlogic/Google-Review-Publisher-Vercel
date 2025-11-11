<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%); padding: 2rem 0;">
    <div style="max-width: 42rem; margin: 0 auto; padding: 0 1rem;">
      <div style="background: #111111; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2); padding: 2rem; border: 1px solid #374151;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <img src="/logo.svg" alt="ABL Smart Tech" style="height: 3rem; margin: 0 auto 1rem;">
          <h1 style="font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">Review Generator</h1>
          <p style="color: #9ca3af; margin-top: 0.5rem; font-size: 1rem;">Generate authentic reviews for ABL Smart Tech</p>
        </div>
        
        <form v-if="!showReviews" @submit.prevent="generateReviews" style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="background: #1f1f1f; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #374151;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #f3f4f6; margin-bottom: 0.75rem;">👨💼 Team Leader Name *</label>
            <select v-model="form.teamLeader" 
                    style="width: 100%; padding: 0.75rem 1rem; border: 2px solid #374151; border-radius: 0.5rem; font-size: 1rem; background: #111111; color: #f3f4f6; transition: all 0.2s; outline: none;" required>
              <option value="">Select team leader</option>
              <option v-for="leader in teamLeaders" :key="leader.value" :value="leader.value">{{ leader.label }}</option>
            </select>
          </div>

          <div style="background: #1f1f1f; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #374151;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #f3f4f6; margin-bottom: 1rem;">📝 Review Topics *</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.75rem;">
              <label v-for="topic in reviewTopics" :key="topic.value" style="display: flex; align-items: center; padding: 0.75rem; background: #111111; border-radius: 0.5rem; border: 1px solid #374151; cursor: pointer; transition: all 0.2s;" :class="form.selectedTopics.includes(topic.value) ? 'selected-topic' : ''">
                <input type="checkbox" :value="topic.value" v-model="form.selectedTopics" 
                       style="margin-right: 0.75rem; width: 1.25rem; height: 1.25rem; accent-color: #dc2626;">
                <span style="font-size: 0.875rem; color: #d1d5db; font-weight: 500;">{{ topic.label }}</span>
              </label>
            </div>
          </div>

          <button type="submit" :disabled="isLoading"
                  :style="`width: 100%; background: ${isLoading ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'}; color: white; padding: 1rem 2rem; border-radius: 0.75rem; border: none; font-size: 1.1rem; font-weight: 600; cursor: ${isLoading ? 'not-allowed' : 'pointer'}; transition: all 0.3s; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);`">
            {{ isLoading ? '🔄 Generating...' : '✨ Generate Review' }}
          </button>
        </form>

        <div v-if="isLoading" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem; background: linear-gradient(135deg, #1f1f1f 0%, #2d1b1b 100%); border-radius: 1rem; margin: 2rem 0; border: 1px solid #374151;">
          <div style="width: 4rem; height: 4rem; border: 4px solid #374151; border-top: 4px solid #dc2626; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <div style="text-align: center;">
            <p style="color: #f3f4f6; font-size: 1.2rem; font-weight: 600; margin: 0;">🤖 AI is crafting your reviews...</p>
            <p style="color: #9ca3af; font-size: 0.9rem; margin-top: 0.5rem;">This may take a few moments</p>
          </div>
        </div>

        <div v-if="showReviews" style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="text-align: center;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #f3f4f6; margin: 0;">🎯 Choose Your Perfect Review</h2>
            <p style="color: #9ca3af; margin-top: 0.5rem;">Select the review that best represents your experience</p>
          </div>
          
          <div v-for="(review, index) in generatedReviews" :key="index" style="background: linear-gradient(135deg, #1f1f1f 0%, #2d1b1b 100%); border: 2px solid #374151; border-radius: 1rem; padding: 1.5rem; transition: all 0.3s; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);"></div>
            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.875rem;">{{ index + 1 }}</div>
              <p style="margin: 0; line-height: 1.6; color: #d1d5db; font-size: 1rem; flex: 1;">{{ review }}</p>
            </div>
            <button @click="selectReview(review)" 
                    style="width: 100%; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);">
              📋 Choose This Review
            </button>
          </div>

          <button @click="resetForm" 
                  style="width: 100%; color: #9ca3af; padding: 0.75rem 1.5rem; border-radius: 0.5rem; background: #1f1f1f; border: 1px solid #374151; cursor: pointer; font-weight: 500; transition: all 0.3s;">
              🔄 Start Over
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #1a1a1a !important;
  margin: 0 !important;
  padding: 0 !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.selected-topic {
  background: linear-gradient(135deg, #2d1b1b 0%, #3d1a1a 100%) !important;
  border-color: #dc2626 !important;
}

select:focus, input:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.6) !important;
}

label:hover {
  background: #1a1a1a !important;
  border-color: #dc2626 !important;
}
</style>

<script setup>
const form = ref({
  teamLeader: '',
  selectedTopics: []
})

const showReviews = ref(false)
const generatedReviews = ref([])
const isLoading = ref(false)

const teamLeaders = [
  { label: 'Nishant', value: 'Nishant Ji' },
  { label: 'Ankit', value: 'Ankit' },
  { label: 'Gaurav', value: 'Gaurav' },
  { label: 'Saurabh', value: 'Saurabh' }
]

const reviewTopics = [
  { label: 'Project delivery on time', value: 'delivery' },
  { label: 'Communication and support quality', value: 'communication' },
  { label: 'Technical expertise and innovation', value: 'technical' },
  { label: 'Website or app design quality', value: 'design' },
  { label: 'SEO and marketing performance', value: 'seo' },
  { label: 'Value for money', value: 'value' },
  { label: 'Problem-solving and flexibility', value: 'problem_solving' },
  { label: 'Post-launch support', value: 'support' },
  { label: 'Professionalism and reliability', value: 'professionalism' },
  { label: 'Overall satisfaction', value: 'satisfaction' }
]

const reviewTemplates = {
  delivery: [
    "ABL Smart Tech delivered our project right on schedule when others couldn't meet deadlines.",
    "Unlike previous vendors who delayed everything, ABL completed our work on time perfectly."
  ],
  communication: [
    "Great communication throughout - much better than our last service provider who barely responded.",
    "ABL team was always available and responsive, unlike others who left us hanging."
  ],
  technical: [
    "Their technical expertise solved problems that other companies couldn't handle.",
    "Impressive innovation and technical skills - far superior to our previous developer."
  ],
  design: [
    "Beautiful, modern design that exceeded expectations after disappointing experiences elsewhere.",
    "Outstanding design quality - finally found a team that understands good UI/UX."
  ],
  seo: [
    "SEO results improved dramatically after switching from our previous agency to ABL.",
    "Marketing performance boosted significantly - wish we'd found them sooner."
  ],
  value: [
    "Excellent value for money compared to overpriced competitors we tried before.",
    "Fair pricing with quality results - much better deal than expensive alternatives."
  ],
  problem_solving: [
    "ABL solved complex issues quickly while others struggled for weeks.",
    "Flexible problem-solving approach that actually works, unlike rigid previous vendors."
  ],
  support: [
    "Post-launch support is fantastic - available when needed unlike others who disappear.",
    "Ongoing support and maintenance much better than previous company's poor service."
  ],
  professionalism: [
    "Professional and reliable team - refreshing change from unprofessional experiences before.",
    "Highly professional service that restored our faith after bad experiences elsewhere."
  ],
  satisfaction: [
    "Completely satisfied with ABL's work after disappointing results from other companies.",
    "Overall excellent experience - finally found a reliable tech partner."
  ]
}

async function generateReviews() {
  if (form.value.selectedTopics.length === 0) {
    alert('Please select at least one review topic.')
    return
  }
  
  isLoading.value = true
  
  try {
    console.log('Generating reviews...', form.value)
    const response = await $fetch('/api/generate-review', {
      method: 'POST',
      body: {
        teamLeader: form.value.teamLeader,
        selectedTopics: form.value.selectedTopics
      }
    })
    
    console.log('Response:', response)
    generatedReviews.value = response
    showReviews.value = true
  } catch (error) {
    console.error('Error:', error)
    alert('Error generating reviews: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

async function selectReview(review) {
  try {
    await navigator.clipboard.writeText(review)
    alert('Review has copied to your clipboard, Continue to go to Google Review Page and paste it.')
    window.open('https://g.page/r/CRtq3UXU7DKCEAI/review', '_blank')
  } catch (err) {
    alert('Please copy this review manually: ' + review)
    window.open('https://g.page/r/CRtq3UXU7DKCEAI/review', '_blank')
  }
}

function resetForm() {
  form.value = { teamLeader: '', selectedTopics: [] }
  showReviews.value = false
  generatedReviews.value = []
  isLoading.value = false
}
</script>