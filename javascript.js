
/* =========================================================
   BOUNDARIES FOR IMAGINATION
   ========================================================= */

const title = document.getElementById("title");
const body = document.body;
let openingScreen = document.getElementById("opening-screen");
const cards = Array.from(document.querySelectorAll(".card"));
const imageTrail = document.getElementById("image-trail");
const wordTrail = document.getElementById("word-trail");
const blackTransition = document.getElementById("black-transition");
const trailSound = document.getElementById("trailSound");

/* =========================================================
   BOUNDARY HANDLE
   ========================================================= */

const boundaryHandle = document.getElementById("boundary-handle");
let boundaryScale = 1;
let boundaryDragging = false;
let boundaryStartY = 0;
let boundaryStartScale = 1;


function applyBoundaryScale(scale) {
boundaryScale = Math.max(0.55, Math.min(2.5, scale));
  document.documentElement.style.setProperty(
    "--boundary-scale",
    boundaryScale
  );

  if (boundaryScale < 0.995) {
    body.classList.add("boundary-scaled");
  } else {
    body.classList.remove("boundary-scaled");
  }
}


if (boundaryHandle) {
  boundaryHandle.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;

    boundaryDragging = true;
    boundaryStartY = event.clientY;
    boundaryStartScale = boundaryScale;
    body.classList.add("boundary-dragging");

    try {
      boundaryHandle.setPointerCapture(event.pointerId);
    } catch (error) {}

    event.preventDefault();
  });

  boundaryHandle.addEventListener("pointermove", event => {
    if (!boundaryDragging) return;

    const distance = event.clientY - boundaryStartY;
    const scaleChange = distance / window.innerHeight;
    const newScale = boundaryStartScale - scaleChange;

    applyBoundaryScale(newScale);
  });

  function finishBoundaryDrag(event) {
    if (!boundaryDragging) return;

    boundaryDragging = false;
    body.classList.remove("boundary-dragging");

    try {
      boundaryHandle.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  boundaryHandle.addEventListener("pointerup", finishBoundaryDrag);
  boundaryHandle.addEventListener("pointercancel", finishBoundaryDrag);
}

/* =========================================================
   BOTTOM ZOOM HANDLE
   ========================================================= */

const zoomHandle = document.getElementById("zoom-handle");
let zoomDragging = false;
let zoomStartY = 0;
let zoomStartScale = 1;

/* =========================================================
   APPLY ZOOM SCALE
   ========================================================= */


function applyZoomScale(scale) {
boundaryScale = Math.max(0.55, Math.min(2.5, scale));
  document.documentElement.style.setProperty(
    "--boundary-scale",
    boundaryScale
  );

  if (boundaryScale < 0.995) {
    body.classList.add("boundary-scaled");
  } else {
    body.classList.remove("boundary-scaled");
  }
}


/* =========================================================
   BOTTOM HANDLE INTERACTION
   ========================================================= */

if (zoomHandle) {
  zoomHandle.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;

    zoomDragging = true;
    zoomStartY = event.clientY;
    zoomStartScale = boundaryScale;
    body.classList.add("zoom-dragging");

    try {
      zoomHandle.setPointerCapture(event.pointerId);
    } catch (error) {}

    event.preventDefault();
  });

  zoomHandle.addEventListener("pointermove", event => {
    if (!zoomDragging) return;

    const distance = zoomStartY - event.clientY;
    const scaleChange = distance / window.innerHeight;
    const newScale = zoomStartScale + scaleChange;

    applyZoomScale(newScale);
  });

  function finishZoomDrag(event) {
    if (!zoomDragging) return;

    zoomDragging = false;
    body.classList.remove("zoom-dragging");

    try {
      zoomHandle.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  zoomHandle.addEventListener("pointerup", finishZoomDrag);
  zoomHandle.addEventListener("pointercancel", finishZoomDrag);
}

/* =========================================================
   CREATE OPENING SCREEN
   ========================================================= */

if (!openingScreen) {
  openingScreen = document.createElement("div");
  openingScreen.id = "opening-screen";
  document.body.appendChild(openingScreen);
}

/* =========================================================
   TRAIL WORDS
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

/* =========================================================
   TRAIL IMAGES
   ========================================================= */

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
   STATE
   ========================================================= */

let currentMode = 3;
let introFinished = false;
let transitioning = false;

/* =========================================================
   ORDERED FLIPPED CARDS
   ========================================================= */

let flippedCards = [];
const orderedColumns = 5;
const orderedStartX = 7;
const orderedStartY = 9;
const orderedColumnGap = 16;
const orderedRowGap = 16;




/* =========================================================
   ORDERED FLIPPED CARDS
   ========================================================= */

function getOrderedPosition(index) {
  const cardGap = 28;

  // ORIGINAL 20 CARDS: keep their existing positions
  if (index < 7) {
    // Top row
    return [-40 + index * cardGap, -55];
  }

  if (index < 14) {
    // Bottom row
    return [-40 + (index - 7) * cardGap, 140];
  }

  if (index < 17) {
    // Original left column: 3 cards
    const sideIndex = index - 14;
    return [-40, -5 + sideIndex * 47.5];
  }

  if (index < 20) {
    // Original right column: 3 cards
    const sideIndex = index - 17;
    return [130, -5 + sideIndex * 47.5];
  }

  // EXTRA CARDS:
  // First 4 cards on each outer edge move upward.
  // The 5th card stays at its previous bottom position.

  const extraIndex = index - 20;
  const outerColumnGap = 47.5;
  const outerStartY = -54;

  if (extraIndex < 5) {
    // Outer left column
    const y = extraIndex === 4
      ? -50 + 4 * outerColumnGap
      : outerStartY + extraIndex * outerColumnGap;

    return [-69, y];
  }

  // Outer right column
  const rightIndex = extraIndex - 5;
  const y = rightIndex === 4
    ? -50 + 4 * outerColumnGap
    : outerStartY + rightIndex * outerColumnGap;

  return [159, y];
}




/* =========================================================
   AUDIO
   ========================================================= */

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  audioUnlocked = true;
  document.removeEventListener("pointerdown", unlockAudio);
}

