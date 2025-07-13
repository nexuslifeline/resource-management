<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmission;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function submit(ContactFormRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Send email notification (you can configure this in your .env)
        try {
            Mail::to(config('mail.admin_email', 'admin@example.com'))
                ->send(new ContactFormSubmission($data));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Contact form email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Thank you for your message. We will get back to you soon!'
        ]);
    }
} 