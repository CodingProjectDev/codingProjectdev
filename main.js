function init() {
  // Remove loading state
  document.querySelector(".loading-init").remove();
  appNodes.stageContainer.classList.remove("remove");

  // Populate dropdowns
  function setOptionsForSelect(node, options) {
    node.innerHTML = options.reduce(
      (acc, opt) => (acc += `<option value="${opt.value}">${opt.label}</option>`),
      ""
    );
  }

  // shell type
  let options = "";
  shellNames.forEach((opt) => (options += `<option value="${opt}">${opt}</option>`));
  appNodes.shellType.innerHTML = options;
  // shell size
  options = "";
  ['3"', '4"', '6"', '8"', '12"', '16"'].forEach(
    (opt, i) => (options += `<option value="${i}">${opt}</option>`)
  );
  appNodes.shellSize.innerHTML = options;

  setOptionsForSelect(appNodes.quality, [
    { label: "Low", value: QUALITY_LOW },
    { label: "Normal", value: QUALITY_NORMAL },
    { label: "High", value: QUALITY_HIGH },
  ]);

  setOptionsForSelect(appNodes.skyLighting, [
    { label: "None", value: SKY_LIGHT_NONE },
    { label: "Dim", value: SKY_LIGHT_DIM },
    { label: "Normal", value: SKY_LIGHT_NORMAL },
  ]);

  // 0.9 is mobile default
  setOptionsForSelect(
    appNodes.scaleFactor,
    [0.5, 0.62, 0.75, 0.9, 1.0, 1.5, 2.0].map((value) => ({
      value: value.toFixed(2),
      label: `${value * 100}%`,
    }))
  );

  // Begin simulation
  togglePause(false);

  // initial render
  renderApp(store.state);

  // Apply initial config
  configDidUpdate();
}

// Kick things off.
function setLoadingStatus(status) {
  document.querySelector(".loading-init__status").textContent = status;
}

// Compute initial dimensions
handleResize();
window.addEventListener("resize", handleResize);

// CodePen profile header doesn't need audio, just initialize.
if (IS_HEADER) {
  init();
} else {
  // Allow status to render, then preload assets and start app.
  setLoadingStatus("Lighting Fuses");
  setTimeout(() => {
    soundManager.preload().then(init, (reason) => {
      // Codepen preview doesn't like to load the audio, so just init to fix the preview for now.
      init();
      // setLoadingStatus('Error Loading Audio');
      return Promise.reject(reason);
    });
  }, 0);
}