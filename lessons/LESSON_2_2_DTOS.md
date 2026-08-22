# Lesson 2.2: Data Transfer Objects (DTOs)

In the last lesson, you experienced a very common pain point in PHP: **Array Blindness**.

When you pass an array into a service (`public function register(array $data)`), your IDE has absolutely no idea what is inside that array. Does it have an `email` key? A `password` key? Is the phone number an integer or a string? 

If another developer uses your `AuthService` six months from now, they will have to trace the code all the way back to the controller just to figure out what data the service needs. This is a massive source of bugs in enterprise software.

**The Solution:** Data Transfer Objects (DTOs).

---

## What is a DTO?

A DTO is a simple, plain PHP class whose only job is to hold data. It doesn't query the database. It doesn't send emails. It just holds strongly-typed variables.

By using PHP 8.2's `readonly class` feature, we can create incredibly clean DTOs.

### Example: The Array Way (Bad)
```php
public function updateProfile(array $data) {
    // I have no idea if $data['avatar_url'] exists...
    $user->update([
        'name' => $data['name'],
        'bio' => $data['bio'] ?? null,
    ]);
}
```

### Example: The DTO Way (Enterprise Standard)
First, we define the DTO:
```php
namespace App\DTOs;

readonly class UpdateProfileDTO 
{
    public function __construct(
        public string $name,
        public ?string $bio = null,
        public ?string $avatarUrl = null
    ) {}
}
```

Then, our Service requires the DTO instead of an array:
```php
public function updateProfile(UpdateProfileDTO $dto) {
    // Now, my IDE autocompletes $dto->name!
    // I know exactly what types I am working with.
    $user->update([
        'name' => $dto->name,
        'bio' => $dto->bio,
    ]);
}
```

And our Controller instantiates it:
```php
public function update(Request $request, ProfileService $service) {
    $validated = $request->validate([...]);
    
    $dto = new UpdateProfileDTO(
        name: $validated['name'],
        bio: $validated['bio'] ?? null,
        avatarUrl: $validated['avatar_url'] ?? null
    );
    
    $service->updateProfile($dto);
}
```

## Why do this?
1. **Type Safety:** If the controller forgets to pass the `name`, PHP will throw a fatal error immediately, rather than silently creating a broken database record.
2. **Autocompletion:** Your IDE will suggest properties when typing `$dto->`.
3. **Decoupling:** The Service no longer cares if the data came from an HTTP Request, an Artisan CLI command, or a Queued Job. As long as it receives the DTO, it knows exactly what to do.

---

## Your Assignment (Action Required)

We are going to refactor the registration flow one last time to use a DTO.

1. **Create the DTO Directory & File:**
   - Create a folder: `app/DTOs`
   - Create a file: `app/DTOs/RegisterUserDTO.php`

2. **Define the DTO:**
   - Make it a `readonly class RegisterUserDTO`.
   - Add a constructor with strongly typed properties for `name`, `email`, `password`, and an optional nullable `phone`.

3. **Update the Controller (`AuthController.php`):**
   - Inside the `register` method, after validating the request, instantiate your new `RegisterUserDTO`.
   - Pass the DTO into `$authService->register($dto);` instead of the array.

4. **Update the Service (`AuthService.php`):**
   - Change the method signature to: `public function register(RegisterUserDTO $dto)`
   - Update the `User::create(...)` logic to map the properties from the `$dto` into an array for Eloquent. (e.g., `'name' => $dto->name`).

Once you've made these changes, run your tests again:
`php artisan test --filter AuthFeatureTest`

If the tests pass, you have successfully built a bulletproof, enterprise-grade authentication pipeline. Let me know when you're done!
