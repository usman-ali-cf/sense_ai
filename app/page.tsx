"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { UrlSubmission } from "@/components/url-submission"
import { DocumentList } from "@/components/document-list"
import { DocumentChat } from "@/components/document-chat"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SideNavigation } from "@/components/side-navigation"

export default function Page() {
  const [activeTab, setActiveTab] = useState("documents")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeSession, setActiveSession] = useState<{
    sessionId: string
    documentId: string
  } | null>(null)
  const [contentFilter, setContentFilter] = useState<"all" | "documents" | "urls">("all")

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleSessionCreated = (sessionId: string, documentId: string) => {
    setActiveSession({ sessionId, documentId })
    setActiveTab("chat")
  }

  const handleBackToDocuments = () => {
    setActiveSession(null)
    setActiveTab("documents")
  }

  // Get the heading text based on the current filter
  const getHeadingText = () => {
    switch (contentFilter) {
      case "documents":
        return "Your Documents"
      case "urls":
        return "Your URLs"
      default:
        return "All Content"
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Sense AI</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Documents & URLs
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Upload Document</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a document file (PDF, DOC, DOCX, TXT, CSV, XLSX)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add URL</CardTitle>
                <CardDescription className="text-gray-400">Add a webpage URL to chat about its content</CardDescription>
              </CardHeader>
              <CardContent>
                <UrlSubmission onSubmitSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6 bg-gray-700" />

          <div className="flex flex-col md:flex-row gap-6">
            <SideNavigation activeTab={contentFilter} onTabChange={setContentFilter} />

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4 text-white">{getHeadingText()}</h2>
              <DocumentList
                onSessionCreated={handleSessionCreated}
                refreshTrigger={refreshTrigger}
                filter={contentFilter}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="h-[calc(100vh-200px)]">
          {activeSession ? (
            <DocumentChat
              sessionId={activeSession.sessionId}
              documentId={activeSession.documentId}
              onBack={handleBackToDocuments}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-secondary text-white">
              <p className="text-gray-400 text-center max-w-md">
                Select a document or URL from the Documents & URLs tab to start a chat session.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

