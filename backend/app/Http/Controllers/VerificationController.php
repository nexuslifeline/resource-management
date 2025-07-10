<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {
    }

    /**
     * Verify the user's email address using the provided verification token.
     *
     * @param Request $request The HTTP request object.
     * @param string $token The verification token.
     * @return \Illuminate\Http\Response The HTTP response containing a success message.
     */
    public function verify(Request $request, $token)
    {
        try {
            // Find the user with the given token
            $user = $this->userRepository->findByVerificationToken($token);

            // If the user is not found, return a response with an error message and status code 403
            if (!$user) {
                return response()->json(['error' => 'Invalid token.'], 403);
            }

            // Check if the user's email is already verified
            if ($user->email_verified_at) {
                return response()->json(['error' => 'User is already verified.'], 403);
            }

            // Mark the user's email as verified
            $user->markEmailAsVerified();

            // Return a response with a success message
            return response([
                'message' => "Your email has been verified."
            ]);
        } catch (\Exception $e) {
            // Handle the exception, log it, or return an appropriate error response
            return response(['message' => 'Error verifying email.'], 500);
        }
    }


    /**
     * Resend the verification email to the user.
     *
     * @param Request $request The request object containing the user information.
     * @return \Illuminate\Http\Response The response indicating the email has been sent.
     */
    public function resend(Request $request)
    {
        try {
            // Get the authenticated user from the request
            $user = $request->user();

            // Check if the user's email is already verified
            if ($user->email_verified_at) {
                // Return a response indicating that the user is already verified
                return response()->json(['error' => 'User is already verified.'], 403);
            }

            // Generate a new verification token using a UUID (Universally Unique Identifier)
            $newVerificationToken = Str::uuid();

            // Update the verification token, prompting the user observer to send the
            // email verification again

            $user->verification_token = $newVerificationToken;
            $user->save();

            // Return a response indicating that the verification email has been sent
            return response([
                'message' => "Verification email sent."
            ], 200);
        } catch (\Exception $e) {
            // Handle the exception, log it, or return an appropriate error response
            return response(['message' => 'Error resending verification.'], 500);
        }
    }
}
