const title = document.querySelector("#title");
const body = document.body;
const cards = document.querySelectorAll(".card");

const imageTrail = document.querySelector("#image-trail");
const wordTrail = document.querySelector("#word-trail");
const blackTransition = document.querySelector("#black-transition");


/* =========================================================
   MUSIC
========================================================= */

const trailSound =
  document.querySelector("#trailSound");

trailSound.volume = 0.5;

let audioUnlocked = false;
let soundStopTimer = null;


/* =========================================================
   UNLOCK AUDIO
========================================================= */

document.addEventListener(
  "click",
  () => {

    if (audioUnlocked) {
      return;
    }

    trailSound.muted = true;

    trailSound.play()
      .then(() => {

        trailSound.pause();

        trailSound.currentTime = 0;

        trailSound.muted = false;

        audioUnlocked = true;

      })
      .catch(() => {

        trailSound.muted = false;

      });

  },
  { once: true }
);


/* =========================================================
   START MUSIC
========================================================= */

function startTrailSound() {

  if (!audioUnlocked) {
    return;
  }

  clearTimeout(soundStopTimer);

  if (trailSound.paused) {

    trailSound.play()
      .catch(() => {});

  }

}


/* =========================================================
   STOP MUSIC WHEN MOUSE STOPS
========================================================= */

function stopTrailSound() {

  clearTimeout(soundStopTimer);

  soundStopTimer =
    setTimeout(
      () => {

        trailSound.pause();

      },
      150
    );

}


/* =========================================================
   STOP MUSIC COMPLETELY
========================================================= */

function stopTrailSoundCompletely() {

  clearTimeout(soundStopTimer);

  trailSound.pause();

}


/* =========================================================
   MODE
========================================================= */

let currentMode = 1;
let transitioning = false;


/* =========================================================
   WORD TRAIL
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
   IMAGE TRAIL
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
  "image/sixteen.png"
];


/* =========================================================
   CARD POSITIONS
========================================================= */

const positions = [
  [6, 10],
  [20, 8],
  [36, 11],
  [52, 8],
  [68, 11],
  [80, 15],

  [5, 37],
  [18, 51],

  [72, 37],
  [80, 52],

  [7, 70],
  [22, 79],
  [37, 73],
  [53, 80],
  [68, 71],
  [79, 64],

  [84, 82]
];


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      shuffled[i],
      shuffled[j]
    ] = [
      shuffled[j],
      shuffled[i]
    ];

  }

  return shuffled;
}


/* =========================================================
   APPLE-STYLE CARD MOVEMENT
========================================================= */

function setCardMovement(card) {

  if (
    card.classList.contains("add-card")
  ) {

    card.style.animation = "none";

    return;
  }


  if (
    card.classList.contains("flipped")
  ) {

    card.style.animation = "none";

    return;
  }


  const moveX =
    (
      Math.random() * 2.8 - 1.4
    ).toFixed(2);

  const moveY =
    (
      Math.random() * 3.8 - 1.9
    ).toFixed(2);

  const moveR =
    (
      Math.random() * 2.4 - 1.2
    ).toFixed(2);


  card.style.setProperty(
    "--move-x",
    `${moveX}vw`
  );

  card.style.setProperty(
    "--move-y",
    `${moveY}vh`
  );

  card.style.setProperty(
    "--move-r",
    `${moveR}deg`
  );


  const duration =
    22 +
    Math.random() * 16;


  const delay =
    Math.random() * -18;


  card.style.animation =
    "none";

  void card.offsetWidth;


  card.style.animation =
    `appleFloat ${duration}s cubic-bezier(0.45, 0, 0.55, 1) ${delay}s infinite`;
}


/* =========================================================
   RANDOMIZE ORIGINAL CARDS
========================================================= */

function randomizeCards() {

  const shuffledPositions =
    shuffle(positions);


  cards.forEach(
    (card, index) => {

      const [x, y] =
        shuffledPositions[index];


      card.style.setProperty(
        "--x",
        `${x}vw`
      );

      card.style.setProperty(
        "--y",
        `${y}vh`
      );


      setCardMovement(card);

    }
  );

}


