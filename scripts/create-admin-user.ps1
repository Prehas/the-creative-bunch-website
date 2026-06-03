$ErrorActionPreference = "Stop"

$adminEmail = $env:ADMIN_EMAIL
$adminPassword = $env:ADMIN_PASSWORD
$supabaseUrl = $env:SUPABASE_URL
$serviceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $adminEmail) { $adminEmail = "raduniculescu22@gmail.com" }
if (-not $adminPassword) { throw "Set ADMIN_PASSWORD in this PowerShell session before running this script." }
if (-not $supabaseUrl) { throw "Set SUPABASE_URL in this PowerShell session before running this script." }
if (-not $serviceRoleKey) { throw "Set SUPABASE_SERVICE_ROLE_KEY in this PowerShell session before running this script." }

$body = @{
    email = $adminEmail
    password = $adminPassword
    email_confirm = $true
    user_metadata = @{
        role = "admin"
        source = "codex-local-script"
    }
} | ConvertTo-Json -Depth 4

$headers = @{
    apikey = $serviceRoleKey
    Authorization = "Bearer $serviceRoleKey"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Method Post -Uri "$supabaseUrl/auth/v1/admin/users" -Headers $headers -Body $body
Write-Host "Admin user ready: $($response.email)"