document.addEventListener("pointerdown", unlockAudio);

/* =========================================================
   TRAIL SOUND
   ========================================================= */

let trailSoundTimeout;

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
  [7, 9],
  [23, 6],
  [42, 8],
  [65, 7],
  [81, 13],
  [5, 30],
  [28, 25],
  [47, 32],
  [70, 27],
  [86, 34],
  [9, 52],
  [31, 48],
  [52, 53],
  [73, 49],
  [87, 57],
  [20, 75],
  [57, 76],
  [3, 68],
  [38, 70],
  [68, 72],
  [84, 78]
];

/* =========================================================
   SHUFFLE
   ========================================================= */

function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i]
    ];
  }

  return shuffled;
}

/* =========================================================
   GET RANDOM POSITION
   ========================================================= */

function getRandomAvailablePosition() {
  const occupiedPositions = flippedCards.map(
    card => card.dataset.flippedPosition
  );

  const available = positions.filter(position => {
    const key = `${position[0]},${position[1]}`;
    return !occupiedPositions.includes(key);
  });

  if (available.length === 0) {
    return positions[Math.floor(Math.random() * positions.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
}

/* =========================================================
   PLACE FLIPPED CARDS IN ORDER
   ========================================================= */

function updateFlippedCardPositions() {
  flippedCards.forEach((card, index) => {
    const position = getOrderedPosition(index);
    const x = position[0];
    const y = position[1];

    card.style.animation = "none";
    card.style.setProperty("--x", `${x}vw`);
    card.style.setProperty("--y", `${y}vh`);
    card.style.left = `${x}vw`;
    card.style.top = `${y}vh`;
  });
}

/* =========================================================
   ADD CARD TO FLIPPED ORDER
   ========================================================= */

function addToFlippedOrder(card) {
  if (!flippedCards.includes(card)) {
    flippedCards.push(card);
  }

  document.body.classList.add("cards-expanded");
  updateFlippedCardPositions();
}

/* =========================================================
   REMOVE CARD FROM FLIPPED ORDER
   ========================================================= */

function removeFromFlippedOrder(card) {
  flippedCards = flippedCards.filter(item => item !== card);

  if (flippedCards.length === 0) {
    document.body.classList.remove("cards-expanded");
  }

  updateFlippedCardPositions();
}

function updateFlippedCardPositions() {
  flippedCards.forEach((card, index) => {
    const position = getOrderedPosition(index);
    const x = position[0];
    const y = position[1];

    card.style.animation = "none";
    card.style.transform = "translate(0, 0)";
    card.style.left = `${x}vw`;
    card.style.top = `${y}vh`;
    card.style.setProperty("--x", `${x}vw`);
    card.style.setProperty("--y", `${y}vh`);
    card.dataset.flippedPosition = `${x},${y}`;
  });
}

function removeFromFlippedOrder(card) {
  const index = flippedCards.indexOf(card);
  if (index === -1) return;

  flippedCards.splice(index, 1);
  delete card.dataset.flippedPosition;

  if (flippedCards.length === 0) {
    document.body.classList.remove("cards-expanded");
  }

  updateFlippedCardPositions();
}

/* =========================================================
   CARD FLOATING
   ========================================================= */

function setCardMovement(card) {
  if (card.classList.contains("add-card") || card.classList.contains("flipped")) {
    card.style.animation = "none";
    return;
  }

  const moveX = (Math.random() * 8 - 4).toFixed(2);
  const moveY = (Math.random() * 10 - 5).toFixed(2);

  card.style.setProperty("--move-x", `${moveX}vw`);
  card.style.setProperty("--move-y", `${moveY}vh`);

  const duration = 16 + Math.random() * 12;
  const delay = Math.random() * -16;

  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = `cardFloat ${duration}s cubic-bezier(0.45, 0, 0.55, 1) ${delay}s infinite`;
}

/* =========================================================
   RANDOMIZE CARDS
   ========================================================= */

function randomizeCards() {
  const shuffledPositions = shuffle(positions);
  let normalPositionIndex = 0;

  cards.forEach(card => {
    if (card.classList.contains("flipped")) return;

    const [x, y] = shuffledPositions[normalPositionIndex];
    normalPositionIndex++;

    card.style.setProperty("--x", `${x}vw`);
    card.style.setProperty("--y", `${y}vh`);
    setCardMovement(card);
  });
}

randomizeCards();

/* =========================================================
   OPENING TRANSFORMATION
   ========================================================= */


function startOpening() {
  body.classList.remove("playground-ready");
  title.classList.remove("intro-zoom");
  title.style.display = "block";

  void title.offsetWidth;
  title.classList.add("intro-zoom");

  setTimeout(() => {
    body.classList.add("playground-ready");
  }, 100);

  setTimeout(() => {
    openingScreen.classList.add("opening-finished");
  }, 1400);

  setTimeout(() => {
    title.style.display = "none";
    introFinished = true;
    updateTrailMode();
  }, 1750);
}


startOpening();

/* =========================================================
   CARD INTERACTION
   ========================================================= */

function attachCardInteraction(card) {
  if (card.classList.contains("add-card")) return;

  let pointerStartX = 0;
  let pointerStartY = 0;
  let cardStartX = 0;
  let cardStartY = 0;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let lastTime = 0;

  card.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    if (event.target.closest("input, textarea, button")) return;

    moved = false;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;

    const rect = card.getBoundingClientRect();
    cardStartX = rect.left;
    cardStartY = rect.top;

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();

    card.style.animation = "none";
    card.style.left = `${cardStartX / boundaryScale}px`;
    card.style.top = `${cardStartY / boundaryScale}px`;
    card.style.transform = "translate(0, 0)";
    card.classList.add("dragging");

    try {
      card.setPointerCapture(event.pointerId);
    } catch (error) {}
  });

  card.addEventListener("pointermove", event => {
    if (!card.classList.contains("dragging")) return;

    const dx = (event.clientX - pointerStartX) / boundaryScale;
    const dy = (event.clientY - pointerStartY) / boundaryScale;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      moved = true;
    }

    const now = performance.now();
    const dt = Math.max(now - lastTime, 1);

    velocityX = (event.clientX - lastX) / dt / boundaryScale;
    velocityY = (event.clientY - lastY) / dt / boundaryScale;

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;

    let newX = cardStartX / boundaryScale + dx;
    let newY = cardStartY / boundaryScale + dy;

    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const maxX = window.innerWidth - cardWidth;
    const maxY = window.innerHeight - cardHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    card.style.left = `${newX}px`;
    card.style.top = `${newY}px`;
  });

  card.addEventListener("pointerup", event => {
    if (!card.classList.contains("dragging")) return;

    card.classList.remove("dragging");

    try {
      card.releasePointerCapture(event.pointerId);
    } catch (error) {}

    if (!moved) {
      body.classList.add("trail-paused");

      const isCurrentlyFlipped = card.classList.contains("flipped");

      if (!isCurrentlyFlipped) {
        card.classList.add("flipped");
        card.style.animation = "none";
        card.style.transform = "translate(0, 0)";
        addToFlippedOrder(card);
      } else {
        card.classList.remove("flipped");
        removeFromFlippedOrder(card);

        card.style.animation = "none";
        card.style.transform = "translate(0, 0)";

        const randomPosition = getRandomAvailablePosition();
        const [randomX, randomY] = randomPosition;

        card.style.left = `${randomX}vw`;
        card.style.top = `${randomY}vh`;
        card.style.setProperty("--x", `${randomX}vw`);
        card.style.setProperty("--y", `${randomY}vh`);

        setTimeout(() => {
          setCardMovement(card);
        }, 50);
      }

      setTimeout(() => {
        updateTrailMode();
        body.classList.remove("trail-paused");
      }, 700);

      return;
    }

    const rect = card.getBoundingClientRect();

    let finalX = rect.left / boundaryScale + velocityX * 80;
    let finalY = rect.top / boundaryScale + velocityY * 80;

    const maxX = window.innerWidth - rect.width / boundaryScale;
    const maxY = window.innerHeight - rect.height / boundaryScale;

    finalX = Math.max(0, Math.min(finalX, maxX));
    finalY = Math.max(60, Math.min(finalY, maxY));

    card.style.left = `${finalX}px`;
    card.style.top = `${finalY}px`;
    card.style.transform = "translate(0, 0)";

    if (!card.classList.contains("flipped")) {
      setTimeout(() => {
        setCardMovement(card);
      }, 50);
    }
  });

  card.addEventListener("pointercancel", event => {
    if (!card.classList.contains("dragging")) return;

    card.classList.remove("dragging");

    try {
      card.releasePointerCapture(event.pointerId);
    } catch (error) {}

    card.style.transform = "translate(0, 0)";

    if (!card.classList.contains("flipped")) {
      setCardMovement(card);
    }
  });
}

