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
 * @OA\Post(
 *     path="/comments",
 *     tags={"Comments"},
 *     summary="Create a new comment",
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
    $data = Flight::request()->data->getData();
    Flight::json(Flight::commentService()->createComment($data));
});

/**
 * @OA\Delete(
 *     path="/comments/{id}",
 *     tags={"Comments"},
 *     summary="Delete a comment by ID",
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
    $data = Flight::request()->data->getData();
    Flight::json(Flight::commentService()->deleteComment($id, $data));
});
?>