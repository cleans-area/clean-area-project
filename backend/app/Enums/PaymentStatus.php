<?php

// app/Enums/PaymentStatus.php
namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'unpaid';
    case DP = 'dp';
    case PAID = 'paid';
}
