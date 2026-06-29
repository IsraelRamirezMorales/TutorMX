<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->created_at = $model->freshTimestamp();
        });
    }

    /**
     * Tutors who teach this subject.
     */
    public function tutors()
    {
        return $this->belongsToMany(User::class, 'user_subjects')
            ->wherePivot('relationship_type', 'TEACHING')
            ->where('is_tutor', true)
            ->where('verification_status', 'APPROVED');
    }

    public function tutoringSessions()
    {
        return $this->hasMany(TutoringSession::class);
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, TutoringSession::class);
    }
}
