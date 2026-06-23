<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Crear tipos ENUM
        DB::statement("DROP TYPE IF EXISTS document_status_t CASCADE");
        DB::statement("CREATE TYPE document_status_t AS ENUM ('PENDING', 'APPROVED', 'DECLINED')");
        DB::statement("DROP TYPE IF EXISTS document_type_t CASCADE");
        DB::statement("CREATE TYPE document_type_t AS ENUM ('INE', 'STUDENT_ID', 'PROOF_OF_ENROLLMENT', 'OTHER')");
        DB::statement("DROP TYPE IF EXISTS subject_relationship_t CASCADE");
        DB::statement("CREATE TYPE subject_relationship_t AS ENUM ('LEARNING', 'TEACHING')");
        DB::statement("DROP TYPE IF EXISTS tutoring_status_t CASCADE");
        DB::statement("CREATE TYPE tutoring_status_t AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED')");
        DB::statement("DROP TYPE IF EXISTS university_relationship_t CASCADE");
        DB::statement("CREATE TYPE university_relationship_t AS ENUM ('STUDENT', 'TUTOR', 'PROFESSOR', 'EMPLOYEE', 'ALUMNI')");

        // 2. Crear Tablas base (sin FKs o FKs a users)
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('institutional_domain');
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
        });

        // 3. Tablas dependientes de users y otras
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('institution')->nullable();
            $table->integer('achievement_year')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('file_url');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
        });
        DB::statement("ALTER TABLE documents ADD COLUMN document_type document_type_t NOT NULL");
        DB::statement("ALTER TABLE documents ADD COLUMN status document_status_t NOT NULL DEFAULT 'PENDING'::document_status_t");

        Schema::create('tutor_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->smallInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamp('created_at')->nullable()->useCurrent();
        });

        Schema::create('tutoring_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->timestamp('scheduled_at');
            $table->string('location');
            $table->timestamp('created_at')->useCurrent();
        });
        DB::statement("ALTER TABLE tutoring_sessions ADD COLUMN status tutoring_status_t NOT NULL DEFAULT 'PENDING'::tutoring_status_t");

        Schema::create('user_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
        });
        DB::statement("ALTER TABLE user_subjects ADD COLUMN relationship_type subject_relationship_t NOT NULL");

        Schema::create('user_universities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
        DB::statement("ALTER TABLE user_universities ADD COLUMN relationship_type university_relationship_t NOT NULL");

        // 4. Tablas dependientes de 2do nivel
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->text('message');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutoring_session_id')->nullable()->constrained('tutoring_sessions')->onDelete('set null');
            $table->smallInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('user_universities');
        Schema::dropIfExists('user_subjects');
        Schema::dropIfExists('tutoring_sessions');
        Schema::dropIfExists('tutor_availability');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('universities');
        Schema::dropIfExists('subjects');

        DB::statement("DROP TYPE IF EXISTS document_status_t");
        DB::statement("DROP TYPE IF EXISTS document_type_t");
        DB::statement("DROP TYPE IF EXISTS subject_relationship_t");
        DB::statement("DROP TYPE IF EXISTS tutoring_status_t");
        DB::statement("DROP TYPE IF EXISTS university_relationship_t");
    }
};
