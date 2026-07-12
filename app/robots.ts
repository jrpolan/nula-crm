import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

// Private, functional, or intentionally non-indexable areas — never crawl these.
const DISALLOW = [
  "/app/",
  "/api/",
  "/accept-invite/",
  "/forgot-password",
  "/reset-password",
  "/suspended",
]

// AI assistants and answer-engine crawlers we explicitly welcome, so Nula can be
// discovered, summarized, and cited by AI search tools alongside classic search
// engines. Naming them (instead of relying on "*") also clearly opts in the
// AI-training / answer control tokens such as Google-Extended and
// Applebot-Extended.
const AI_USER_AGENTS = [
  "GPTBot", // OpenAI crawler (training + search index)
  "OAI-SearchBot", // OpenAI search
  "ChatGPT-User", // ChatGPT live browsing
  "ClaudeBot", // Anthropic crawler
  "Claude-User", // Claude live browsing
  "Claude-Web", // Anthropic (legacy)
  "anthropic-ai", // Anthropic (legacy)
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity live fetch
  "Google-Extended", // Gemini / Vertex AI training opt-in
  "Applebot", // Apple / Siri / Spotlight
  "Applebot-Extended", // Apple AI training opt-in
  "Amazonbot", // Amazon / Alexa
  "Bytespider", // ByteDance
  "CCBot", // Common Crawl (feeds many LLMs)
  "cohere-ai", // Cohere
  "Meta-ExternalAgent", // Meta AI
  "DuckAssistBot", // DuckDuckGo AI assist
  "MistralAI-User", // Mistral live fetch
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines (Googlebot, Bingbot, DuckDuckBot, …).
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // AI / answer-engine crawlers — explicitly allowed to crawl public pages.
      { userAgent: AI_USER_AGENTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
