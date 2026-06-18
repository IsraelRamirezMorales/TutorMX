"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Star, Filter, X, MapPin, Clock, DollarSign } from "lucide-react"

const allTutors = [
  {
    id: 1,
    name: "Dr. María González",
    subject: "Calculus",
    specialty: "Differential Calculus",
    university: "UNAM",
    rating: 4.9,
    reviews: 156,
    price: 250,
    available: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    bio: "Professor with 10+ years of experience teaching calculus at university level.",
  },
  {
    id: 2,
    name: "Ing. Carlos Mendoza",
    subject: "Programming",
    specialty: "Python & JavaScript",
    university: "Tec de Monterrey",
    rating: 4.8,
    reviews: 203,
    price: 300,
    available: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    bio: "Software engineer and full-stack developer with industry experience.",
  },
  {
    id: 3,
    name: "Lic. Ana Rodríguez",
    subject: "Physics",
    specialty: "Mechanics",
    university: "IPN",
    rating: 4.7,
    reviews: 89,
    price: 220,
    available: false,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    bio: "Physics researcher specialized in classical mechanics and thermodynamics.",
  },
  {
    id: 4,
    name: "M.Sc. Roberto Sánchez",
    subject: "Mathematics",
    specialty: "Linear Algebra",
    university: "UAM",
    rating: 4.9,
    reviews: 134,
    price: 280,
    available: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "Mathematics graduate with expertise in linear algebra and abstract algebra.",
  },
  {
    id: 5,
    name: "Ing. Laura Martínez",
    subject: "Databases",
    specialty: "SQL & MongoDB",
    university: "Tec de Monterrey",
    rating: 4.6,
    reviews: 67,
    price: 260,
    available: true,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "Database administrator with experience in both relational and NoSQL databases.",
  },
  {
    id: 6,
    name: "Dr. Fernando López",
    subject: "Software Engineering",
    specialty: "System Design",
    university: "UNAM",
    rating: 4.8,
    reviews: 178,
    price: 350,
    available: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    bio: "Senior software architect with 15+ years in the industry.",
  },
]

const subjects = ["All Subjects", "Calculus", "Programming", "Physics", "Mathematics", "Databases", "Software Engineering"]
const universities = ["All Universities", "UNAM", "IPN", "Tec de Monterrey", "UAM", "UDG", "Instituto Tecnológico de Morelia"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedUniversity, setSelectedUniversity] = useState("All Universities")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTutors = allTutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "All Subjects" || tutor.subject === selectedSubject
    const matchesUniversity = selectedUniversity === "All Universities" || tutor.university === selectedUniversity
    const matchesAvailability = !showAvailableOnly || tutor.available

    return matchesSearch && matchesSubject && matchesUniversity && matchesAvailability
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("All Subjects")
    setSelectedUniversity("All Universities")
    setShowAvailableOnly(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Find a Tutor</h1>
          <p className="mt-1 text-muted-foreground">Browse and connect with verified tutors</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, subject, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-4 lg:flex">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox
                id="available"
                checked={showAvailableOnly}
                onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
              />
              <Label htmlFor="available" className="text-sm">
                Available now
              </Label>
            </div>

            {(selectedSubject !== "All Subjects" ||
              selectedUniversity !== "All Universities" ||
              showAvailableOnly ||
              searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="space-y-4 rounded-lg border bg-card p-4 lg:hidden">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="available-mobile"
                  checked={showAvailableOnly}
                  onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
                />
                <Label htmlFor="available-mobile" className="text-sm">
                  Available now
                </Label>
              </div>

              <Button variant="outline" className="w-full" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""}
        </p>

        {/* Tutor Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="group overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      {tutor.available && (
                        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{tutor.name}</h3>
                      <p className="text-sm text-primary font-medium">{tutor.subject}</p>
                      <p className="text-xs text-muted-foreground">{tutor.specialty}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {tutor.university}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {tutor.available ? "Available" : "Busy"}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{tutor.rating}</span>
                        <span className="text-xs text-muted-foreground">({tutor.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-foreground">${tutor.price}</span>
                      <span className="text-xs">/hr</span>
                    </div>
                  </div>
                </div>

                <div className="border-t bg-muted/30 p-4">
                  <div className="flex gap-2">
                    <Link href={`/profile?id=${tutor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/chat?tutor=${tutor.id}`} className="flex-1">
                      <Button className="w-full">Message</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg font-medium">No tutors found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
