function refId(name) {
  return name
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .replace(/[^A-Za-z0-9]/g, "_")
    .replace(/_(_+)/g, "_")
    .toLowerCase();
}

function setMissing(key, missing) {
  if (missing) {
    elementMap[key].root.classList.add("missing");
  } else {
    elementMap[key].root.classList.remove("missing");
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  const removeToast = () => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  };

  const timeout = setTimeout(removeToast, 4000);

  toast.addEventListener('click', () => {
    clearTimeout(timeout);
    removeToast();
  });
}

const atlasSize = { w: 16 * 32, h: 16 * 32 };

function draw(fullAtlas = false) {
  const currentAtlasW = 32 * cellSize.x;
  const currentAtlasH = 32 * cellSize.y;

  if (fullAtlas) {
    canvas.width = currentAtlasW;
    canvas.height = currentAtlasH;
  } else {
    canvas.width = Math.min(currentAtlasW, 512);
    canvas.height = 112;
  }

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const texture in MAP) {
    let srcTex = baseTexture;
    let srcW = 16;
    let srcH = 16;
    let srcX = MAP[texture].locations[0].x;
    let srcY = MAP[texture].locations[0].y;
    const id = refId(texture);
    if (textureMap[id]) {
      srcTex = textureMap[id];
      srcX = srcY = 0;
      srcW = srcTex.width;
      srcH = srcTex.height;
    }
    for (const { x, y } of MAP[texture].locations) {
      ctx.drawImage(
        srcTex,
        srcX,
        srcY,
        srcW,
        srcH,
        (x / 16) * cellSize.x,
        (y / 16) * cellSize.y,
        cellSize.x,
        cellSize.y
      );
    }
  }
  ctx.drawImage(solidColors, 0, 0, currentAtlasW, currentAtlasH);


  if (highlightedTextureName && MAP[highlightedTextureName]) {
    ctx.strokeStyle = "rgba(255, 190, 15, 0.8)";
    ctx.lineWidth = 2;
    for (const { x, y } of MAP[highlightedTextureName].locations) {
      ctx.strokeRect(
        (x / 16) * cellSize.x + 1,
        (y / 16) * cellSize.y + 1,
        cellSize.x - 2,
        cellSize.y - 2
      );
    }
  }


  if (hoveredCanvasBlock) {
    ctx.fillStyle = "rgba(255, 190, 15, 0.4)";
    for (const { x, y } of hoveredCanvasBlock.locations) {
      ctx.fillRect(
        (x / 16) * cellSize.x,
        (y / 16) * cellSize.y,
        cellSize.x,
        cellSize.y
      );
    }
  }
}

function resize(w, h) {
  cellSize.x = w;
  cellSize.y = h;
  draw();
}

const listTarget = document.getElementById("list-target");
const elementMap = {};
const textureMap = {};
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");
const solidColors = new Image();
const baseTexture = new Image();
const dropTarget = document.getElementById("drop-target");
const dropInput = document.getElementById("import");
const cellSize = { x: 16, y: 16 };
const downloadButton = document.getElementById("download");
const downloadLink = document.getElementById("download-a");

let highlightedTextureName = null;
let hoveredCanvasBlock = null;

const searchInput = document.getElementById("search-input");
const sortOrder = document.getElementById("sort-order");
const tagDropdown = document.getElementById("tag-dropdown");
const tagSelectTrigger = document.getElementById("tag-select-trigger");
const tagCountText = document.getElementById("tag-count");
const logicOrBtn = document.getElementById("logic-or");
const logicAndBtn = document.getElementById("logic-and");

let selectedTags = new Set();
let logicMode = "OR";

function extractUniqueTags() {
  const tags = new Set();
  for (const key in MAP) {
    tags.add(MAP[key].category);
    MAP[key].tags.forEach(t => tags.add(t));
  }
  return Array.from(tags).sort();
}

function buildTagDropdown() {
  const tags = extractUniqueTags();
  tagDropdown.innerHTML = "";
  tags.forEach(tag => {
    const item = document.createElement("div");
    item.className = "tag-item";
    item.innerHTML = `
      <input type="checkbox" ${selectedTags.has(tag) ? 'checked' : ''}>
      <span>${tag}</span>
    `;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }
      updateTagUI();
      renderList();
    });
    tagDropdown.appendChild(item);
  });
}

function updateTagUI() {
  const count = selectedTags.size;
  tagCountText.textContent = count === 0 ? "Filter by tags..." : `${count} tag${count > 1 ? 's' : ''} selected`;

  Array.from(tagDropdown.children).forEach(item => {
    const tag = item.querySelector("span").textContent;
    if (selectedTags.has(tag)) {
      item.classList.add("selected");
      item.querySelector("input").checked = true;
    } else {
      item.classList.remove("selected");
      item.querySelector("input").checked = false;
    }
  });
}

tagSelectTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  tagDropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  tagDropdown.classList.remove("show");
});

logicOrBtn.addEventListener("click", () => {
  logicMode = "OR";
  logicOrBtn.classList.add("active");
  logicAndBtn.classList.remove("active");
  renderList();
});

