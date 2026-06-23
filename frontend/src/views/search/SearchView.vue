<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Select from '@/components/ui/Select.vue'
import SelectTrigger from '@/components/ui/SelectTrigger.vue'
import SelectValue from '@/components/ui/SelectValue.vue'
import SelectContent from '@/components/ui/SelectContent.vue'
import SelectItem from '@/components/ui/SelectItem.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Label from '@/components/ui/Label.vue'
import { Search, Star, Filter, X, MapPin, Clock, DollarSign } from '@lucide/vue'

const router = useRouter()

const allTutors = [
  { id: 1, name: "Dr. María González", subject: "Calculus", specialty: "Differential Calculus", university: "UNAM", rating: 4.9, reviews: 156, price: 250, available: true, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", bio: "Professor with 10+ years of experience teaching calculus at university level." },
  { id: 2, name: "Ing. Carlos Mendoza", subject: "Programming", specialty: "Python & JavaScript", university: "Tec de Monterrey", rating: 4.8, reviews: 203, price: 300, available: true, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", bio: "Software engineer and full-stack developer with industry experience." },
  { id: 3, name: "Lic. Ana Rodríguez", subject: "Physics", specialty: "Mechanics", university: "IPN", rating: 4.7, reviews: 89, price: 220, available: false, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", bio: "Physics researcher specialized in classical mechanics and thermodynamics." },
  { id: 4, name: "M.Sc. Roberto Sánchez", subject: "Mathematics", specialty: "Linear Algebra", university: "UAM", rating: 4.9, reviews: 134, price: 280, available: true, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", bio: "Mathematics graduate with expertise in linear algebra and abstract algebra." },
  { id: 5, name: "Ing. Laura Martínez", subject: "Databases", specialty: "SQL & MongoDB", university: "Tec de Monterrey", rating: 4.6, reviews: 67, price: 260, available: true, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", bio: "Database administrator with experience in both relational and NoSQL databases." },
  { id: 6, name: "Dr. Fernando López", subject: "Software Engineering", specialty: "System Design", university: "UNAM", rating: 4.8, reviews: 178, price: 350, available: true, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", bio: "Senior software architect with 15+ years in the industry." },
]

const subjects = ["All Subjects", "Calculus", "Programming", "Physics", "Mathematics", "Databases", "Software Engineering"]
const universities = ["All Universities", "UNAM", "IPN", "Tec de Monterrey", "UAM", "UDG", "Instituto Tecnológico de Morelia"]

const searchQuery = ref("")
const selectedSubject = ref("All Subjects")
const selectedUniversity = ref("All Universities")
const showAvailableOnly = ref(false)
const showFilters = ref(false)

const filteredTutors = computed(() => {
  return allTutors.filter((tutor) => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = tutor.name.toLowerCase().includes(searchLower) ||
                          tutor.subject.toLowerCase().includes(searchLower) ||
                          tutor.specialty.toLowerCase().includes(searchLower)
    const matchesSubject = selectedSubject.value === "All Subjects" || tutor.subject === selectedSubject.value
    const matchesUniversity = selectedUniversity.value === "All Universities" || tutor.university === selectedUniversity.value
    const matchesAvailability = !showAvailableOnly.value || tutor.available

    return matchesSearch && matchesSubject && matchesUniversity && matchesAvailability
  })
})

const clearFilters = () => {
  searchQuery.value = ""
  selectedSubject.value = "All Subjects"
  selectedUniversity.value = "All Universities"
  showAvailableOnly.value = false
}
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0">
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Find a Tutor</h1>
        <p class="mt-1 text-muted-foreground">Browse and connect with verified tutors</p>
      </div>

      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <div class="flex flex-col gap-4 lg:flex-row">
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, subject, or specialty..."
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
            Filters
          </Button>
        </div>

        <!-- Desktop Filters -->
        <div class="hidden items-center gap-4 lg:flex z-40 relative">
          <Select v-model="selectedSubject">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedUniversity">
            <SelectTrigger class="w-64">
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="uni in universities" :key="uni" :value="uni">
                {{ uni }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="flex items-center gap-2">
            <Checkbox
              id="available"
              :checked="showAvailableOnly"
              @update:checked="val => showAvailableOnly = val"
            />
            <Label for="available" class="text-sm">
              Available now
            </Label>
          </div>

          <Button 
            v-if="selectedSubject !== 'All Subjects' || selectedUniversity !== 'All Universities' || showAvailableOnly || searchQuery"
            variant="ghost" 
            size="sm" 
            @click="clearFilters"
          >
            <X class="mr-1 h-4 w-4" />
            Clear filters
          </Button>
        </div>

        <!-- Mobile Filters -->
        <div v-if="showFilters" class="space-y-4 rounded-lg border bg-card p-4 lg:hidden relative z-40">
          <Select v-model="selectedSubject">
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedUniversity">
            <SelectTrigger>
              <SelectValue placeholder="University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="uni in universities" :key="uni" :value="uni">
                {{ uni }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="flex items-center gap-2">
            <Checkbox
              id="available-mobile"
              :checked="showAvailableOnly"
              @update:checked="val => showAvailableOnly = val"
            />
            <Label for="available-mobile" class="text-sm">
              Available now
            </Label>
          </div>

          <Button variant="outline" class="w-full" @click="clearFilters">
            Clear filters
          </Button>
        </div>
      </div>

      <!-- Results Count -->
      <p class="mb-4 text-sm text-muted-foreground">
        Showing {{ filteredTutors.length }} tutor{{ filteredTutors.length !== 1 ? "s" : "" }}
      </p>

      <!-- Tutor Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="tutor in filteredTutors" :key="tutor.id" class="group overflow-hidden transition-all hover:shadow-lg">
          <CardContent class="p-0 flex flex-col h-full">
            <div class="p-6 flex-1">
              <div class="flex items-start gap-4">
                <div class="relative">
                  <img
                    :src="tutor.image"
                    :alt="tutor.name"
                    class="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <span v-if="tutor.available" class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold truncate">{{ tutor.name }}</h3>
                  <p class="text-sm text-primary font-medium">{{ tutor.subject }}</p>
                  <p class="text-xs text-muted-foreground">{{ tutor.specialty }}</p>
                </div>
              </div>

              <p class="mt-4 text-sm text-muted-foreground line-clamp-2">{{ tutor.bio }}</p>

              <div class="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" class="gap-1">
                  <MapPin class="h-3 w-3" />
                  {{ tutor.university }}
                </Badge>
                <Badge variant="secondary" class="gap-1">
                  <Clock class="h-3 w-3" />
                  {{ tutor.available ? "Available" : "Busy" }}
                </Badge>
              </div>

              <div class="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">
                    <Star class="h-4 w-4 fill-primary text-primary" />
                    <span class="font-medium">{{ tutor.rating }}</span>
                    <span class="text-xs text-muted-foreground">({{ tutor.reviews }})</span>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-muted-foreground">
                  <DollarSign class="h-4 w-4" />
                  <span class="font-semibold text-foreground">${{ tutor.price }}</span>
                  <span class="text-xs">/hr</span>
                </div>
              </div>
            </div>

            <div class="border-t border-border bg-muted/30 p-4 mt-auto">
              <div class="flex gap-2">
                <router-link :to="`/profile?id=${tutor.id}`" class="flex-1 block">
                  <Button variant="outline" class="w-full">
                    View Profile
                  </Button>
                </router-link>
                <router-link :to="`/chat?tutor=${tutor.id}`" class="flex-1 block">
                  <Button class="w-full">Message</Button>
                </router-link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-if="filteredTutors.length === 0" class="py-12 text-center">
        <p class="text-lg font-medium">No tutors found</p>
        <p class="text-muted-foreground">Try adjusting your filters or search query</p>
        <Button variant="outline" class="mt-4" @click="clearFilters">
          Clear all filters
        </Button>
      </div>
    </div>
  </div>
</template>
