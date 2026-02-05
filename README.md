# attaquer_custom

Version modifiee du projet original [iAttaquer/.glzr](https://github.com/iAttaquer/.glzr).

## Description

Barre de taches personnalisee pour [Zebar](https://github.com/glzr-io/zebar) utilisant SolidJS et TypeScript.

### Composants

- **Gauche** : Direction de tiling, espaces de travail
- **Centre** : Rien
- **Droite** : Réseau, CPU, memoire, volume, heure

## Prerequis

- [Node.js](https://nodejs.org/)
- [Zebar](https://github.com/glzr-io/zebar)
- [GlazeWM](https://github.com/glzr-io/glazewm) (optionnel, pour le tiling)
- [AutoHotkey](https://www.autohotkey.com/) (pour certaines fonctionnalites)

## Installation

```bash
npm install
npm run build
```

Activer le widget via l'icone Zebar dans le system tray.

## Developpement

Pour rebuilder automatiquement lors des modifications :

```bash
npm run dev
```

## Credits

Base sur le travail de [iAttaquer](https://github.com/iAttaquer/.glzr).
