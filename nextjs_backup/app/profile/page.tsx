"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  FileText, 
  MessageCircle, 
  Edit, 
  Plus,
  GraduationCap,
  Briefcase,
  Clock,
  Users
} from "lucide-react"

const userProfile = {
  id: 1,
  name: "Dr. María González",
  email: "maria.gonzalez@unam.edu.mx",
  role: "Teacher",
  subject: "Mathematics",
  specialty: "Calculus",
  university: "UNAM",
  location: "Mexico City, Mexico",
  rating: 4.9,
  reviews: 156,
  students: 89,
  sessions: 342,
  joinedDate: "January 2023",
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  bio: "Professor with 10+ years of experience teaching calculus at university level. Passionate about making complex mathematical concepts accessible to all students. I specialize in differential and integral calculus, and have helped hundreds of students achieve their academic goals.",
  subjects: ["Differential Calculus", "Integral Calculus", "Vector Calculus", "Linear Algebra"],
  languages: ["Spanish", "English"],
  hourlyRate: 300,
  availability: "Mon-Fri, 9AM-6PM",
}

const achievements = [
  {
    id: 1,
    title: "PhD in Applied Mathematics",
    institution: "UNAM",
    year: "2015",
    type: "degree",
  },
  {
    id: 2,
    title: "Master of Science in Mathematics",
    institution: "UNAM",
    year: "2012",
    type: "degree",
  },
  {
    id: 3,
    title: "Excellence in Teaching Award",
    institution: "Faculty of Sciences, UNAM",
    year: "2022",
    type: "award",
  },
  {
    id: 4,
    title: "Research Grant - CONACYT",
    institution: "National Council of Science and Technology",
    year: "2020",
    type: "award",
  },
  {
    id: 5,
    title: "Certified Online Educator",
    institution: "Coursera",
    year: "2021",
    type: "certificate",
  },
]

const reviews = [
  {
    id: 1,
    author: "Carlos M.",
    rating: 5,
    date: "2 weeks ago",
    text: "Excellent tutor! Dr. González explained calculus concepts in a way I could finally understand. Highly recommended for anyone struggling with math.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    author: "Ana S.",
    rating: 5,
    date: "1 month ago",
    text: "Very patient and knowledgeable. She helped me prepare for my final exam and I got an A! Thank you so much.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    author: "Roberto L.",
    rating: 4,
    date: "2 months ago",
    text: "Great explanations and very organized sessions. Would definitely recommend to other engineering students.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
]

export default function ProfilePage() {
  const [isOwnProfile] = useState(true) // In a real app, this would be determined by auth

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 bg-accent" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <Avatar className="-mt-16 h-32 w-32 border-4 border-card">
                <AvatarImage src={userProfile.image} alt={userProfile.name} />
                <AvatarFallback className="text-3xl">
                  {userProfile.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-2 sm:pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                      <Badge className="bg-primary text-primary-foreground">{userProfile.role}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{userProfile.specialty} - {userProfile.subject}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {userProfile.university}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {userProfile.joinedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Link href={`/chat?tutor=${userProfile.id}`}>
                          <Button>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      {userProfile.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">{userProfile.reviews} reviews</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Users className="h-5 w-5 text-primary" />
                      {userProfile.students}
                    </div>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {userProfile.sessions}
                    </div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-2xl font-bold">${userProfile.hourlyRate}</div>
                    <p className="text-xs text-muted-foreground">Per hour</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle>Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{userProfile.bio}</p>
              </CardContent>
            </Card>

            {/* Subjects & Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Subjects & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userProfile.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="px-3 py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{userProfile.availability}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {userProfile.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Become a Tutor CTA */}
            {isOwnProfile && userProfile.role === "Student" && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Ready to Share Your Knowledge?</h3>
                      <p className="text-muted-foreground">
                        Become a tutor and help other students succeed while earning money.
                      </p>
                    </div>
                    <Button size="lg">
                      Become a Tutor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Add Achievement Button (for own profile) */}
            {isOwnProfile && (
              <div className="flex justify-end">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Achievement
                </Button>
              </div>
            )}

            {/* Achievements Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        {achievement.type === "degree" && (
                          <GraduationCap className="h-6 w-6 text-primary" />
                        )}
                        {achievement.type === "award" && (
                          <Award className="h-6 w-6 text-primary" />
                        )}
                        {achievement.type === "certificate" && (
                          <FileText className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.institution}</p>
                        <Badge variant="secondary" className="mt-2">
                          {achievement.year}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Reviews Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">{userProfile.rating}</div>
                    <div className="mt-1 flex items-center justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(userProfile.rating)
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on {userProfile.reviews} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = rating === 5 ? 85 : rating === 4 ? 12 : rating === 3 ? 3 : 0
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="w-3 text-sm">{rating}</span>
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-sm text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.image} alt={review.author} />
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.author}</h4>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="mt-1 flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-muted-foreground">{review.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
