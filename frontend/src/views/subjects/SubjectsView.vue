<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import api from '@/services/api'
import { Star, Users, ChevronRight, BookOpen, ArrowLeft, MessageSquare, User as UserIcon } from '@lucide/vue'

const router = useRouter()

const categories = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)

// Modal State
const isModalOpen = ref(false)
const selectedSubjectTitle = ref('')
const modalTutors = ref([])
const isLoadingTutors = ref(false)
const selectedTutor = ref(null)

const openTutorsModal = async (category) => {
  isModalOpen.value = true
  selectedTutor.value = null
  selectedSubjectTitle.value = category.name
  isLoadingTutors.value = true
  modalTutors.value = []
  
  try {
    const response = await api.get(`/subjects/${category.id}/tutors`)
    modalTutors.value = response.data.data
  } catch (err) {
    console.error('Failed to load tutors', err)
  } finally {
    isLoadingTutors.value = false
  }
}

const fetchSubjects = async (page = 1) => {
  try {
    if (page === 1) loading.value = true
    else loadingMore.value = true
    
    const response = await api.get(`/subjects?page=${page}`)
    const newData = response.data.data
    
    if (page === 1) {
      categories.value = newData
    } else {
      categories.value = [...categories.value, ...newData]
    }
    
    if (response.data.meta) {
      currentPage.value = response.data.meta.current_page
      lastPage.value = response.data.meta.last_page
    } else {
      lastPage.value = 1
    }
  } catch (err) {
    error.value = 'Failed to load subjects. Please try again later.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchSubjects(1)
})
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0 pt-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <Button variant="ghost" class="mb-4 -ml-4" @click="router.push('/home')">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">All Subjects</h1>
        <p class="mt-2 text-lg text-muted-foreground">
          Browse our complete catalog of subjects to find the perfect tutor.
        </p>
      </div>

      <!-- State: Loading -->
      <div v-if="loading" class="py-12 text-center text-muted-foreground">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
        <p class="mt-4">Loading subjects...</p>
      </div>
      
      <!-- State: Error -->
      <div v-else-if="error" class="py-12 text-center text-red-500">
        <p>{{ error }}</p>
      </div>
      
      <!-- State: Empty -->
      <div v-else-if="categories.length === 0" class="py-12 text-center text-muted-foreground">
        <p>No subjects found.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card v-for="category in categories" :key="category.id" class="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <component :is="BookOpen" class="h-6 w-6 text-primary" />
              </div>
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <Star class="h-4 w-4 fill-primary text-primary" />
                {{ category.average_rating ? category.average_rating + ' ★' : 'No ratings' }}
              </div>
            </div>
            <CardTitle class="mt-4">{{ category.name }}</CardTitle>
            <CardDescription class="line-clamp-2">{{ category.description || 'Sin descripción' }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <Users class="h-4 w-4" />
                {{ category.tutors_count === 1 ? '1 Tutor' : `${category.tutors_count} Tutors` }}
              </div>
              <Button size="sm" @click.stop="openTutorsModal(category)">
                View Tutors
                <ChevronRight class="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Load More -->
      <div v-if="currentPage < lastPage" class="mt-12 text-center pb-12">
        <Button variant="outline" size="lg" @click="fetchSubjects(currentPage + 1)" :disabled="loadingMore" class="min-w-[200px]">
          <span v-if="loadingMore" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em]"></span>
          {{ loadingMore ? 'Loading...' : 'Load More Subjects' }}
        </Button>
      </div>

      <!-- Modal de Tutores -->
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50">
            <div class="flex items-center gap-3">
              <button v-if="selectedTutor" @click="selectedTutor = null" class="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 mr-1">
                <ArrowLeft class="h-5 w-5" />
              </button>
              <h3 class="text-xl font-semibold text-white">
                {{ selectedTutor ? 'Perfil del Maestro' : `Tutores de ${selectedSubjectTitle}` }}
              </h3>
            </div>
            <button @click="isModalOpen = false; selectedTutor = null" class="text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="isLoadingTutors" class="py-8 text-center text-muted-foreground flex flex-col items-center">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
              <p>Cargando tutores...</p>
            </div>
            
            <div v-else-if="modalTutors.length === 0" class="py-8 text-center text-muted-foreground">
              <p>Aún no hay tutores registrados para esta materia.</p>
            </div>
            
            <!-- Tutor Detail View -->
            <div v-else-if="selectedTutor" class="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 pb-4">
              <div class="flex flex-col items-center text-center mt-2">
                <div class="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl uppercase mb-4 shadow-lg border border-primary/20">
                  {{ selectedTutor.name.charAt(0) }}
                </div>
                <h4 class="text-2xl font-bold text-white">{{ selectedTutor.name }} {{ selectedTutor.lastname }}</h4>
                <p class="text-primary font-medium mt-1">Profesor Especializado</p>
                
                <div class="flex items-center gap-2 mt-4 bg-zinc-900 px-4 py-2 rounded-full border border-white/10">
                  <Star class="h-5 w-5 fill-primary text-primary" />
                  <span class="font-bold text-white">{{ selectedTutor.tutor_reviews_avg_rating ? parseFloat(selectedTutor.tutor_reviews_avg_rating).toFixed(1) : 'Nuevo' }}</span>
                  <span class="text-muted-foreground text-sm ml-1">Calificación Promedio</span>
                </div>
              </div>
              
              <div class="bg-zinc-900/50 rounded-xl p-5 border border-white/5">
                <h5 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Descripción y Grado</h5>
                <p class="text-white/90 leading-relaxed text-sm">
                  {{ selectedTutor.bio || 'Este maestro aún no ha escrito una descripción sobre su experiencia, metodología de enseñanza o grado académico. Sin embargo, ha sido verificado por TÚ ASESORÍA.' }}
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3 mt-2">
                <Button class="flex-1" @click="router.push(`/chat?tutor=${selectedTutor.id}`); isModalOpen = false; selectedTutor = null">
                  <MessageSquare class="mr-2 h-4 w-4" />
                  Mandar Mensaje
                </Button>
                <Button variant="outline" class="flex-1" @click="router.push(`/profile/${selectedTutor.id}`); isModalOpen = false; selectedTutor = null">
                  <UserIcon class="mr-2 h-4 w-4" />
                  Ver Perfil
                </Button>
              </div>
            </div>
            
            <!-- Tutors List View -->
            <div v-else class="space-y-4">
              <div v-for="tutor in modalTutors" :key="tutor.id" @click="selectedTutor = tutor" class="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-primary/50 transition-all cursor-pointer group">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg uppercase transition-transform group-hover:scale-110">
                    {{ tutor.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-white text-base">{{ tutor.name }} {{ tutor.lastname }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">Ver detalles del perfil</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                    <Star class="h-4 w-4 fill-primary text-primary" />
                    <span class="text-sm font-medium text-white">{{ tutor.tutor_reviews_avg_rating ? parseFloat(tutor.tutor_reviews_avg_rating).toFixed(1) : 'Nuevo' }}</span>
                  </div>
                  <ChevronRight class="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
