
/* =========================================================
   BOUNDATIONS
   ========================================================= */

const title = document.getElementById("title");
const body = document.body;
const floatingSpace = document.querySelector(".floating-space");
const cards = Array.from(document.querySelectorAll(".card"));
const imageTrail = document.getElementById("image-trail");
const wordTrail = document.getElementById("word-trail");
const blackTransition = document.getElementById("black-transition");
const trailSound = document.getElementById("trailSound");

const addCard = document.querySelector(".add-card");
const customImageInput = document.getElementById("custom-image-input");
const customRuleTitle = document.getElementById("custom-rule-title");
const customRuleDescription = document.getElementById("custom-rule-description");
const saveCustomCard = document.getElementById("save-custom-card");

let currentMode = 3;
let introFinished = false;
let transitioning = false;
let flippedCards = [];
let customImageURL = null;


/* =========================================================
   BOUNDARY SCALE HANDLES
   ========================================================= */

const boundaryHandle = document.getElementById("boundary-handle");
const zoomHandle = document.getElementById("zoom-handle");

let boundaryScale = 1;

function applyBoundaryScale(scale) {
  boundaryScale = Math.max(0.55, Math.min(2.5, scale));

  document.documentElement.style.setProperty(
    "--boundary-scale",
    boundaryScale
  );

  body.classList.toggle("boundary-scaled", boundaryScale < 0.995);

  requestAnimationFrame(() => {
    keepAddCardInsideBoundary();
  });
}

function attachScaleHandle(handle, direction) {
  if (!handle) return;

  let dragging = false;
  let startY = 0;
  let startScale = 1;

  handle.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;

    dragging = true;
    startY = event.clientY;
    startScale = boundaryScale;

    body.classList.add(
      direction === "boundary"
        ? "boundary-dragging"
        : "zoom-dragging"
    );

    try {
      handle.setPointerCapture(event.pointerId);
    } catch (error) {}

    event.preventDefault();
  });

  handle.addEventListener("pointermove", event => {
    if (!dragging) return;

    const distance = event.clientY - startY;
    const change = direction === "boundary"
      ? -distance / window.innerHeight
      : -distance / window.innerHeight;

    applyBoundaryScale(startScale + change);
  });

  function finish(event) {
    if (!dragging) return;

    dragging = false;

    body.classList.remove(
      direction === "boundary"
        ? "boundary-dragging"
        : "zoom-dragging"
    );

    try {
      handle.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  handle.addEventListener("pointerup", finish);
  handle.addEventListener("pointercancel", finish);
}

attachScaleHandle(boundaryHandle, "boundary");
attachScaleHandle(zoomHandle, "zoom");

/* =========================================================
   OPENING SCREEN
   ========================================================= */

let openingScreen = document.getElementById("opening-screen");

if (!openingScreen) {
  openingScreen = document.createElement("div");
  openingScreen.id = "opening-screen";
  document.body.appendChild(openingScreen);
}

function startOpening() {
  body.classList.remove("playground-ready");

  if (title) {
    title.classList.remove("intro-zoom");
    title.style.display = "block";

    void title.offsetWidth;
    title.classList.add("intro-zoom");
  }

  setTimeout(() => {
    body.classList.add("playground-ready");
  }, 100);

  setTimeout(() => {
    openingScreen.classList.add("opening-finished");
  }, 1400);

  setTimeout(() => {
    if (title) title.style.display = "none";

    introFinished = true;
    updateTrailMode();
  }, 1750);
}

/* =========================================================
   TRAIL CONTENT
   ========================================================= */

const trailWords = [
  "WHAT IF?",
  "YOUR TURN",
  "WHY NOT?",
  "MAKE A FORT",
  "GET MESSY",
  "OUR RULE",
  "TRY AGAIN",
  "MAKE BELIEVE",
  "LOOK CLOSER",
  "PLAY TOGETHER",
  "CAN WE CHANGE IT?",
  "WHAT CAN WE MAKE?"
];

const trailImages = [
  "image/one.png",
  "image/two.png",
  "image/three.png",
  "image/four.png",
  "image/five.png",
  "image/six.png",
  "image/seven.png",
  "image/eight.png",
  "image/nine.png",
  "image/ten.png",
  "image/eleven.png",
  "image/twelve.png",
  "image/thirteen.png",
  "image/fourteen.png",
  "image/fifteen.png",
  "image/sixteen.png",
  "image/seventeen.png",
  "image/eighteen.png",
  "image/nineteen.png",
  "image/twenty.png"
];

/* =========================================================
   AUDIO
   ========================================================= */

let audioUnlocked = false;
let trailSoundTimeout;

function unlockAudio() {
  audioUnlocked = true;
  document.removeEventListener("pointerdown", unlockAudio);
}

document.addEventListener("pointerdown", unlockAudio);

function playTrailSound() {
  if (!trailSound || !audioUnlocked) return;

  trailSound.volume = 0.18;

  if (trailSound.paused) {
    trailSound.play().catch(() => {});
  }

  clearTimeout(trailSoundTimeout);

  trailSoundTimeout = setTimeout(() => {
    trailSound.pause();
  }, 180);
}

/* =========================================================
   CARD POSITIONS
   ========================================================= */

const positions = [
  [7, 9], [23, 6], [42, 8], [65, 7], [81, 13],
  [5, 30], [28, 25], [47, 32], [70, 27], [86, 34],
  [9, 52], [31, 48], [52, 53], [73, 49], [87, 57],
  [20, 75], [57, 76], [3, 68], [38, 70], [68, 72],
  [84, 78]
];

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function setCardPosition(card, x, y) {
  card.style.left = `${x}vw`;
  card.style.top = `${y}vh`;
  card.style.setProperty("--x", `${x}vw`);
  card.style.setProperty("--y", `${y}vh`);
}

function setCardMovement(card) {
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("dragging")
  ) {
    card.style.animation = "none";
    return;
  }

  const moveX = (Math.random() * 4 - 2).toFixed(2);
  const moveY = (Math.random() * 4 - 2).toFixed(2);

  card.style.setProperty("--move-x", `${moveX}vw`);
  card.style.setProperty("--move-y", `${moveY}vh`);

  const duration = 16 + Math.random() * 12;
  const delay = Math.random() * -16;

  card.style.animation = "none";
  void card.offsetWidth;

  card.style.animation =
    `cardFloat ${duration}s cubic-bezier(0.45, 0, 0.55, 1) ${delay}s infinite`;
}

