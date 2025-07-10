<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\VerificationEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Repositories\RoleRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // Define a constant for the name of the authentication token
    const AUTH_TOKEN_NAME = 'user_auth_token';

    private $userRepository;
    private $roleRepository;

    /**
     * Constructor for the class.
     *
     * @param UserRepositoryInterface $userRepository description
     * @param RoleRepositoryInterface $roleRepository description
     */
    public function __construct(
        UserRepositoryInterface $userRepository,
        RoleRepositoryInterface $roleRepository
    ) {
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
    }

    /**
     * Register a new user.
     *
     * @param RegisterUserRequest $request the request object containing the user data
     *
     * @throws Some_Exception_Class description of exception
     *
     * @return \Illuminate\Http\Response the HTTP response containing the user data and token
     */
    public function register(RegisterUserRequest $request)
    {
        try {
            // Validate the request
            $fields = $request->all();

            // Start a database transaction
            DB::beginTransaction();

            // Create a new user
            $user = $this->userRepository->create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
            ]);

            // Get the default role (Regular User)
            $role = $this->roleRepository->findByName('Regular User');
            
            if ($role) {
                // Attach the role to the user
                $user->roles()->attach($role->id);
            }

            // Commit the database transaction
            DB::commit();

            // Create a token for authentication
            $token = $user->createToken(self::AUTH_TOKEN_NAME)->plainTextToken;

            // Build the response
            $response = [
                'user' => new UserResource($user),
                'token' => $token
            ];

            // Return the response with a status code of 201 (Created)
            return response($response, 201);
        } catch (\Exception $e) {
            // Rollback the transaction
            DB::rollBack();
            
            // Handle the exception, log it, or return an appropriate error response
            return response(['message' => 'Error creating user. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Logs in a user.
     *
     * @param LoginUserRequest $request The login user request.
     * @throws None
     * @return Response The response containing the user and token.
     */
    public function login(LoginUserRequest $request)
    {
        try {
            // Validate the request fields
            $fields = $request->all();

            // Set the invalid message
            $invalidMessage = 'Invalid email or password. Please try again.';

            // Check if the email and password fields are present
            if (!Arr::has($fields, 'email') || !Arr::has($fields, 'password')) {
                // Return a response with an error message if the email or password is missing
                return response([
                    'message' => $invalidMessage
                ], 401);
            }

            // Check if the user exists based on the email
            $user = $this->userRepository->findByEmail($fields['email']);

            // Check if the user is found and if the password is correct
            if (!$user || !Hash::check($fields['password'], $user->password)) {
                // Return a response with an error message if the email or password is invalid
                return response([
                    'message' => $invalidMessage
                ], 401);
            }

            // Create a token for the authenticated user
            $token = $user->createToken(self::AUTH_TOKEN_NAME)->plainTextToken;

            // Prepare the response with the user and token
            $response = [
                'user' => new UserResource($user),
                'token' => $token
            ];

            // Return the response with a status code of 201 (Created)
            return response($response, 201);
        } catch (\Exception $e) {
            // Handle the exception, log it, or return an appropriate error response
            return response(['message' => 'Error logging in user.'], 500);
        }
    }

    /**
     * Logs out the user.
     *
     * @param Request $request The request object.
     * @throws None
     * @return \Illuminate\Http\Response The HTTP response containing a message.
     */
    public function logout(Request $request)
    {
        try {
            // Delete the current token
            $request->user()->currentAccessToken()->delete();

            // Return a 204 No Content response
            return response()->json([], 204);
        } catch (\Exception $e) {
            // Handle the exception, log it, or return an appropriate error response
            return response(['message' => 'Error logging out user.'], 500);
        }
    }
}
