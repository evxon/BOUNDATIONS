/* ==================================================
   ELEMENTS
================================================== */

const filmList = document.getElementById('filmList');
const photoList = document.getElementById('photoList');
const designList = document.getElementById('designList');
const webList = document.getElementById('webList');

const leftSide = document.getElementById('leftSide');
const evonToggle = document.getElementById('evonToggle');

const trailSound = document.getElementById('trailSound');

const videoOverlay = document.createElement('div');
videoOverlay.className = 'video-overlay';

const centerVideoPlayer = document.createElement('video');
centerVideoPlayer.controls = true;

videoOverlay.appendChild(centerVideoPlayer);

const videoSplit = document.getElementById('videoSplit');
const leftVideo = document.getElementById('leftVideo');
const rightVideo = document.getElementById('rightVideo');

const defaultBackground =
  "url('image/임연정-67722.jpg')";


/* ==================================================
   TRAIL / AUDIO VARIABLES
================================================== */

let trailEnabled = true;

let audioUnlocked = false;

let mouseMoving = false;

let lastTrailTime = 0;

let movementTimer = null;

let activeVideoContainer = null;


/* ==================================================
   GET TRAIL LAYER
================================================== */

function getTrailLayer() {

  let layer =
    document.getElementById('mouseTrailLayer');

  /*
    If the layer doesn't exist because the
    left side was replaced, create it again.
  */

  if (!layer) {

    layer =
      document.createElement('div');

    layer.id =
      'mouseTrailLayer';

    leftSide.appendChild(layer);
  }

  return layer;
}


/* ==================================================
   AUDIO SETTINGS
================================================== */

trailSound.volume = 0.5;

trailSound.loop = true;


/* ==================================================
   UNLOCK AUDIO
================================================== */

/*
   Browsers do not allow audible autoplay
   from mouse movement alone.

   One click anywhere on the page unlocks
   the audio.

   The click itself does NOT start the music.

   After that, mouse movement controls the music.
*/

document.addEventListener(
  'click',
  unlockAudio,
  {
    once: true
  }
);


function unlockAudio() {

  trailSound.muted = true;

  trailSound.play()
    .then(function() {

      trailSound.pause();

      trailSound.currentTime = 0;

      trailSound.muted = false;

      audioUnlocked = true;

      console.log(
        'Audio unlocked. Mouse movement can now control sound.'
      );

    })
    .catch(function(error) {

      console.log(
        'Could not unlock audio:',
        error
      );

    });
}


/* ==================================================
   START MUSIC
================================================== */

function startTrailSound() {

  if (!audioUnlocked) {
    return;
  }

  /*
    If already playing, do nothing.
  */

  if (!trailSound.paused) {
    return;
  }

  trailSound.play()
    .then(function() {

      console.log(
        'Trail sound playing'
      );

    })
    .catch(function(error) {

      console.log(
        'Could not play trail sound:',
        error
      );

    });
}


/* ==================================================
   STOP MUSIC
================================================== */

function stopTrailSound() {

  trailSound.pause();

  trailSound.currentTime = 0;

}


/* ==================================================
   MOUSE TRAIL
================================================== */

leftSide.addEventListener(
  'mousemove',
  function(event) {

    if (!trailEnabled) {
      return;
    }


    /* ==============================================
       MOUSE IS MOVING
    ============================================== */

    mouseMoving = true;


    /*
      Start the music.
    */

    startTrailSound();


    /*
      Every time the mouse moves,
      reset the "stop" timer.

      If the mouse stops moving for
      150 milliseconds, music stops.
    */

    clearTimeout(movementTimer);

    movementTimer = setTimeout(
      function() {

        mouseMoving = false;

        stopTrailSound();

      },
      150
    );


    /* ==============================================
       TRAIL SPEED
    ============================================== */

    const now = Date.now();

    if (
      now - lastTrailTime < 30
    ) {
      return;
    }

    lastTrailTime = now;


    /* ==============================================
       MOUSE POSITION
    ============================================== */

    const rect =
      leftSide.getBoundingClientRect();


    const x =
      event.clientX - rect.left;


    const y =
      event.clientY - rect.top;


    /* ==============================================
       TRAIL LAYER
    ============================================== */

    const trailLayer =
      getTrailLayer();


    /* ==============================================
       CREATE TRAIL
    ============================================== */

    const trail =
      document.createElement('div');

    trail.className =
      'mouse-trail';


    trail.style.left =
      x + 'px';


    trail.style.top =
      y + 'px';


    trailLayer.appendChild(
      trail
    );


    /* ==============================================
       REMOVE TRAIL
    ============================================== */

    setTimeout(
      function() {

        trail.remove();

      },
      700
    );

  }
);


