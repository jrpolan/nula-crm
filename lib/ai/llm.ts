import "server-only"

type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: { json?: boolean; model?: string },
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return null

  const model = options?.model ?? process.env.OPENAI_MODEL?.trim() ?? "gpt-4o-mini"

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        ...(options?.json ? { response_format: { type: "json_object" } } : {}),
      }),
    })

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, await response.text())
      return null
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content ?? null
  } catch (error) {
    console.error("OpenAI request failed:", error)
    return null
  }
}