function randomizeCards() {
  const shuffled = shuffle(positions);
  let index = 0;

  cards.forEach(card => {
    if (card.classList.contains("flipped")) return;

    const position = shuffled[index++];
    if (!position) return;

    setCardPosition(card, position[0], position[1]);
    setCardMovement(card);
  });
}

randomizeCards();

/* =========================================================
   FLIPPED CARD LAYOUT
   ========================================================= */

function getOrderedPosition(index) {
  const cardGap = 28;

  if (index < 7) {
    return [-40 + index * cardGap, -55];
  }

  if (index < 14) {
    return [-40 + (index - 7) * cardGap, 140];
  }

  if (index < 17) {
    return [-40, -5 + (index - 14) * 47.5];
  }

  if (index < 20) {
    return [130, -5 + (index - 17) * 47.5];
  }

  const extraIndex = index - 20;
  const outerColumnGap = 47.5;
  const outerStartY = -54;

  if (extraIndex < 5) {
    return [-69, outerStartY + extraIndex * outerColumnGap];
  }

  return [
    159,
    outerStartY + (extraIndex - 5) * outerColumnGap
  ];
}

function updateFlippedCardPositions() {
  flippedCards.forEach((card, index) => {
    const [x, y] = getOrderedPosition(index);

    card.style.animation = "none";
    card.style.transform = "translate(0, 0)";
    card.style.left = `${x}vw`;
    card.style.top = `${y}vh`;
    card.style.setProperty("--x", `${x}vw`);
    card.style.setProperty("--y", `${y}vh`);
    card.dataset.flippedPosition = `${x},${y}`;
  });
}