/* ==================================================
   MOUSE LEAVES LEFT SIDE
================================================== */

leftSide.addEventListener(
  'mouseleave',
  function() {

    mouseMoving = false;

    clearTimeout(
      movementTimer
    );

    stopTrailSound();

  }
);


/* ==================================================
   STOP TRAIL
================================================== */

function stopTrail() {

  trailEnabled = false;

  mouseMoving = false;

  clearTimeout(
    movementTimer
  );

  stopTrailSound();


  const trailLayer =
    document.getElementById(
      'mouseTrailLayer'
    );


  if (trailLayer) {

    trailLayer.innerHTML = '';

  }

}


/* ==================================================
   START TRAIL
================================================== */

function startTrail() {

  trailEnabled = true;

}


/* ==================================================
   MENU
================================================== */

function hideAllLists() {

  webList.style.display = 'none';
  filmList.style.display = 'none';
  photoList.style.display = 'none';
  designList.style.display = 'none';

  webList.classList.remove('menu-open');
  filmList.classList.remove('menu-open');
  photoList.classList.remove('menu-open');
  designList.classList.remove('menu-open');

}


function toggleList(list) {

  const isOpen =
    list.style.display === 'block';

  hideAllLists();

  if (!isOpen) {

    list.style.display = 'block';

    list.classList.remove(
      'menu-open'
    );

    void list.offsetWidth;

    list.classList.add(
      'menu-open'
    );

  }

}


document.getElementById('web')
  .addEventListener(
    'click',
    function() {

      toggleList(webList);

    }
  );


document.getElementById('film')
  .addEventListener(
    'click',
    function() {

      toggleList(filmList);

    }
  );


document.getElementById('design')
  .addEventListener(
    'click',
    function() {

      toggleList(designList);

    }
  );


/* ==================================================
   REMOVE VIDEO
================================================== */

function removeActiveVideo() {

  if (activeVideoContainer) {

    activeVideoContainer.remove();

    activeVideoContainer = null;

  }


  centerVideoPlayer.pause();

  centerVideoPlayer.src = '';


  videoSplit.style.display =
    'none';


  leftVideo.pause();

  rightVideo.pause();


  leftVideo.src = '';

  rightVideo.src = '';

}


/* ==================================================
   RESET HOME
================================================== */

function resetLeftSide() {

  removeActiveVideo();

  startTrail();


  leftSide.innerHTML = `

    <div
      class="left-text"
      id="introText"
    >
      Evon is a New York and Seoul based communication designer interested in visual storytelling, branding, and experience. She explores how design can shape the way we see, feel, and interact with the world around us.
    </div>

    <div id="mouseTrailLayer"></div>

  `;


  leftSide.style.backgroundImage =
    defaultBackground;


  leftSide.style.backgroundSize =
    'cover';


  leftSide.style.backgroundPosition =
    'center';


  leftSide.style.backgroundColor =
    'transparent';


  evonToggle.style.display =
    'none';


  hideAllLists();

}


/* ==================================================
   SHOW EVON BUTTON
================================================== */

function showEvonToggle() {

  evonToggle.style.display =
    'block';

}


/* ==================================================
   FILM
================================================== */

