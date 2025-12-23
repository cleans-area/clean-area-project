<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/Order.php
class Order extends Model
{
    protected $fillable = [
        'ticket_code',
        'service_id',
        'customer_name',
        'customer_phone',
        'customer_address',
        'order_status',
        'payment_status',
        'price',
        'amount_paid',
        'remaining_amount',
        'payment_method',
        'admin_note',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function photos()
    {
        return $this->hasMany(OrderPhoto::class);
    }
}
