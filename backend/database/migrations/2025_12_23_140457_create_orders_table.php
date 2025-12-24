<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('ticket_code')->unique(); // ⬅️ INI WAJIB

            $table->foreignId('service_id')->constrained()->cascadeOnDelete();

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('customer_address')->nullable();

            $table->string('order_status')->default('pending');
            $table->string('payment_status')->default('unpaid');

            $table->integer('price')->default(0);
            $table->integer('amount_paid')->default(0);
            $table->integer('remaining_amount')->default(0);
            $table->string('payment_method')->nullable();

            $table->text('admin_note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
