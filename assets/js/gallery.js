(function () {
  const collectionSettings = {
    street: {
      fallbackLabel: "STREET",
      fallbackTitlePrefix: "Scene",
      fallbackMeta: "FOTOZAKI",
      fallbackAlt: "Street Photography"
    },
    bw: {
      fallbackLabel: "MONO",
      fallbackTitlePrefix: "Frame",
      fallbackMeta: "MONOCHROME",
      fallbackAlt: "B&W Photography"
    },
    landscape: {
      fallbackLabel: "LANDSCAPE",
      fallbackTitlePrefix: "View",
      fallbackMeta: "NATURE",
      fallbackAlt: "Landscape Photography"
    },
    portrait: {
      fallbackLabel: "PORTRAIT",
      fallbackTitlePrefix: "Face",
      fallbackMeta: "HUMANITY",
      fallbackAlt: "Portrait Photography"
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function photoNumber(photo, index) {
    if (photo.no) {
      return String(photo.no);
    }

    const match = String(photo.src || "").match(/(\d+)(?=\.[^.]+$)/);
    return match ? match[1].padStart(2, "0") : String(index + 1).padStart(2, "0");
  }

  window.renderFotozakiGallery = function renderFotozakiGallery(collectionKey) {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    const key = collectionKey || grid.dataset.collection;
    const settings = collectionSettings[key] || collectionSettings.street;
    const manifest = window.FOTOZAKI_PHOTOS || {};
    const photos = (manifest.collections && manifest.collections[key]) || [];

    grid.innerHTML = photos.map((photo, index) => {
      const no = photoNumber(photo, index);
      const src = escapeHtml(photo.src);
      const alt = escapeHtml(photo.alt || `${settings.fallbackAlt} ${no}`);
      const overlay = escapeHtml(photo.overlay || `${settings.fallbackLabel} / NO.${no}`);
      const title = escapeHtml(photo.title || `${settings.fallbackTitlePrefix} ${no}`);
      const meta = escapeHtml(photo.meta || settings.fallbackMeta);

      return `
        <div class="grid-item">
          <div class="photo-card">
            <img src="${src}" loading="lazy" decoding="async" alt="${alt}">
            <div class="hover-overlay">
              <div class="overlay-text">${overlay}</div>
            </div>
          </div>
          <div class="photo-info">
            <div class="item-name">${title}</div>
            <div class="item-meta">${meta}</div>
          </div>
        </div>
      `;
    }).join("");
  };
})();
