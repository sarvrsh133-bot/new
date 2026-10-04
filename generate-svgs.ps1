$paths = @(
    "C:\Users\SARWESH\.gemini\antigravity\scratch\best-friend-gift\assets\images",
    "C:\Users\SARWESH\.gemini\antigravity\brain\f4e93a3e-4f4d-4a18-83e0-c4c46af31944\scratch\best-friend-gift\assets\images"
)

$svgs = @{
    'story-1.svg' = @{ title = 'The First Hello'; subtitle = 'Where it all began'; icon = [char]::ConvertFromUtf32(0x2728); c1 = '#8B5CF6'; c2 = '#EC4899' }
    'story-2.svg' = @{ title = 'First Deep Chat'; subtitle = '3 hours felt like 3 minutes'; icon = [char]::ConvertFromUtf32(0x2615); c1 = '#6366F1'; c2 = '#A855F7' }
    'story-3.svg' = @{ title = 'Unstoppable Laughs'; subtitle = 'Stomach aching comedy'; icon = [char]::ConvertFromUtf32(0x1F602); c1 = '#F59E0B'; c2 = '#EC4899' }
    'story-4.svg' = @{ title = 'Chosen Family'; subtitle = 'Safe haven forever'; icon = [char]::ConvertFromUtf32(0x1FAC2); c1 = '#3B82F6'; c2 = '#8B5CF6' }
    'story-5.svg' = @{ title = 'Golden Sunset Days'; subtitle = 'Pure peace & memories'; icon = [char]::ConvertFromUtf32(0x1F305); c1 = '#F43F5E'; c2 = '#FB923C' }
    'story-6.svg' = @{ title = 'To Infinite Chapters'; subtitle = 'Always by your side'; icon = [char]::ConvertFromUtf32(0x1F942); c1 = '#A855F7'; c2 = '#EC4899' }
    'memory-1.svg' = @{ title = 'Completely Normal'; subtitle = 'Exhibit A: Goofy smiles'; icon = [char]::ConvertFromUtf32(0x1F4F8); c1 = '#7C3AED'; c2 = '#DB2777' }
    'memory-2.svg' = @{ title = 'Questionable Idea'; subtitle = '11:42 PM mischief'; icon = [char]::ConvertFromUtf32(0x1F319); c1 = '#4F46E5'; c2 = '#9333EA' }
    'memory-3.svg' = @{ title = 'Single Brain Cell'; subtitle = 'Pure unfiltered chaos'; icon = [char]::ConvertFromUtf32(0x26A1); c1 = '#D97706'; c2 = '#DC2626' }
    'memory-4.svg' = @{ title = 'Best Afternoon'; subtitle = 'Sunlight, snacks & stories'; icon = [char]::ConvertFromUtf32(0x1F338); c1 = '#E11D48'; c2 = '#F472B6' }
    'memory-5.svg' = @{ title = 'This Moment >>>'; subtitle = 'Happiness bottled up'; icon = [char]::ConvertFromUtf32(0x1F4AB); c1 = '#6366F1'; c2 = '#06B6D4' }
    'memory-6.svg' = @{ title = 'Core Memory'; subtitle = 'Saved forever in heart'; icon = [char]::ConvertFromUtf32(0x1F512); c1 = '#9333EA'; c2 = '#F43F5E' }
    'spotlight.svg' = @{ title = 'Forever Best Friends'; subtitle = 'Unlimited storage for our memories'; icon = [char]::ConvertFromUtf32(0x1F496); c1 = '#6366F1'; c2 = '#EC4899' }
}

foreach ($targetDir in $paths) {
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }
    foreach ($name in $svgs.Keys) {
        $info = $svgs[$name]
        $t = $info.title
        $s = $info.subtitle
        $ico = $info.icon
        $c1 = $info.c1
        $c2 = $info.c2
        
        $content = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="$c1" stop-opacity="0.9" />
      <stop offset="100%" stop-color="$c2" stop-opacity="0.85" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>
  
  <rect width="600" height="450" fill="url(#grad)" rx="24" />
  <circle cx="300" cy="225" r="200" fill="url(#glow)" />
  
  <g fill="#ffffff" opacity="0.4">
    <circle cx="80" cy="60" r="2.5" />
    <circle cx="520" cy="80" r="3" />
    <circle cx="540" cy="380" r="2" />
    <circle cx="70" cy="390" r="2.5" />
    <circle cx="460" cy="220" r="1.5" />
    <circle cx="120" cy="250" r="2" />
  </g>
  
  <rect x="50" y="40" width="500" height="370" rx="18" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.25" filter="url(#drop)" />
  
  <circle cx="300" cy="180" r="64" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
  <text x="300" y="198" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="52" text-anchor="middle">$ico</text>
  
  <text x="300" y="285" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="26" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">$t</text>
  <text x="300" y="325" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="400" fill="#f1f5f9" fill-opacity="0.9" text-anchor="middle">$s</text>
  
  <rect x="250" y="350" width="100" height="26" rx="13" fill="#ffffff" fill-opacity="0.15" />
  <text x="300" y="367" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="1">BESTIE MEMORY</text>
</svg>
"@
        Set-Content -Path (Join-Path $targetDir $name) -Value $content -Encoding UTF8
    }
}
Write-Output "Generated all SVGs in all project locations!"
