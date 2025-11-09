Schedule script instructions

This file explains how to schedule `scripts/scheduled_commit.ps1` using Windows Task Scheduler.

1. Script path
   - `c:\Users\DELL\OneDrive\Desktop\ai_market\scripts\scheduled_commit.ps1`

2. Test the script manually in PowerShell (recommended):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "c:\Users\DELL\OneDrive\Desktop\ai_market\scripts\scheduled_commit.ps1" -RepoPath "c:\Users\DELL\OneDrive\Desktop\ai_market" -Branch "main" -CommitCount 5 -MessagePrefix "Scheduled commit"
```

3. Create a Task Scheduler entry (one for each scheduled date):
   - Open Task Scheduler -> Create Basic Task
   - Name: "Scheduled Git Commits"
   - Trigger: Choose date/time (e.g., tomorrow 09:00 AM)
   - Action: Start a program
     - Program/script: `powershell.exe`
     - Add arguments: `-NoProfile -ExecutionPolicy Bypass -File "c:\Users\DELL\OneDrive\Desktop\ai_market\scripts\scheduled_commit.ps1" -RepoPath "c:\Users\DELL\OneDrive\Desktop\ai_market" -Branch "main" -CommitCount 5 -MessagePrefix "Scheduled commit $(Get-Date -Format yyyy-MM-dd)"`
     - Start in: `C:\Windows\System32`
   - Finish and test the task.

4. Notes:
   - Ensure the account running the task has access to the repository and Git credentials (credential manager or SSH key configured).
   - To schedule multiple days (tomorrow and day-after), create two tasks with different triggers.
   - Alternatively, set the task to run daily and internalize logic in the script to only run on specific dates.
