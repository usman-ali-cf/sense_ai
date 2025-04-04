// API client for interacting with the FastAPI backend

export interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  size: number
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface Session {
  id: string
  documentId: string
  createdAt: string
}

// Replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Upload a document
export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  return response.json()
}

// Get all documents
export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/documents`)

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`)
  }

  return response.json()
}

// Delete a document
export async function deleteDocument(docId: string): Promise<void> {
  const response = await fetch(`${API_URL}/documents/${docId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`)
  }
}

// Create a new chat session for a document
export async function createSession(docId: string): Promise<Session> {
  const response = await fetch(`${API_URL}/create_session/${docId}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`)
  }

  return response.json()
}

// Send a chat message
export async function sendChatMessage(sessionId: string, message: string): Promise<ChatMessage> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  })

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`)
  }

  return response.json()
}

// Submit a URL to be processed
export async function submitUrl(url: string): Promise<Document> {
  const response = await fetch(`${API_URL}/add_url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error(`URL submission failed: ${response.statusText}`)
  }

  return response.json()
}

