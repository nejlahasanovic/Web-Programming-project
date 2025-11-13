<?php

/**
 * @OA\Get(
 *     path="/users",
 *     tags={"Users"},
 *     summary="Get all users",
 *     @OA\Response(
 *         response=200,
 *         description="Returns all users (without passwords)."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /users', function() {
    Flight::json(Flight::userService()->getAll());
});

/**
 * @OA\Get(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Get a user by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User found."
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found."
 *     )
 * )
 */
Flight::route('GET /users/@id', function($id) {
    Flight::json(Flight::userService()->getById($id));
});

/**
 * @OA\Get(
 *     path="/users/email/{email}",
 *     tags={"Users"},
 *     summary="Get user by email address",
 *     @OA\Parameter(
 *         name="email",
 *         in="path",
 *         required=true,
 *         description="User email",
 *         @OA\Schema(type="string", example="nejla@90minut.com")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User found."
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found."
 *     )
 * )
 */
Flight::route('GET /users/email/@email', function($email){
    Flight::json(Flight::userService()->getByEmail($email));
});

/**
 * @OA\Get(
 *     path="/users/username/{username}",
 *     tags={"Users"},
 *     summary="Get user by username",
 *     @OA\Parameter(
 *         name="username",
 *         in="path",
 *         required=true,
 *         description="Username",
 *         @OA\Schema(type="string", example="nejla90")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User found."
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found."
 *     )
 * )
 */
Flight::route('GET /users/username/@username', function($username){
    Flight::json(Flight::userService()->getByUsername($username));
});

/**
 * @OA\Get(
 *     path="/users/role/{role}",
 *     tags={"Users"},
 *     summary="Get all users by role",
 *     @OA\Parameter(
 *         name="role",
 *         in="path",
 *         required=true,
 *         description="User role (user, editor, admin)",
 *         @OA\Schema(type="string", example="editor")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of users by role."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid role value."
 *     )
 * )
 */
Flight::route('GET /users/role/@role', function($role){
    Flight::json(Flight::userService()->getByRole($role));
});

/**
 * @OA\Post(
 *     path="/users",
 *     tags={"Users"},
 *     summary="Create a new user",
 *     description="Username must be at least 7 characters. Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"username","email","password_hash"},
 *             @OA\Property(property="username", type="string", example="nejla90"),
 *             @OA\Property(property="email", type="string", example="nejla@90minut.com"),
 *             @OA\Property(property="password_hash", type="string", example="StrongPass@123"),
 *             @OA\Property(property="role", type="string", example="user")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User created successfully."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Validation failed (invalid username, email or password)."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /users', function(){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::userService()->createUser($data));
});

/**
 * @OA\Put(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Update an existing user",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID to update",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="username", type="string", example="updatedUser"),
 *             @OA\Property(property="email", type="string", example="updated@90minut.com"),
 *             @OA\Property(property="role", type="string", example="editor")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User updated successfully."
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Validation failed (invalid role or email)."
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found."
 *     )
 * )
 */
Flight::route('PUT /users/@id', function($id){
    $data = Flight::request()->data->getData();
    Flight::json(Flight::userService()->updateUser($id, $data));
});

/**
 * @OA\Delete(
 *     path="/users/{id}",
 *     tags={"Users"},
 *     summary="Delete a user by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully."
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('DELETE /users/@id', function($id){
    Flight::json(Flight::userService()->deleteUser($id));
});

?>