filmList.querySelectorAll('li')
.forEach(function(item) {

  item.addEventListener(
    'click',
    function() {

      stopTrail();

      removeActiveVideo();


      const videoSrc =
        item.getAttribute(
          'data-video'
        );


      leftSide.innerHTML = '';


      leftSide.style.backgroundImage =
        defaultBackground;


      leftSide.style.backgroundSize =
        'cover';


      leftSide.style.backgroundPosition =
        'center';


      leftSide.style.backgroundColor =
        'transparent';


      videoSplit.style.display =
        'none';


      const videoContainer =
        document.createElement(
          'div'
        );


      videoContainer.className =
        'video-container';


      videoContainer.style.position =
        'fixed';


      videoContainer.style.top =
        '50%';


      videoContainer.style.left =
        '50%';


      videoContainer.style.transform =
        'translate(-50%, -50%)';


      videoContainer.style.width =
        '45vw';


      videoContainer.style.maxWidth =
        '700px';


      videoContainer.style.display =
        'flex';


      videoContainer.style.flexDirection =
        'column';


      videoContainer.style.alignItems =
        'center';


      videoContainer.style.zIndex =
        '10000';


      centerVideoPlayer.src =
        videoSrc;


      centerVideoPlayer.controls =
        true;


      centerVideoPlayer.load();


      centerVideoPlayer.play()
        .catch(function() {});


      centerVideoPlayer.style.width =
        '100%';


      centerVideoPlayer.style.height =
        'auto';


      centerVideoPlayer.style.display =
        'block';


      const infoWrapper =
        document.createElement(
          'div'
        );


      infoWrapper.style.width =
        '100%';


      infoWrapper.style.marginTop =
        '10px';


      const year =
        document.createElement(
          'div'
        );


      year.className =
        'video-year';


      const desc =
        document.createElement(
          'div'
        );


      desc.className =
        'video-description';


      if (
        videoSrc ===
        'compressed/C0251.mp4'
      ) {

        year.textContent =
          '(2025)';


        desc.textContent =
          'A contemplative short capturing the quiet after loss—sitting in a car, watching snow fall, the world safe yet emptied. It invites viewers to imagine their own stories, emotions, and what has been carried away or left behind.';

      }


      infoWrapper.appendChild(
        year
      );


      infoWrapper.appendChild(
        desc
      );


      videoContainer.appendChild(
        videoOverlay
      );


      videoContainer.appendChild(
        infoWrapper
      );


      document.body.appendChild(
        videoContainer
      );


      activeVideoContainer =
        videoContainer;


      showEvonToggle();

    }
  );

});


/* ==================================================
   PHOTOGRAPHY
================================================== */

photoList.querySelectorAll('li')
.forEach(function(item) {

  item.addEventListener(
    'click',
    function() {

      stopTrail();

      removeActiveVideo();


      const imgSrc =
        item.getAttribute(
          'data-img'
        );


      leftSide.innerHTML =
        '';


      leftSide.style.backgroundImage =
        `url('${imgSrc}')`;


      leftSide.style.backgroundSize =
        'cover';


      leftSide.style.backgroundPosition =
        'center';


      leftSide.style.backgroundColor =
        'transparent';


      showEvonToggle();

    }
  );

});


/* ==================================================
   BRAND & IDENTITY
================================================== */

webList.querySelectorAll('li')
.forEach(function(item) {

  item.addEventListener(
    'click',
    function() {

      stopTrail();

      removeActiveVideo();


      leftSide.innerHTML =
        '';


      leftSide.style.backgroundImage =
        'none';


      leftSide.style.backgroundColor =
        'white';


      /* ============================================
         SØNNER
      ============================================ */

      if (item.id === 'home') {

        leftSide.style.backgroundImage =
          "url('image/sønner.png')";


        leftSide.style.backgroundSize =
          'contain';


        leftSide.style.backgroundRepeat =
          'no-repeat';


        leftSide.style.backgroundPosition =
          'center';


        const year =
          document.createElement(
            'div'
          );


        year.className =
          'halley-year';


        year.textContent =
          '(2024)';


        year.style.bottom =
          '20px';


        year.style.right =
          '20px';


        leftSide.appendChild(
          year
        );


        const desc =
          document.createElement(
            'div'
          );


        desc.className =
          'schedule-desc';


        desc.textContent =
          'A web-based design project exploring SØNNER, a visual identity and digital experience centered around golf, art, and culture.';


        leftSide.appendChild(
          desc
        );

      }


      /* ============================================
         POLO
      ============================================ */

      else if (
        item.id === 'iblame'
      ) {

        leftSide.style.backgroundImage =
          "url('image/polo.png')";


        leftSide.style.backgroundSize =
          'contain';


        leftSide.style.backgroundRepeat =
          'no-repeat';


        leftSide.style.backgroundPosition =
          'center';


        const year =
          document.createElement(
            'div'
          );


        year.className =
          'iblame-year';


        year.textContent =
          '(2025)';


        year.style.position =
          'absolute';


        year.style.bottom =
          '20px';


        year.style.right =
          '20px';


        leftSide.appendChild(
          year
        );


        const desc =
          document.createElement(
            'div'
          );


        desc.className =
          'iblame-desc';


        desc.textContent =
          'A web-based project exploring Polo through interactive design, visual identity, and digital storytelling.';


        desc.style.position =
          'absolute';


        desc.style.bottom =
          '20px';


        desc.style.left =
          '20px';


        desc.style.maxWidth =
          '250px';


        leftSide.appendChild(
          desc
        );

      }


      /* ============================================
         CHAIROSCOPE
      ============================================ */

      else if (
        item.id === 'chai'
      ) {

        const videoContainer =
          document.createElement(
            'div'
          );


        videoContainer.className =
          'video-container';


        const chaiVideo =
          document.createElement(
            'video'
          );


        chaiVideo.src =
          'video/chairoscope_ short.mov';


        chaiVideo.controls =
          true;


        chaiVideo.autoplay =
          true;


        chaiVideo.style.width =
          '90%';


        const chaiYear =
          document.createElement(
            'div'
          );


        chaiYear.className =
          'chai-year';


        chaiYear.textContent =
          '(2025)';


        const additionalDesc =
          document.createElement(
            'div'
          );


        additionalDesc.className =
          'chai-desc';


        additionalDesc.textContent =
          'An interactive web-based design system where users select a birthday to reveal a unique chair with a corresponding description, inspired by zodiac-style personalization. Each chair’s form and attributes are derived from the designer’s birthday.';


        videoContainer.appendChild(
          chaiVideo
        );


        videoContainer.appendChild(
          chaiYear
        );


        videoContainer.appendChild(
          additionalDesc
        );


        leftSide.appendChild(
          videoContainer
        );

      }


      showEvonToggle();

    }
  );

});


