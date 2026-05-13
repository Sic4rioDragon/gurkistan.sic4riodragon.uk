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

let uploadedPhoto = null;
let baseImage = new Image();

function getGermanDate(date = new Date()) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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
        x: 344,
        y: 128,
        size: 23,
        maxWidth: 255,
        color: "#050505",
        family: "'Arial Black', Impact, sans-serif",
        rough: true,
        uppercase: true,
      },
      {
        field: "birthday",
        x: 430,
        y: 173,
        size: 23,
        maxWidth: 185,
        color: "#050505",
        family: "'Arial Black', Impact, sans-serif",
        rough: true,
        uppercase: true,
      },
      {
        auto: "issued",
        x: 430,
        y: 218,
        size: 23,
        maxWidth: 185,
        color: "#050505",
        family: "'Arial Black', Impact, sans-serif",
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
      address: "Gurkistan",
      birthday: "01.01.2000",
      expires: "01.01.2099",
      sex: "Internet",
      hair: "Gurke",
      eyes: "Online",
      signature: "G. Gurkensen",
    },

    visibleFields: [
      "name",
      "address",
      "birthday",
      "expires",
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
        field: "expires",
        x: 104,
        y: 146,
        size: 18,
        maxWidth: 130,
        color: "rgba(56, 43, 38, 0.92)",
        family: "Georgia, serif",
      },
      {
        auto: "issued",
        prefix: "Ausgestellt: ",
        x: 462,
        y: 150,
        size: 14,
        maxWidth: 180,
        color: "rgba(90, 90, 90, 0.50)",
        family: "Georgia, serif",
      },
      {
        field: "name",
        x: 322,
        y: 224,
        size: 21,
        maxWidth: 210,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "address",
        x: 348,
        y: 290,
        size: 21,
        maxWidth: 200,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "birthday",
        x: 362,
        y: 356,
        size: 21,
        maxWidth: 180,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "sex",
        x: 617,
        y: 224,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "hair",
        x: 617,
        y: 247,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "eyes",
        x: 617,
        y: 270,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "signature",
        x: 617,
        y: 447,
        size: 17,
        maxWidth: 120,
        color: "rgba(120, 95, 80, 0.62)",
        family: "Georgia, serif",
      },
    ],
  },
};

let currentTemplateKey = "gurkistan_licence_1";

function getTemplate() {
  return cardTemplates[currentTemplateKey];
}

function fitText(text, maxWidth, fontStart, fontFamily) {
  let size = fontStart;

  do {
    ctx.font = `${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return `${size}px ${fontFamily}`;
    }
    size -= 1;
  } while (size > 9);

  return `${size}px ${fontFamily}`;
}

function drawNormalText(text, item) {
  ctx.save();
  ctx.fillStyle = item.color || "#111";
  ctx.textAlign = item.align || "left";
  ctx.textBaseline = "top";
  ctx.font = fitText(
    text,
    item.maxWidth || 240,
    item.size || 24,
    item.family || "Arial, sans-serif"
  );
  ctx.fillText(text, item.x, item.y);
  ctx.restore();
}

function drawRoughText(text, item) {
  ctx.save();
  ctx.fillStyle = item.color || "#000";
  ctx.textAlign = item.align || "left";
  ctx.textBaseline = "top";
  ctx.font = fitText(
    text,
    item.maxWidth || 240,
    item.size || 24,
    item.family || "Impact, sans-serif"
  );

  const offsets = [
    [0, 0],
    [0.35, 0],
    [-0.2, 0.15],
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

    if (item.rough) {
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

  ctx.drawImage(uploadedPhoto, drawX, drawY, drawW, drawH);
  ctx.restore();
}

function drawCard() {
  const template = getTemplate();

  canvas.width = template.width;
  canvas.height = template.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  drawPhoto();
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

  setFieldVisibility();

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

  for (const [field, input] of Object.entries(fields)) {
    if (template.defaults[field] !== undefined) {
      input.value = template.defaults[field];
    }
  }

  photoInput.value = "";
  uploadedPhoto = null;
  drawCard();
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
      drawCard();
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

downloadBtn.addEventListener("click", downloadPng);
resetBtn.addEventListener("click", resetForm);

loadTemplate(currentTemplateKey);