/* =========================================================
   ATTACH CARD INTERACTION
   ========================================================= */

cards.forEach(card => {
  attachCardInteraction(card);
});

/* =========================================================
   ADD CARD DRAG
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

    const rect = card.getBoundingClientRect();

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    cardStartX = rect.left / boundaryScale;
    cardStartY = rect.top / boundaryScale;
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

    const dx = (event.clientX - pointerStartX) / boundaryScale;
    const dy = (event.clientY - pointerStartY) / boundaryScale;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      moved = true;
    }

    if (!moved) return;

    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    let newX = cardStartX + dx;
    let newY = cardStartY + dy;

    const maxX = window.innerWidth - cardWidth;
    const maxY = window.innerHeight - cardHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    card.style.left = `${newX}px`;
    card.style.top = `${newY}px`;
  });

  function finishAddCardDrag(event) {
    if (!dragging) return;

    dragging = false;
    card.classList.remove("dragging");

    try {
      card.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  card.addEventListener("pointerup", finishAddCardDrag);
  card.addEventListener("pointercancel", finishAddCardDrag);
}

/* =========================================================
   ENABLE ADD CARD DRAGGING
   ========================================================= */

attachAddCardDrag(document.querySelector(".add-card"));

/* =========================================================
   TRAIL MODE
   ========================================================= */

