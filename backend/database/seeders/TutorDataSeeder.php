<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Subject;
use Carbon\Carbon;

class TutorDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutors = User::where('is_tutor', true)->get();
        $subjectIds = Subject::pluck('id')->toArray();
        
        if (empty($subjectIds)) {
            $this->command->info('No subjects found. Please seed subjects first.');
            return;
        }

        foreach ($tutors as $index => $tutor) {
            // Half tutors, half professors
            $isProfessor = $index % 2 === 0; 
            $subjectsCount = $isProfessor ? rand(2, 3) : 1;
            
            // Assign random subjects
            $assignedSubjects = (array) array_rand(array_flip($subjectIds), $subjectsCount);
            
            foreach ($assignedSubjects as $subjectId) {
                // Avoid duplicates
                $exists = DB::table('user_subjects')
                    ->where('user_id', $tutor->id)
                    ->where('subject_id', $subjectId)
                    ->exists();
                    
                if (!$exists) {
                    DB::table('user_subjects')->insert([
                        'user_id' => $tutor->id,
                        'subject_id' => $subjectId,
                        'relationship_type' => 'TEACHING',
                        'created_at' => Carbon::now(),
                    ]);
                }
            }
            
            // Add tutor_availability
            // Let's add 2 random availabilities per tutor
            for ($i = 0; $i < 2; $i++) {
                $dayOfWeek = rand(1, 5); // Monday to Friday
                $startHour = rand(8, 16);
                $endHour = $startHour + rand(1, 3);
                
                DB::table('tutor_availability')->insert([
                    'user_id' => $tutor->id,
                    'day_of_week' => $dayOfWeek,
                    'start_time' => sprintf('%02d:00:00', $startHour),
                    'end_time' => sprintf('%02d:00:00', $endHour),
                    'created_at' => Carbon::now(),
                ]);
            }
        }
        
        $this->command->info('Tutors populated with subjects and availability!');
    }
}
