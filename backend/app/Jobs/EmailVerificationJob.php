<?php

namespace App\Jobs;

use App\Mail\VerificationEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailVerificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    /**
     * Create a new job instance.
     */
    public function __construct(
        private User $user, // Combines the property declaration with the constructor parameter
    ) {
    }

    /**
     * Send a verification email to the user.
     */
    public function handle(): void
    {
        // Get the user's email address
        $email = $this->user->email;

        // Create a new VerificationEmail instance
        $verificationEmail = new VerificationEmail($this->user);

        // Send the verification email
        Mail::to($email)->send($verificationEmail);
    }
}
