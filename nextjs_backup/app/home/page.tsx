"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Users, Calculator, Code, Atom, PiSquare, Database, Cpu, ChevronRight } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Calculus",
    description: "Differential, integral, and vector calculus",
    tutors: 128,
    rating: 4.9,
    icon: Calculator,
    subjects: ["Differential Calculus", "Integral Calculus", "Vector Calculus"],
  },
  {
    id: 2,
    name: "Programming",
    description: "Learn software development and coding",
    tutors: 256,
    rating: 4.8,
    icon: Code,
    subjects: ["Python", "JavaScript", "Java", "C++"],
  },
  {
    id: 3,
    name: "Physics",
    description: "Mechanics, thermodynamics, and electromagnetism",
    tutors: 94,
    rating: 4.7,
    icon: Atom,
    subjects: ["Classical Mechanics", "Thermodynamics", "Electromagnetism"],
  },
  {
    id: 4,
    name: "Mathematics",
    description: "Algebra, geometry, and statistics",
    tutors: 187,
    rating: 4.9,
    icon: PiSquare,
    subjects: ["Linear Algebra", "Statistics", "Discrete Math"],
  },
  {
    id: 5,
    name: "Software Engineering",
    description: "System design and software architecture",
    tutors: 112,
    rating: 4.8,
    icon: Cpu,
    subjects: ["System Design", "Agile", "DevOps"],
  },
  {
    id: 6,
    name: "Databases",
    description: "SQL, NoSQL, and data modeling",
    tutors: 78,
    rating: 4.6,
    icon: Database,
    subjects: ["SQL", "MongoDB", "Data Modeling"],
  },
]

const universities = [
  "Instituto Tecnológico de Morelia",
  "UNAM",
  "IPN",
  "UDG",
  "Tec de Monterrey",
  "UAM",
  "BUAP",
  "UV",
]

const featuredTutors = [
  {
    id: 1,
    name: "Dr. María González",
    subject: "Calculus",
    university: "UNAM",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Ing. Carlos Mendoza",
    subject: "Programming",
    university: "Tec de Monterrey",
    rating: 4.8,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Lic. Ana Rodríguez",
    subject: "Physics",
    university: "IPN",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState<string>("")

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-accent px-4 py-12 text-accent-foreground sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl text-balance">
            Find Your Perfect Tutor
          </h1>
          <p className="mb-8 text-lg text-accent-foreground/80">
            Connect with verified tutors from top Mexican universities
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search university, tutor or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 bg-background pl-12 text-foreground text-lg"
              />
            </div>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="h-14 w-full bg-background text-foreground sm:w-64">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="lg" className="h-14 px-8">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Browse by Subject</h2>
              <p className="mt-1 text-muted-foreground">Find tutors in your area of study</p>
            </div>
            <Link href="/search">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {category.rating}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {category.subjects.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {category.tutors} tutors
                      </div>
                      <Button size="sm">
                        View Tutors
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-6 text-center sm:hidden">
            <Link href="/search">
              <Button variant="outline">
                View All Categories
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="bg-muted/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Tutors</h2>
            <p className="mt-1 text-muted-foreground">Top-rated tutors this month</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTutors.map((tutor) => (
              <Card key={tutor.id} className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{tutor.name}</h3>
                      <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                      <p className="text-xs text-muted-foreground">{tutor.university}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{tutor.rating}</span>
                      <span className="text-sm text-muted-foreground">({tutor.reviews} reviews)</span>
                    </div>
                    <Link href={`/profile?id=${tutor.id}`}>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-accent text-accent-foreground border-0">
            <CardContent className="p-8 text-center sm:p-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl text-balance">
                Ready to Share Your Knowledge?
              </h2>
              <p className="mb-6 text-accent-foreground/80">
                Join our community of tutors and help students succeed in their academic journey.
              </p>
              <Link href="/profile">
                <Button size="lg" variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Become a Tutor
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent px-4 py-8 text-accent-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-accent-foreground/70">
              2026 TutorMX. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-accent-foreground/70 hover:text-accent-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-accent-foreground/70 hover:text-accent-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-accent-foreground/70 hover:text-accent-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