/* =========================================================
   ANIMATIONS
========================================================= */

const styleSheet =
  document.createElement("style");

styleSheet.textContent = `

@keyframes appleFloat {

  0% {
    transform:
      translate(0, 0)
      rotate(0deg);
  }

  25% {
    transform:
      translate(
        calc(var(--move-x) * 0.35),
        calc(var(--move-y) * 0.25)
      )
      rotate(
        calc(var(--move-r) * 0.3)
      );
  }

  50% {
    transform:
      translate(
        var(--move-x),
        var(--move-y)
      )
      rotate(
        var(--move-r)
      );
  }

  75% {
    transform:
      translate(
        calc(var(--move-x) * 0.55),
        calc(var(--move-y) * 0.8)
      )
      rotate(
        calc(var(--move-r) * 0.5)
      );
  }

  100% {
    transform:
      translate(0, 0)
      rotate(0deg);
  }

}


@keyframes titleToBlack {

  0% {
    transform:
      translate(-50%, -50%)
      scale(1);
    opacity: 1;
  }

  18% {
    transform:
      translate(-50%, -50%)
      scale(0.86);
    opacity: 1;
  }

  36% {
    transform:
      translate(-50%, -50%)
      scale(0.35);
    opacity: 1;
  }

  48% {
    transform:
      translate(-50%, -50%)
      scale(0.055);
    opacity: 1;
  }

  58% {
    transform:
      translate(-50%, -50%)
      scale(0.08);
    opacity: 1;
  }

  72% {
    transform:
      translate(-50%, -50%)
      scale(1.1);
    opacity: 1;
  }

  88% {
    transform:
      translate(-50%, -50%)
      scale(5);
    opacity: 0.65;
  }

  100% {
    transform:
      translate(-50%, -50%)
      scale(16);
    opacity: 0;
  }

}


@keyframes blackReveal {

  0% {
    clip-path:
      circle(0% at 50% 50%);
    opacity: 1;
  }

  20% {
    clip-path:
      circle(0.15% at 50% 50%);
    opacity: 1;
  }

  40% {
    clip-path:
      circle(1.5% at 50% 50%);
    opacity: 1;
  }

  60% {
    clip-path:
      circle(12% at 50% 50%);
    opacity: 1;
  }

  78% {
    clip-path:
      circle(45% at 50% 50%);
    opacity: 1;
  }

  90% {
    clip-path:
      circle(90% at 50% 50%);
    opacity: 1;
  }

  100% {
    clip-path:
      circle(160% at 50% 50%);
    opacity: 1;
  }

}


@keyframes blackToTitle {

  0% {
    clip-path:
      circle(160% at 50% 50%);
  }

  25% {
    clip-path:
      circle(80% at 50% 50%);
  }

  50% {
    clip-path:
      circle(35% at 50% 50%);
  }

  68% {
    clip-path:
      circle(8% at 50% 50%);
  }

  78% {
    clip-path:
      circle(1% at 50% 50%);
  }

  100% {
    clip-path:
      circle(0% at 50% 50%);
  }

}


@keyframes titleAppear {

  0% {
    transform:
      translate(-50%, -50%)
      scale(0.055);
    opacity: 0;
  }

  20% {
    transform:
      translate(-50%, -50%)
      scale(0.055);
    opacity: 1;
  }

  45% {
    transform:
      translate(-50%, -50%)
      scale(0.15);
    opacity: 1;
  }

  70% {
    transform:
      translate(-50%, -50%)
      scale(0.72);
    opacity: 1;
  }

  100% {
    transform:
      translate(-50%, -50%)
      scale(1);
    opacity: 1;
  }

}

`;

document.head.appendChild(
  styleSheet
);


/* =========================================================
   INITIAL RANDOMIZATION
========================================================= */

randomizeCards();


/* =========================================================
   CARD → BLACK TRANSITION
========================================================= */