logicAndBtn.addEventListener("click", () => {
  logicMode = "AND";
  logicAndBtn.classList.add("active");
  logicOrBtn.classList.remove("active");
  renderList();
});

function renderList() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeSort = sortOrder.value;

  const hasAnyCustom = Object.keys(textureMap).length > 0;
  const listHeader = document.querySelector(".list-header");
  const customHeader = document.querySelector(".header-custom");

  if (hasAnyCustom) {
    customHeader.style.display = "block";
  } else {
    customHeader.style.display = "none";
  }

  listTarget.innerHTML = "";

  let blockKeys = Object.keys(MAP);

  blockKeys = blockKeys.filter(key => {
    const meta = MAP[key];
    const allBlockTags = [meta.category, ...meta.tags];

    const matchesSearch = key.toLowerCase().includes(searchTerm) ||
      allBlockTags.some(t => t.toLowerCase().includes(searchTerm));

    if (!matchesSearch) return false;

    if (selectedTags.size === 0) return true;

    const tagsArray = Array.from(selectedTags);
    if (logicMode === "OR") {
      return tagsArray.some(t => allBlockTags.includes(t));
    } else {
      return tagsArray.every(t => allBlockTags.includes(t));
    }
  });

  blockKeys.sort((a, b) => {
    if (activeSort === "alpha") {
      return a.localeCompare(b);
    } else {
      const locA = MAP[a].locations[0];
      const locB = MAP[b].locations[0];
      if (locA.y !== locB.y) return locA.y - locB.y;
      return locA.x - locB.x;
    }
  });

  blockKeys.forEach(textureName => {
    const meta = MAP[textureName];
    const ref = refId(textureName);
    const locations = meta.locations;
    const element = document.createElement("li");
    const thumbGroup = document.createElement("div");
    thumbGroup.className = "thumb-group";

    const thumbnail = document.createElement("div");
    thumbnail.style.backgroundPositionX = `-${locations[0].x * 2}px`;
    thumbnail.style.backgroundPositionY = `-${locations[0].y * 2}px`;
    thumbnail.classList.add("thumbnail");
    thumbGroup.appendChild(thumbnail);

    if (hasAnyCustom) {
      if (textureMap[ref]) {
        const uploadedThumb = document.createElement("div");
        uploadedThumb.classList.add("thumbnail", "uploaded");
        uploadedThumb.style.backgroundImage = `url(${textureMap[ref].src})`;
        thumbGroup.appendChild(uploadedThumb);
      } else {
        const spacer = document.createElement("div");
        spacer.style.width = "32px";
        thumbGroup.appendChild(spacer);
      }
    }

    element.appendChild(thumbGroup);

    const nameSpan = document.createElement("span");
    nameSpan.textContent = textureName;
    element.appendChild(nameSpan);

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-item-btn";
    copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    copyBtn.title = "Copy block name";
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(textureName);
      copyBtn.classList.add("copied");
      setTimeout(() => copyBtn.classList.remove("copied"), 1000);
    });
    element.appendChild(copyBtn);

    if (textureMap[ref]) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-item-btn";
      removeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
      removeBtn.title = "Remove custom texture";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Remove custom texture for ${textureName}?`)) {
          delete textureMap[ref];
          localStorage.removeItem(`protox_${ref}`);
          setMissing(ref, true);
          draw();
          renderList();
        }
      });
      element.appendChild(removeBtn);
    }

    element.addEventListener("mouseenter", () => {
      highlightedTextureName = textureName;
      draw();
    });

    element.addEventListener("mouseleave", () => {
      if (highlightedTextureName === textureName) {
        highlightedTextureName = null;
        draw();
      }
    });

    elementMap[ref] = { root: element };
    listTarget.appendChild(element);
    setMissing(ref, !textureMap[ref]);
  });
}

searchInput.addEventListener("input", renderList);
sortOrder.addEventListener("change", renderList);

buildTagDropdown();

resize(16, 16);

solidColors.src = "assets/solidColors.png";
solidColors.addEventListener("load", () => draw());

baseTexture.src = "assets/baseTexture.png";
baseTexture.addEventListener("load", () => {
  draw();
  renderList();
});

window.addEventListener("drop", (event) => {
  if ([...event.dataTransfer.items].some((item) => item.kind === "file")) {
    event.preventDefault();
  }
});

window.addEventListener("dragover", (event) => {
  if (
    Array.from(event.dataTransfer.items).some((item) => item.kind === "file")
  ) {
    event.preventDefault();
    if (!dropTarget.contains(event.target)) {
      event.dataTransfer.dropEffect = "none";
    }
  }
});

dropTarget.addEventListener("dragover", (event) => {
  const items = Array.from(event.dataTransfer.items);
  if (items.some((item) => item.kind === "file")) {
    event.preventDefault();
    event.dataTransfer.dropEffect = items.some((item) =>
      item.type.startsWith("image/")
    )
      ? "copy"
      : "none";
  }
});

const clearCacheButton = document.getElementById("clear-cache");

function saveTexture(id, img) {
  try {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    localStorage.setItem(`protox_${id}`, c.toDataURL());
  } catch (e) {
    console.warn("Failed to save texture", e);
  }
}

function loadFromCache() {
  for (const textureName of Object.keys(MAP)) {
    const id = refId(textureName);
    const data = localStorage.getItem(`protox_${id}`);
    if (data) {
      const img = new Image();
      img.onload = () => {
        textureMap[id] = img;
        setMissing(id, false);
        if (cellSize.x !== img.width || cellSize.y !== img.height) {
          cellSize.x = img.width;
          cellSize.y = img.height;
          resize(cellSize.x, cellSize.y);
        }
        draw();
      };
      img.src = data;
    }
  }
}

clearCacheButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the cached textures?")) {
    localStorage.clear();
    location.reload();
  }
});

loadFromCache();

const importAtlasBtn = document.getElementById("import-ui-btn");
const importAtlasInput = document.getElementById("import-atlas-input");

importAtlasBtn.addEventListener("click", () => importAtlasInput.click());

importAtlasInput.addEventListener("change", () => {
  if (importAtlasInput.files && importAtlasInput.files[0]) {
    const file = importAtlasInput.files[0];
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      splitAtlas(img);
    };
    img.src = url;
  }
});

function splitAtlas(atlasImg) {
  const newCellSize = atlasImg.width / 32;
  cellSize.x = newCellSize;
  cellSize.y = newCellSize;
  resize(cellSize.x, cellSize.y);

  const canvas = document.createElement('canvas');
  canvas.width = atlasImg.width;
  canvas.height = atlasImg.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(atlasImg, 0, 0);

  for (const textureName of Object.keys(MAP)) {
    const locations = MAP[textureName].locations;
    if (!locations || locations.length === 0) continue;

    const { x, y } = locations[0];

    const data = ctx.getImageData((x / 16) * cellSize.x, (y / 16) * cellSize.y, cellSize.x, cellSize.y);

    const texCanvas = document.createElement('canvas');
    texCanvas.width = cellSize.x;
    texCanvas.height = cellSize.y;
    texCanvas.getContext('2d').putImageData(data, 0, 0);

    const id = refId(textureName);
    const img = new Image();
    img.onload = () => {
      textureMap[id] = img;
      setMissing(id, false);
      saveTexture(id, img);
      draw();
      renderList();
    };
    img.src = texCanvas.toDataURL();
  }
}

const fileCallback = (files) => {
  for (const file of files) {
    const fileName = file.name.split(".").slice(0, -1).join(".");
    const id = refId(fileName);
    const isValidName = Object.keys(MAP).some((key) => refId(key) === id);

    if (isValidName) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.addEventListener("load", () => {
        if (img.width !== 16 || img.height !== 16) {
          showToast(`Texture '${fileName}' is ${img.width}x${img.height}. Standard size is 16x16.`, 'warning');
        }

        setMissing(id, false);
        textureMap[id] = img;
        saveTexture(id, img);
        if (cellSize.x !== img.width || cellSize.y !== img.height) {
          cellSize.x = img.width;
          cellSize.y = img.height;
          resize(cellSize.x, cellSize.y);
        }
        draw();
        renderList();
      });
    } else {
      showToast(`Texture '${fileName}' does not match any required block.`, 'error');
    }
  }
};

dropTarget.addEventListener("drop", (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.items)
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile());
  fileCallback(files);
});

dropInput.addEventListener("change", () => {
  if (
    dropInput.files &&
    Array.from(dropInput.files).some((file) => file.type.startsWith("image/"))
  ) {
    fileCallback(
      Array.from(dropInput.files).filter((file) => file.type.startsWith("image/"))
    );
  }
});

downloadButton.addEventListener("click", () => {
  draw(true);
  const url = canvas.toDataURL("image/png");
  draw();
  downloadLink.href = url;
  downloadLink.click();
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const gridX = Math.floor(x / cellSize.x) * 16;
  const gridY = Math.floor(y / cellSize.y) * 16;

  for (const textureName in MAP) {
    const locations = MAP[textureName].locations;
    if (locations.some(loc => loc.x === gridX && loc.y === gridY)) {
      const ref = refId(textureName);
      const element = elementMap[ref]?.root;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add("flash-highlight");
        setTimeout(() => element.classList.remove("flash-highlight"), 1000);
      }
      break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const gridX = Math.floor(x / cellSize.x) * 16;
  const gridY = Math.floor(y / cellSize.y) * 16;

  let newHoveredBlock = null;
  for (const textureName in MAP) {
    if (MAP[textureName].locations.some(loc => loc.x === gridX && loc.y === gridY)) {
      newHoveredBlock = MAP[textureName];
      break;
    }
  }

  if (hoveredCanvasBlock !== newHoveredBlock) {
    hoveredCanvasBlock = newHoveredBlock;
    draw();
  }
});

canvas.addEventListener("mouseleave", () => {
  hoveredCanvasBlock = null;
  draw();
});

