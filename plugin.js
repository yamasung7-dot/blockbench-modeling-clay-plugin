/**
 * BlockBench Modeling Clay Plugin - Android Optimized with Pixelation Effect
 * Applies a soft, squishy modeling clay aesthetic to 3D models
 * Enhanced for touch devices and mobile Android compatibility
 * Features dynamic pixelation based on zoom level with custom icons
 */

(function() {
  const id = 'modeling_clay_plugin';
  const name = 'Modeling Clay';
  const isAndroid = /android/i.test(navigator.userAgent);
  
  // Touch event helpers for Android
  const TouchHandler = {
    isTouchDevice: () => isAndroid || ('ontouchstart' in window),
    
    // Gesture detection
    touches: [],
    startDistance: 0,
    
    detectPinch: (event) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        
        if (TouchHandler.startDistance === 0) {
          TouchHandler.startDistance = distance;
        }
        
        return {
          scale: distance / TouchHandler.startDistance,
          distance: distance
        };
      }
      return null;
    },
    
    detectSwipe: (startX, startY, endX, endY) => {
      const diffX = endX - startX;
      const diffY = endY - startY;
      const threshold = 50;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        return diffX > threshold ? 'right' : diffX < -threshold ? 'left' : null;
      } else {
        return diffY > threshold ? 'down' : diffY < -threshold ? 'up' : null;
      }
    }
  };
  
  // Pixelation effect manager
  const PixelationManager = {
    enabled: true,
    basePixelSize: 1.0, // Default pixel size
    minPixelSize: 0.5, // Minimum (zoomed in)
    maxPixelSize: 4.0, // Maximum (zoomed out)
    cameraDistance: 0,
    lastDistance: 0,
    
    // Calculate pixel size based on camera distance
    calculatePixelSize: (camera) => {
      if (!camera) return PixelationManager.basePixelSize;
      
      const distance = camera.position.length();
      PixelationManager.cameraDistance = distance;
      
      // Normalize distance: closer = smaller pixels, farther = larger pixels
      const minDistance = 10;
      const maxDistance = 100;
      const normalizedDistance = Math.max(minDistance, Math.min(maxDistance, distance));
      
      // Interpolate pixel size based on zoom
      const ratio = (normalizedDistance - minDistance) / (maxDistance - minDistance);
      const pixelSize = PixelationManager.minPixelSize + (PixelationManager.maxPixelSize - PixelationManager.minPixelSize) * ratio;
      
      return pixelSize;
    },
    
    // Apply pixelation to material
    applyPixelation: (material, pixelSize) => {
      if (!material) return;
      
      // Store original values if not already stored
      if (!material._originalOnBeforeCompile) {
        material._originalOnBeforeCompile = material.onBeforeCompile;
      }
      
      material.onBeforeCompile = (shader) => {
        // Call original if it exists
        if (material._originalOnBeforeCompile) {
          material._originalOnBeforeCompile(shader);
        }
        
        // Add pixelation to fragment shader
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `
            // Pixelation effect
            vec3 pixelColor = gl_FragColor.rgb;
            float pixelLevel = ${pixelSize.toFixed(2)};
            
            if (pixelLevel > 0.5) {
              // Quantize colors for pixelated effect
              pixelColor = floor(pixelColor * (8.0 / pixelLevel)) / (8.0 / pixelLevel);
              gl_FragColor.rgb = mix(gl_FragColor.rgb, pixelColor, min(pixelLevel / 4.0, 1.0));
            }
            
            #include <output_fragment>
          `
        );
      };
    },
    
    // Update all clay materials with current pixelation
    updatePixelation: (camera) => {
      if (!PixelationManager.enabled) return;
      
      const pixelSize = PixelationManager.calculatePixelSize(camera);
      
      // Update all selected elements
      if (Outliner.selected && Outliner.selected.length > 0) {
        Outliner.selected.forEach(element => {
          if (element.meshes && element.meshes.length > 0) {
            element.meshes.forEach(mesh => {
              if (mesh.material) {
                PixelationManager.applyPixelation(mesh.material, pixelSize);
              }
            });
          }
        });
      }
    }
  };
  
  // Custom SVG Icons
  const Icons = {
    // Clay icon - looks like a sculpted blob
    clay: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
    </svg>`,
    
    // Settings icon - gear with paint
    settings: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.64l-1.92-3.32c-.12-.22-.38-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.5-.41h-3.84c-.26 0-.46.17-.49.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.22-.07.49.12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.64l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.25.41.51.41h3.84c.26 0 .46-.17.49-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.64l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>`,
    
    // Pixelation icon - grid/mosaic pattern
    pixelation: `<svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="4" height="4" fill="currentColor"/>
      <rect x="8" y="2" width="4" height="4" fill="currentColor"/>
      <rect x="14" y="2" width="4" height="4" fill="currentColor"/>
      <rect x="2" y="8" width="4" height="4" fill="currentColor"/>
      <rect x="8" y="8" width="4" height="4" fill="currentColor"/>
      <rect x="14" y="8" width="4" height="4" fill="currentColor"/>
      <rect x="2" y="14" width="4" height="4" fill="currentColor"/>
      <rect x="8" y="14" width="4" height="4" fill="currentColor"/>
      <rect x="14" y="14" width="4" height="4" fill="currentColor"/>
      <rect x="20" y="2" width="2" height="20" fill="currentColor"/>
      <rect x="2" y="20" width="20" height="2" fill="currentColor"/>
    </svg>`
  };
  
  // Create the custom shader for modeling clay effect
  const clayShader = {
    name: 'Modeling Clay',
    vertex: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
        gl_Position = projectionMatrix * vec4(vPosition, 1.0);
      }
    `,
    fragment: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      uniform vec3 uColor;
      uniform float uRoughness;
      uniform float uMetallic;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        
        // Soft diffuse lighting characteristic of clay
        float diffuse = max(dot(normal, lightDir), 0.3);
        
        // Add subtle rim lighting for soft appearance
        vec3 viewDir = normalize(-vPosition);
        float rimLight = pow(max(dot(normal, viewDir), 0.0), 3.0) * 0.5;
        
        // Combine for clay-like matte finish
        vec3 finalColor = uColor * (diffuse + rimLight * 0.3);
        
        // Add slight saturation boost typical of modeling clay
        float brightness = length(finalColor) / sqrt(3.0);
        finalColor = mix(finalColor, vec3(brightness), -0.1);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  const plugin = {
    id: id,
    name: name,
    icon: 'fas fa-cube',
    author: 'BlockBench Community',
    description: 'Transform your models into beautiful modeling clay sculptures with dynamic pixelation (Android Optimized)',
    
    onload() {
      console.log('Modeling Clay Plugin loaded');
      console.log('Android optimized mode:', isAndroid);
      console.log('Pixelation effect enabled');
      
      // Inject custom icon styles
      this.injectIconStyles();
      
      // Register the clay material
      this.registerClay();
      
      // Add toolbar buttons
      this.createToolbarButtons();
      
      // Add menu items (kept for compatibility)
      MenuBar.addAction({
        id: 'apply_clay_material',
        name: 'Apply Clay Material',
        description: 'Apply the modeling clay aesthetic to selected elements',
        icon: 'fas fa-palette',
        click: () => this.applyClay()
      }, 'filter');
      
      MenuBar.addAction({
        id: 'clay_settings',
        name: 'Clay Settings',
        description: 'Adjust modeling clay appearance',
        icon: 'fas fa-sliders-h',
        click: () => this.openSettings()
      }, 'filter');
      
      MenuBar.addAction({
        id: 'toggle_pixelation',
        name: 'Toggle Pixelation Effect',
        description: 'Enable/disable dynamic pixelation based on zoom',
        icon: 'fas fa-th',
        click: () => this.togglePixelation()
      }, 'filter');
      
      // Register animation loop for pixelation updates
      this.registerAnimationLoop();
      
      // Register long-press handler for quick settings on Android
      if (TouchHandler.isTouchDevice()) {
        this.registerTouchHandlers();
      }
    },
    
    injectIconStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .clay-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1em;
          height: 1em;
          font-size: inherit;
          color: inherit;
        }
        
        .clay-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }
        
        #btn_apply_clay .clay-icon {
          color: #c9886e;
        }
        
        #btn_clay_settings .clay-icon {
          color: #8b7355;
        }
        
        #btn_toggle_pixelation .clay-icon {
          color: #d4a574;
        }
        
        #btn_toggle_pixelation.enabled .clay-icon {
          color: #4a90e2;
          filter: drop-shadow(0 0 3px rgba(74, 144, 226, 0.5));
        }
      `;
      document.head.appendChild(style);
    },
    
    createToolbarButtons() {
      // Create a container for clay buttons
      const clayContainer = document.createElement('div');
      clayContainer.id = 'clay_toolbar_container';
      clayContainer.className = 'toolbar-buttons-group';
      clayContainer.style.cssText = `
        display: inline-flex;
        gap: 5px;
        padding: 0 10px;
        border-right: 1px solid #ccc;
      `;
      
      // Apply Clay Material Button
      const applyClayBtn = document.createElement('button');
      applyClayBtn.id = 'btn_apply_clay';
      applyClayBtn.className = 'toolbar-button';
      applyClayBtn.title = 'Apply Clay Material';
      applyClayBtn.innerHTML = `<span class="clay-icon">${Icons.clay}</span>`;
      applyClayBtn.style.cssText = `
        padding: 8px 12px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      applyClayBtn.onmouseover = () => {
        applyClayBtn.style.background = '#e8d4c4';
      };
      applyClayBtn.onmouseout = () => {
        applyClayBtn.style.background = '#f0f0f0';
      };
      applyClayBtn.onclick = () => this.applyClay();
      
      // Clay Settings Button
      const settingsBtn = document.createElement('button');
      settingsBtn.id = 'btn_clay_settings';
      settingsBtn.className = 'toolbar-button';
      settingsBtn.title = 'Clay Settings';
      settingsBtn.innerHTML = `<span class="clay-icon">${Icons.settings}</span>`;
      settingsBtn.style.cssText = `
        padding: 8px 12px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      settingsBtn.onmouseover = () => {
        settingsBtn.style.background = '#e8d4c4';
      };
      settingsBtn.onmouseout = () => {
        settingsBtn.style.background = '#f0f0f0';
      };
      settingsBtn.onclick = () => this.openSettings();
      
      // Toggle Pixelation Button
      const pixelationBtn = document.createElement('button');
      pixelationBtn.id = 'btn_toggle_pixelation';
      pixelationBtn.className = 'toolbar-button';
      pixelationBtn.title = 'Toggle Pixelation';
      pixelationBtn.innerHTML = `<span class="clay-icon">${Icons.pixelation}</span>`;
      pixelationBtn.style.cssText = `
        padding: 8px 12px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      pixelationBtn.onmouseover = () => {
        pixelationBtn.style.background = PixelationManager.enabled ? '#c5deff' : '#e8d4c4';
      };
      pixelationBtn.onmouseout = () => {
        pixelationBtn.style.background = PixelationManager.enabled ? '#d4e8ff' : '#f0f0f0';
      };
      pixelationBtn.onclick = () => {
        this.togglePixelation();
        // Update button appearance
        if (PixelationManager.enabled) {
          pixelationBtn.classList.add('enabled');
          pixelationBtn.style.background = '#d4e8ff';
        } else {
          pixelationBtn.classList.remove('enabled');
          pixelationBtn.style.background = '#f0f0f0';
        }
      };
      
      // Initialize pixelation button
      if (PixelationManager.enabled) {
        pixelationBtn.classList.add('enabled');
        pixelationBtn.style.background = '#d4e8ff';
      }
      
      clayContainer.appendChild(applyClayBtn);
      clayContainer.appendChild(settingsBtn);
      clayContainer.appendChild(pixelationBtn);
      
      // Find the toolbar and add buttons
      const toolbar = document.querySelector('#top_menu_bar') || 
                     document.querySelector('.top-menu') ||
                     document.querySelector('[class*="toolbar"]');
      
      if (toolbar) {
        toolbar.appendChild(clayContainer);
      } else {
        // Fallback: add to body if toolbar not found
        document.body.appendChild(clayContainer);
      }
      
      // Store button references for later updates
      this.toolbarButtons = {
        applyClay: applyClayBtn,
        settings: settingsBtn,
        pixelation: pixelationBtn
      };
    },
    
    registerAnimationLoop() {
      // Update pixelation every frame based on camera distance
      const self = this;
      const originalRender = Canvas.render;
      
      Canvas.render = function() {
        if (PixelationManager.enabled && Canvas.camera) {
          PixelationManager.updatePixelation(Canvas.camera);
        }
        return originalRender.call(this);
      };
    },
    
    registerTouchHandlers() {
      // Long-press on canvas to open quick settings
      let touchStartTime = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      
      document.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });
      
      document.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = Math.hypot(
          e.changedTouches[0].clientX - touchStartX,
          e.changedTouches[0].clientY - touchStartY
        );
        
        // Long-press: 500ms without significant movement
        if (touchDuration > 500 && touchDistance < 50) {
          if (Outliner.selected.length > 0) {
            this.openSettings();
          }
        }
      });
    },
    
    registerClay() {
      // Create a default clay material
      const clayMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4A574, // Warm clay color
        roughness: 0.7,
        metallic: 0,
        side: THREE.DoubleSide
      });
      
      this.clayMaterial = clayMaterial;
    },
    
    applyClay() {
      if (!Outliner.selected.length) {
        Blockbench.notification('info', 'Please select at least one element');
        return;
      }
      
      Outliner.selected.forEach(element => {
        if (element.type === 'cube' || element.type === 'group') {
          // Apply clay texture properties
          element.shade = true;
          
          // Store clay material reference
          if (element.meshes && element.meshes.length) {
            element.meshes.forEach(mesh => {
              if (mesh.material) {
                mesh.material.roughness = 0.7;
                mesh.material.metallic = 0;
                mesh.material.envMapIntensity = 0.3;
                
                // Apply pixelation if enabled
                if (PixelationManager.enabled) {
                  const pixelSize = PixelationManager.calculatePixelSize(Canvas.camera);
                  PixelationManager.applyPixelation(mesh.material, pixelSize);
                }
              }
            });
          }
        }
      });
      
      Canvas.updateAllFaces();
      Blockbench.notification('success', 'Clay material applied with pixelation effect!');
    },
    
    togglePixelation() {
      PixelationManager.enabled = !PixelationManager.enabled;
      const status = PixelationManager.enabled ? 'enabled' : 'disabled';
      Blockbench.notification('success', `Pixelation effect ${status}`);
      
      // Update button color
      if (this.toolbarButtons && this.toolbarButtons.pixelation) {
        if (PixelationManager.enabled) {
          this.toolbarButtons.pixelation.classList.add('enabled');
          this.toolbarButtons.pixelation.style.background = '#d4e8ff';
        } else {
          this.toolbarButtons.pixelation.classList.remove('enabled');
          this.toolbarButtons.pixelation.style.background = '#f0f0f0';
        }
      }
      
      Canvas.updateAllFaces();
    },
    
    openSettings() {
      const isMobile = TouchHandler.isTouchDevice();
      
      // Create mobile-optimized dialog
      const dialog = new Dialog({
        id: 'clay_settings_dialog',
        title: 'Modeling Clay Settings',
        form: {
          color: {
            label: 'Clay Color',
            type: 'color',
            value: '#D4A574'
          },
          roughness: {
            label: 'Roughness',
            type: 'range',
            min: 0,
            max: 1,
            step: 0.1,
            value: 0.7
          },
          saturation: {
            label: 'Saturation',
            type: 'range',
            min: 0,
            max: 2,
            step: 0.1,
            value: 1.2
          },
          smoothness: {
            label: 'Smoothness',
            type: 'select',
            options: {
              'low': 'Lumpy Clay',
              'medium': 'Balanced',
              'high': 'Smooth Clay'
            },
            value: 'medium'
          },
          pixelation_enabled: {
            label: 'Enable Pixelation',
            type: 'checkbox',
            value: PixelationManager.enabled
          },
          pixel_zoom_sensitivity: {
            label: 'Pixelation Zoom Sensitivity',
            type: 'range',
            min: 0.5,
            max: 4.0,
            step: 0.5,
            value: PixelationManager.maxPixelSize
          }
        },
        onConfirm: (result) => {
          this.applySettings(result);
        }
      });
      
      // Apply mobile-friendly styling
      if (isMobile) {
        this.optimizeDialogForMobile(dialog);
      }
      
      dialog.show();
    },
    
    optimizeDialogForMobile(dialog) {
      // Increase touch target sizes
      const style = document.createElement('style');
      style.textContent = `
        #clay_settings_dialog .dialog-form input[type="range"] {
          width: 100%;
          height: 50px;
          cursor: pointer;
          -webkit-appearance: slider-horizontal;
        }
        
        #clay_settings_dialog .dialog-form input[type="color"] {
          width: 100%;
          height: 60px;
          cursor: pointer;
          border-radius: 8px;
        }
        
        #clay_settings_dialog .dialog-form select {
          width: 100%;
          height: 50px;
          font-size: 16px;
          padding: 10px;
          border-radius: 8px;
        }
        
        #clay_settings_dialog .dialog-form input[type="checkbox"] {
          width: 30px;
          height: 30px;
          cursor: pointer;
          margin-right: 10px;
        }
        
        #clay_settings_dialog button {
          min-height: 50px;
          min-width: 100px;
          font-size: 16px;
          padding: 15px 25px;
          border-radius: 8px;
          margin: 10px;
        }
        
        #clay_settings_dialog .dialog-form label {
          font-size: 14px;
          margin: 15px 0 10px 0;
          display: block;
        }
        
        #clay_settings_dialog {
          max-width: 95vw;
          padding: 20px;
        }
      `;
      document.head.appendChild(style);
    },
    
    applySettings(settings) {
      // Update pixelation settings
      if (settings.pixelation_enabled !== undefined) {
        PixelationManager.enabled = settings.pixelation_enabled;
        // Update button color
        if (this.toolbarButtons && this.toolbarButtons.pixelation) {
          if (PixelationManager.enabled) {
            this.toolbarButtons.pixelation.classList.add('enabled');
            this.toolbarButtons.pixelation.style.background = '#d4e8ff';
          } else {
            this.toolbarButtons.pixelation.classList.remove('enabled');
            this.toolbarButtons.pixelation.style.background = '#f0f0f0';
          }
        }
      }
      if (settings.pixel_zoom_sensitivity !== undefined) {
        PixelationManager.maxPixelSize = settings.pixel_zoom_sensitivity;
      }
      
      Outliner.selected.forEach(element => {
        if (element.meshes) {
          element.meshes.forEach(mesh => {
            if (mesh.material) {
              // Update color
              mesh.material.color.setStyle(settings.color);
              
              // Update roughness
              mesh.material.roughness = settings.roughness;
              
              // Update saturation through material properties
              const saturation = settings.saturation;
              mesh.material.colorSpace = THREE.SRGBColorSpace;
              
              // Apply pixelation
              if (PixelationManager.enabled) {
                const pixelSize = PixelationManager.calculatePixelSize(Canvas.camera);
                PixelationManager.applyPixelation(mesh.material, pixelSize);
              }
            }
          });
        }
      });
      
      Canvas.updateAllFaces();
      Blockbench.notification('success', 'Clay settings applied!');
    },
    
    onunload() {
      console.log('Modeling Clay Plugin unloaded');
      // Remove toolbar container
      const container = document.getElementById('clay_toolbar_container');
      if (container) {
        container.remove();
      }
    }
  };
  
  BBPlugin.register(id, plugin);
})();
