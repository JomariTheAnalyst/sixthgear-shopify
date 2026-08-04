param(
  [string]$SourcePath = "public/images/logo/Sixthgear-newLogo.png",
  [string]$OutputDirectory = "public/images/favicon"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$resolvedSource = (Resolve-Path -LiteralPath $SourcePath).Path
$resolvedOutput = (Resolve-Path -LiteralPath $OutputDirectory).Path
$sourceImage = [System.Drawing.Image]::FromFile($resolvedSource)

function New-IconPngBytes {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Size
  )

  $bitmap = New-Object System.Drawing.Bitmap(
    $Size,
    $Size,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $bitmap.SetResolution(96, 96)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

  # A small safe area keeps the circular seal clear of browser tab clipping.
  $padding = [Math]::Max(1, [Math]::Round($Size * 0.04))
  $availableSize = $Size - ($padding * 2)
  $scale = [Math]::Min(
    $availableSize / $sourceImage.Width,
    $availableSize / $sourceImage.Height
  )
  $drawWidth = [Math]::Max(1, [Math]::Round($sourceImage.Width * $scale))
  $drawHeight = [Math]::Max(1, [Math]::Round($sourceImage.Height * $scale))
  $drawX = [Math]::Round(($Size - $drawWidth) / 2)
  $drawY = [Math]::Round(($Size - $drawHeight) / 2)

  $graphics.DrawImage(
    $sourceImage,
    (New-Object System.Drawing.Rectangle($drawX, $drawY, $drawWidth, $drawHeight))
  )

  $stream = New-Object System.IO.MemoryStream
  $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bytes = $stream.ToArray()

  $stream.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()

  return $bytes
}

function Write-Bytes {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FileName,
    [Parameter(Mandatory = $true)]
    [byte[]]$Bytes
  )

  [System.IO.File]::WriteAllBytes(
    (Join-Path $resolvedOutput $FileName),
    $Bytes
  )
}

$png16 = New-IconPngBytes -Size 16
$png32 = New-IconPngBytes -Size 32
$png48 = New-IconPngBytes -Size 48
$png180 = New-IconPngBytes -Size 180
$png192 = New-IconPngBytes -Size 192
$png512 = New-IconPngBytes -Size 512

Write-Bytes -FileName "favicon-16x16.png" -Bytes $png16
Write-Bytes -FileName "favicon-32x32.png" -Bytes $png32
Write-Bytes -FileName "apple-touch-icon.png" -Bytes $png180
Write-Bytes -FileName "android-chrome-192x192.png" -Bytes $png192
Write-Bytes -FileName "android-chrome-512x512.png" -Bytes $png512

$icoImages = @(
  [PSCustomObject]@{ Size = 16; Bytes = $png16 },
  [PSCustomObject]@{ Size = 32; Bytes = $png32 },
  [PSCustomObject]@{ Size = 48; Bytes = $png48 }
)
$icoStream = New-Object System.IO.MemoryStream
$icoWriter = New-Object System.IO.BinaryWriter($icoStream)
$icoWriter.Write([uint16]0)
$icoWriter.Write([uint16]1)
$icoWriter.Write([uint16]$icoImages.Count)

$imageOffset = 6 + (16 * $icoImages.Count)
foreach ($image in $icoImages) {
  $icoWriter.Write([byte]$image.Size)
  $icoWriter.Write([byte]$image.Size)
  $icoWriter.Write([byte]0)
  $icoWriter.Write([byte]0)
  $icoWriter.Write([uint16]1)
  $icoWriter.Write([uint16]32)
  $icoWriter.Write([uint32]$image.Bytes.Length)
  $icoWriter.Write([uint32]$imageOffset)
  $imageOffset += $image.Bytes.Length
}

foreach ($image in $icoImages) {
  $payload = [byte[]]$image.Bytes
  $icoWriter.Write($payload, 0, $payload.Length)
}

$icoWriter.Flush()
Write-Bytes -FileName "favicon.ico" -Bytes $icoStream.ToArray()
$icoWriter.Dispose()
$icoStream.Dispose()
$sourceImage.Dispose()

Write-Output "Generated favicon assets from $resolvedSource"
