<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// Tambahkan import ini:
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Masukkan kode Anda di sini:
        User::create([
            'name' => 'Admin Clean Area',
            'email' => 'admin@cleanarea.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }
}
