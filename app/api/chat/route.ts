// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function POST(req: Request) {
  const body = await req.json()

  // Extract the session ID and messages from the request body
  const sessionId = body.session_ids
  const messages = body.messages || []
  const message = messages[messages.length - 1].content

  try {
    console.log("Sending chat request to backend with session ID:", sessionId)

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId || "general", // Use "general" as fallback if no session ID
        message,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to communicate with backend: ${response.statusText}`)
    }

    const data = await response.json()

    // Return the response from the FastAPI backend
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error forwarding chat request:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to communicate with backend",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

