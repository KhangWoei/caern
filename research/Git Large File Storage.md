# Git large file storage

This tracks files specified in `.gitattributes` following the `<path> filter=lfs diff=lfs merge=lfs -text` format. The tracked files are:
  - Stored seperately in a remote server
  - Replaced with a pointers inside Git

If LFS is setup in a repository and a user pull the repository without LFS configured, shit goes wrong.

## Setup

### Installation
```
git lfs install
```

### Tracking
```
git lfs track <path>
```
