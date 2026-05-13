const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const versionSelect = document.getElementById("versionSelect");

const fields = {
  name: document.getElementById("nameInput"),
  address: document.getElementById("addressInput"),
  birthday: document.getElementById("birthdayInput"),
  expires: document.getElementById("expiresInput"),
  sex: document.getElementById("sexInput"),
  hair: document.getElementById("hairInput"),
  eyes: document.getElementById("eyesInput"),
  signature: document.getElementById("signatureInput"),
};

const photoInput = document.getElementById("photoInput");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

const photoZoomInput = document.getElementById("photoZoomInput");
const photoOffsetXInput = document.getElementById("photoOffsetXInput");
const photoOffsetYInput = document.getElementById("photoOffsetYInput");
const resetPhotoBtn = document.getElementById("resetPhotoBtn");

const photoAdjust = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

let uploadedPhoto = null;
let baseImage = new Image();

const overlayImages = new Map();

const birthdayDaySelect = document.getElementById("birthdayDay");
const birthdayMonthSelect = document.getElementById("birthdayMonth");
const birthdayYearSelect = document.getElementById("birthdayYear");

let generatedCardNumber = makeCardNumber();

function getGermanDate(date = new Date()) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getCompactGermanDate(date = new Date()) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll(".", "");
}

function makeCardNumber() {
  const datePart = getCompactGermanDate();
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `GURK-${randomPart}-${datePart}`;
}

const cardTemplates = {
  gurkistan_licence_1: {
    label: "Gurkistan Lizenz 1",
    src: "assets/gurkistan_licence_1.jpeg",
    width: 640,
    height: 410,

    defaults: {
      name: "Gurke Gurkensen",
      address: "",
      birthday: "01.01.2000",
      expires: "01.01.2099",
      sex: "",
      hair: "",
      eyes: "",
      signature: "",
    },

    visibleFields: ["name", "birthday"],

    photo: {
      x: 50,
      y: 126,
      w: 160,
      h: 160,
      rounded: 0,
    },

    text: [
      {
        field: "name",
        x: 325,
        y: 132,
        size: 22,
        maxWidth: 260,
        color: "#050505",
        family: "'Balsamiq Sans', 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "700",
        rough: true,
        uppercase: true,
      },
      {
        field: "birthday",
        x: 434,
        y: 185,
        size: 22,
        maxWidth: 185,
        color: "#050505",
        family: "'Balsamiq Sans', 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "700",
        rough: true,
        uppercase: true,
      },
      {
        auto: "issued",
        x: 434,
        y: 233,
        size: 22,
        maxWidth: 185,
        color: "#050505",
        family: "'Balsamiq Sans', 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "700",
        rough: true,
        uppercase: true,
      },
    ],
  },

  gurkistan_licence_2: {
    label: "Gurkistan Lizenz 2",
    src: "assets/gurkistan_licence_2.webp",
    width: 800,
    height: 500,

    defaults: {
      name: "Gurke Gurkensen",
      address: "Gurkistanstrasse 1, 12345 Gurkstadt",
      birthday: "01.01.2000",
      expires: "01.01.2099",
      sex: "Gurkengeschlecht",
      hair: "GurkenGrün",
      eyes: "GurkenGrün",
      signature: "G. Gurkensen",
    },

    visibleFields: [
      "name",
      "address",
      "birthday",
      "sex",
      "hair",
      "eyes",
      "signature",
    ],

    photo: {
      x: 27,
      y: 163,
      w: 205,
      h: 260,
      rounded: 0,
    },

    text: [
      {
        auto: "fixedExpires",
        x: 114,
        y: 150,
        size: 18,
        maxWidth: 130,
        color: "rgba(56, 43, 38, 0.92)",
        family: "Georgia, serif",
      },
      {
        auto: "cardNumber",
        x: 440,
        y: 164,
        size: 17,
        maxWidth: 210,
        color: "rgba(80, 80, 80, 0.72)",
        family: "Georgia, serif",
        weight: "700",
      },
      {
        field: "name",
        x: 323,
        y: 239,
        size: 21,
        maxWidth: 225,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "address",
        x: 330,
        y: 303,
        size: 21,
        maxWidth: 215,
        maxLines: 2,
        lineHeight: 21,
        wrap: true,

        // y positions depending on how many lines the address actually uses
        yByLineCount: {
          1: 303,
          2: 305
        },

        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "birthday",
        x: 330,
        y: 369,
        size: 21,
        maxWidth: 195,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "sex",
        x: 630,
        y: 235,
        size: 18,
        maxWidth: 148,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "hair",
        x: 630,
        y: 258,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "eyes",
        x: 630,
        y: 281,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "signature",
        x: 530,
        y: 447,
        size: 17,
        maxWidth: 150,
        color: "rgba(120, 95, 80, 0.62)",
        family: "Georgia, serif",
      },
    ],
  },
};

