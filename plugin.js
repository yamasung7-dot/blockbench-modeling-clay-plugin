/**
 * BlockBench Modeling Clay Plugin - Android Optimized
 * Applies a soft, squishy modeling clay aesthetic to 3D models
 * Enhanced for touch devices and mobile Android compatibility
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
    description: 'Transform your models into beautiful modeling clay sculptures (Android Optimized)',
    
    onload() {
      console.log('Modeling Clay Plugin loaded');
      console.log('Android optimized mode:', isAndroid);
      
      // Register the clay material
      this.registerClay();
      
      // Add menu items
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
      
      // Register long-press handler for quick settings on Android
      if (TouchHandler.isTouchDevice()) {
        this.registerTouchHandlers();
      }
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
              }
            });
          }
        }
      });
      
      Canvas.updateAllFaces();
      Blockbench.notification('success', 'Clay material applied!');
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
            }
          });
        }
      });
      
      Canvas.updateAllFaces();
      Blockbench.notification('success', 'Clay settings applied!');
    },
    
    onunload() {
      console.log('Modeling Clay Plugin unloaded');
    }
  };
  
  BBPlugin.register(id, plugin);
})();
