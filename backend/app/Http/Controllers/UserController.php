<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Display a listing of users with pagination and filtering
     */
    public function index(Request $request)
    {
        try {
            // Extract filters from request
            $filters = [
                'search' => $request->input('search'),
                'role' => $request->input('role'),
                'sort_by' => $request->input('sort_by', 'created_at'),
                'sort_order' => $request->input('sort_order', 'desc'),
            ];

            // Retrieve the per_page parameter from the request
            $perPage = $request->input('per_page', 15);

            // Retrieve the users from the repository
            $users = $this->userRepository->getPaginated($filters, $perPage);

            // Return a collection of user resources
            return UserResource::collection($users);
        } catch (\Exception $e) {
            // Something went wrong
            Log::error("Error during user list fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch users'], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        try {
            $user->load('roles');
            
            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error("Error during user fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch user'], 500);
        }
    }

    /**
     * Get users for assignment dropdown (simplified version for resource assignment)
     */
    public function getUsersForAssignment()
    {
        try {
            $users = $this->userRepository->getForAssignment();
            
            return response()->json([
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error("Error during users for assignment fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch users for assignment'], 500);
        }
    }
} 