cardTemplates.gurkistan_licence_1.borderOverlay = {
  src: "assets/border.jpeg",

  // Makes the drawn frame slightly bigger around the profile picture.
  paddingX: 19,
  paddingY: 18,

  // Crops away messy outside parts of border.jpeg before drawing it.
  // Increase these if you still see unwanted black edge lines.
  crop: {
    left: 0.055,
    top: 0.055,
    right: 0.055,
    bottom: 0.055,
  },

  // Hole inside the cropped border image.
  // Lower numbers = frame covers less of the profile picture.
  hole: {
    left: 0.13,
    top: 0.14,
    right: 0.13,
    bottom: 0.10,
  },
};

let currentTemplateKey = "gurkistan_licence_1";

function getTemplate() {
  return cardTemplates[currentTemplateKey];
}

function buildFont(size, item) {
  const weight = item.weight || "400";
  const family = item.family || "Arial, sans-serif";

  return `${weight} ${size}px ${family}`;
}

function fitText(text, maxWidth, fontStart, item) {
  let size = fontStart;

  do {
    ctx.font = buildFont(size, item);

    if (ctx.measureText(text).width <= maxWidth) {
      return buildFont(size, item);
    }

    size -= 1;
  } while (size > 9);

  return buildFont(size, item);
}

function drawNormalText(text, item) {
  ctx.save();

  ctx.fillStyle = item.color || "#111";
  ctx.textAlign = item.align || "left";
  ctx.textBaseline = item.baseline || "middle";
  ctx.font = fitText(text, item.maxWidth || 240, item.size || 24, item);

  ctx.fillText(text, item.x, item.y);

  ctx.restore();
}

function getWrappedLines(text, item) {
  const maxWidth = item.maxWidth || 240;
  const maxLines = item.maxLines || 3;
  const words = String(text || "").split(/\s+/).filter(Boolean);

  const lines = [];
  let currentLine = "";

  ctx.font = buildFont(item.size || 24, item);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;

      if (lines.length >= maxLines) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const lastIndex = lines.length - 1;

  if (lastIndex >= 0) {
    let lastLine = lines[lastIndex];

    while (ctx.measureText(`${lastLine}…`).width > maxWidth && lastLine.length > 1) {
      lastLine = lastLine.slice(0, -1);
    }

    const remainingWords = words.join(" ");
    const drawnText = lines.join(" ");

    if (remainingWords.length > drawnText.length) {
      lines[lastIndex] = `${lastLine}…`;
    }
  }

  return lines;
}

function drawWrappedText(text, item) {
  ctx.save();

  const size = item.size || 24;
  const lineHeight = item.lineHeight || Math.round(size * 1.18);

  ctx.fillStyle = item.color || "#111";
  ctx.textAlign = item.align || "left";
  ctx.textBaseline = item.baseline || "middle";
  ctx.font = buildFont(size, item);

  const lines = getWrappedLines(text, item);

  const yByLineCount = item.yByLineCount || {};
  const baseY = yByLineCount[lines.length] ?? item.y;

  for (let i = 0; i < lines.length; i += 1) {
    ctx.fillText(lines[i], item.x, baseY + i * lineHeight);
  }

  ctx.restore();
}

