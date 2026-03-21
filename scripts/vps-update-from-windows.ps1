#Requires -Version 5.1
<#
.SYNOPSIS
  Deploy / update web on VPS from Windows without CRLF breaking bash.
.DESCRIPTION
  PowerShell Get-Content -Raw keeps CRLF; piping that to "ssh ... bash -s" breaks Linux bash.
  This script normalizes the .sh to LF-only UTF-8 and pipes it to ssh.
.EXAMPLE
  .\scripts\vps-update-from-windows.ps1
  .\scripts\vps-update-from-windows.ps1 -HostName root@217.216.109.5
#>
param(
  [string] $HostName = 'root@217.216.109.5',
  [string] $ScriptName = 'vps-update-and-restart.sh'
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$shPath = Join-Path $here $ScriptName

if (-not (Test-Path -LiteralPath $shPath)) {
  throw "Not found: $shPath"
}

$text = [System.IO.File]::ReadAllText($shPath)
$unix = $text -replace "`r`n", "`n" -replace "`r", "`n"
if (-not $unix.EndsWith("`n")) {
  $unix += "`n"
}

$enc = New-Object System.Text.UTF8Encoding $false
$bytes = $enc.GetBytes($unix)

Write-Host "Piping $ScriptName (LF-only) -> ssh $HostName bash -s" -ForegroundColor Cyan

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'ssh'
# PS 5.1: use Arguments (ArgumentList is .NET 5+ only)
$psi.Arguments = "$($HostName.Trim()) bash -s"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $false

$p = [System.Diagnostics.Process]::Start($psi)
$p.StandardInput.BaseStream.Write($bytes, 0, $bytes.Length)
$p.StandardInput.Close()

$out = $p.StandardOutput.ReadToEnd()
$err = $p.StandardError.ReadToEnd()
$p.WaitForExit()

if ($out) { Write-Output $out }
if ($err) { Write-Output $err }
exit $p.ExitCode
