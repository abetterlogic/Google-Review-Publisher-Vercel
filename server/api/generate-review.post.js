export default defineEventHandler(async (event) => {
  const { teamLeader, selectedTopics, selectedServices } = await readBody(event)
  const apiKey = process.env.OPENROUTER_API_KEY
  const aiModel = process.env.AI_MODEL
  
  console.log('API called with:', { teamLeader, selectedTopics })
  console.log('API Key exists:', !!apiKey)
  
  const reviewTopics = process.env.REVIEW_TOPICS.split(',')
  
  const topicNames = {}
  reviewTopics.forEach((topic, index) => {
    topicNames[`topic_${index}`] = topic.trim()
  })
  
  const selectedTopicNames = selectedTopics.map(topic => topicNames[topic]).join(', ')
  
  const shouldMentionPrevious = selectedTopics.includes('problem_solving') || selectedTopics.includes('professionalism')
  
  const businessName = process.env.BUSINESS_NAME
  const natureOfBusiness = process.env.NATURE_OF_BUSINESS
  const whatWeSell = process.env.WHAT_WE_SELL
  
  const prompt = `Generate exactly 2 different natural Google reviews for "${businessName}" - a ${natureOfBusiness} company.

Context:
- Business Type: ${natureOfBusiness}
- Services/Products: ${whatWeSell}
- Team Leader: ${teamLeader}
- Services purchased: ${selectedServices.join(', ')}
- Focus areas: ${selectedTopicNames}

Requirements:
- Each review 30-100 words
- Sound like genuine customer reviews
- Mention specific services from what we sell
- Focus on the selected review topics/areas
${shouldMentionPrevious ? '- Mention dissatisfaction with previous providers and highlight how this company was better' : '- Focus on positive experience'}
- Natural, human tone
- Make them different from each other

Return only the 2 reviews, nothing else.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9
      })
    })
    
    const data = await response.json()
    const content = data.choices[0].message.content
    
    // Extract reviews from response
    const reviews = content.split('\n\n').filter(r => r.trim()).slice(0, 2)
    
    return reviews.length === 2 ? reviews : [content.substring(0, 200), content.substring(200, 400)]
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate reviews'
    })
  }
})