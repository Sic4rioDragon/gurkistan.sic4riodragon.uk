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

    photo: {
      x: 49,
      y: 126,
      w: 160,
      h: 160,
      rounded: 0,
    },

    text: [
      {
        field: "name",
        x: 430,
        y: 127,
        size: 25,
        maxWidth: 185,
        color: "#050505",
        family: "'Arial Black', Impact, sans-serif",
        rough: true,
        uppercase: true,
      },
      {
        field: "birthday",
        x: 430,
        y: 178,
        size: 25,
        maxWidth: 185,
        color: "#050505",
        family: "'Arial Black', Impact, sans-serif",
        rough: true,
        uppercase: true,
      },
      {
        field: "expires",
        x: 430,
        y: 269,
        size: 25,
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
    width: 1280,
    height: 969,

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

    photo: {
      x: 38,
      y: 342,
      w: 335,
      h: 313,
      rounded: 0,
    },

    text: [
      {
        field: "expires",
        x: 140,
        y: 255,
        size: 28,
        maxWidth: 230,
        color: "rgba(56, 43, 38, 0.86)",
        family: "Georgia, serif",
      },
      {
        field: "name",
        x: 475,
        y: 367,
        size: 30,
        maxWidth: 375,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "address",
        x: 515,
        y: 496,
        size: 30,
        maxWidth: 350,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "birthday",
        x: 535,
        y: 610,
        size: 30,
        maxWidth: 330,
        color: "rgba(56, 43, 38, 0.88)",
        family: "Georgia, serif",
      },
      {
        field: "sex",
        x: 920,
        y: 369,
        size: 24,
        maxWidth: 170,
        color: "rgba(56, 43, 38, 0.78)",
        family: "Georgia, serif",
      },
      {
        field: "hair",
        x: 920,
        y: 410,
        size: 24,
        maxWidth: 170,
        color: "rgba(56, 43, 38, 0.78)",
        family: "Georgia, serif",
      },
      {
        field: "eyes",
        x: 920,
        y: 451,
        size: 24,
        maxWidth: 170,
        color: "rgba(56, 43, 38, 0.78)",
        family: "Georgia, serif",
      },
      {
        field: "signature",
        x: 875,
        y: 900,
        size: 28,
        maxWidth: 260,
        color: "rgba(120, 95, 80, 0.55)",
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
    [0.7, 0],
    [-0.5, 0.25],
    [0.25, -0.55],
    [-0.2, -0.2],
  ];

  for (const [ox, oy] of offsets) {
    ctx.fillText(text, item.x + ox, item.y + oy);
  }

  ctx.restore();
}

function drawTemplateText() {
  const template = getTemplate();

  for (const item of template.text) {
    const input = fields[item.field];

    if (!input) continue;

    let value = String(input.value || "").trim();

    if (!value) continue;

    if (item.uppercase) {
      value = value.toUpperCase();
    }

    if (item.rough) {
      drawRoughText(value, item);
    } else {
      drawNormalText(value, item);
    }
  }
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

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
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
  const usedFields = new Set(template.text.map((item) => item.field));

  for (const [key, input] of Object.entries(fields)) {
    const wrapper = input.closest(".field");

    if (!wrapper) continue;

    if (usedFields.has(key)) {
      wrapper.style.display = "";
    } else {
      wrapper.style.display = "none";
    }
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