function addToFlippedOrder(card) {
  if (!flippedCards.includes(card)) {
    flippedCards.push(card);
  }

  body.classList.add("cards-expanded");
  updateFlippedCardPositions();
}

function removeFromFlippedOrder(card) {
  const index = flippedCards.indexOf(card);
  if (index === -1) return;

  flippedCards.splice(index, 1);
  delete card.dataset.flippedPosition;

  if (flippedCards.length === 0) {
    body.classList.remove("cards-expanded");
  }

  updateFlippedCardPositions();
}

/* =========================================================
   PLAYGROUND COORDINATE HELPERS
   ========================================================= */

// Convert screen coordinates into the playground's local coordinates.
// This is important when the playground is scaled.
function getPlaygroundMetrics() {
  const rect = floatingSpace.getBoundingClientRect();

  const scaleX = floatingSpace.offsetWidth
    ? rect.width / floatingSpace.offsetWidth
    : 1;

  const scaleY = floatingSpace.offsetHeight
    ? rect.height / floatingSpace.offsetHeight
    : 1;

  return {
    rect,
    scaleX: scaleX || 1,
    scaleY: scaleY || 1,
    width: floatingSpace.offsetWidth,
    height: floatingSpace.offsetHeight
  };
}

function clampCardInsidePlayground(card, localX, localY) {
  const metrics = getPlaygroundMetrics();
  const padding = 12;

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  const maxX = Math.max(
    padding,
    metrics.width - cardWidth - padding
  );

  const maxY = Math.max(
    padding,
    metrics.height - cardHeight - padding
  );

  const x = Math.max(padding, Math.min(localX, maxX));
  const y = Math.max(padding, Math.min(localY, maxY));

  card.style.animation = "none";
  card.style.transform = "translate(0, 0)";
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;

  return { x, y };
}

function keepAddCardInsideBoundary() {
  if (!addCard || !floatingSpace) return;

  const metrics = getPlaygroundMetrics();
  const cardRect = addCard.getBoundingClientRect();

  // Work out the card's current location relative to the scaled box.
  const localX = (cardRect.left - metrics.rect.left) / metrics.scaleX;
  const localY = (cardRect.top - metrics.rect.top) / metrics.scaleY;

  clampCardInsidePlayground(addCard, localX, localY);
}

function scheduleAddCardPositionFix() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      keepAddCardInsideBoundary();
    });
  });

  setTimeout(keepAddCardInsideBoundary, 750);
}

/* =========================================================
   REGULAR CARD DRAGGING AND FLIPPING
   ========================================================= */

function attachCardInteraction(card) {
  if (card.classList.contains("add-card")) return;

  let pointerStartX = 0;
  let pointerStartY = 0;
  let cardStartX = 0;
  let cardStartY = 0;
  let moved = false;

  card.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    if (event.target.closest("input, textarea, button")) return;

    const metrics = getPlaygroundMetrics();
    const rect = card.getBoundingClientRect();

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;

    cardStartX = (rect.left - metrics.rect.left) / metrics.scaleX;
    cardStartY = (rect.top - metrics.rect.top) / metrics.scaleY;

    moved = false;

    card.style.animation = "none";
    card.style.transform = "translate(0, 0)";
    card.style.left = `${cardStartX}px`;
    card.style.top = `${cardStartY}px`;
    card.classList.add("dragging");

    try {
      card.setPointerCapture(event.pointerId);
    } catch (error) {}
  });

  card.addEventListener("pointermove", event => {
    if (!card.classList.contains("dragging")) return;

    const metrics = getPlaygroundMetrics();

    const dx = (event.clientX - pointerStartX) / metrics.scaleX;
    const dy = (event.clientY - pointerStartY) / metrics.scaleY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

    const newX = cardStartX + dx;
    const newY = cardStartY + dy;

    clampCardInsidePlayground(card, newX, newY);
  });

  function finishCardDrag(event) {
    if (!card.classList.contains("dragging")) return;

    card.classList.remove("dragging");

    try {
      card.releasePointerCapture(event.pointerId);
    } catch (error) {}

    if (!moved) {
      body.classList.add("trail-paused");

      if (!card.classList.contains("flipped")) {
        card.classList.add("flipped");
        card.style.animation = "none";
        card.style.transform = "translate(0, 0)";
        addToFlippedOrder(card);
      } else {
        card.classList.remove("flipped");
        removeFromFlippedOrder(card);

        const position = getRandomAvailablePosition();
        setCardPosition(card, position[0], position[1]);

        setTimeout(() => setCardMovement(card), 50);
      }

      scheduleAddCardPositionFix();

      setTimeout(() => {
        updateTrailMode();
        body.classList.remove("trail-paused");
      }, 700);

      return;
    }

    if (!card.classList.contains("flipped")) {
      setTimeout(() => setCardMovement(card), 50);
    }
  }

  card.addEventListener("pointerup", finishCardDrag);
  card.addEventListener("pointercancel", finishCardDrag);
}

