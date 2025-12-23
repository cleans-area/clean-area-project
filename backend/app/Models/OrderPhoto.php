<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/OrderPhoto.php
class OrderPhoto extends Model
{
    protected $fillable = [
        'order_id',
        'photo_path',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
