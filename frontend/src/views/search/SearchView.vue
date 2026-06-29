<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Select from '@/components/ui/Select.vue'
import SelectTrigger from '@/components/ui/SelectTrigger.vue'
import SelectValue from '@/components/ui/SelectValue.vue'
import SelectContent from '@/components/ui/SelectContent.vue'
import SelectItem from '@/components/ui/SelectItem.vue'
import { Search, Star, Filter, X, Users, BookOpen, ChevronRight, User as UserIcon, MessageSquare } from '@lucide/vue'
import api from '@/services/api'
import { useCacheStore } from '@/stores/cacheStore'

const router = useRouter()
const cacheStore = useCacheStore()

const searchQuery = ref("")
const selectedSubject = ref("all")
const selectedUniversity = ref("all")
const selectedRole = ref("all")
const showFilters = ref(false)

const subjectsList = ref([])
const subjectsResults = ref([])
const professorsResults = ref([])
const tutorsResults = ref([])
const loading = ref(true)

const universities = ["UNAM", "IPN", "Tec de Monterrey", "UAM", "UDG", "Instituto Tecnológico de Morelia"]

const fetchFiltersData = async () => {
  try {
    subjectsList.value = await cacheStore.getSubjectsAll()
  } catch (err) {
    console.error('Failed to load subjects for filters', err)
  }
}

const fetchResults = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedSubject.value !== 'all') params.subject_id = selectedSubject.value

    // Fetch subjects (only filter by search query if any)
    const subjRes = await api.get('/subjects', { params: { search: searchQuery.value } })
    subjectsResults.value = (subjRes.data.data || subjRes.data).slice(0, 6)

    // Fetch professors
    if (selectedRole.value === 'all' || selectedRole.value === 'professor') {
      const profRes = await api.get('/professors', { params })
      professorsResults.value = (profRes.data.data || profRes.data).slice(0, 6)
    } else {
      professorsResults.value = []
    }

    // Fetch tutors
    if (selectedRole.value === 'all' || selectedRole.value === 'tutor') {
      const tutRes = await api.get('/tutors', { params })
      tutorsResults.value = (tutRes.data.data || tutRes.data).slice(0, 6)
    } else {
      tutorsResults.value = []
    }
    
  } catch (err) {
    console.error('Failed to load search results', err)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ""
  selectedSubject.value = "all"
  selectedUniversity.value = "all"
  selectedRole.value = "all"
  fetchResults()
}

let timeout = null
watch(searchQuery, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchResults()
  }, 500)
})

watch([selectedSubject, selectedUniversity, selectedRole], () => {
  fetchResults()
})

