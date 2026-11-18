# Read-only pixel comparison of actual Chrome captures. No image is altered.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$reviewDir = Split-Path $PSScriptRoot -Parent
$currentDir = Join-Path $reviewDir 'evidence/cro03b'
$priorDir = Join-Path $reviewDir 'evidence/cro03a'
$receipt = Get-Content (Join-Path $currentDir 'matrix-verification.json') -Raw | ConvertFrom-Json
$comparisons = @()
foreach ($case in $receipt.cases) {
    foreach ($name in @($case.screenshot, $case.full)) {
        if (-not $name) { continue }
        $before = [System.Drawing.Bitmap]::new((Join-Path $priorDir $name))
        $after = [System.Drawing.Bitmap]::new((Join-Path $currentDir $name))
        try {
            $startRow = if ($case.width -le 760) { 0 } else { 96 }
            $equal = $before.Width -eq $after.Width -and $before.Height -eq $after.Height
            if ($equal) {
                $rect = [System.Drawing.Rectangle]::new(0, 0, $before.Width, $before.Height)
                $a = $before.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
                $b = $after.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
                try {
                    $size = $a.Stride * $before.Height
                    $bytesA = [byte[]]::new($size)
                    $bytesB = [byte[]]::new($size)
                    [Runtime.InteropServices.Marshal]::Copy($a.Scan0, $bytesA, 0, $size)
                    [Runtime.InteropServices.Marshal]::Copy($b.Scan0, $bytesB, 0, $size)
                    $offset = $startRow * $a.Stride
                    $equal = [Convert]::ToBase64String($bytesA, $offset, $size - $offset) -ceq [Convert]::ToBase64String($bytesB, $offset, $size - $offset)
                } finally {
                    $before.UnlockBits($a)
                    $after.UnlockBits($b)
                }
            }
            $comparisons += [ordered]@{capture=$name; width=$after.Width; height=$after.Height; firstComparedRow=$startRow; equalPixels=$equal}
        } finally {
            $before.Dispose()
            $after.Dispose()
        }
    }
}
$result = [ordered]@{method='Decoded 32-bit pixels; full image on mobile, rows 96 onward on desktop/tablet. Compared with approved CRO-03A captures.'; comparisons=$comparisons; failures=@($comparisons | Where-Object { -not $_.equalPixels })}
$result | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $currentDir 'pixel-verification.json') -Encoding utf8
Write-Output "Pixel comparisons: $($comparisons.Count); failures: $($result.failures.Count)"
if ($result.failures.Count) { exit 1 }
