<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_customer_cannot_access_admin_route()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $customer->createToken('auth')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->getJson('/api/admin');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_route()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('auth')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->getJson('/api/admin');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Admin dashboard']);
    }
}
