/* -----------------------------------------------------------
   GUI Entry Point
----------------------------------------------------------- */

import { GUI } from 'lil-gui';
import { addEarthControls } from './earthControls.js';
import { addCloudControls } from './cloudControls.js';
import { addLightControls } from './lightControls.js';
import { addGlobalControls } from './globalControls.js';

export function initGUI({ cloudMaterial, sunlight }) {
  // Shared parameters for GUI + animation
  const params = {
    earthRotationSpeed: 0.002,
    cloudsRotationSpeed: 0.0023,
    cloudsOpacity: cloudMaterial.opacity,
    sunlightIntensity: sunlight.intensity,
    autoRotate: true
  };

  // Create root GUI panel
  const gui = new GUI();

  // Add different sections
  addEarthControls(gui, params);
  addCloudControls(gui, params, cloudMaterial);
  addLightControls(gui, params, sunlight);
  addGlobalControls(gui, params);

  // Return params so script.js can use them in animation
  return params;
}