function enterBlackScreen() {

  if (transitioning) {
    return;
  }

  transitioning = true;

  stopTrailSoundCompletely();

  body.className =
    "black-transition";

  title.style.animation =
    "titleToBlack 2.15s cubic-bezier(0.16, 1, 0.3, 1) forwards";

  blackTransition.style.animation =
    "blackReveal 2.15s cubic-bezier(0.16, 1, 0.3, 1) forwards";

  setTimeout(
    () => {

      body.className =
        "black-mode";

      currentMode = 4;

      title.style.animation =
        "none";

      blackTransition.style.animation =
        "none";

      transitioning = false;

    },
    2200
  );

}


/* =========================================================
   TITLE CLICK
========================================================= */

title.addEventListener(
  "click",
  () => {

    if (transitioning) {
      return;
    }


    /* CARD → BLACK */

    if (currentMode === 3) {

      enterBlackScreen();

      return;
    }


    /* IMAGE → WORD */

    if (currentMode === 1) {

      stopTrailSoundCompletely();

      currentMode = 2;

      body.className =
        "word-mode";

      return;
    }


    /* WORD → CARDS */

    if (currentMode === 2) {

      stopTrailSoundCompletely();

      currentMode = 3;

      body.className =
        "card-mode";

      return;
    }

  }
);


/* =========================================================
   BLACK SCREEN → IMAGE
========================================================= */

blackTransition.addEventListener(
  "click",
  () => {

    if (
      currentMode !== 4 ||
      transitioning
    ) {
      return;
    }

    transitioning = true;

    body.className =
      "black-transition";

    title.style.display =
      "block";

    title.style.opacity =
      "0";

    title.style.transform =
      "translate(-50%, -50%) scale(0.055)";

    blackTransition.style.animation =
      "blackToTitle 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";

    title.style.animation =
      "titleAppear 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";

    setTimeout(
      () => {

        body.className =
          "image-mode";

        currentMode = 1;

        blackTransition.style.animation =
          "none";

        blackTransition.style.opacity =
          "0";

        title.style.animation =
          "none";

        title.style.transform =
          "translate(-50%, -50%) scale(1)";

        title.style.opacity =
          "1";

        title.style.display =
          "";

        transitioning = false;

      },
      1850
    );

  }
);


/* =========================================================
   CARD DRAG + FLIP
========================================================= */

