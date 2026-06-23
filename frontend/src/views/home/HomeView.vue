<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import Select from '@/components/ui/Select.vue'
import SelectTrigger from '@/components/ui/SelectTrigger.vue'
import SelectValue from '@/components/ui/SelectValue.vue'
import SelectContent from '@/components/ui/SelectContent.vue'
import SelectItem from '@/components/ui/SelectItem.vue'
import { Search, Star, Users, Calculator, Code, Atom, PiSquare, Database, Cpu, ChevronRight } from '@lucide/vue'

const router = useRouter()

const categories = [
  { id: 1, name: "Calculus", description: "Differential, integral, and vector calculus", tutors: 128, rating: 4.9, icon: Calculator, subjects: ["Differential Calculus", "Integral Calculus", "Vector Calculus"] },
  { id: 2, name: "Programming", description: "Learn software development and coding", tutors: 256, rating: 4.8, icon: Code, subjects: ["Python", "JavaScript", "Java", "C++"] },
  { id: 3, name: "Physics", description: "Mechanics, thermodynamics, and electromagnetism", tutors: 94, rating: 4.7, icon: Atom, subjects: ["Classical Mechanics", "Thermodynamics", "Electromagnetism"] },
  { id: 4, name: "Mathematics", description: "Algebra, geometry, and statistics", tutors: 187, rating: 4.9, icon: PiSquare, subjects: ["Linear Algebra", "Statistics", "Discrete Math"] },
  { id: 5, name: "Software Engineering", description: "System design and software architecture", tutors: 112, rating: 4.8, icon: Cpu, subjects: ["System Design", "Agile", "DevOps"] },
  { id: 6, name: "Databases", description: "SQL, NoSQL, and data modeling", tutors: 78, rating: 4.6, icon: Database, subjects: ["SQL", "MongoDB", "Data Modeling"] },
]

const universities = [
  "Instituto Tecnológico de Morelia", "UNAM", "IPN", "UDG", "Tec de Monterrey", "UAM", "BUAP", "UV"
]

const featuredTutors = [
  { id: 1, name: "Dr. María González", subject: "Calculus", university: "UNAM", rating: 4.9, reviews: 156, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { id: 2, name: "Ing. Carlos Mendoza", subject: "Programming", university: "Tec de Monterrey", rating: 4.8, reviews: 203, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { id: 3, name: "Lic. Ana Rodríguez", subject: "Physics", university: "IPN", rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
]

const searchQuery = ref("")
const selectedUniversity = ref("")
</script>

<template>
  <div class="min-h-screen bg-background pb-16 md:pb-0">
    <!-- Hero Section -->
    <section class="relative bg-zinc-950 px-4 py-20 sm:py-32">
      <!-- Minimalist Dark Background Gradient -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-zinc-950 to-zinc-950"></div>
      
      <div class="relative mx-auto max-w-4xl text-center">
        <h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white text-balance">
          Find Your Perfect Tutor
        </h1>
        <p class="mb-12 text-lg text-zinc-400 sm:text-xl max-w-2xl mx-auto text-balance">
          Connect with verified tutors from top Mexican universities and master your subjects.
        </p>
        
        <!-- Modern Search Bar Pill (Dark Theme) -->
        <div class="mx-auto flex max-w-3xl flex-col sm:flex-row items-center gap-2 rounded-3xl bg-zinc-900 p-2 shadow-2xl shadow-primary/10 border border-white/10">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search university, tutor or subject..."
              v-model="searchQuery"
              class="h-14 border-0 bg-transparent pl-12 text-base text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
          </div>
          
          <div class="h-8 w-px bg-white/10 hidden sm:block"></div>
          
          <div class="w-full sm:w-64">
            <Select v-model="selectedUniversity">
              <SelectTrigger class="h-14 border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0 shadow-none text-base">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent class="bg-zinc-900 border-white/10 text-white">
                <SelectItem v-for="uni in universities" :key="uni" :value="uni" class="focus:bg-zinc-800 focus:text-white">
                  {{ uni }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button size="lg" class="h-14 w-full sm:w-auto rounded-2xl px-8 bg-primary text-primary-foreground hover:bg-primary/90" @click="router.push('/search')">
            <Search class="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="px-4 py-12 sm:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold sm:text-3xl">Browse by Subject</h2>
            <p class="mt-1 text-muted-foreground">Find tutors in your area of study</p>
          </div>
          <router-link to="/search">
            <Button variant="outline" class="hidden sm:flex">
              View All
              <ChevronRight class="ml-1 h-4 w-4" />
            </Button>
          </router-link>
        </div>
        
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="category in categories" :key="category.id" class="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader>
              <div class="flex items-start justify-between">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <component :is="category.icon" class="h-6 w-6 text-primary" />
                </div>
                <div class="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star class="h-4 w-4 fill-primary text-primary" />
                  {{ category.rating }}
                </div>
              </div>
              <CardTitle class="mt-4">{{ category.name }}</CardTitle>
              <CardDescription>{{ category.description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="mb-4 flex flex-wrap gap-2">
                <Badge v-for="subject in category.subjects.slice(0, 3)" :key="subject" variant="secondary" class="text-xs">
                  {{ subject }}
                </Badge>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users class="h-4 w-4" />
                  {{ category.tutors }} tutors
                </div>
                <Button size="sm">
                  View Tutors
                  <ChevronRight class="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div class="mt-6 text-center sm:hidden">
          <router-link to="/search">
            <Button variant="outline">
              View All Categories
              <ChevronRight class="ml-1 h-4 w-4" />
            </Button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Tutors Section -->
    <section class="bg-muted/50 px-4 py-12 sm:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8">
          <h2 class="text-2xl font-bold sm:text-3xl">Featured Tutors</h2>
          <p class="mt-1 text-muted-foreground">Top-rated tutors this month</p>
        </div>
        
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="tutor in featuredTutors" :key="tutor.id" class="group cursor-pointer transition-all hover:shadow-lg">
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <img
                  :src="tutor.image"
                  :alt="tutor.name"
                  class="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div class="flex-1">
                  <h3 class="font-semibold">{{ tutor.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ tutor.subject }}</p>
                  <p class="text-xs text-muted-foreground">{{ tutor.university }}</p>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <Star class="h-4 w-4 fill-primary text-primary" />
                  <span class="font-medium">{{ tutor.rating }}</span>
                  <span class="text-sm text-muted-foreground">({{ tutor.reviews }} reviews)</span>
                </div>
                <router-link :to="`/profile?id=${tutor.id}`">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </router-link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-4 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl">
        <Card class="bg-accent text-accent-foreground border-0">
          <CardContent class="p-8 text-center sm:p-12">
            <h2 class="mb-4 text-2xl font-bold sm:text-3xl text-balance">
              Ready to Share Your Knowledge?
            </h2>
            <p class="mb-6 text-accent-foreground/80">
              Join our community of tutors and help students succeed in their academic journey.
            </p>
            <router-link to="/profile">
              <Button size="lg" variant="secondary" class="bg-primary text-primary-foreground hover:bg-primary/90">
                Become a Tutor
                <ChevronRight class="ml-2 h-5 w-5" />
              </Button>
            </router-link>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-accent px-4 py-8 text-accent-foreground">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-accent-foreground/70">
            2026 TutorMX. All rights reserved.
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-sm text-accent-foreground/70 hover:text-accent-foreground">
              Privacy Policy
            </a>
            <a href="#" class="text-sm text-accent-foreground/70 hover:text-accent-foreground">
              Terms of Service
            </a>
            <a href="#" class="text-sm text-accent-foreground/70 hover:text-accent-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
