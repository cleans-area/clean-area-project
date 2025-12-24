<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\OrderPhoto;
use Illuminate\Support\Facades\Storage;

class OrderAdminController extends Controller
{
    public function index()
    {
        $orders = Order::with('service')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_address' => ['nullable', 'string', 'max:500'],
            'admin_note' => ['nullable', 'string', 'max:500'],

            // pembayaran (boleh isi dari awal)
            'price' => ['nullable', 'integer', 'min:0'],
            'amount_paid' => ['nullable', 'integer', 'min:0'],
            'payment_method' => ['nullable', 'string', 'max:30'],
        ]);

        $price = (int) ($data['price'] ?? 0);
        $amountPaid = (int) ($data['amount_paid'] ?? 0);
        $remaining = max($price - $amountPaid, 0);

        // status pembayaran otomatis sederhana
        $paymentStatus = 'unpaid';
        if ($amountPaid > 0 && $remaining > 0) $paymentStatus = 'dp';
        if ($price > 0 && $remaining === 0) $paymentStatus = 'paid';

        $order = Order::create([
            'ticket_code' => $this->generateTicketCode(),
            'service_id' => $data['service_id'],

            'customer_name' => $data['customer_name'],
            'customer_phone' => $data['customer_phone'],
            'customer_address' => $data['customer_address'] ?? null,

            'order_status' => 'pending',
            'payment_status' => $paymentStatus,

            'price' => $price,
            'amount_paid' => $amountPaid,
            'remaining_amount' => $remaining,
            'payment_method' => $data['payment_method'] ?? null,

            'admin_note' => $data['admin_note'] ?? null,
        ]);

        $order->load('service');

        return response()->json([
            'message' => 'Order berhasil dibuat',
            'data' => $order
        ], 201);
    }

    public function show(Order $order)
    {
        $order->load(['service']);
        return response()->json(['data' => $order]);
    }

    private function generateTicketCode(): string
    {
        // contoh: CA-7F3A92
        return 'CA-' . strtoupper(Str::random(6));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'order_status' => ['required', 'string'],
        ]);

        // kalau kamu pakai Enum PHP native, kita bisa validasi lebih strict nanti
        $order->update([
            'order_status' => $data['order_status'],
        ]);

        return response()->json([
            'message' => 'Status order berhasil diupdate',
            'data' => $order->load('service'),
        ]);
    }

    public function updatePayment(Request $request, Order $order)
    {
        $data = $request->validate([
            'price' => ['required', 'numeric', 'min:0'],
            'amount_paid' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string'],
        ]);

        $remaining = $data['price'] - $data['amount_paid'];

        $paymentStatus = $remaining <= 0 ? 'paid' : 'dp';

        $order->update([
            'price' => $data['price'],
            'amount_paid' => $data['amount_paid'],
            'remaining_amount' => max(0, $remaining),
            'payment_status' => $paymentStatus,
            'payment_method' => $data['payment_method'],
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil diupdate',
            'data' => $order->load('service'),
        ]);
    }


    public function uploadPhoto(Request $request, Order $order)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        $path = $request->file('photo')->store('orders', 'public');

        $photo = $order->photos()->create([
            'photo_path' => $path,
        ]);

        return response()->json([
            'message' => 'Foto berhasil diupload',
            'data' => $photo,
        ], 201);
    }
}
