# GitHub actions

# Ensure the github actions file is already created and configured
Create the following structure in your project:
    .github/
        workflows/
            ci.yml

# Ensure your repository is in GitHub.

# Create Cypress and Playwright test cases.

# Commit and publish changes to the main branch to trigger the workflow actions.

# Once Published, you can got to Github and click on the Actions tab, you'll see the workflows running.

# Cypress will display a summary section when the execution is done. 

# Execution Reports

Go to https://github.com/JRodMejia/happy_testing/actions
Click in the workflow "CI - Testing Pipeline"
Select the most recent execution
Scroll down to the "Artifacts" section
Click on the ZIP field to downlowd:
    cypress-videos.zip → failure videos
    cypress-screenshots.zip → failure Screenshots
    playwright-report.zip → interactive HTML report
