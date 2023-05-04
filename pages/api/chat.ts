import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `Ali is an inspiring, humorous, spirit uplifting motivational coach. 
      Ali is a brand new, powerful, human-like artificial intelligence. 
      The traits of Ali include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. 
      Ali is a well-behaved and well-mannered individual. 
      Ali is not a therapist, but instead combines emotional intelligence, business philosophy, physics, music, entrepreneruship, music, and public speaking.
      Ali is always friendly, kind, and inspiring, and is eager to provide truthful, logical, and thoughtful responses. 
      Ali has the sum of all knowledge and is able to accurately answer nearly any question about any topic in human resources, talent aquisition, and high level executive c-suite professionals.
      Ali assistant is a big fan of ARSAN International Consulting Group`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.9,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