function makeCardInteractive(card) {

  let startX = 0;
  let startY = 0;

  let originalLeft = 0;
  let originalTop = 0;

  let moved = false;

  let lastPointerX = 0;
  let lastPointerY = 0;

  let velocityX = 0;
  let velocityY = 0;

  let lastMoveTime = 0;


  /* POINTER DOWN */

  card.addEventListener(
    "pointerdown",
    (e) => {

      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "BUTTON"
      ) {
        return;
      }

      const rect =
        card.getBoundingClientRect();

      startX =
        e.clientX;

      startY =
        e.clientY;

      originalLeft =
        rect.left;

      originalTop =
        rect.top;

      lastPointerX =
        e.clientX;

      lastPointerY =
        e.clientY;

      velocityX = 0;
      velocityY = 0;

      lastMoveTime =
        performance.now();

      moved = false;

      card.style.animation =
        "none";

      card.style.left =
        `${originalLeft}px`;

      card.style.top =
        `${originalTop}px`;

      card.style.transform =
        "none";

      card.style.transition =
        "none";

      card.setPointerCapture(
        e.pointerId
      );

      card.classList.add(
        "dragging"
      );

    }
  );


  /* POINTER MOVE */

  card.addEventListener(
    "pointermove",
    (e) => {

      if (
        !card.hasPointerCapture(
          e.pointerId
        )
      ) {
        return;
      }

      const now =
        performance.now();

      const dx =
        e.clientX -
        startX;

      const dy =
        e.clientY -
        startY;

      const deltaTime =
        Math.max(
          now - lastMoveTime,
          1
        );

      velocityX =
        (
          e.clientX -
          lastPointerX
        ) /
        deltaTime;

      velocityY =
        (
          e.clientY -
          lastPointerY
        ) /
        deltaTime;

      lastPointerX =
        e.clientX;

      lastPointerY =
        e.clientY;

      lastMoveTime =
        now;

      if (
        Math.abs(dx) > 5 ||
        Math.abs(dy) > 5
      ) {
        moved = true;
      }

      card.style.left =
        `${originalLeft + dx}px`;

      card.style.top =
        `${originalTop + dy}px`;

    }
  );


  /* POINTER UP */

  card.addEventListener(
    "pointerup",
    (e) => {

      if (
        !card.hasPointerCapture(
          e.pointerId
        )
      ) {
        return;
      }

      card.releasePointerCapture(
        e.pointerId
      );

      card.classList.remove(
        "dragging"
      );


      /* DRAGGED */

      if (moved) {

        const momentumX =
          Math.max(
            -45,
            Math.min(
              45,
              velocityX * 90
            )
          );

        const momentumY =
          Math.max(
            -45,
            Math.min(
              45,
              velocityY * 90
            )
          );

        const currentLeft =
          parseFloat(
            card.style.left
          );

        const currentTop =
          parseFloat(
            card.style.top
          );

        card.style.transition =
          "left 0.65s cubic-bezier(0.16, 1, 0.3, 1), " +
          "top 0.65s cubic-bezier(0.16, 1, 0.3, 1)";

        card.style.left =
          `${currentLeft + momentumX}px`;

        card.style.top =
          `${currentTop + momentumY}px`;

        setTimeout(
          () => {

            card.style.transition =
              "none";

            if (
              !card.classList.contains(
                "flipped"
              )
            ) {

              setCardMovement(
                card
              );

            }

          },
          700
        );

        return;

      }


      /* + CARD */

      if (
        card.classList.contains(
          "add-card"
        ) &&
        !card.classList.contains(
          "has-image"
        )
      ) {
        return;
      }


      /* FLIP */

      card.classList.toggle(
        "flipped"
      );


      /* TEXT SIDE */

      if (
        card.classList.contains(
          "flipped"
        )
      ) {

        card.style.animation =
          "none";

        card.style.transition =
          "none";

      }


      /* PHOTO SIDE */

      else {

        setTimeout(
          () => {

            setCardMovement(
              card
            );

          },
          50
        );

      }

    }
  );

}


/* =========================================================
   INITIAL CARD INTERACTION
========================================================= */

cards.forEach(
  makeCardInteractive
);


/* =========================================================
   CUSTOM CARD SYSTEM
========================================================= */

const addCard =
  document.querySelector(
    ".add-card"
  );

const customImageInput =
  document.querySelector(
    "#custom-image-input"
  );

let customImageURL = null;


/* =========================================================
   CLICK +
========================================================= */

