# Aayush Keshari's Portfolio

An interactive portfolio inspired by the late-1990s Classic Mac OS desktop. The site includes movable Finder-style windows for my background, experience, projects, skills, résumé, and contact links.

## Features

- Classic Mac menu bar, desktop, Control Strip, and aqua iMac-era visual language
- Draggable, focusable, and closable portfolio windows
- Responsive touch layout for phones and tablets
- Résumé view that can be printed or saved as a PDF
- Static export with automatic GitHub Pages deployment
- No database, server, tracking, or external runtime dependency

## Run locally

```bash
npm install
npm run dev
```

## Publish with GitHub Pages

1. Create a GitHub repository and upload this project.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to the `main` branch. The included workflow builds and publishes the site.

The workflow automatically handles both a root user site (`username.github.io`) and a project site (`username.github.io/repository-name`).

## Customize

Portfolio content and links are centralized near the top of `app/page.tsx`. Visual styling is in `app/globals.css`.

## Credits

Visual direction inspired by the playful desktop portfolio at [dylan.nagelbros.com](https://dylan.nagelbros.com/) and by Apple's late-1990s Classic Mac OS interface. All code and portfolio content in this repository are original.
