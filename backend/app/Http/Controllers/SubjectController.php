<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller
{
    /**
     * Retrieve the catalog of subjects.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        $subjects = Subject::withCount('tutors')
            ->withAvg('reviews', 'rating')
            ->paginate(20);

        return SubjectResource::collection($subjects);
    }

    /**
     * Get tutors for a specific subject.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function tutors($id)
    {
        $subject = Subject::findOrFail($id);
        
        $tutors = $subject->tutors()
            ->withAvg('tutorReviews', 'rating')
            ->select('users.id', 'users.name', 'users.lastname', 'users.profile_image_url', 'users.bio')
            ->get();
            
        return response()->json(['data' => $tutors]);
    }
}
