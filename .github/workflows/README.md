# GitHub actions

# Ensure the github actions file is already created and configured
Create the following structure in your project:
    .github/
        workflows/
            ci.yml

# Ensure your repository is in GitHub 

# Create Cypress and Playwright test cases

# Commit and publish changes to the main branch to trigger the workflow actions

# Once Published, you can got to Github and click on the Actions tab, you'll see the workflows running.

# Execution Reports

Go to https://github.com/JRodMejia/happy_testing/actions
Click in the workflow "CI - Testing Pipeline"
Select the most recent execution
Scroll down to the "Artifacts" section
Click on the ZIP field to downlowd:
    cypress-videos.zip → failure videos
    cypress-screenshots.zip → failure Screenshots
    playwright-report.zip → interactive HTML report

##  GitHub pages for execution report
        Go to your GitHub repository
        Settings → Pages 
        In Source, select: gh-pages branch
        Click Save
        After each execution you could see the report on:
            https://jrodmejia.github.io/happy_testing/reports/[RUN_NUMBER]/
        Where [RUN_NUMBER] is the execution number (ex: run #42 = .../reports/42/)