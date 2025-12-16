<?php

/**
 * @OA\Get(
 *     path="/leagues",
 *     tags={"Leagues"},
 *     summary="Get all leagues",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all leagues in the database"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /leagues', function() {
    Flight::json(Flight::leagueService()->getAll());
});

/**
 * @OA\Get(
 *     path="/leagues/{id}",
 *     tags={"Leagues"},
 *     summary="Get league by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="League ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="League found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /leagues/@id', function($id) {
    Flight::json(Flight::leagueService()->getById($id));
});

/**
 * @OA\Post(
 *     path="/leagues",
 *     tags={"Leagues"},
 *     summary="Create a new league",
 *     security={{"ApiKey": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="league_name", type="string", example="Premier League"),
 *             @OA\Property(property="country", type="string", example="England")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="League created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /leagues', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::leagueService()->createLeague($data));
});

/**
 * @OA\Get(
 *     path="/leagues/country/{country}",
 *     tags={"Leagues"},
 *     summary="Get leagues by country",
 *     @OA\Parameter(
 *         name="country",
 *         in="path",
 *         required=true,
 *         description="Country name",
 *         @OA\Schema(type="string", example="England")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Leagues found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /leagues/country/@country', function($country) {
    Flight::json(Flight::leagueService()->getLeaguesByCountry($country));
});

/**
 * @OA\Get(
 *     path="/leagues/{id}/teams-count",
 *     tags={"Leagues"},
 *     summary="Get league with teams count",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="League ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="League with teams count"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /leagues/@id/teams-count', function($id) {
    Flight::json(Flight::leagueService()->getLeagueWithTeamsCount($id));
});
?>