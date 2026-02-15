/* -----------------------------------------------------------
   Light Controls
----------------------------------------------------------- */

export function addLightControls(gui, params, sunlight) {
  const lightFolder = gui.addFolder('Light');

  lightFolder
    .add(params, 'sunlightIntensity')
    .min(0)
    .max(5)
    .step(0.1)
    .name('Sun Intensity')
    .onChange((value) => {
      sunlight.intensity = value;
    });

  lightFolder.open();
}
