<?php

/**
 * @OA\Get(
 *     path="/teams",
 *     tags={"Teams"},
 *     summary="Get all teams",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all teams in the database"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /teams', function() {
    Flight::json(Flight::teamService()->getAll());
});

/**
 * @OA\Get(
 *     path="/teams/{id}",
 *     tags={"Teams"},
 *     summary="Get team by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Team ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Team found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /teams/@id', function($id) {
    Flight::json(Flight::teamService()->getById($id));
});

/**
 * @OA\Post(
 *     path="/teams",
 *     tags={"Teams"},
 *     summary="Create a new team",
 *     security={{"ApiKey": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="team_name", type="string", example="Manchester United"),
 *             @OA\Property(property="league_id", type="integer", example=1),
 *             @OA\Property(property="founded_year", type="integer", example=1878)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Team created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /teams', function() {
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::teamService()->createTeam($data));
});

/**
 * @OA\Get(
 *     path="/teams/league/{league_id}",
 *     tags={"Teams"},
 *     summary="Get teams by league",
 *     @OA\Parameter(
 *         name="league_id",
 *         in="path",
 *         required=true,
 *         description="League ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Teams found"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /teams/league/@league_id', function($league_id) {
    Flight::json(Flight::teamService()->getByLeagueId($league_id));
});

/**
 * @OA\Get(
 *     path="/teams/search/{keyword}",
 *     tags={"Teams"},
 *     summary="Search teams by keyword",
 *     @OA\Parameter(
 *         name="keyword",
 *         in="path",
 *         required=true,
 *         description="Search keyword",
 *         @OA\Schema(type="string", example="United")
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
Flight::route('GET /teams/search/@keyword', function($keyword) {
    Flight::json(Flight::teamService()->searchTeams($keyword));
});
?>
