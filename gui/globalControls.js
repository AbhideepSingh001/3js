/* -----------------------------------------------------------
   Global / Misc Controls
----------------------------------------------------------- */

export function addGlobalControls(gui, params) {
  const globalFolder = gui.addFolder('Global');

  globalFolder
    .add(params, 'autoRotate')
    .name('Auto Rotate');

  globalFolder.open();
}
