"use client"

import { useState, useEffect } from "react"
import { Trash2, FileText, FileSpreadsheet, FileCode, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Document, getDocuments, deleteDocument, createSession } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface DocumentWithSource extends Document {
  source?: "file" | "url"
  sourceUrl?: string
}

interface DocumentListProps {
  onSessionCreated: (sessionId: string, documentId: string) => void
  refreshTrigger: number
  filter: "documents" | "urls" | "all"
}

export function DocumentList({ onSessionCreated, refreshTrigger, filter = "all" }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [refreshTrigger])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId)
      setDocuments(documents.filter((doc) => doc.id !== docId))
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    } finally {
      setDocumentToDelete(null)
    }
  }

  const handleCreateSession = async (docId: string) => {
    try {
      const session = await createSession(docId)
      onSessionCreated(session.id, docId)
      toast({
        title: "Session created",
        description: "You can now chat about this content",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (type: string, source?: string) => {
    if (source === "url") {
      return <Link className="h-6 w-6 text-primary" />
    } else if (type.includes("pdf") || type.includes("word")) {
      return <FileText className="h-6 w-6 text-primary" />
    } else if (type.includes("csv") || type.includes("sheet")) {
      return <FileSpreadsheet className="h-6 w-6 text-primary" />
    } else {
      return <FileCode className="h-6 w-6 text-primary" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter documents based on the selected filter
  const filteredDocuments = documents.filter((doc) => {
    const docWithSource = doc as DocumentWithSource
    if (filter === "all") return true
    if (filter === "documents") return docWithSource.source !== "url"
    if (filter === "urls") return docWithSource.source === "url"
    return true
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          {filter === "documents"
            ? "No documents added yet"
            : filter === "urls"
              ? "No URLs added yet"
              : "No documents or URLs added yet"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredDocuments.map((doc) => {
        const docWithSource = doc as DocumentWithSource
        const isUrl = docWithSource.source === "url"

        return (
          <Card key={doc.id} className="overflow-hidden bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {getFileIcon(doc.type, docWithSource.source)}
                <CardTitle className="text-base truncate text-white">{doc.name}</CardTitle>
                {isUrl && (
                  <Badge variant="outline" className="ml-auto bg-primary text-white border-primary">
                    URL
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-gray-400">
                {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                {isUrl && docWithSource.sourceUrl && (
                  <div className="mt-1 truncate">
                    <a
                      href={docWithSource.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {docWithSource.sourceUrl}
                    </a>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 flex justify-between">
              <Button variant="default" size="sm" onClick={() => handleCreateSession(doc.id)}>
                {isUrl ? "Chat with URL" : "Chat with document"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-gray-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {isUrl ? "URL" : "Document"}</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      Are you sure you want to delete this {isUrl ? "URL" : "document"}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-primary hover:bg-primary/80" onClick={() => handleDelete(doc.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

