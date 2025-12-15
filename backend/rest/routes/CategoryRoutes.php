<?php

/**
 * @OA\Get(
 *     path="/categories",
 *     tags={"Categories"},
 *     summary="Get all categories",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all categories in the database"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /categories', function(){
    Flight::json(Flight::categoryService()->getAll());
});

/**
 * @OA\Get(
 *     path="/categories/{id}",
 *     tags={"Categories"},
 *     summary="Get category by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Category ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /categories/@id', function($id){
    Flight::json(Flight::categoryService()->getById($id));
});

/**
 * @OA\Post(
 *     path="/categories",
 *     tags={"Categories"},
 *     summary="Create a new category",
 *     security={{"ApiKey": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="category_name", type="string", example="Transfer News")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /categories', function(){
    
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::categoryService()->createCategory($data));
});

/**
 * @OA\Get(
 *     path="/categories/with-count",
 *     tags={"Categories"},
 *     summary="Get all categories with article count",
 *     @OA\Response(
 *         response=200,
 *         description="Categories with article count"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /categories/with-count', function(){
    Flight::json(Flight::categoryService()->getAllCategoriesWithCount());
});

/**
 * @OA\Get(
 *     path="/categories/{id}/with-count",
 *     tags={"Categories"},
 *     summary="Get category with article count",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Category ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Category with article count"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /categories/@id/with-count', function($id){
    Flight::json(Flight::categoryService()->getCategoryWithArticlesCount($id));
});
?>