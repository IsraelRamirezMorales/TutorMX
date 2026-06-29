<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import Avatar from '@/components/ui/Avatar.vue'
import AvatarFallback from '@/components/ui/AvatarFallback.vue'
import AvatarImage from '@/components/ui/AvatarImage.vue'
import { 
  Star, MapPin, Calendar, Award, MessageCircle, 
  Briefcase, ArrowLeft, BookOpen, Quote
} from '@lucide/vue'
import api from '@/services/api'
import { useCacheStore } from '@/stores/cacheStore'

const router = useRouter()
const route = useRoute()
const cacheStore = useCacheStore()

const userProfile = ref(null)
const loading = ref(true)
const error = ref(null)

const formattedDate = computed(() => {
  if (!userProfile.value?.created_at) return ''
  const date = new Date(userProfile.value.created_at)
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(date)
})

const fetchProfile = async () => {
  try {
    loading.value = true
    const id = route.params.id
    userProfile.value = await cacheStore.getProfile(id)
  } catch (err) {
    error.value = "No se pudo cargar el perfil del tutor."
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0">
    <div class="mx-auto max-w-5xl px-4 py-8">
      
      <!-- Botón de Volver -->
      <Button variant="ghost" class="mb-6 text-muted-foreground hover:text-foreground" @click="router.back()">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
        <p class="text-muted-foreground font-medium">Cargando perfil...</p>
      </div>
      
      <div v-else-if="error" class="py-20 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
          <span class="text-2xl font-bold">!</span>
        </div>
        <p class="text-lg font-semibold text-destructive">{{ error }}</p>
      </div>

      <div v-else-if="userProfile" class="animate-in fade-in duration-500">
        <!-- Header del Perfil -->
        <Card class="mb-8 overflow-hidden shadow-md border-border">
          <div class="h-32 bg-primary/10 relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          </div>
          <CardContent class="relative px-6 pb-8 bg-card">
            <div class="flex flex-col items-center sm:items-start gap-6 sm:flex-row">
              <Avatar class="-mt-16 h-32 w-32 border-4 border-card shadow-lg bg-muted">
                <AvatarImage :src="userProfile.profile_image_url || ''" :alt="userProfile.name" />
                <AvatarFallback class="text-4xl bg-primary/10 text-primary font-bold">
                  {{ userProfile.name.charAt(0) }}{{ userProfile.lastname.charAt(0) }}
                </AvatarFallback>
              </Avatar>

              <div class="flex-1 pt-2 sm:pt-4 w-full text-center sm:text-left">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div class="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-1">
                      <h1 class="text-3xl font-bold text-foreground tracking-tight">{{ userProfile.name }} {{ userProfile.lastname }}</h1>
                      <Badge class="bg-primary text-primary-foreground mt-1 sm:mt-0 px-3 py-1 text-sm shadow-sm">
                        {{ userProfile.subjects.length > 1 ? 'Profesor Especializado' : 'Tutor Verificado' }}
                      </Badge>
                    </div>
                    
                    <p class="text-muted-foreground font-medium text-lg mt-2 sm:mt-0">
                      {{ userProfile.subjects.length > 0 ? userProfile.subjects.join(', ') : 'Asesorías Generales' }}
                    </p>
                    
                    <div class="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-sm text-muted-foreground">
                      <span class="flex items-center gap-1.5">
                        <MapPin class="h-4 w-4 text-primary/70" />
                        TÚ ASESORÍA
                      </span>
                      <span class="hidden sm:inline text-border">•</span>
                      <span class="flex items-center gap-1.5">
                        <Calendar class="h-4 w-4 text-primary/70" />
                        Se unió en {{ formattedDate }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-6 sm:mt-0">
                    <router-link :to="`/chat?tutor=${userProfile.id}`">
                      <Button size="lg" class="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
                        <MessageCircle class="mr-2 h-5 w-5" />
                        Mandar Mensaje
                      </Button>
                    </router-link>
                  </div>
                </div>

                <!-- Estadísticas Resumidas -->
                <div class="mt-8 grid grid-cols-2 gap-4 sm:flex sm:gap-6">
                  <div class="flex flex-col items-center sm:items-start p-4 rounded-xl bg-muted/50 border border-border sm:border-none sm:bg-transparent sm:p-0">
                    <div class="flex items-center gap-1.5 text-2xl font-bold text-foreground">
                      <Star class="h-6 w-6 fill-primary text-primary" />
                      {{ userProfile.rating || 'N/A' }}
                    </div>
                    <p class="text-sm text-muted-foreground font-medium mt-1">{{ userProfile.reviews_count }} Reseñas</p>
                  </div>
                  <div class="hidden sm:block w-px h-12 bg-border"></div>
                  <div class="flex flex-col items-center sm:items-start p-4 rounded-xl bg-muted/50 border border-border sm:border-none sm:bg-transparent sm:p-0">
                    <div class="flex items-center gap-1.5 text-2xl font-bold text-foreground">
                      <Briefcase class="h-6 w-6 text-primary" />
                      {{ userProfile.subjects.length }}
                    </div>
                    <p class="text-sm text-muted-foreground font-medium mt-1">Materias</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Sección de Pestañas -->
        <Tabs default-value="about" class="space-y-8">
          <TabsList class="w-full justify-start overflow-x-auto overflow-y-hidden bg-card border border-border p-1 shadow-sm rounded-xl h-auto">
            <TabsTrigger value="about" class="px-6 py-3 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Sobre Mí</TabsTrigger>
            <TabsTrigger value="achievements" class="px-6 py-3 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Logros (0)</TabsTrigger>
            <TabsTrigger value="reviews" class="px-6 py-3 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Reseñas ({{ userProfile.recent_reviews.length }})</TabsTrigger>
          </TabsList>

          <!-- Pestaña: Sobre Mí -->
          <TabsContent value="about" class="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <!-- Biografía -->
            <Card class="border-border shadow-sm">
              <CardHeader class="pb-3 border-b border-border bg-muted/20">
                <CardTitle class="flex items-center gap-2 text-xl">
                  <UserIcon class="h-5 w-5 text-primary" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <p class="text-foreground leading-relaxed text-base sm:text-lg">
                  {{ userProfile.bio || 'Este maestro aún no ha escrito una descripción sobre su experiencia o metodología de enseñanza.' }}
                </p>
              </CardContent>
            </Card>

            <!-- Materias Especializadas -->
            <Card class="border-border shadow-sm">
              <CardHeader class="pb-3 border-b border-border bg-muted/20">
                <CardTitle class="flex items-center gap-2 text-xl">
                  <BookOpen class="h-5 w-5 text-primary" />
                  Áreas de Experiencia
                </CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div v-if="userProfile.subjects.length > 0" class="flex flex-wrap gap-3">
                  <Badge 
                    v-for="subject in userProfile.subjects" 
                    :key="subject" 
                    variant="secondary" 
                    class="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors cursor-default border border-primary/20"
                  >
                    {{ subject }}
                  </Badge>
                </div>
                <div v-else class="text-muted-foreground flex flex-col items-center py-6">
                  <BookOpen class="h-10 w-10 mb-3 text-muted-foreground/30" />
                  <p>Aún no tiene materias asignadas.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Pestaña: Logros -->
          <TabsContent value="achievements" class="animate-in slide-in-from-bottom-4 duration-300">
            <Card class="border-border shadow-sm">
              <CardContent class="py-16 text-center text-muted-foreground flex flex-col items-center">
                <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Award class="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 class="text-xl font-semibold text-foreground mb-2">Sin logros públicos</h3>
                <p class="max-w-md mx-auto">Este tutor aún no ha hecho públicos sus logros o certificaciones académicas en la plataforma.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Pestaña: Reseñas -->
          <TabsContent value="reviews" class="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div v-if="userProfile.recent_reviews.length === 0">
              <Card class="border-border shadow-sm">
                <CardContent class="py-16 text-center text-muted-foreground flex flex-col items-center">
                  <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle class="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 class="text-xl font-semibold text-foreground mb-2">Aún no hay reseñas</h3>
                  <p class="max-w-md mx-auto">Sé el primero en tomar una asesoría y compartir tu experiencia con la comunidad.</p>
                </CardContent>
              </Card>
            </div>

            <!-- Lista de Reseñas -->
            <div v-else class="grid gap-4">
              <Card v-for="review in userProfile.recent_reviews" :key="review.id" class="border-border shadow-sm overflow-hidden transition-all hover:border-primary/30">
                <CardContent class="p-6">
                  <div class="flex items-start gap-5">
                    <Avatar class="h-12 w-12 border border-border shadow-sm bg-muted">
                      <AvatarImage :src="review.student_image || ''" />
                      <AvatarFallback class="text-primary font-bold bg-primary/10">
                        {{ review.student_name.charAt(0) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h4 class="font-bold text-foreground text-lg">{{ review.student_name }}</h4>
                        <div class="flex items-center gap-3">
                          <div class="flex items-center bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                            <Star
                              v-for="star in 5"
                              :key="star"
                              :class="['h-3.5 w-3.5', star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30']"
                            />
                          </div>
                          <span class="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {{ new Date(review.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="mt-3 relative">
                        <Quote class="absolute -top-1 -left-2 h-6 w-6 text-primary/10 transform -scale-x-100" />
                        <p class="text-muted-foreground text-base leading-relaxed pl-6 italic">
                          "{{ review.comment || 'Calificación sin comentario escrito.' }}"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
