<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait Auditable
{
    /**
     * Boot method to register event listeners.
     */
    protected static function bootAuditable()
    {
        // fired before creating
        static::creating(function ($model) {
            // if created_by is already set, don't set it again
            if ($model->created_by) {
                return;
            }

            // Set created_by if an authenticated user exists
            $user = Auth::user();
            if ($user) {
                $model->created_by = $user->id;
            }
        });

        // fired before deleting
        static::deleting(function ($model) {
            // if deleted_by is already set, don't set it again
            if ($model->deleted_by) {
                return;
            }

            // Set deleted_by if an authenticated user exists
            $user = Auth::user();
            if ($user) {
                $model->deleted_by = $user->id;
                $model->save(); // Save to persist the deleted_by field
            }
        });
    }
}