addCard.addEventListener(
  "click",
  (e) => {

    if (
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (
      !addCard.classList.contains(
        "flipped"
      ) &&
      !addCard.classList.contains(
        "has-image"
      )
    ) {

      customImageInput.click();

    }

  }
);


/* =========================================================
   ADD RULE BUTTON
========================================================= */

addCard.addEventListener(
  "click",
  (e) => {

    if (
      e.target.id ===
      "save-custom-card"
    ) {

      e.preventDefault();

      e.stopPropagation();

      finishCustomCard();

    }

  }
);


/* =========================================================
   IMAGE UPLOAD
========================================================= */

customImageInput.addEventListener(
  "change",
  (e) => {

    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    customImageURL =
      URL.createObjectURL(file);

    const front =
      addCard.querySelector(
        ".add-card-front"
      );

    front.style.backgroundImage =
      `url("${customImageURL}")`;

    addCard.classList.add(
      "has-image"
    );

    setTimeout(
      () => {

        addCard.classList.add(
          "flipped"
        );

      },
      100
    );

  }
);


/* =========================================================
   FINISH CUSTOM CARD
========================================================= */

function finishCustomCard() {

  const ruleTitleInput =
    addCard.querySelector(
      "#custom-rule-title"
    );

  const ruleDescriptionInput =
    addCard.querySelector(
      "#custom-rule-description"
    );

  if (!ruleTitleInput) {
    return;
  }

  const ruleTitle =
    ruleTitleInput.value.trim();

  const ruleDescription =
    ruleDescriptionInput.value.trim();

  if (!ruleTitle) {

    ruleTitleInput.focus();

    return;

  }

  const plusRect =
    addCard.getBoundingClientRect();

  const destination =
    getExtremeDestination(
      plusRect.left,
      plusRect.top,
      plusRect.width,
      plusRect.height
    );

  const completedCard =
    document.createElement(
      "div"
    );

  completedCard.className =
    "card custom-completed-card flipped";

  completedCard.style.left =
    `${plusRect.left}px`;

  completedCard.style.top =
    `${plusRect.top}px`;

  completedCard.style.width =
    `${plusRect.width}px`;

  completedCard.style.height =
    `${plusRect.height}px`;

  completedCard.style.zIndex =
    "50";

  completedCard.style.opacity =
    "1";

  completedCard.style.transform =
    "scale(1.08) rotate(-3deg)";

  completedCard.style.animation =
    "none";

  completedCard.innerHTML = `

    <div class="card-inner">

      <div
        class="card-front"
        style="
          background-image: url('${customImageURL}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        "
      ></div>

      <div class="card-back">

        <span>YOUR RULE</span>

        <h2>
          ${escapeHTML(ruleTitle)}
        </h2>

        <p>
          ${escapeHTML(ruleDescription)}
        </p>

      </div>

    </div>

  `;

  addCard.parentNode.insertBefore(
    completedCard,
    addCard
  );

  makeCardInteractive(
    completedCard
  );

  void completedCard.offsetWidth;

  completedCard.style.transition =
    "transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), " +
    "left 2.2s cubic-bezier(0.16, 1, 0.3, 1), " +
    "top 2.2s cubic-bezier(0.16, 1, 0.3, 1)";

  completedCard.style.left =
    `${destination.x}px`;

  completedCard.style.top =
    `${destination.y}px`;

  completedCard.style.transform =
    "scale(1) rotate(0deg)";

  resetAddCard();

  setTimeout(
    () => {

      completedCard.style.transition =
        "none";

      if (
        completedCard.classList.contains(
          "flipped"
        )
      ) {

        completedCard.style.animation =
          "none";

      }

    },
    2300
  );

}


/* =========================================================
   EXTREME DESTINATION
========================================================= */

function getExtremeDestination(
  startX,
  startY,
  cardWidth,
  cardHeight
) {

  const margin = 30;

  const screenWidth =
    window.innerWidth;

  const screenHeight =
    window.innerHeight;

  const destinations = [

    {
      x: margin,
      y: margin
    },

    {
      x:
        (screenWidth -
          cardWidth) / 2,

      y: margin
    },

    {
      x:
        screenWidth -
        cardWidth -
        margin,

      y: margin
    },

    {
      x: margin,

      y:
        (screenHeight -
          cardHeight) / 2
    },

    {
      x:
        screenWidth -
        cardWidth -
        margin,

      y:
        (screenHeight -
          cardHeight) / 2
    },

    {
      x: margin,

      y:
        screenHeight -
        cardHeight -
        margin
    },

    {
      x:
        (screenWidth -
          cardWidth) / 2,

      y:
        screenHeight -
        cardHeight -
        margin
    },

    {
      x:
        screenWidth -
        cardWidth -
        margin,

      y:
        screenHeight -
        cardHeight -
        margin
    }

  ];

  destinations.forEach(
    (destination) => {

      destination.distance =
        Math.hypot(
          destination.x -
            startX,

          destination.y -
            startY
        );

    }
  );

  destinations.sort(
    (a, b) =>
      b.distance -
      a.distance
  );

  const farthest =
    destinations.slice(
      0,
      3
    );

  const selected =
    farthest[
      Math.floor(
        Math.random() *
        farthest.length
      )
    ];

  return {

    x: selected.x,

    y: selected.y

  };

}


/* =========================================================
   RESET + CARD
========================================================= */

function resetAddCard() {

  addCard.classList.remove(
    "flipped",
    "has-image",
    "custom-complete"
  );

  customImageURL =
    null;

  addCard.querySelector(
    ".card-inner"
  ).innerHTML = `

    <div class="card-front add-card-front">

      <span>+</span>

    </div>

    <div class="card-back add-card-back">

      <label>

        RULE

        <input
          type="text"
          id="custom-rule-title"
          placeholder="Write your rule..."
          maxlength="60"
        >

      </label>

      <label>

        WHY?

        <textarea
          id="custom-rule-description"
          placeholder="What does this rule mean?"
          maxlength="180"
        ></textarea>

      </label>

      <button
        type="button"
        id="save-custom-card"
      >
        ADD RULE
      </button>

    </div>

  `;

  customImageInput.value =
    "";

  addCard.style.transform =
    "none";

  addCard.style.animation =
    "none";

  addCard.style.transition =
    "none";

  addCard.style.zIndex =
    "10";

}


/* =========================================================
   SAFE TEXT
========================================================= */

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text;

  return div.innerHTML;

}


