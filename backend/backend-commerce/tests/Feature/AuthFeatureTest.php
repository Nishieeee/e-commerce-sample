<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'phone' => '1234567890'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['access_token', 'user', 'message']);
                 
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'user']);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out successfully']);
                 
        $this->assertCount(0, $user->tokens);
    }

    public function test_registration_fails_if_email_already_exists() {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'phone' => '1234567890'
        ]);
        $response = $this->postJson('/api/register', [
            'email'=>$user->email,
        ]);

        $response->assertStatus(422);     
    }

    public function test_login_fails_with_incorrect_password() {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password'=> Hash::make('Password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'WrongPassword123'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                    'message'=>'Invalid credentials' 
                 ]);
    }

    public function test_cannot_access_protected_route_without_token() {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