function getRandomAvailablePosition() {
  const occupied = new Set();

  document.querySelectorAll(".card:not(.flipped)").forEach(card => {
    if (card === addCard) return;

    const x = card.style.getPropertyValue("--x");
    const y = card.style.getPropertyValue("--y");

    if (x && y) occupied.add(`${x},${y}`);
  });

  const available = positions.filter(position => {
    return !occupied.has(`${position[0]}vw,${position[1]}vh`);
  });

  const list = available.length ? available : positions;

  return list[Math.floor(Math.random() * list.length)];
}

cards.forEach(attachCardInteraction);

/* =========================================================
   ADD CARD DRAGGING
   ========================================================= */

function attachAddCardDrag(card) {
  if (!card) return;

  let pointerStartX = 0;
  let pointerStartY = 0;
  let cardStartX = 0;
  let cardStartY = 0;
  let moved = false;
  let dragging = false;

  card.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    if (event.target.closest("input, textarea, button")) return;

    const metrics = getPlaygroundMetrics();
    const rect = card.getBoundingClientRect();

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    cardStartX = (rect.left - metrics.rect.left) / metrics.scaleX;
    cardStartY = (rect.top - metrics.rect.top) / metrics.scaleY;

    moved = false;
    dragging = true;

    card.style.animation = "none";
    card.style.transform = "translate(0, 0)";
    card.style.left = `${cardStartX}px`;
    card.style.top = `${cardStartY}px`;
    card.classList.add("dragging");

    try {
      card.setPointerCapture(event.pointerId);
    } catch (error) {}
  });

  card.addEventListener("pointermove", event => {
    if (!dragging) return;

    const metrics = getPlaygroundMetrics();

    const dx = (event.clientX - pointerStartX) / metrics.scaleX;
    const dy = (event.clientY - pointerStartY) / metrics.scaleY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    if (!moved) return;

    clampCardInsidePlayground(
      card,
      cardStartX + dx,
      cardStartY + dy
    );
  });

  function finish(event) {
    if (!dragging) return;

    dragging = false;
    card.classList.remove("dragging");

    try {
      card.releasePointerCapture(event.pointerId);
    } catch (error) {}

    if (card.classList.contains("flipped")) {
      keepAddCardInsideBoundary();
    } else if (moved) {
      setCardMovement(card);
    }
  }

  card.addEventListener("pointerup", finish);
  card.addEventListener("pointercancel", finish);
}

attachAddCardDrag(addCard);

/* =========================================================
   TRAIL MODE
   ========================================================= */

function updateTrailMode() {
  if (currentMode !== 3 || !introFinished) return;

  const regularCards = Array.from(
    document.querySelectorAll(".card:not(.add-card)")
  );

  const flippedCount = regularCards.filter(card =>
    card.classList.contains("flipped")
  ).length;

  const photoCount = regularCards.length - flippedCount;

  if (photoCount > flippedCount) {
    body.classList.add("show-word-trail");
    body.classList.remove("show-image-trail");
  } else if (flippedCount > photoCount) {
    body.classList.add("show-image-trail");
    body.classList.remove("show-word-trail");
  } else {
    body.classList.remove("show-word-trail", "show-image-trail");
  }
}

/* =========================================================
   TRAIL BOUNDARY
   ========================================================= */