/* =========================================================
   IMAGE TRAIL + MUSIC
========================================================= */

let lastImageX = 0;
let lastImageY = 0;
let lastImageTime = 0;


document.addEventListener(
  "mousemove",
  (e) => {

    if (
      currentMode !== 1
    ) {

      stopTrailSoundCompletely();

      return;

    }


    /* START MUSIC WHILE MOVING */

    startTrailSound();

    stopTrailSound();


    const now =
      Date.now();


    if (
      now - lastImageTime <
      80
    ) {
      return;
    }


    const distance =
      Math.hypot(
        e.clientX -
          lastImageX,

        e.clientY -
          lastImageY
      );


    if (
      distance < 15
    ) {
      return;
    }


    lastImageX =
      e.clientX;

    lastImageY =
      e.clientY;

    lastImageTime =
      now;


    const img =
      document.createElement(
        "img"
      );


    const randomImage =
      trailImages[
        Math.floor(
          Math.random() *
          trailImages.length
        )
      ];


    img.src =
      randomImage;

    img.className =
      "trail-image";


    img.style.left =
      `${e.clientX}px`;

    img.style.top =
      `${e.clientY}px`;


    img.style.transform =
      `translate(-50%, -50%)
       rotate(${Math.random() * 20 - 10}deg)`;


    imageTrail.appendChild(
      img
    );


    setTimeout(
      () => {

        img.remove();

      },
      1500
    );

  }
);


/* =========================================================
   WORD TRAIL
========================================================= */

let lastWordX = 0;
let lastWordY = 0;
let lastWordTime = 0;


document.addEventListener(
  "mousemove",
  (e) => {

    if (
      currentMode !== 2
    ) {
      return;
    }


    const now =
      Date.now();


    if (
      now - lastWordTime <
      90
    ) {
      return;
    }


    const distance =
      Math.hypot(
        e.clientX -
          lastWordX,

        e.clientY -
          lastWordY
      );


    if (
      distance < 18
    ) {
      return;
    }


    lastWordX =
      e.clientX;

    lastWordY =
      e.clientY;

    lastWordTime =
      now;


    const word =
      document.createElement(
        "span"
      );


    word.className =
      "trail-word";


    word.textContent =
      trailWords[
        Math.floor(
          Math.random() *
          trailWords.length
        )
      ];


    word.style.left =
      `${e.clientX}px`;

    word.style.top =
      `${e.clientY}px`;


    const randomSize =
      Math.floor(
        Math.random() * 9
      ) + 15;


    const randomRotation =
      Math.random() * 10 - 5;


    word.style.fontSize =
      `${randomSize}px`;


    word.style.transform =
      `translate(-50%, -50%)
       rotate(${randomRotation}deg)`;


    wordTrail.appendChild(
      word
    );


    setTimeout(
      () => {

        word.remove();

      },
      1400
    );

  }
);
