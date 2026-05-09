# 🌟 GNOME Shell Spotlight Shaders

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-42%2B-blue)](https://gnome.org)

A **highly customizable GNOME Shell extension** that adds **13 shader effects** around your mouse cursor. Each shader is **fully configurable** via a **GTK4 preferences dialog**.

---

## ✨ Features

- **13 Shader Effects**: Spotlight, Ripple, Scanline, Vignette, Blur, Glow, Invert, Pixelate, Edge Detection, Color Shift, Grid, Neon, Heatmap.
- **Fully Configurable**: Adjust radius, colors, speeds, thresholds, and more for each shader.
- **Dynamic Switching**: Change shaders on the fly via the preferences dialog.
- **Performance Optimized**: Uses OpenGL shaders (Clutter/Cogl) for hardware acceleration.

---

## 🛠 Installation

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/herve-brun/gnome-shell-spotlight.git
   ```
2. Create a symlink in your GNOME Shell extensions directory:
   ```bash
   ln -s $(pwd)/gnome-shell-spotlight ~/.local/share/gnome-shell/extensions/spotlight-shaders@herve-brun
   ```
3. Restart GNOME Shell (`Alt+F2` → `r`).
4. Enable the extension in **GNOME Tweaks** or **Extensions** app.

---

## 🎛 Usage

1. Open **Extensions** app or **GNOME Tweaks**.
2. Find **"Spotlight Shaders"** and enable it.
3. Open the **preferences dialog** to configure:
   - **Shader Type**: Choose from 13 effects.
   - **Common Settings**: Radius, color, opacity, fade delay, easing.
   - **Shader-Specific Settings**: Each shader has its own parameters.

---

## 🔧 Development

### Prerequisites
- GNOME Shell 42+
- GJS (GNOME JavaScript)
- GTK4 and Libadwaita

### Debugging
- Use **Looking Glass** (`Alt+F2` → `lg`) to inspect the extension.
- Check logs:
  ```bash
  journalctl -f -o cat /usr/bin/gnome-shell | grep -i "spotlight\|shader"
  ```

### Compile GSettings Schema
```bash
./compile-schemas.sh
```

---

## 📜 License

MIT License – see [LICENSE](LICENSE) for details.