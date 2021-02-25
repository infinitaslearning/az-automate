# Tools to automate stuff around devops / github

To use this, you need the `az-cli` installed, and to have logged in - it basically wraps around the CLI tool.

https://docs.microsoft.com/en-us/azure/devops/cli/?view=azure-devops

# Usage


### Get all Repos

Gets all projects, then for each project, gets all repos

```
node ./repo > repos.json
```

