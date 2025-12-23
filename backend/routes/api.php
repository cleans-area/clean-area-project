<?php

use App\Http\Controllers\Api\Admin\ServiceAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Public\ServicePublicController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Public
Route::get('/services', [ServicePublicController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


// Admin Services
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('services', ServiceAdminController::class);
});
