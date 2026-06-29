<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Star, User as UserIcon, MessageSquare, ArrowLeft } from '@lucide/vue'
import api from '@/services/api'

const router = useRouter()

const professors = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const loadingMore = ref(false)

const fetchProfessors = async (page = 1) => {
  try {
    if (page === 1) loading.value = true
    else loadingMore.value = true
    
    const response = await api.get(`/professors?page=${page}`)
    const data = response.data
    
    if (page === 1) {
      professors.value = data.data
    } else {
      professors.value = [...professors.value, ...data.data]
    }
    
    currentPage.value = data.current_page
    lastPage.value = data.last_page
  } catch (err) {
    error.value = 'Failed to load professors. Please try again later.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchProfessors()
})
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0">
    <!-- Header -->
    <div class="bg-zinc-950 border-b border-white/10 px-4 py-8 sm:py-12 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-zinc-950 to-zinc-950"></div>
      <div class="mx-auto max-w-7xl relative">
        <Button variant="ghost" class="mb-4 text-zinc-400 hover:text-white" @click="router.push('/search')">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Volver a Búsqueda
        </Button>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Todos los Maestros</h1>
        <p class="mt-2 text-lg text-zinc-400">Descubre a los profesores especializados que ofrecen tutorías en múltiples materias.</p>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-8">
      <div v-if="loading && professors.length === 0" class="py-12 text-center text-muted-foreground flex flex-col items-center">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p>Cargando maestros...</p>
      </div>
      
      <div v-else-if="error" class="py-12 text-center text-red-500">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="professors.length === 0" class="py-12 text-center text-muted-foreground">
        <p>Aún no hay maestros registrados.</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card v-for="tutor in professors" :key="tutor.id" class="group transition-all hover:shadow-lg">
          <CardContent class="p-0 flex flex-col h-full">
            <div class="p-6 flex-1">
              <div class="flex items-start gap-4">
                <div class="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl uppercase">
                  {{ tutor.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold truncate">{{ tutor.name }} {{ tutor.lastname }}</h3>
                  <p class="text-sm text-primary font-medium">Profesor Especializado</p>
                  <div class="flex items-center gap-1 mt-1">
                    <Star class="h-4 w-4 fill-primary text-primary" />
                    <span class="font-medium text-sm">{{ tutor.tutor_reviews_avg_rating ? parseFloat(tutor.tutor_reviews_avg_rating).toFixed(1) : 'Nuevo' }}</span>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-sm text-muted-foreground line-clamp-3">{{ tutor.bio || 'Sin descripción disponible.' }}</p>
            </div>
            <div class="border-t border-border bg-muted/30 p-4 mt-auto">
              <div class="flex gap-2">
                <router-link :to="`/profile/${tutor.id}`" class="flex-1 block">
                  <Button variant="outline" class="w-full h-9 text-xs">
                    <UserIcon class="h-3 w-3 mr-1" /> Perfil
                  </Button>
                </router-link>
                <router-link :to="`/chat?tutor=${tutor.id}`" class="flex-1 block">
                  <Button class="w-full h-9 text-xs">
                    <MessageSquare class="h-3 w-3 mr-1" /> Mensaje
                  </Button>
                </router-link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div v-if="currentPage < lastPage" class="mt-12 flex justify-center">
        <Button variant="outline" size="lg" @click="fetchProfessors(currentPage + 1)" :disabled="loadingMore" class="min-w-[200px]">
          <span v-if="loadingMore" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em]"></span>
          {{ loadingMore ? 'Cargando...' : 'Cargar más maestros' }}
        </Button>
      </div>
    </div>
  </div>
</template>
