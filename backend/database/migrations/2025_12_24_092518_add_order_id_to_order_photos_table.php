<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('order_photos', function (Blueprint $table) {
            if (!Schema::hasColumn('order_photos', 'order_id')) {
                $table->foreignId('order_id')
                    ->constrained('orders')
                    ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_photos', function (Blueprint $table) {
            if (Schema::hasColumn('order_photos', 'order_id')) {
                $table->dropForeign(['order_id']);
                $table->dropColumn('order_id');
            }
        });
    }
};
