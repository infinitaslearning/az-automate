# Tools to automate stuff around devops / github

To use this, you need the `az-cli` installed, and to have logged in - it basically wraps around the CLI tool.

https://docs.microsoft.com/en-us/azure/devops/cli/?view=azure-devops

# Usage


### Get all Repos

Gets all projects, then for each project, gets all repos into a CSV file along with the last commit date.

It performs a shallow checkout for every repository into a data folder, subsequent runs won't re-check it out - so if you want a fresh run delete the data folder.

```
node ./repo
```

The goods are then in `repos.csv`.

### Merge Repos

Command to enable you to merge a list of Repos into one mono-repo.

TODO

### Push to Github

Command to enable you to push a list of Repos to Github.

TODO

### Migrate Pipelines

Command to enable transformation and push of azure pipeline yaml to github action yaml.

https://github.com/samsmithnz/AzurePipelinesToGitHubActionsConverter

TODO

### Migrate Issues

Command to enable push of issues from Devops to Github

TODO