function updateTrailMode() {
  if (currentMode !== 3 || !introFinished) return;

  const regularCards = Array.from(
    document.querySelectorAll(".card:not(.add-card)")
  );

  const flippedCount = regularCards.filter(
    card => card.classList.contains("flipped")
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
   TRAIL BOUNDARY CHECK
   ========================================================= */

/* =========================================================
   TRAIL BOUNDARY CHECK
   ========================================================= */

function isCursorInsidePlayground(event) {
  const playground = document.querySelector(".floating-space");
  if (!playground) return false;

  const rect = playground.getBoundingClientRect();

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

  const playground = document.querySelector(".floating-space");
  if (!playground) return;

  const rect = playground.getBoundingClientRect();

  const imageSize = window.matchMedia("(max-width: 700px)").matches
    ? 75
    : 90;

  const radius = imageSize / 2;

  // Keep the entire circular image inside the rectangle.
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

  setTimeout(() => {
    img.remove();
  }, 800);
});

/* =========================================================
   WORD TRAIL
   ========================================================= */
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

  const playground = document.querySelector(".floating-space");
  if (!playground) return;

  const rect = playground.getBoundingClientRect();

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

  // Measure the complete word before positioning it.
  word.style.left = "0px";
  word.style.top = "0px";

  wordTrail.appendChild(word);

  const wordRect = word.getBoundingClientRect();

  const halfWidth = wordRect.width / 2;
  const halfHeight = wordRect.height / 2;

  // Do not create words if the rectangle is too small.
  if (
    rect.width < wordRect.width ||
    rect.height < wordRect.height
  ) {
    word.remove();
    return;
  }

  // Keep every edge of the word inside the rectangle.
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

  setTimeout(() => {
    word.remove();
  }, 650);
});

