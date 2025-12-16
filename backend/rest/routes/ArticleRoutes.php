<?php
/**
 * @OA\Get(
 *     path="/articles/with-comments",
 *     tags={"Articles"},
 *     summary="Get all articles with comment count",
 *     @OA\Response(
 *         response=200,
 *         description="List of articles with comment counts"
 *     )
 * )
 */
Flight::route('GET /articles/with-comments', function(){
    Flight::json(Flight::articleService()->getArticlesWithCommentCount());
});
/**
 * @OA\Get(
 *     path="/articles",
 *     tags={"Articles"},
 *     summary="Get all articles",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all articles in the database"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles', function(){
    Flight::json(Flight::articleService()->getAll());
});

/**
 * @OA\Get(
 *     path="/articles/{id}",
 *     tags={"Articles"},
 *     summary="Get article by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Article ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Article found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/@id', function($id){
    Flight::json(Flight::articleService()->getById($id));
});

/**
 * @OA\Get(
 *     path="/articles/author/{author_id}",
 *     tags={"Articles"},
 *     summary="Get articles by author",
 *     @OA\Parameter(
 *         name="author_id",
 *         in="path",
 *         required=true,
 *         description="Author ID",
 *         @OA\Schema(type="integer", example=2)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Articles found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/author/@author_id', function($author_id){
    Flight::json(Flight::articleService()->getByAuthorId($author_id));
});

/**
 * @OA\Get(
 *     path="/articles/category/{category_id}",
 *     tags={"Articles"},
 *     summary="Get articles by category",
 *     @OA\Parameter(
 *         name="category_id",
 *         in="path",
 *         required=true,
 *         description="Category ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Articles found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/category/@category_id', function($category_id){
    Flight::json(Flight::articleService()->getByCategoryId($category_id));
});

/**
 * @OA\Get(
 *     path="/articles/league/{league_id}",
 *     tags={"Articles"},
 *     summary="Get articles by league",
 *     @OA\Parameter(
 *         name="league_id",
 *         in="path",
 *         required=true,
 *         description="League ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Articles found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/league/@league_id', function($league_id){
    Flight::json(Flight::articleService()->getByLeagueId($league_id));
});

/**
 * @OA\Get(
 *     path="/articles/latest/{limit}",
 *     tags={"Articles"},
 *     @OA\Parameter(
 *         name="limit",
 *         in="path",
 *         required=true,
 *         description="Number of articles to return",
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Latest articles"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/latest/@limit', function($limit){
    Flight::json(Flight::articleService()->getLatestArticles($limit));
});

/**
 * @OA\Get(
 *     path="/articles/search/{keyword}",
 *     tags={"Articles"},
 *     summary="Search articles by keyword",
 *     @OA\Parameter(
 *         name="keyword",
 *         in="path",
 *         required=true,
 *         description="Search keyword",
 *         @OA\Schema(type="string", example="Manchester")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Search results"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /articles/search/@keyword', function($keyword){
    Flight::json(Flight::articleService()->searchArticles($keyword));
});

/**
 * @OA\Post(
 *     path="/articles",
 *     tags={"Articles"},
 *     summary="Create a new article",
 *     security={{"ApiKey": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Match Report"),
 *             @OA\Property(property="content", type="string", example="Article content here..."),
 *             @OA\Property(property="author_id", type="integer", example=2),
 *             @OA\Property(property="category_id", type="integer", example=1),
 *             @OA\Property(property="league_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Article created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /articles', function(){

    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::EDITOR]);

    $data = Flight::request()->data->getData();
    Flight::json(Flight::articleService()->createArticle($data));
});

/**
 * @OA\Put(
 *     path="/articles/{id}",
 *     tags={"Articles"},
 *     summary="Update an article by ID",
 *     security={{"ApiKey": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Article ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Updated Title"),
 *             @OA\Property(property="content", type="string", example="Updated content..."),
 *             @OA\Property(property="category_id", type="integer", example=2)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Article updated successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('PUT /articles/@id', function($id){

    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::EDITOR]);

    $data = Flight::request()->data->getData();
    Flight::json(Flight::articleService()->updateArticle($id, $data));
});

/**
 * @OA\Patch(
 *     path="/articles/{id}",
 *     tags={"Articles"},
 *     summary="Update an article by ID",
 *     security={{"ApiKey": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Article ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Updated Title"),
 *             @OA\Property(property="content", type="string", example="Updated content...")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Article updated successfully."
 *     )
 * )
 */
Flight::route('PATCH /articles/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::ADMIN, Roles::EDITOR]);
    
    $data = Flight::request()->data->getData();
    Flight::json(Flight::articleService()->updateArticle($id, $data));
});

/**
 * @OA\Delete(
 *     path="/articles/{id}",
 *     tags={"Articles"},
 *     summary="Delete an article by ID",
 *     security={{"ApiKey": {}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Article ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Article deleted successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('DELETE /articles/@id', function($id){

    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);

    Flight::json(Flight::articleService()->deleteArticle($id));
});
?>
