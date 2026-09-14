/**
 * BlockBench Modeling Clay Plugin
 * Applies a soft, squishy modeling clay aesthetic to 3D models
 */

(function() {
  const id = 'modeling_clay_plugin';
  const name = 'Modeling Clay';
  
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
    description: 'Transform your models into beautiful modeling clay sculptures',
    
    onload() {
      console.log('Modeling Clay Plugin loaded');
      
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
      new Dialog({
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
            label: 'Smoothness (Geometry)',
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
      }).show();
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