function isCursorInsidePlayground(event) {
  if (!floatingSpace) return false;

  const rect = floatingSpace.getBoundingClientRect();

  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

/* =========================================================
   IMAGE TRAIL
   ========================================================= */

let lastImageX = 0;
let lastImageY = 0;
let lastImageTime = 0;

document.addEventListener("pointermove", event => {
  if (!introFinished) return;
  if (!body.classList.contains("show-image-trail")) return;
  if (body.classList.contains("trail-paused")) return;
  if (!isCursorInsidePlayground(event)) return;
  if (!imageTrail) return;

  const rect = floatingSpace.getBoundingClientRect();

  const imageSize = window.matchMedia("(max-width: 700px)").matches
    ? 75
    : 90;

  const radius = imageSize / 2;

  if (rect.width < imageSize || rect.height < imageSize) return;

  const x = Math.max(
    rect.left + radius,
    Math.min(event.clientX, rect.right - radius)
  );

  const y = Math.max(
    rect.top + radius,
    Math.min(event.clientY, rect.bottom - radius)
  );

  const now = performance.now();
  const distance = Math.hypot(
    event.clientX - lastImageX,
    event.clientY - lastImageY
  );

  if (now - lastImageTime < 80 || distance < 15) return;

  lastImageTime = now;
  lastImageX = event.clientX;
  lastImageY = event.clientY;

  const img = document.createElement("img");

  img.src = trailImages[
    Math.floor(Math.random() * trailImages.length)
  ];

  img.className = "trail-image";
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  imageTrail.appendChild(img);
  playTrailSound();

  setTimeout(() => img.remove(), 800);
});

/* =========================================================
   WORD TRAIL
   ========================================================= */

let lastWordX = 0;
let lastWordY = 0;
let lastWordTime = 0;

document.addEventListener("pointermove", event => {
  if (!introFinished) return;
  if (!body.classList.contains("show-word-trail")) return;
  if (body.classList.contains("trail-paused")) return;
  if (!isCursorInsidePlayground(event)) return;
  if (!wordTrail) return;

  const rect = floatingSpace.getBoundingClientRect();
  const now = performance.now();

  const distance = Math.hypot(
    event.clientX - lastWordX,
    event.clientY - lastWordY
  );

  if (now - lastWordTime < 90 || distance < 18) return;

  lastWordTime = now;
  lastWordX = event.clientX;
  lastWordY = event.clientY;

  const word = document.createElement("div");
  word.className = "trail-word";
  word.textContent = trailWords[
    Math.floor(Math.random() * trailWords.length)
  ];

  word.style.left = "0px";
  word.style.top = "0px";

  wordTrail.appendChild(word);

  const wordRect = word.getBoundingClientRect();
  const halfWidth = wordRect.width / 2;
  const halfHeight = wordRect.height / 2;

  if (rect.width < wordRect.width || rect.height < wordRect.height) {
    word.remove();
    return;
  }

  const x = Math.max(
    rect.left + halfWidth,
    Math.min(event.clientX, rect.right - halfWidth)
  );

  const y = Math.max(
    rect.top + halfHeight,
    Math.min(event.clientY, rect.bottom - halfHeight)
  );

  word.style.left = `${x}px`;
  word.style.top = `${y}px`;

  playTrailSound();
  setTimeout(() => word.remove(), 650);
});

/* =========================================================
   OPEN ADD CARD / IMAGE UPLOAD
   ========================================================= */

if (addCard && customImageInput) {
  addCard.addEventListener("click", event => {
    if (event.target.closest("input, textarea, button")) return;
    if (addCard.classList.contains("dragging")) return;

    if (!addCard.classList.contains("flipped")) {
      if (addCard.classList.contains("custom-image-ready")) {
        body.classList.add("trail-paused");
        addCard.classList.add("flipped");

        scheduleAddCardPositionFix();

        setTimeout(() => {
          customRuleTitle?.focus();
        }, 750);
      } else {
        body.classList.add("trail-paused");
        customImageInput.click();
      }
    }
  });
}

if (customImageInput && addCard) {
  customImageInput.addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) {
      body.classList.remove("trail-paused");
      return;
    }

    if (customImageURL) {
      URL.revokeObjectURL(customImageURL);
    }

    customImageURL = URL.createObjectURL(file);

    const front = addCard.querySelector(".add-card-front");

    if (front) {
      front.style.backgroundImage = `url("${customImageURL}")`;
      front.classList.add("has-image");
    }

    addCard.classList.add("custom-image-ready");
    addCard.classList.add("flipped");
    body.classList.add("trail-paused");

    scheduleAddCardPositionFix();

    setTimeout(() => {
      customRuleTitle?.focus();
    }, 750);
  });
}

