<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPhoto extends Model
{
    protected $fillable = [
        'order_id',
        'photo_path',
    ];

    // ⬇️ PENTING
    protected $appends = ['url'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // ⬇️ PENTING
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->photo_path);
    }
}
