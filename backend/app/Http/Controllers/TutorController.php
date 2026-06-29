<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TutorController extends Controller
{
    /**
     * Get a paginated list of tutors (1 subject).
     */
    public function getTutors(Request $request): JsonResponse
    {
        $tutors = $this->buildQuery($request)
            ->has('subjects', '=', 1)
            ->paginate(20);

        return response()->json($tutors);
    }

    /**
     * Get a paginated list of professors (>1 subjects).
     */
    public function getProfessors(Request $request): JsonResponse
    {
        $professors = $this->buildQuery($request)
            ->has('subjects', '>', 1)
            ->paginate(20);

        return response()->json($professors);
    }

    /**
     * Get a list of featured tutors/professors.
     */
    public function getFeatured(Request $request): JsonResponse
    {
        $featured = User::where('is_tutor', true)
            ->withAvg('tutorReviews', 'rating')
            ->withCount('tutorReviews')
            ->orderByDesc('tutor_reviews_avg_rating')
            ->limit(3)
            ->get();
            
        // Map to match the frontend expected format
        $mapped = $featured->map(function ($tutor) {
            return [
                'id' => $tutor->id,
                'name' => $tutor->name . ' ' . $tutor->lastname,
                'subject' => $tutor->subjects()->first()?->name ?? 'Múltiples Materias',
                'university' => 'Verificada', // Podríamos agregar $tutor->universities()->first() si existiera la relación
                'rating' => $tutor->tutor_reviews_avg_rating ? round($tutor->tutor_reviews_avg_rating, 1) : null,
                'reviews' => $tutor->tutor_reviews_count,
                'image' => $tutor->profile_image_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($tutor->name) . '&background=random',
            ];
        });

        return response()->json(['data' => $mapped]);
    }
    
    /**
     * Get the full public profile for a tutor/professor.
     */
    public function getProfile($id): JsonResponse
    {
        $user = User::where('id', $id)
            ->with(['subjects'])
            ->withAvg('tutorReviews', 'rating')
            ->withCount('tutorReviews')
            ->firstOrFail();

        // Also fetch reviews explicitly
        $reviews = \App\Models\Review::where('tutor_id', $id)
            ->with('student:id,name,lastname,profile_image_url')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'bio' => $user->bio,
            'profile_image_url' => $user->profile_image_url,
            'created_at' => $user->created_at,
            'rating' => $user->tutor_reviews_avg_rating ? round($user->tutor_reviews_avg_rating, 1) : null,
            'reviews_count' => $user->tutor_reviews_count,
            'subjects' => $user->subjects->map(function($s) { return $s->name; })->toArray(),
            'recent_reviews' => $reviews->map(function($r) {
                return [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'created_at' => $r->created_at,
                    'student_name' => $r->student->name . ' ' . $r->student->lastname,
                    'student_image' => $r->student->profile_image_url
                ];
            })
        ]);
    }

    /**
     * Get a combined list of tutors and professors (for Search).
     */
    public function getAll(Request $request): JsonResponse
    {
        $all = $this->buildQuery($request)
            ->paginate(20);

        return response()->json($all);
    }

    /**
     * Build the base query with filters.
     */
    private function buildQuery(Request $request)
    {
        $query = User::where('is_tutor', true)
            ->withAvg('tutorReviews', 'rating')
            ->withCount('tutorReviews')
            ->select('users.id', 'users.name', 'users.lastname', 'users.profile_image_url', 'users.bio');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                  ->orWhere('lastname', 'ilike', '%' . $search . '%');
            });
        }
        
        if ($request->has('subject_id') && !empty($request->subject_id)) {
            $query->whereHas('subjects', function($q) use ($request) {
                $q->where('subjects.id', $request->subject_id);
            });
        }

        return $query;
    }
}