/* =========================================================
   SAVE CUSTOM RULE
   ========================================================= */

if (saveCustomCard) {
  saveCustomCard.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const ruleTitle = customRuleTitle?.value.trim() || "";
    const ruleDescription = customRuleDescription?.value.trim() || "";

    if (!customImageURL || !ruleTitle) return;

    createCustomCard(
      customImageURL,
      ruleTitle,
      ruleDescription
    );

    customImageURL = null;

    if (customRuleTitle) customRuleTitle.value = "";
    if (customRuleDescription) customRuleDescription.value = "";
    if (customImageInput) customImageInput.value = "";

    resetAddCard();
    body.classList.remove("trail-paused");
    updateTrailMode();
  });
}

/* =========================================================
   RESET ADD CARD
   ========================================================= */

function resetAddCard() {
  if (!addCard) return;

  const front = addCard.querySelector(".add-card-front");

  if (front) {
    front.style.backgroundImage = "";
    front.classList.remove("has-image");
  }

  addCard.classList.remove("custom-image-ready");
  addCard.classList.remove("flipped");
  addCard.style.animation = "none";
  addCard.style.transform = "translate(0, 0)";

  // Put the + card back inside the playground even if
  // the original cards are all flipped.
  scheduleAddCardPositionFix();
}

/* =========================================================
   CREATE CUSTOM CARD
   ========================================================= */

function createCustomCard(imageURL, ruleTitle, ruleDescription) {
  const card = document.createElement("div");

  card.className = "card custom-card-entering";

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="${imageURL}" alt="Custom rule">
      </div>
      <div class="card-back">
        <h2>${escapeHTML(ruleTitle)}</h2>
        <p>${escapeHTML(ruleDescription)}</p>
      </div>
    </div>
  `;

  if (addCard) {
    addCard.parentNode.insertBefore(card, addCard);
  } else {
    floatingSpace.appendChild(card);
  }

  // IMPORTANT:
  // Choose a destination in the playground's local pixel
  // coordinates. Do not use vw/vh here because the playground
  // may be scaled when all the original cards are flipped.
  const metrics = getPlaygroundMetrics();
  const padding = 12;

  const cardWidth = card.offsetWidth || 160;
  const cardHeight = card.offsetHeight || 160;

  const maxX = Math.max(
    padding,
    metrics.width - cardWidth - padding
  );

  const maxY = Math.max(
    padding,
    metrics.height - cardHeight - padding
  );

  const destinationX =
    padding + Math.random() * Math.max(0, maxX - padding);

  const destinationY =
    padding + Math.random() * Math.max(0, maxY - padding);

  // Start at the current + card position, measured relative
  // to the playground rather than the browser window.
  const addRect = addCard.getBoundingClientRect();

  const startX = (addRect.left - metrics.rect.left) / metrics.scaleX;
  const startY = (addRect.top - metrics.rect.top) / metrics.scaleY;

  card.style.animation = "none";
  card.style.transform = "translate(0, 0)";
  card.style.left = `${startX}px`;
  card.style.top = `${startY}px`;

  // Animate into its destination, which is guaranteed to be
  // within the playground's local bounds.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.style.left = `${destinationX}px`;
      card.style.top = `${destinationY}px`;
    });
  });

  setTimeout(() => {
    card.classList.remove("custom-card-entering");
    setCardMovement(card);
  }, 1050);

  attachCardInteraction(card);

  return card;
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

/* =========================================================
   INITIALIZE
   ========================================================= */

startOpening();

window.addEventListener("resize", () => {
  keepAddCardInsideBoundary();
});
