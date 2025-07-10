<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\UuidGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resource extends BaseModel
{
    use HasFactory, Auditable, UuidGenerator;

    protected $fillable = [
        'uuid',
        'name',
        'description',
        'type',
        'status',
        'priority',
        'assigned_to',
        'due_date',
        'tags',
        'user_id',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'tags' => 'array',
    ];

    /**
     * Get the user who created this resource
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user assigned to this resource
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Scope to filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by priority
     */
    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to filter by assigned user
     */
    public function scopeByAssignedUser($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }
} 