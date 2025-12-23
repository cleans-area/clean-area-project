<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceAdminController extends Controller
{
    public function index()
    {
        $services = Service::query()
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['data' => $services]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $service = Service::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Layanan berhasil dibuat',
            'data' => $service
        ], 201);
    }

    public function show(Service $service)
    {
        return response()->json(['data' => $service]);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'price' => ['sometimes', 'required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $service->update($data);

        return response()->json([
            'message' => 'Layanan berhasil diupdate',
            'data' => $service
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'Layanan berhasil dihapus'
        ]);
    }
}
