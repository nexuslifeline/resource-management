<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResetPasswordPostRequest;
use App\Http\Requests\SendResetLinkPostRequest;
use App\Jobs\SendPasswordResetEmail;
use App\Repositories\UserRepositoryInterface;
use App\Utils\ErrorMessages;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function __construct(private UserRepositoryInterface $userRepository)
    {
    }
    public function sendResetLinkEmail(SendResetLinkPostRequest $request)
    {
        try {
            $user = $this->userRepository->findByEmail($request->email);

            // Check if the user exists
            if (!$user) {
                return response()->json(['error' => 'User not found.'], 422);
            }

            // Send the password reset link
            $status = Password::sendResetLink(
                $request->only('email'),
                function ($user, $token) {
                    // Queue the job for sending the email with the reset token
                    dispatch(new SendPasswordResetEmail($user, $token));
                }
            );

            if ($status !== Password::RESET_LINK_SENT) {
                return response()->json(['error' => "Cannot send reset link."], 422);;
            }

            return response()->json(['message' => "Reset link has been sent to your email."]);
        } catch (\Exception $e) {
            // Something went wrong
            Log::error(
                "Error during sending of reset link. " . $e->getMessage(),
                ['request' => $request->all(), 'user_id' => optional($request->user)->id]
            );
            return response()->json(
                ['error' => ErrorMessages::SOMETHING_WENT_WRONG . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function resetPassword(ResetPasswordPostRequest $request)
    {

        try {
            $user = $this->userRepository->findByEmail($request->email);

            if (!$user) {
                return response()->json(['error' => 'User not found.'], 422);
            }

            // Check if the token is valid
            if (!Password::tokenExists($user, $request->token)) {
                return response()->json(['error' => 'Invalid token'], 422);
            }

            // Continue with password reset logic
            $response = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));
                    $user->save();
                }
            );

            if ($response !== Password::PASSWORD_RESET) {
                return response()->json(['error' => "Cannot reset password."], 422);
            }

            return response()->json(['message' => "Password has been reset."]);
        } catch (\Exception $e) {
            // Something went wrong
            Log::error(
                "Error during password reset. " . $e->getMessage(),
                ['request' => $request->all(), 'user_id' => optional($user)->id]
            );
            return response()->json(
                ['error' => ErrorMessages::SOMETHING_WENT_WRONG . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