/* =========================================================
   ADD YOUR OWN CARD
   ========================================================= */

const addCard = document.querySelector(".add-card");
const customImageInput = document.getElementById("custom-image-input");
const customRuleTitle = document.getElementById("custom-rule-title");
const customRuleDescription = document.getElementById("custom-rule-description");
const saveCustomCard = document.getElementById("save-custom-card");

let customImageURL = null;

/* =========================================================
   OPEN IMAGE UPLOAD
   ========================================================= */

if (addCard && customImageInput) {
  addCard.addEventListener("click", event => {
    if (event.target.closest("input, textarea, button")) return;

    if (!addCard.classList.contains("flipped")) {
      if (addCard.classList.contains("custom-image-ready")) {
        body.classList.add("trail-paused");
        addCard.classList.add("flipped");

        setTimeout(() => {
          if (customRuleTitle) customRuleTitle.focus();
        }, 750);
      } else {
        body.classList.add("trail-paused");
        customImageInput.click();
      }
    }
  });
}

/* =========================================================
   CUSTOM IMAGE UPLOAD
   ========================================================= */

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

    setTimeout(() => {
      if (customRuleTitle) customRuleTitle.focus();
    }, 750);
  });
}

/* =========================================================
   SAVE CUSTOM CARD
   ========================================================= */

if (saveCustomCard) {
  saveCustomCard.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const ruleTitle = customRuleTitle
      ? customRuleTitle.value.trim()
      : "";

    const ruleDescription = customRuleDescription
      ? customRuleDescription.value.trim()
      : "";

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
  }

  const occupiedNormalPositions = Array.from(
    document.querySelectorAll(".card:not(.add-card):not(.flipped)")
  ).map(card => {
    const x = card.style.getPropertyValue("--x");
    const y = card.style.getPropertyValue("--y");
    return `${x},${y}`;
  });

  const availableDestinations = positions.filter(position => {
    const key = `${position[0]}vw,${position[1]}vh`;
    return !occupiedNormalPositions.includes(key);
  });

  let destination;

  if (availableDestinations.length > 0) {
    destination = availableDestinations[
      Math.floor(Math.random() * availableDestinations.length)
    ];
  } else {
    destination = positions[
      Math.floor(Math.random() * positions.length)
    ];
  }

  if (addCard) {
    const addRect = addCard.getBoundingClientRect();
    const startX = addRect.left / boundaryScale;
    const startY = addRect.top / boundaryScale;

    card.style.left = `${startX}px`;
    card.style.top = `${startY}px`;
  } else {
    card.style.left = `${destination[0]}vw`;
    card.style.top = `${destination[1]}vh`;
  }

  card.style.transform = "translate(0, 0)";
  card.style.animation = "none";
  card.classList.remove("flipped");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.style.left = `${destination[0]}vw`;
      card.style.top = `${destination[1]}vh`;
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
