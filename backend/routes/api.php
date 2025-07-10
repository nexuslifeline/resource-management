<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\VerificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Forgot Password Routes
Route::post('/password/send-reset-link', [ResetPasswordController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [ResetPasswordController::class, 'resetPassword']);

// Account Verification Routes
Route::get('/email/verify/{token}', [VerificationController::class, 'verify'])
    ->where('token', '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$')
    ->name('verification.verify');

// Contact form (public)
Route::post('/contact', [ContactController::class, 'submit']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Account Verification Routes
    Route::get('/email/verify/resend', [VerificationController::class, 'resend'])->name('verification.resend');

    // Returns the currently authenticated user
    Route::get('/me', function (Request $request) {
        return $request->user()->load('roles');
    });
    
    // Logout the currently authenticated user
    Route::post('/logout', [AuthController::class, 'logout']);

    // Resource Management Routes
    Route::prefix('resources')->group(function () {
        Route::get('/', [ResourceController::class, 'index']);
        Route::post('/', [ResourceController::class, 'store']);
        Route::get('/{resource:uuid}', [ResourceController::class, 'show']);
        Route::put('/{resource:uuid}', [ResourceController::class, 'update']);
        Route::delete('/{resource:uuid}', [ResourceController::class, 'destroy']);
        Route::get('/dashboard/stats', [ResourceController::class, 'dashboard']);
        Route::get('/users/list', [ResourceController::class, 'getUsers']);
    });

    // Admin-only routes
    Route::group(['middleware' => ['role:Administrator']], function () {
        // Add admin-specific routes here
        Route::get('/admin/users', function () {
            return response()->json(['message' => 'Admin users endpoint']);
        });
    });
});
