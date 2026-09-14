````markdown name=ANDROID_GUIDE.md
# 📱 BlockBench Modeling Clay Plugin - Android Guide

Complete guide for using the Modeling Clay plugin on Android devices with BlockBench.

## ✨ Android Optimizations

This version of the plugin has been specifically enhanced for Android touch devices with:

- **Touch-Friendly Interface** - Larger buttons and input fields optimized for finger taps
- **Gesture Support** - Swipe and long-press controls for quick access
- **Mobile-Optimized Dialogs** - Responsive settings panels that fit mobile screens
- **Automatic Detection** - Plugin detects Android and applies optimizations automatically

---

## 🚀 Getting Started on Android

### Installation

1. Open BlockBench on your Android device
2. Navigate to **File → Preferences → Plugins**
3. Tap **"Load Plugin"**
4. Select `plugin.js` from your file storage
5. The plugin will load and appear in the Filters menu

### Quick Start

1. **Create or open** a model in BlockBench
2. **Select elements** by tapping them (tap multiple times for multiple selections)
3. Go to **Filters → Apply Clay Material**
4. Your model transforms into clay! 🎨

---

## 📲 Android Controls & Gestures

### Basic Touch Controls

| Action | Result |
|--------|--------|
| **Single Tap** | Select/deselect elements |
| **Double Tap** | Apply clay material quickly |
| **Long Press** (500ms) | Open settings dialog |
| **Swipe Left/Right** | Adjust roughness slider |
| **Swipe Up/Down** | Adjust saturation slider |
| **Two-Finger Pinch** | Zoom clay preview (if supported) |

### Menu Navigation

- **Tap Filters menu** → Shows all clay options
- **Tap "Apply Clay Material"** → Instantly applies to selected elements
- **Tap "Clay Settings"** → Opens customization dialog

---

## 🎨 Customizing Clay on Android

### Opening Settings

**Option 1: Via Menu**
```
Filters → Clay Settings → Tap "Open"
```

**Option 2: Long-Press Shortcut** ⚡
```
Long-press (hold for 0.5 seconds) on any element
Settings dialog opens automatically!
```

### Settings Dialog - Touch Tips

The settings dialog is optimized for touch with:

- **Large Color Picker** - Tap to open, drag to select color
- **Wide Range Sliders** - Easy to adjust with finger
- **Big Dropdown Menu** - Tap to expand smoothness options
- **Large Buttons** - Confirm/Cancel buttons sized for fingers

### Adjusting Each Setting

#### 1. Clay Color
- **Tap the color box** to open color picker
- **Drag to select** your desired hue
- **Tap OK** to confirm

**Popular Android-Friendly Colors:**
```
#D4A574 - Natural Tan (Default)
#C85A3D - Warm Red
#8B7355 - Brown
#FF6B6B - Bright Red
#4ECDC4 - Teal
```

#### 2. Roughness Slider
- **Swipe left** = Glossier, shinier clay
- **Swipe right** = Matte, duller clay
- Range: 0 (shiny) → 1 (matte)
- **Default: 0.7** (authentic clay feel)

**Tip:** Tap and drag the slider knob for precise control

#### 3. Saturation Slider
- **Swipe left** = Muted, dusty clay
- **Swipe right** = Vibrant, vivid clay
- Range: 0 (grayscale) → 2 (hyper-saturated)
- **Default: 1.2** (recommended)

#### 4. Smoothness Dropdown
- **Lumpy Clay** - Hand-sculpted, organic look
- **Balanced** - Medium detail
- **Smooth Clay** - Polished, refined appearance

---

## ⌨️ Keyboard Alternatives for Android

Since Android keyboards lack some keys, here are touch-only alternatives:

| What You Need | Android Alternative |
|---------------|-------------------|
| Right-Click Menu | **Long-press** on element |
| Delete Key | Tap element → use menu delete |
| Ctrl+Z (Undo) | Use BlockBench menu undo |
| Ctrl+A (Select All) | Use outliner to select multiple |
| Enter/Confirm | Tap large button in dialog |

---

## 🎯 Pro Tips for Android

### Performance
- **Close other apps** before opening BlockBench for better performance
- **Use Balanced smoothness** for faster rendering on older devices
- **Reduce model complexity** if clay effects lag

### Best Practices
1. **Apply clay to groups** rather than individual cubes for efficiency
2. **Test on a small model first** before applying to large projects
3. **Save frequently** - tap File → Save often
4. **Use preview mode** to see clay effects in real-time

### Troubleshooting

**Settings dialog won't open?**
- Make sure you have selected at least one element
- Try using the menu instead of long-press

**Clay doesn't look right?**
- Verify lighting in your scene (Filters → Lighting)
- Try different smoothness settings
- Adjust roughness and saturation values

**Gestures not working?**
- The plugin auto-detects Android - if gestures fail, use menus
- Make sure you're using two fingers for pinch zoom
- Long-press must be held for ~500ms

**Performance issues?**
- Reduce model polygon count
- Close background apps
- Disable real-time preview if available
- Use lower-detail smoothness settings

---

## 📊 Comparison: Desktop vs Android

| Feature | Desktop | Android |
|---------|---------|---------|
| Full keyboard shortcuts | ✅ | ❌ (Use long-press) |
| Mouse precision | ✅ | Limited (use menus) |
| Touch gestures | ⚠️ (Optional) | ✅ (Primary) |
| Settings dialog | Standard | Optimized |
| Larger UI elements | ❌ | ✅ |
| Long-press shortcuts | ❌ | ✅ |

---

## 🔧 Advanced: Custom Touch Bindings

If you want to customize touch controls further, edit `plugin.js`:

```javascript
// Around line 70, adjust touch detection:
TouchHandler.isTouchDevice = () => isAndroid || ('ontouchstart' in window);

// Around line 130, adjust long-press duration (in milliseconds):
if (touchDuration > 500 && touchDistance < 50) {  // Change 500 for faster/slower
  this.openSettings();
}
```

---

## 📞 Support & Issues

**Having problems?**

1. Check this guide first
2. Visit the [GitHub Issues](https://github.com/yamasung7-dot/blockbench-modeling-clay-plugin/issues)
3. Include:
   - Your Android version
   - BlockBench version
   - What went wrong
   - Screenshots if possible

---

## 🎓 Example Workflow on Android

Here's a typical clay modeling session:

```
1. Open BlockBench with your model
2. Select a cube or group (tap it)
3. Long-press to open Settings quickly
4. Adjust clay color to match your vision
5. Set roughness to 0.6 for semi-glossy
6. Tap "Confirm"
7. Model instantly looks like clay!
8. Repeat with different groups for multi-colored clay sculptures
9. Save your work (File → Save)
```

---

## 🌟 Clay Color Ideas for Android

### Natural Clays
- `#A0826D` - Terracotta
- `#8B6F47` - Earth Brown
- `#C19A6B` - Gold Clay

### Bright Clays
- `#FF1744` - Vivid Red
- `#00BCD4` - Cyan
- `#FFEB3B` - Bright Yellow

### Pastel Clays
- `#F8BBD0` - Soft Pink
- `#C5E1A5` - Soft Green
- `#B3E5FC` - Soft Blue

Try them all! Long-press → Color → Pick from suggestions

---

**Happy clay sculpting on Android! 🎨📱**
````
