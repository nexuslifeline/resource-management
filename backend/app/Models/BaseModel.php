<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\UuidGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BaseModel extends Model
{
    use HasFactory, SoftDeletes, UuidGenerator, Auditable;

    protected $guarded = ['id', 'uuid'];

    protected $hidden = [
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'deleted_at',
        'deleted_by',
    ];

    /**
     * Retrieves the name of the route key used for model binding.
     *
     * @return string The name of the route key.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