onMounted(() => {
  fetchFiltersData()
  fetchResults()
})
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Explorar</h1>
        <p class="mt-1 text-muted-foreground">Encuentra materias, maestros y tutores verificados</p>
      </div>

      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <div class="flex flex-col gap-4 lg:flex-row">
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o materia..."
              v-model="searchQuery"
              class="h-12 pl-12"
            />
          </div>
          <Button
            variant="outline"
            class="h-12 lg:hidden"
            @click="showFilters = !showFilters"
          >
            <Filter class="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        <!-- Desktop Filters -->
        <div class="hidden items-center gap-4 lg:flex z-40 relative">
          <Select v-model="selectedSubject">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Materias</SelectItem>
              <SelectItem v-for="subject in subjectsList" :key="subject.id" :value="subject.id.toString()">
                {{ subject.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedUniversity">
            <SelectTrigger class="w-64">
              <SelectValue placeholder="Universidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Universidades</SelectItem>
              <SelectItem v-for="uni in universities" :key="uni" :value="uni">
                {{ uni }}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select v-model="selectedRole">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Roles</SelectItem>
              <SelectItem value="professor">Solo Maestros</SelectItem>
              <SelectItem value="tutor">Solo Tutores</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            v-if="selectedSubject !== 'all' || selectedUniversity !== 'all' || selectedRole !== 'all' || searchQuery"
            variant="ghost" 
            size="sm" 
            @click="clearFilters"
          >
            <X class="mr-1 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>

        <!-- Mobile Filters -->
        <div v-if="showFilters" class="space-y-4 rounded-lg border bg-card p-4 lg:hidden relative z-40">
          <Select v-model="selectedSubject">
            <SelectTrigger>
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Materias</SelectItem>
              <SelectItem v-for="subject in subjectsList" :key="subject.id" :value="subject.id.toString()">
                {{ subject.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedUniversity">
            <SelectTrigger>
              <SelectValue placeholder="Universidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Universidades</SelectItem>
              <SelectItem v-for="uni in universities" :key="uni" :value="uni">
                {{ uni }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedRole">
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Roles</SelectItem>
              <SelectItem value="professor">Solo Maestros</SelectItem>
              <SelectItem value="tutor">Solo Tutores</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" class="w-full" @click="clearFilters">
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div v-if="loading" class="py-12 text-center text-muted-foreground">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p>Buscando...</p>
      </div>

      <div v-else class="space-y-12">
        
        <!-- Materias Section -->
        <section v-if="subjectsResults.length > 0 && selectedRole === 'all'">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold">Materias</h2>
            <router-link to="/subjects">
              <Button variant="outline" size="sm">
                Ver Todo
                <ChevronRight class="ml-1 h-4 w-4" />
              </Button>
            </router-link>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card v-for="category in subjectsResults" :key="category.id" class="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50" @click="router.push(`/subjects`)">
              <CardHeader>
                <div class="flex items-start justify-between">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <component :is="BookOpen" class="h-6 w-6 text-primary" />
                  </div>
                  <div class="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star class="h-4 w-4 fill-primary text-primary" />
                    {{ category.average_rating ? category.average_rating + ' ★' : 'Nuevo' }}
                  </div>
                </div>
                <CardTitle class="mt-4">{{ category.name }}</CardTitle>
                <CardDescription class="line-clamp-2">{{ category.description || 'Sin descripción' }}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users class="h-4 w-4" />
                    {{ category.tutors_count === 1 ? '1 Tutor' : `${category.tutors_count} Tutores` }}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <!-- Maestros Section -->
        <section v-if="professorsResults.length > 0">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold">Maestros</h2>
            <router-link to="/professors">
              <Button variant="outline" size="sm">
                Ver Todo
                <ChevronRight class="ml-1 h-4 w-4" />
              </Button>
            </router-link>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card v-for="tutor in professorsResults" :key="tutor.id" class="group transition-all hover:shadow-lg">
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
        </section>

        <!-- Tutores Section -->
        <section v-if="tutorsResults.length > 0">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold">Tutores</h2>
            <router-link to="/tutors">
              <Button variant="outline" size="sm">
                Ver Todo
                <ChevronRight class="ml-1 h-4 w-4" />
              </Button>
            </router-link>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card v-for="tutor in tutorsResults" :key="tutor.id" class="group transition-all hover:shadow-lg">
              <CardContent class="p-0 flex flex-col h-full">
                <div class="p-6 flex-1">
                  <div class="flex items-start gap-4">
                    <div class="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-2xl uppercase">
                      {{ tutor.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold truncate">{{ tutor.name }} {{ tutor.lastname }}</h3>
                      <p class="text-sm text-secondary-foreground font-medium">Estudiante Universitario</p>
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
        </section>

        <div v-if="subjectsResults.length === 0 && professorsResults.length === 0 && tutorsResults.length === 0" class="py-12 text-center">
          <p class="text-lg font-medium">No se encontraron resultados</p>
          <p class="text-muted-foreground">Intenta ajustar tus filtros o búsqueda</p>
          <Button variant="outline" class="mt-4" @click="clearFilters">
            Limpiar filtros
          </Button>
        </div>

      </div>
    </div>
  </div>
</template>