/* ==================================================
   GRAPHIC DESIGN
================================================== */

designList.querySelectorAll('li')
.forEach(function(item) {

  item.addEventListener(
    'click',
    function() {

      stopTrail();

      removeActiveVideo();


      leftSide.innerHTML =
        '';


      leftSide.style.backgroundImage =
        'none';


      leftSide.style.backgroundColor =
        'white';


      /* ============================================
         HALLEY'S COMET
      ============================================ */

      if (
        item.id === 'halley'
      ) {

        leftSide.style.backgroundImage =
          "url('image/final versions-01.png')";


        leftSide.style.backgroundSize =
          '65%';


        leftSide.style.backgroundRepeat =
          'no-repeat';


        leftSide.style.backgroundPosition =
          '68% center';


        const inspiredText =
          document.createElement(
            'div'
          );


        inspiredText.className =
          'schedule-desc';


        inspiredText.textContent =
          'A poster about Halley’s Comet, illustrating its first observation in Korea during the Joseon Dynasty and its historical timeline.';


        inspiredText.style.color =
          'gray';


        inspiredText.style.position =
          'absolute';


        inspiredText.style.left =
          '30px';


        inspiredText.style.top =
          '50%';


        inspiredText.style.transform =
          'translateY(-50%)';


        inspiredText.style.width =
          '150px';


        inspiredText.style.maxWidth =
          '150px';


        inspiredText.style.lineHeight =
          '1.4';


        inspiredText.style.fontSize =
          '0.68rem';


        inspiredText.style.textAlign =
          'left';


        inspiredText.style.zIndex =
          '5';


        leftSide.appendChild(
          inspiredText
        );


        const halleyYear =
          document.createElement(
            'div'
          );


        halleyYear.className =
          'halley-year';


        halleyYear.textContent =
          '(2025)';


        halleyYear.style.position =
          'absolute';


        halleyYear.style.left =
          '30px';


        halleyYear.style.top =
          'calc(50% + 75px)';


        halleyYear.style.color =
          'gray';


        halleyYear.style.fontSize =
          '0.85rem';


        halleyYear.style.fontStyle =
          'italic';


        halleyYear.style.zIndex =
          '5';


        leftSide.appendChild(
          halleyYear
        );

      }


      /* ============================================
         WHISKEY
      ============================================ */

      else if (
        item.id === 'whiskey'
      ) {

        leftSide.style.backgroundImage =
          "url('image/whiskey.png')";


        leftSide.style.backgroundSize =
          'contain';


        leftSide.style.backgroundRepeat =
          'no-repeat';


        leftSide.style.backgroundPosition =
          'center';

      }


      showEvonToggle();

    }
  );

});


/* ==================================================
   EVON BUTTON
================================================== */

evonToggle.addEventListener(
  'click',
  resetLeftSide
);
