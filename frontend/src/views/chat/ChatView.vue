<script setup>
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Avatar from '@/components/ui/Avatar.vue'
import AvatarFallback from '@/components/ui/AvatarFallback.vue'
import AvatarImage from '@/components/ui/AvatarImage.vue'
import Badge from '@/components/ui/Badge.vue'
import ScrollArea from '@/components/ui/ScrollArea.vue'
import Alert from '@/components/ui/Alert.vue'
import AlertDescription from '@/components/ui/AlertDescription.vue'
import { Send, Video, Calendar, Search, MoreVertical, AlertTriangle, Phone, Info } from '@lucide/vue'
import { cn } from '@/lib/utils'

const conversations = [
  { id: 1, name: "Dr. María González", subject: "Calculus", lastMessage: "See you tomorrow at 3 PM for our session!", time: "2m ago", unread: 2, online: true, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { id: 2, name: "Ing. Carlos Mendoza", subject: "Programming", lastMessage: "The code looks good! Just need to fix the bug in line 42.", time: "1h ago", unread: 0, online: true, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { id: 3, name: "Lic. Ana Rodríguez", subject: "Physics", lastMessage: "Thanks for your patience with the thermodynamics problems!", time: "3h ago", unread: 0, online: false, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
  { id: 4, name: "M.Sc. Roberto Sánchez", subject: "Linear Algebra", lastMessage: "Let me know when you want to schedule the next session.", time: "Yesterday", unread: 0, online: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
]

const initialMessages = [
  { id: 1, sender: "tutor", text: "Hello! How can I help you today?", time: "10:00 AM" },
  { id: 2, sender: "me", text: "Hi Dr. González! I am having trouble understanding derivatives of trigonometric functions.", time: "10:02 AM" },
  { id: 3, sender: "tutor", text: "No problem! Let me explain. The derivative of sin(x) is cos(x), and the derivative of cos(x) is -sin(x). Would you like me to walk you through some examples?", time: "10:03 AM" },
  { id: 4, sender: "me", text: "Yes please! I am particularly confused about the chain rule with these functions.", time: "10:05 AM" },
  { id: 5, sender: "tutor", text: "Great question! When we have a composite function like sin(2x), we apply the chain rule: the derivative is cos(2x) * 2 = 2cos(2x). The outer function derivative times the inner function derivative.", time: "10:07 AM" },
  { id: 6, sender: "tutor", text: "Would you like to schedule a session to go over more examples together? I have availability tomorrow at 3 PM.", time: "10:08 AM" },
  { id: 7, sender: "me", text: "That would be perfect! Let me check my calendar.", time: "10:10 AM" },
  { id: 8, sender: "tutor", text: "See you tomorrow at 3 PM for our session!", time: "10:12 AM" },
]

const selectedChat = ref(conversations[0])
const messages = ref([...initialMessages])
const newMessage = ref("")
const searchQuery = ref("")
const showMobileChat = ref(false)

const filteredConversations = computed(() => {
  return conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: messages.value.length + 1,
    sender: "me",
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }

  messages.value.push(message)
  newMessage.value = ""
}

const selectChat = (chat) => {
  selectedChat.value = chat
  showMobileChat.value = true
}
</script>

<template>
  <div class="flex h-[calc(100dvh-64px)] flex-col bg-background">
    <!-- Warning Banner -->
    <Alert variant="destructive" class="rounded-none border-x-0 bg-primary/10 text-foreground border-primary/20">
      <AlertTriangle class="h-4 w-4 text-primary" />
      <AlertDescription class="text-sm">
        All conversations may be reviewed and used in case of disputes, complaints, or security issues.
      </AlertDescription>
    </Alert>

    <div class="flex flex-1 overflow-hidden">
      <!-- Conversations Sidebar -->
      <div
        :class="cn(
          'w-full shrink-0 border-r border-border bg-card md:w-80 lg:w-96 flex flex-col',
          showMobileChat ? 'hidden md:flex' : 'flex'
        )"
      >
        <!-- Search -->
        <div class="border-b border-border p-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              v-model="searchQuery"
              class="pl-9"
            />
          </div>
        </div>

        <!-- Conversation List -->
        <ScrollArea class="flex-1">
          <div class="divide-y divide-border">
            <button
              v-for="conv in filteredConversations"
              :key="conv.id"
              @click="selectChat(conv)"
              :class="cn(
                'flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50',
                selectedChat.id === conv.id ? 'bg-muted' : ''
              )"
            >
              <div class="relative">
                <Avatar>
                  <AvatarImage :src="conv.image" :alt="conv.name" />
                  <AvatarFallback>
                    {{ conv.name.split(' ').map((n) => n[0]).join('') }}
                  </AvatarFallback>
                </Avatar>
                <span v-if="conv.online" class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="truncate font-medium">{{ conv.name }}</h3>
                  <span class="text-xs text-muted-foreground">{{ conv.time }}</span>
                </div>
                <p class="text-xs text-muted-foreground">{{ conv.subject }}</p>
                <p class="mt-1 truncate text-sm text-muted-foreground">
                  {{ conv.lastMessage }}
                </p>
              </div>
              <Badge v-if="conv.unread > 0" class="ml-2 bg-primary text-primary-foreground">
                {{ conv.unread }}
              </Badge>
            </button>
          </div>
        </ScrollArea>
      </div>

      <!-- Chat Area -->
      <div
        :class="cn(
          'flex flex-1 flex-col',
          !showMobileChat ? 'hidden md:flex' : 'flex'
        )"
      >
        <!-- Chat Header -->
        <div class="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              class="md:hidden"
              @click="showMobileChat = false"
            >
              Back
            </Button>
            <Avatar>
              <AvatarImage :src="selectedChat.image" :alt="selectedChat.name" />
              <AvatarFallback>
                {{ selectedChat.name.split(' ').map((n) => n[0]).join('') }}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 class="font-semibold">{{ selectedChat.name }}</h2>
              <p class="text-xs text-muted-foreground">
                <span v-if="selectedChat.online" class="text-green-600">Online</span>
                <span v-else>Offline</span>
                ·
                {{ selectedChat.subject }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone class="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video class="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Calendar class="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-5 w-5" />
            </Button>
          </div>
        </div>

        <!-- Messages -->
        <ScrollArea class="flex-1 p-4 bg-background">
          <div class="mx-auto max-w-3xl space-y-4">
            <!-- Info Card -->
            <div class="mb-6 rounded-lg bg-muted/50 p-4">
              <div class="flex items-start gap-3">
                <Info class="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p class="text-sm font-medium">Session with {{ selectedChat.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    Subject: {{ selectedChat.subject }} · Schedule sessions using the calendar button above.
                  </p>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div
              v-for="message in messages"
              :key="message.id"
              :class="cn(
                'flex',
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              )"
            >
              <div
                :class="cn(
                  'max-w-[80%] rounded-2xl px-4 py-2',
                  message.sender === 'me'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )"
              >
                <p class="text-sm">{{ message.text }}</p>
                <p
                  :class="cn(
                    'mt-1 text-right text-xs',
                    message.sender === 'me'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )"
                >
                  {{ message.time }}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <!-- Message Input -->
        <div class="border-t border-border bg-card p-4">
          <form @submit.prevent="handleSendMessage" class="mx-auto flex max-w-3xl gap-2">
            <Input
              placeholder="Type a message..."
              v-model="newMessage"
              class="flex-1"
            />
            <Button type="submit" size="icon">
              <Send class="h-4 w-4" />
              <span class="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
