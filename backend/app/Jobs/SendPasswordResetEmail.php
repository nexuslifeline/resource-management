<?php

namespace App\Jobs;

use App\Mail\ResetPasswordEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private User $user, // Combines the property declaration with the constructor parameter
        private string $resetToken
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Get the user's email address
        $email = $this->user->email;

        // Create a new ResetPasswordEmail instance
        $resetEmail = new ResetPasswordEmail($this->user, $this->resetToken);

        // Send the verification email
        Mail::to($email)->send($resetEmail);
    }
}
