<?php

/**
 * @OA\Info(
 *   title="API",
 *   description="90minut Football portal news API",
 *   version="1.0",
 *   @OA\Contact(
 *     email="nejlahasanovicdev@gmail.com",
 *     name="Nejla Hasanovic"
 *   )
 * ),
 * @OA\Server(
 *     url=LOCALSERVER,
 *     description="API server"
 * ),
 * @OA\Server(
 *     url=PRODSERVER,
 *     description="API server"
 * ),
 * @OA\SecurityScheme(
 *     securityScheme="ApiKey",
 *     type="apiKey",
 *     in="header",
 *     name="Authentication"
 * )
 */