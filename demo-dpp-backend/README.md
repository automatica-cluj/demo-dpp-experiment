# Release Process

This document outlines the formal release process for the project, utilizing GitHub Actions and GitHub Container Registry to automate the release workflow, generate binaries, and create Docker images.

## 1. Branching Strategy and Preparation
- Development is performed on the `main` branch.
- When a new release is required, the `main` branch is merged into the `release` branch to ensure that the latest stable changes are incorporated.

## 2. GitHub Actions Configuration
- A GitHub Actions workflow is defined in `.github/workflows/publish.yml` to automate the release process.
- This workflow monitors the `release` branch and is triggered when changes occur in this branch. It handles building the application, generating the binaries, and creating the Docker image for the release.
- The workflow will use Dockerfile from repository root to build the Docker image.

## 3. Initiating the Release Process
The formal release process follows these steps:

1. Merge `main` into `release` to ensure the release branch contains the latest changes. This will trigger the github action to build the docker image. Monitor the build process in the Actions tab.
2. Go to the repository's "Releases" section on GitHub.
2. Click "Create new release."
3. Configure the release:
    - **Tag the release**: Assign a version tag corresponding to the release (e.g., `v1.0`). NOTE: Release tag should start with 'v' since github docker action is listening for new tag with this pattern.
    - **Title and description**: Provide a release title and description summarizing key changes.
4. Click "Publish Release" to finalize the process.
5. Check the GitHub Actions tab to ensure the docker workflow has completed successfully and image as been succesfully generated.

## 4. Run application using Docker image

Change the version in `docker-compose.yaml` to the version you want to run and the user and repository to your own.

```yaml  

services:
app:
container_name: springboot-app
image: ghcr.io/**automatica-cluj**/demo-simple-app:**v0.6-beta**
```

To run the application using docker compose:

```
docker compose up
```

Test the basic hell controller:

```
curl http://localhost:8080/hello
```

## 4. References

- https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry.
- https://docs.github.com/en/actions/sharing-automations/creating-actions/dockerfile-support-for-github-actions
- https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
- https://dev.to/github/publishing-a-docker-image-to-githubs-container-repository-4n50
- https://www.codecentric.de/wissens-hub/blog/github-container-registry