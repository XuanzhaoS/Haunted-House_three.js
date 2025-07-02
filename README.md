# Haunted-House 👻

> A 3D Haunted House project built with Three.js

## Table of Contents

- [Preview](#preview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Mini-Games](#mini-games)
- [Learning Resources](#learning-resources)
- [Author](#️author)

## 📷 Preview

![Screenshot](./assets/screenshot.gif)
[👉Live Demo](https://haunted-house-three-js-steel.vercel.app/)

## Tech Stack

- Three.js
- JavaScript / HTML / CSS
- Vite
- lil-GUI(for debug UI)
- GSAP(animation library)

## 📁Project Structure

```
Haunted-House_three.js/
├── /src
│ ├── AbandonedCarnivalLand/
│ │ ├── environment.js
│ │ └── scene/
│ ├── HauntedHouseLand/
│ │ ├── game/
│ │ │ ├── ghostGame.js
│ │ │ └── coffeeSmoke.js
│ │ ├── lights/
│ │ │ └── lighting.js
│ │ ├── scene/
│ │ │ ├── ghosts.js
│ │ │ ├── hauntedHouse.js
│ │ │ ├── graveyard.js
│ │ │ ├── bushes.js
│ │ │ ├── environment.js
│ │ │ └── ...
│ │ ├── ui/
│ │ │ └── welcomeText.js
│ │ ├── hauntedHouseLand.js
│ ├── index.html
│ ├── script.js
│ ├── style.css
│ └── particles.js
├── static/
│ ├── brick/
│ ├── door/
│ ├── env/
│ ├── floor/
│ ├── fonts/
│ ├── ghostText/
│ ├── grass/
│ ├── particles/
│ ├── Pumpkin/
│ ├── roof/
│ ├── skull/
│ └── sounds/
└── README.md
```

## 🚀Getting Started

```bash
# Install dependencies
npm install

# Run the project locally
npm run dev

# Build for production
npm run build
```

## 📌Features

- **Immersive haunted house scene** with custom 3D models and textures
- **Multiple themed lands** (Haunted House, Carnival, etc.) with modular structure
- **Particle system** for starry night sky and special effects
- **Dynamic lighting and shadows** for spooky atmosphere
- **Responsive camera controls** with OrbitControls
- **Interactive UI** and animated welcome text
- **Background music and sound effects**

## 👻 Mini-Games

- **Ghost Catching Game:**  
  Click on the glowing ghost lights to catch them! Each ghost triggers a smoke effect when caught. Catch all ghosts to win the game.

## 🧠Learning Resources

- [Three.js Journey](https://threejs-journey.com/)
- [Three.js Documentation](https://threejs.org/docs/)

## 🙋‍♀️Author

Xuan Zhao

- ��GitHub: @XuanzhaoS
