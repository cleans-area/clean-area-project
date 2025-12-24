<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderPublicController extends Controller
{
    public function index()
    {
        $orders = Order::with('service')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($o) {
                return [
                    'ticket_code' => $o->ticket_code,
                    'service' => $o->service?->name,
                    'order_status' => $o->order_status,
                    'payment_status' => $o->payment_status,
                    'admin_note' => $o->admin_note,
                    'created_at' => $o->created_at,
                ];
            });

        return response()->json(['data' => $orders]);
    }

    public function track(string $ticket_code)
    {
        $order = Order::with('service')
            ->where('ticket_code', $ticket_code)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'ticket_code' => $order->ticket_code,
                'service' => $order->service?->name,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'admin_note' => $order->admin_note,
                'created_at' => $order->created_at,
            ]
        ]);
    }
}
