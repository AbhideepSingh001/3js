/* -----------------------------------------------------------
   Cloud Controls
----------------------------------------------------------- */

export function addCloudControls(gui, params, cloudMaterial) {
  const cloudFolder = gui.addFolder('Clouds');

  cloudFolder
    .add(params, 'cloudsRotationSpeed')
    .min(0)
    .max(0.03)
    .step(0.0005)
    .name('Rotation Speed');

  cloudFolder
    .add(params, 'cloudsOpacity')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Opacity')
    .onChange((value) => {
      cloudMaterial.opacity = value;
    });

  cloudFolder.open();
}
