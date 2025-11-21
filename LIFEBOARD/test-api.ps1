# Test LifeBoard API

Write-Host "Testing LifeBoard API..." -ForegroundColor Cyan

# Test 1: Check if API is running
Write-Host "`n1. Testing API health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing
    Write-Host "✓ API is running: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "✗ API is not responding: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 2: Try to register a user
Write-Host "`n2. Testing user registration..." -ForegroundColor Yellow
$registerData = @{
    email = "test@example.com"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/auth/register" `
        -Method POST `
        -Body $registerData `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    $errorResponse = $_.ErrorDetails.Message
    Write-Host "✗ Registration failed: $errorResponse" -ForegroundColor Red
    
    # If user already exists, try login
    if ($errorResponse -like "*already exists*") {
        Write-Host "`n3. User exists, testing login..." -ForegroundColor Yellow
        
        $loginData = @{
            email = "test@example.com"
            password = "password123"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/auth/login" `
                -Method POST `
                -Body $loginData `
                -ContentType "application/json" `
                -UseBasicParsing
            
            Write-Host "✓ Login successful!" -ForegroundColor Green
            Write-Host "Response: $($response.Content)" -ForegroundColor Gray
        } catch {
            Write-Host "✗ Login failed: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`nTest complete!" -ForegroundColor Cyan
