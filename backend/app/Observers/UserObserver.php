<?php

namespace App\Observers;

use App\Jobs\EmailVerificationJob;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserObserver
{
    /**
     * This function is responsible for handling the logic when creating a user.
     * It performs the following operations:
     * - If the user is of type 'admin', it sets the email_verified_at field to the current time.
     * - If the user is not of type 'admin' and doesn't have a verification token, it generates a new verification token using a UUID.
     *
     * @param User $user The user object being created.
     * @return void
     */
    public function creating(User $user)
    {
        try {
            // Check if the user is of type 'admin'
            if ($user->type === 'admin') {
                // If yes, set the email_verified_at field to the current time
                $user->email_verified_at = now();
                // we can exit already, no need to set verification token
                return;
            }
        } catch (\Exception $e) {
            // Handle the exception as needed
            // Log the error, send a notification, etc.
            Log::error('Error while filling date of verification: ' . $e->getMessage());
        }

        try {
            // Check if the user doesn't have a verification token
            if (!$user->verification_token) {
                // If yes, generate a new verification token using a UUID
                $user->verification_token = Str::uuid();
            }
        } catch (\Exception $e) {
            // Handle the exception as needed
            // Log the error, send a notification, etc.
            Log::error('Error while filling verification token: ' . $e->getMessage());
        }
    }

    public function created(User $user)
    {
        $this->sendVerificationEmail($user);
        $this->fillDefaultData($user);
    }

    private function fillDefaultData(User $user)
    {
    }

    private function sendVerificationEmail(User $user)
    {
        try {
            // Refresh the user instance
            $user->refresh();

            // Check if the user has an email
            if (!$user->email) {
                return;
            }

            // Check if the user is of type 'tenant'
            if ($user->type !== 'tenant') {
                return;
            }

            // Check if the user's email has been verified
            if ($user->email_verified_at) {
                return;
            }

            // Dispatch the email verification job
            dispatch(new EmailVerificationJob($user));
        } catch (\Exception $e) {
            // Handle the exception as needed
            // Log the error, send a notification, etc.
            Log::error('Error while dispatching send email job: ' . $e->getMessage());
        }
    }

    // TODO: check if we can just use the sendVerificationEmail method
    public function updated(User $user)
    {
        try {
            // Check if the user has an email
            if (!$user->email) {
                return;
            }

            // Check if the user is of type 'tenant'
            if ($user->type !== 'tenant') {
                return;
            }

            // Check if the user's email has been verified
            if ($user->email_verified_at) {
                return;
            }

            // Check if the verification_token field has changed
            if (!$user->isDirty('verification_token')) {
                return;
            }

            // Dispatch the email verification job
            dispatch(new EmailVerificationJob($user));
        } catch (\Exception $e) {
            // Handle the exception as needed
            // Log the error, send a notification, etc.
            Log::error('Error while dispatching send email job: ' . $e->getMessage());
        }
    }
}
