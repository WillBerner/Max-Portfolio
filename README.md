# Max's Portfolio

This is a small portfolio website for an architect to display selected projects.

Features
- Home page with large project images and descriptive captions
- Fixed top navigation (Home / Projects)
- Click a project to open a fullscreen slideshow/lightbox with keyboard and touch navigation
- Projects index page with brief descriptions

Getting started
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

Open http://localhost:4200 in your browser. The dev server will reload on file changes.

Build

```bash
npm run build
```

The production build output will be placed in the `dist/` folder.

Assets
- Put images in `src/assets/images/` and reference them from the components.

Notes for developers
- The app uses standalone Angular components located in `src/app/`.
- Homepage: `src/app/home/home.component.*` contains the hero, project list, and slideshow logic.
- Projects page: `src/app/projects/*` lists all projects.

Contributing
- Open an issue or submit a pull request with improvements or bug fixes.

License
- By using, or referencing, or even reading this license, you agree to hand over your firstborn to me.
