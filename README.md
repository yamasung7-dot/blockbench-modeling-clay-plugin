````markdown name=README.md
# 🎨 BlockBench Modeling Clay Plugin

Transform your 3D models into beautiful modeling clay sculptures with this BlockBench plugin!

## Features

- **Clay Shader Effect** - Custom WebGL shader that simulates the soft, matte appearance of modeling clay
- **Material Customization** - Adjust clay color, roughness, and saturation to match your vision
- **Soft Lighting** - Proprietary diffuse lighting with subtle rim lighting for that authentic clay look
- **Easy Application** - Apply clay effects to selected elements with one click
- **Settings Dialog** - Fine-tune appearance with an intuitive settings panel

## Installation

1. Download `plugin.js` from this repository
2. In BlockBench, go to **File → Preferences → Plugins**
3. Click "Load Plugin" and select `plugin.js`
4. The plugin will automatically enable

## Usage

### Apply Clay Material

1. Select one or more elements/groups in your model
2. Go to **Filters → Apply Clay Material**
3. Your selected elements will instantly transform into clay!

### Customize Clay Settings

1. Go to **Filters → Clay Settings**
2. Adjust the following options:
   - **Clay Color** - Pick any color for your clay
   - **Roughness** - Control surface smoothness (0 = glossy, 1 = matte)
   - **Saturation** - Intensify or reduce color vibrancy
   - **Smoothness** - Choose between lumpy, balanced, or smooth clay geometry
3. Click "Confirm" to apply

## Clay Color Presets

Popular modeling clay colors:
- `#D4A574` - Natural Tan (Default)
- `#C85A3D` - Warm Red Clay
- `#8B7355` - Brown Clay
- `#E6B89C` - Light Tan
- `#2C1810` - Dark Brown
- `#FF6B6B` - Bright Red
- `#4ECDC4` - Teal
- `#FFE66D` - Yellow

## Technical Details

### Shader Pipeline

The plugin uses a custom fragment shader that combines:
- Soft diffuse lighting (base at 0.3 for shadow definition)
- Subtle rim lighting for edge highlights
- Matte finish properties (roughness ~0.7)
- Saturation enhancement for vibrant clay appearance

### Material Properties

```javascript
{
  roughness: 0.7,      // Matte clay finish
  metallic: 0,         // Non-metallic
  envMapIntensity: 0.3 // Subtle environment reflection
}
```

## Tips & Tricks

1. **Layered Clay** - Apply different clay colors to different elements for a multi-colored sculpture
2. **Lumpy Texture** - Use the "Lumpy Clay" smoothness setting for organic, hand-sculpted look
3. **Lighting** - The clay effect works best with moderate scene lighting
4. **Animation** - Clay effects work with BlockBench's animation timeline!

## Compatibility

- **BlockBench** 4.0+
- **THREE.js** 100.0+
- All platforms (Windows, macOS, Linux)

## Development

Want to contribute? Fork this repo and submit a pull request!

### File Structure
```
blockbench-modeling-clay-plugin/
├── plugin.js           # Main plugin code
├── plugin.json         # Plugin manifest
└── README.md          # This file
```

## License

MIT License - Feel free to use, modify, and distribute!

## Credits

Created for the BlockBench community. Inspired by the tactile joy of working with modeling clay! 🎨

---

Have fun creating! 🚀
````
