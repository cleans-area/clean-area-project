<?php

use App\Http\Controllers\Api\Admin\OrderAdminController;
use App\Http\Controllers\Api\Admin\ServiceAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Public\OrderPublicController;
use App\Http\Controllers\Api\Public\ServicePublicController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Public
Route::get('/services', [ServicePublicController::class, 'index']);

// Public List Ticket
Route::get('/orders/public', [OrderPublicController::class, 'index']);
Route::get('/orders/track/{ticket_code}', [OrderPublicController::class, 'track']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


// Admin Services
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('services', ServiceAdminController::class);
    Route::get('/orders', [OrderAdminController::class, 'index']);
    Route::post('/orders', [OrderAdminController::class, 'store']);
    Route::get('/orders/{order}', [OrderAdminController::class, 'show']);
    Route::patch('/orders/{order}/status', [OrderAdminController::class, 'updateStatus']);
    Route::patch('/orders/{order}/payment', [OrderAdminController::class, 'updatePayment']);
    Route::post('/orders/{order}/photos', [OrderAdminController::class, 'uploadPhoto']);
});
