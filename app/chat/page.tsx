"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Send, 
  Video, 
  Calendar, 
  Search, 
  MoreVertical,
  AlertTriangle,
  Phone,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: 1,
    name: "Dr. María González",
    subject: "Calculus",
    lastMessage: "See you tomorrow at 3 PM for our session!",
    time: "2m ago",
    unread: 2,
    online: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Ing. Carlos Mendoza",
    subject: "Programming",
    lastMessage: "The code looks good! Just need to fix the bug in line 42.",
    time: "1h ago",
    unread: 0,
    online: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Lic. Ana Rodríguez",
    subject: "Physics",
    lastMessage: "Thanks for your patience with the thermodynamics problems!",
    time: "3h ago",
    unread: 0,
    online: false,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "M.Sc. Roberto Sánchez",
    subject: "Linear Algebra",
    lastMessage: "Let me know when you want to schedule the next session.",
    time: "Yesterday",
    unread: 0,
    online: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
]

const initialMessages = [
  {
    id: 1,
    sender: "tutor",
    text: "Hello! How can I help you today?",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Hi Dr. González! I am having trouble understanding derivatives of trigonometric functions.",
    time: "10:02 AM",
  },
  {
    id: 3,
    sender: "tutor",
    text: "No problem! Let me explain. The derivative of sin(x) is cos(x), and the derivative of cos(x) is -sin(x). Would you like me to walk you through some examples?",
    time: "10:03 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Yes please! I am particularly confused about the chain rule with these functions.",
    time: "10:05 AM",
  },
  {
    id: 5,
    sender: "tutor",
    text: "Great question! When we have a composite function like sin(2x), we apply the chain rule: the derivative is cos(2x) * 2 = 2cos(2x). The outer function derivative times the inner function derivative.",
    time: "10:07 AM",
  },
  {
    id: 6,
    sender: "tutor",
    text: "Would you like to schedule a session to go over more examples together? I have availability tomorrow at 3 PM.",
    time: "10:08 AM",
  },
  {
    id: 7,
    sender: "me",
    text: "That would be perfect! Let me check my calendar.",
    time: "10:10 AM",
  },
  {
    id: 8,
    sender: "tutor",
    text: "See you tomorrow at 3 PM for our session!",
    time: "10:12 AM",
  },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "me" as const,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const selectChat = (chat: typeof conversations[0]) => {
    setSelectedChat(chat)
    setShowMobileChat(true)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      {/* Warning Banner */}
      <Alert variant="destructive" className="rounded-none border-x-0 bg-primary/10 text-foreground border-primary/20">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          All conversations may be reviewed and used in case of disputes, complaints, or security issues.
        </AlertDescription>
      </Alert>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div
          className={cn(
            "w-full flex-shrink-0 border-r bg-card md:w-80 lg:w-96",
            showMobileChat && "hidden md:block"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Search */}
            <div className="border-b p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectChat(conv)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      selectedChat.id === conv.id && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.image} alt={conv.name} />
                        <AvatarFallback>
                          {conv.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate font-medium">{conv.name}</h3>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{conv.subject}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {conv.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "flex flex-1 flex-col",
            !showMobileChat && "hidden md:flex"
          )}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileChat(false)}
              >
                Back
              </Button>
              <Avatar>
                <AvatarImage src={selectedChat.image} alt={selectedChat.name} />
                <AvatarFallback>
                  {selectedChat.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    "Offline"
                  )}
                  {" · "}
                  {selectedChat.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {/* Info Card */}
              <div className="mb-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Session with {selectedChat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Subject: {selectedChat.subject} · Schedule sessions using the calendar button above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.sender === "me"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-right text-xs",
                        message.sender === "me"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t bg-card p-4">
            <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
