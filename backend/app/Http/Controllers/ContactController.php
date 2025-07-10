<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmission;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function submit(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

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