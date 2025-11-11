export default defineEventHandler(async (event) => {
  const { teamLeader, selectedTopics } = await readBody(event)
  const apiKey = process.env.OPENROUTER_API_KEY
  const aiModel = process.env.AI_MODEL
  
  console.log('API called with:', { teamLeader, selectedTopics })
  console.log('API Key exists:', !!apiKey)
  
  const topicNames = {
    delivery: 'Project delivery on time',
    communication: 'Communication and support quality', 
    technical: 'Technical expertise and innovation',
    design: 'Website or app design quality',
    seo: 'SEO and marketing performance',
    value: 'Value for money',
    problem_solving: 'Problem-solving and flexibility',
    support: 'Post-launch support',
    professionalism: 'Professionalism and reliability',
    satisfaction: 'Overall satisfaction'
  }
  
  const selectedTopicNames = selectedTopics.map(topic => topicNames[topic]).join(', ')
  
  const shouldMentionPrevious = selectedTopics.includes('problem_solving') || selectedTopics.includes('professionalism')
  
  const prompt = `Generate exactly 2 different natural Google reviews for "ABL Smart Tech Private Company (A Better Logic)".

Context:
- Team Leader: ${teamLeader}
- Focus areas: ${selectedTopicNames}

Requirements:
- Each review 30-100 words
- Sound like genuine customer reviews
${shouldMentionPrevious ? '- Mention dissatisfaction with previous providers and highlight how ABL was better' : '- Focus on positive experience with ABL Smart Tech'}
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