# scheduled_commit.ps1
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File "C:\path\to\scripts\scheduled_commit.ps1" -MessagePrefix "Scheduled" -CommitCount 5 -Branch main -RepoPath "C:\Users\DELL\OneDrive\Desktop\ai_market"

param(
    [string]$RepoPath = "C:\Users\DELL\OneDrive\Desktop\ai_market",
    [string]$Branch = "main",
    [int]$CommitCount = 5,
    [string]$MessagePrefix = "Scheduled commit",
    [string]$CommitDate = ""
)

Set-StrictMode -Version Latest

function Write-Log {
    param([string]$Message)
    $t = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Output "[$t] $Message"
}

# Validate repo path
if (-not (Test-Path $RepoPath)) {
    Write-Log "ERROR: Repo path not found: $RepoPath"
    exit 1
}

Push-Location -Path $RepoPath

try {
    # Ensure git is available
    git --version > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: Git not found in PATH"
        exit 1
    }

    # Ensure we are on the desired branch
    git fetch origin $Branch
    git checkout $Branch

    for ($i = 1; $i -le $CommitCount; $i++) {
        $message = "${MessagePrefix} #$i"

        if ($CommitDate -ne "") {
            # Use a specific commit date (ISO format expected)
            git commit --allow-empty --date="$CommitDate" -m "$message"
            Write-Log "Created empty commit with date $CommitDate: $message"
        } else {
            # Use current date/time
            git commit --allow-empty -m "$message"
            Write-Log "Created empty commit: $message"
        }
    }

    # Push commits
    git push origin $Branch
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Pushed $CommitCount commits to origin/$Branch"
    } else {
        Write-Log "ERROR: Failed to push commits (exit code $LASTEXITCODE)"
        exit 1
    }
}
catch {
    Write-Log "ERROR: $_"
    exit 1
}
finally {
    Pop-Location
}
