# Best Friend Gift Website Local HTTP Server
$port = 8080
$dir = $PSScriptRoot
if (-not $dir) { $dir = (Get-Item .).FullName }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Magenta
    Write-Host "  To My Favorite Human - Gift Website is LIVE! " -ForegroundColor Cyan
    Write-Host "  Address: http://localhost:$port/ " -ForegroundColor Yellow
    Write-Host "  (All browser tracking & CORS restrictions are bypassed)" -ForegroundColor Green
    Write-Host "  Press Ctrl+C in this window anytime to close." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Magenta
    Write-Host ""
    
    Start-Process "http://localhost:$port/"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath.TrimStart('/')
        if (-not $localPath) { $localPath = 'index.html' }
        $filePath = Join-Path $dir $localPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.svg'  { 'image/svg+xml' }
                '.mp3'  { 'audio/mpeg' }
                '.m4a'  { 'audio/mp4' }
                '.json' { 'application/json' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                default { 'application/octet-stream' }
            }
            
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped or encountered note: $_" -ForegroundColor Yellow
} finally {
    if ($listener -and $listener.IsListening) { $listener.Stop() }
}
