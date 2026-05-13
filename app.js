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
        x: 335,
        y: 141,
        size: 22,
        maxWidth: 260,
        color: "#050505",
        family: "'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "900",
        rough: true,
        uppercase: true,
      },
      {
        field: "birthday",
        x: 426,
        y: 188,
        size: 22,
        maxWidth: 185,
        color: "#050505",
        family: "'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "900",
        rough: true,
        uppercase: true,
      },
      {
        auto: "issued",
        x: 426,
        y: 233,
        size: 22,
        maxWidth: 185,
        color: "#050505",
        family: "'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif",
        weight: "900",
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
        y: 137,
        size: 18,
        maxWidth: 130,
        color: "rgba(56, 43, 38, 0.92)",
        family: "Georgia, serif",
      },
      {
        auto: "cardNumber",
        x: 470,
        y: 164,
        size: 16,
        maxWidth: 210,
        color: "rgba(80, 80, 80, 0.72)",
        family: "Georgia, serif",
        weight: "700",
      },
      {
        field: "name",
        x: 306,
        y: 224,
        size: 21,
        maxWidth: 225,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "address",
        x: 330,
        y: 290,
        size: 21,
        maxWidth: 215,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "birthday",
        x: 344,
        y: 356,
        size: 21,
        maxWidth: 195,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "sex",
        x: 632,
        y: 235,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "hair",
        x: 632,
        y: 258,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "eyes",
        x: 632,
        y: 281,
        size: 18,
        maxWidth: 110,
        color: "rgba(56, 43, 38, 0.80)",
        family: "Georgia, serif",
      },
      {
        field: "signature",
        x: 555,
        y: 447,
        size: 17,
        maxWidth: 150,
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

  generatedCardNumber = makeCardNumber();

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