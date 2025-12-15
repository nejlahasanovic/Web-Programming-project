<?php

/**
 * @OA\Get(
 *     path="/comments",
 *     tags={"Comments"},
 *     summary="Get all comments",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all comments in the database"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /comments', function() {
    Flight::json(Flight::commentService()->getAll());
});

/**
 * @OA\Get(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Get comment by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Comment ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /comments/@id', function($id) {
    Flight::json(Flight::commentService()->getById($id));
});
/**
 * @OA\Get(
 *     path="/comments/article/{article_id}",
 *     tags={"Comments"},
 *     summary="Get comments by article ID",
 *     @OA\Parameter(
 *         name="article_id",
 *         in="path",
 *         required=true,
 *         description="Article ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(response=200, description="Array of comments for the article")
 * )
 */
Flight::route('GET /comments/article/@article_id', function($article_id) {
    Flight::json(Flight::commentService()->getByArticleId($article_id));
});
/**
 * @OA\Post(
 *     path="/comments",
 *     tags={"Comments"},
 *     summary="Create a new comment",
 *     security={{"ApiKey": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="article_id", type="integer", example=1),
 *             @OA\Property(property="user_id", type="integer", example=3),
 *             @OA\Property(property="content", type="string", example="Great article!")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /comments', function() {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::EDITOR, Roles::ADMIN]);
    $data = Flight::request()->data->getData();
     $loggedUser = Flight::get('user');
    $data['user_id'] = $loggedUser->user_id;
    
    Flight::json(Flight::commentService()->createComment($data));
    
});

/**
 * @OA\Delete(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Delete a comment by ID",
 *     security={{"ApiKey": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Comment ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Comment deleted successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('DELETE /comments/@id', function($id) {
     Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::EDITOR, Roles::ADMIN]);
     Flight::json(
        Flight::commentService()->deleteComment($id, Flight::get('user'))
    );
});
?>