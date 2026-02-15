/* -----------------------------------------------------------
   Earth Controls
----------------------------------------------------------- */

export function addEarthControls(gui, params) {
  const earthFolder = gui.addFolder('Earth');

  earthFolder
    .add(params, 'earthRotationSpeed')
    .min(0)
    .max(0.02)
    .step(0.0005)
    .name('Rotation Speed');

  earthFolder.open();
}
