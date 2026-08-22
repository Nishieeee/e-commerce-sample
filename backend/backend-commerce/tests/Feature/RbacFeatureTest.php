<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RbacFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_customer_cannot_access_admin_route()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $customer->createToken('auth')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_route()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('auth')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Admin dashboard']);
    }
}