function drawRoughText(text, item) {
  ctx.save();

  ctx.fillStyle = item.color || "#000";
  ctx.textAlign = item.align || "left";
  ctx.textBaseline = "middle";
  ctx.font = fitText(text, item.maxWidth || 240, item.size || 24, item);

  const offsets = [
    [0, 0],
    [0.25, 0],
    [-0.18, 0.12],
  ];

  for (const [ox, oy] of offsets) {
    ctx.fillText(text, item.x + ox, item.y + oy);
  }

  ctx.restore();
}

function getTextValue(item) {
  if (item.auto === "issued") {
    return `${item.prefix || ""}${getGermanDate()}`;
  }

  if (item.auto === "fixedExpires") {
    return "01.01.2099";
  }

  if (item.auto === "cardNumber") {
    return generatedCardNumber;
  }

  const input = fields[item.field];

  if (!input) return "";

  let value = String(input.value || "").trim();

  if (item.uppercase) {
    value = value.toUpperCase();
  }

  return value;
}

function drawTemplateText() {
  const template = getTemplate();

  for (const item of template.text) {
    const value = getTextValue(item);

    if (!value) continue;

    if (item.wrap) {
      drawWrappedText(value, item);
    } else if (item.rough) {
      drawRoughText(value, item);
    } else {
      drawNormalText(value, item);
    }
  }
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPhoto() {
  const template = getTemplate();
  const photo = template.photo;

  if (!uploadedPhoto || !photo) return;

  ctx.save();

  if (photo.rounded && photo.rounded > 0) {
    roundedRect(photo.x, photo.y, photo.w, photo.h, photo.rounded);
    ctx.clip();
  } else {
    ctx.beginPath();
    ctx.rect(photo.x, photo.y, photo.w, photo.h);
    ctx.clip();
  }

  const imgRatio = uploadedPhoto.width / uploadedPhoto.height;
  const boxRatio = photo.w / photo.h;

  let drawW = photo.w;
  let drawH = photo.h;
  let drawX = photo.x;
  let drawY = photo.y;

  if (imgRatio > boxRatio) {
    drawH = photo.h;
    drawW = photo.h * imgRatio;
    drawX = photo.x - (drawW - photo.w) / 2;
  } else {
    drawW = photo.w;
    drawH = photo.w / imgRatio;
    drawY = photo.y - (drawH - photo.h) / 2;
  }

  const zoom = Number(photoAdjust.zoom || 1);
  const zoomedW = drawW * zoom;
  const zoomedH = drawH * zoom;

  drawX = photo.x + (photo.w - zoomedW) / 2 + Number(photoAdjust.offsetX || 0);
  drawY = photo.y + (photo.h - zoomedH) / 2 + Number(photoAdjust.offsetY || 0);

  ctx.drawImage(uploadedPhoto, drawX, drawY, zoomedW, zoomedH);

  ctx.restore();
}

function loadOverlayImage(src) {
  if (!src) return null;

  if (overlayImages.has(src)) {
    return overlayImages.get(src);
  }

  const img = new Image();
  img.onload = drawCard;
  img.src = src;

  overlayImages.set(src, img);

  return img;
}

function drawImagePiece(img, sx, sy, sw, sh, dx, dy, dw, dh) {
  if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return;

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawBorderOverlay() {
  const template = getTemplate();

  if (!template.borderOverlay || !template.photo) return;

  const overlay = template.borderOverlay;
  const img = loadOverlayImage(overlay.src);

  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

  const photo = template.photo;

  const dx = photo.x - (overlay.paddingX || 0);
  const dy = photo.y - (overlay.paddingY || 0);
  const dw = photo.w + (overlay.paddingX || 0) * 2;
  const dh = photo.h + (overlay.paddingY || 0) * 2;

  const crop = overlay.crop || {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  const rawW = img.naturalWidth;
  const rawH = img.naturalHeight;

  const sx = rawW * crop.left;
  const sy = rawH * crop.top;
  const sw = rawW * (1 - crop.left - crop.right);
  const sh = rawH * (1 - crop.top - crop.bottom);

  const hole = overlay.hole || {
    left: 0.13,
    top: 0.14,
    right: 0.13,
    bottom: 0.10,
  };

  const holeSx = sx + sw * hole.left;
  const holeSy = sy + sh * hole.top;
  const holeSw = sw * (1 - hole.left - hole.right);
  const holeSh = sh * (1 - hole.top - hole.bottom);

  const holeDx = dx + dw * hole.left;
  const holeDy = dy + dh * hole.top;
  const holeDw = dw * (1 - hole.left - hole.right);
  const holeDh = dh * (1 - hole.top - hole.bottom);

  ctx.save();

  // Top
  drawImagePiece(
    img,
    sx,
    sy,
    sw,
    holeSy - sy,
    dx,
    dy,
    dw,
    holeDy - dy
  );

  // Bottom
  drawImagePiece(
    img,
    sx,
    holeSy + holeSh,
    sw,
    sy + sh - (holeSy + holeSh),
    dx,
    holeDy + holeDh,
    dw,
    dy + dh - (holeDy + holeDh)
  );

  // Left
  drawImagePiece(
    img,
    sx,
    holeSy,
    holeSx - sx,
    holeSh,
    dx,
    holeDy,
    holeDx - dx,
    holeDh
  );

  // Right
  drawImagePiece(
    img,
    holeSx + holeSw,
    holeSy,
    sx + sw - (holeSx + holeSw),
    holeSh,
    holeDx + holeDw,
    holeDy,
    dx + dw - (holeDx + holeDw),
    holeDh
  );

  ctx.restore();
}

function drawCard() {
  const template = getTemplate();

  canvas.width = template.width;
  canvas.height = template.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  drawPhoto();
  drawBorderOverlay();
  drawTemplateText();
}

function setFieldVisibility() {
  const template = getTemplate();
  const visible = new Set(template.visibleFields || []);

  for (const [key, input] of Object.entries(fields)) {
    const wrapper = input.closest(".field");

    if (!wrapper) continue;

    wrapper.style.display = visible.has(key) ? "" : "none";
  }
}

function loadTemplate(key) {
  currentTemplateKey = key;

  const template = getTemplate();

  canvas.width = template.width;
  canvas.height = template.height;

  for (const [field, input] of Object.entries(fields)) {
    if (template.defaults[field] !== undefined) {
      input.value = template.defaults[field];
    }
  }
  
  syncBirthdaySelectsFromInput();

  setFieldVisibility();
  resetPhotoAdjust(false);

  baseImage = new Image();
  baseImage.onload = drawCard;
  baseImage.src = template.src;
}

function downloadPng() {
  drawCard();

  const link = document.createElement("a");
  link.download = `${currentTemplateKey}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function resetForm() {
  const template = getTemplate();

  generatedCardNumber = makeCardNumber();

  for (const [field, input] of Object.entries(fields)) {
    if (template.defaults[field] !== undefined) {
      input.value = template.defaults[field];
    }
  }

  syncBirthdaySelectsFromInput();

  photoInput.value = "";
  uploadedPhoto = null;
  resetPhotoAdjust(false);
  drawCard();
}
function syncPhotoAdjustFromControls() {
  if (photoZoomInput) {
    photoAdjust.zoom = Number(photoZoomInput.value || 1);
  }

  if (photoOffsetXInput) {
    photoAdjust.offsetX = Number(photoOffsetXInput.value || 0);
  }

  if (photoOffsetYInput) {
    photoAdjust.offsetY = Number(photoOffsetYInput.value || 0);
  }

  drawCard();
}

function resetPhotoAdjust(redraw = true) {
  photoAdjust.zoom = 1;
  photoAdjust.offsetX = 0;
  photoAdjust.offsetY = 0;

  if (photoZoomInput) photoZoomInput.value = "1";
  if (photoOffsetXInput) photoOffsetXInput.value = "0";
  if (photoOffsetYInput) photoOffsetYInput.value = "0";

  if (redraw) {
    drawCard();
  }
}

function setupPhotoControls() {
  if (photoZoomInput) {
    photoZoomInput.addEventListener("input", syncPhotoAdjustFromControls);
  }

  if (photoOffsetXInput) {
    photoOffsetXInput.addEventListener("input", syncPhotoAdjustFromControls);
  }

  if (photoOffsetYInput) {
    photoOffsetYInput.addEventListener("input", syncPhotoAdjustFromControls);
  }

  if (resetPhotoBtn) {
    resetPhotoBtn.addEventListener("click", () => {
      resetPhotoAdjust(true);
    });
  }
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function fillBirthdaySelects() {
  if (!birthdayDaySelect || !birthdayMonthSelect || !birthdayYearSelect) return;

  birthdayMonthSelect.innerHTML = "";
  birthdayYearSelect.innerHTML = "";

  for (let month = 1; month <= 12; month += 1) {
    const option = document.createElement("option");
    option.value = pad2(month);
    option.textContent = pad2(month);
    birthdayMonthSelect.appendChild(option);
  }

  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1900; year -= 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    birthdayYearSelect.appendChild(option);
  }
}

function fillBirthdayDays(selectedDay = "01") {
  if (!birthdayDaySelect || !birthdayMonthSelect || !birthdayYearSelect) return;

  const month = Number(birthdayMonthSelect.value || "1");
  const year = Number(birthdayYearSelect.value || "2000");
  const maxDays = getDaysInMonth(month, year);

  birthdayDaySelect.innerHTML = "";

  for (let day = 1; day <= maxDays; day += 1) {
    const option = document.createElement("option");
    option.value = pad2(day);
    option.textContent = pad2(day);
    birthdayDaySelect.appendChild(option);
  }

  const safeDay = Math.min(Number(selectedDay || "1"), maxDays);
  birthdayDaySelect.value = pad2(safeDay);
}

function syncBirthdaySelectsFromInput() {
  if (!fields.birthday || !birthdayDaySelect || !birthdayMonthSelect || !birthdayYearSelect) return;

  const parts = String(fields.birthday.value || "01.01.2000").split(".");
  const day = parts[0] || "01";
  const month = parts[1] || "01";
  const year = parts[2] || "2000";

  birthdayMonthSelect.value = pad2(Number(month) || 1);
  birthdayYearSelect.value = String(Number(year) || 2000);

  fillBirthdayDays(day);
  updateBirthdayInputFromSelects(false);
}

function updateBirthdayInputFromSelects(redraw = true) {
  if (!fields.birthday || !birthdayDaySelect || !birthdayMonthSelect || !birthdayYearSelect) return;

  const day = birthdayDaySelect.value || "01";
  const month = birthdayMonthSelect.value || "01";
  const year = birthdayYearSelect.value || "2000";

  fields.birthday.value = `${day}.${month}.${year}`;

  if (redraw) {
    drawCard();
  }
}

function setupBirthdaySelects() {
  if (!birthdayDaySelect || !birthdayMonthSelect || !birthdayYearSelect) return;

  fillBirthdaySelects();
  syncBirthdaySelectsFromInput();

  birthdayDaySelect.addEventListener("change", () => {
    updateBirthdayInputFromSelects(true);
  });

  birthdayMonthSelect.addEventListener("change", () => {
    const oldDay = birthdayDaySelect.value || "01";
    fillBirthdayDays(oldDay);
    updateBirthdayInputFromSelects(true);
  });

  birthdayYearSelect.addEventListener("change", () => {
    const oldDay = birthdayDaySelect.value || "01";
    fillBirthdayDays(oldDay);
    updateBirthdayInputFromSelects(true);
  });
}

for (const input of Object.values(fields)) {
  input.addEventListener("input", drawCard);
}

versionSelect.addEventListener("change", () => {
  loadTemplate(versionSelect.value);
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];

  if (!file) {
    uploadedPhoto = null;
    drawCard();
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
    uploadedPhoto = img;
    resetPhotoAdjust(false);
    drawCard();
  };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

downloadBtn.addEventListener("click", downloadPng);
resetBtn.addEventListener("click", resetForm);

setupBirthdaySelects();
setupPhotoControls();

document.fonts.ready.then(() => {
  loadTemplate(currentTemplateKey);
});