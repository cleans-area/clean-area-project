<?php

// app/Enums/OrderStatus.php
namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PROSES = 'proses';
    case SELESAI = 'selesai';
}
