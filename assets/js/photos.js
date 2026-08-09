(function () {
  function build(count, folder, prefix, ext, altPrefix, overlayLabel, titlePrefix, meta) {
    return Array.from({ length: count }, (_, index) => {
      const no = String(index + 1).padStart(2, "0");

      return {
        src: `${folder}/${prefix}${no}${ext}`,
        no,
        alt: `${altPrefix} ${no}`,
        overlay: `${overlayLabel} / NO.${no}`,
        title: `${titlePrefix} ${no}`,
        meta
      };
    });
  }

  window.FOTOZAKI_PHOTOS = {
    collections: {
      street: build(65, "images/street", "S", ".jpg", "Street Photography", "STREET", "Scene", "FOTOZAKI"),
      bw: build(15, "images/BW", "B", ".jpg", "B&W Photography", "MONO", "Frame", "MONOCHROME"),
      landscape: build(25, "images/landscape", "L", ".jpg", "Landscape Photography", "LANDSCAPE", "View", "NATURE"),
      portrait: build(12, "images/portrait", "P", ".jpg", "Portrait Photography", "PORTRAIT", "Face", "HUMANITY")
    }
  };
})();
