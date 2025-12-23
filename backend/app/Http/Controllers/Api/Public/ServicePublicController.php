<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServicePublicController extends Controller
{
    public function index()
    {
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('id', 'asc')
            ->get(['id', 'name', 'description', 'price']);

        return response()->json([
            'data' => $services
        ]);
    }
}
