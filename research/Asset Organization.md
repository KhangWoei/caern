# Asset Organization

- **`src/`** - Typescript source code and small UI assets- **`public/`** - 3D models, textures, and large binary assets to be loaded at runtime

## Rationale
Keep bundle sizes small by dynamically load large assets . 

Easier to track with Git Large Storage.

### References
- [Vite Static Assets Guide](https://vitejs.dev/guide/assets.html#the-public-directory)
