import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

// IMPORTANT: For production, move this key to a .env.local file
// e.g., EAZYTEC_API_KEY="your_api_key_here"
// and access it with process.env.EAZYTEC_API_KEY
const eazytecApiKey = "eazytec_25abefe91013adef_9e8e77041a87c925de10acf21040f6c8"

// Create a custom OpenAI provider instance
const eazytec = createOpenAI({
  apiKey: eazytecApiKey,
  baseURL: "https://maas.eazytec-cloud.com/v1",
})

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!eazytecApiKey) {
    return new Response("API key not found", { status: 500 })
  }

  const result = await streamText({
    model: eazytec("maas/qwen2.5-coder"),
    system:
      "You are a helpful assistant. You are a part of a personal blog website. Be friendly, helpful, and slightly informal.",
    messages,
  })

  return result.toDataStreamResponse()
}
