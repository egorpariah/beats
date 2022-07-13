(function () {
  const player = document.querySelector('.player__elem');
  const playerContainer = $('.player__main');
  
  let currentPosition = 0;
  let currentVolume = 0;

  const changeActivePausedClass = () => {
    return {
      add() {
        playerContainer.addClass('active');
        playerContainer.addClass('paused');
      },
      remove() {
        playerContainer.removeClass('active');
        playerContainer.removeClass('paused');
      }
    }
  }

  const classChanger = changeActivePausedClass();

  $('.player__start').on('click', e => {
    e.preventDefault();

    if (playerContainer.hasClass('paused')) {
      player.pause();
      classChanger.remove();
    } else {
      player.play();
      classChanger.add();
    }
  });

  $('.player__splash').on('click', e => {
    player.play();

    classChanger.add();
  });

  $(player).on('click', e => {
    e.preventDefault();

    player.pause();
    classChanger.remove();
  });

  player.addEventListener('ended', e => {
    e.preventDefault();

    player.pause();
    classChanger.remove();

    $('.player__playback .range-slider__button').css({
      left: 0
    });

    $('.player__playback .range-slider__progress').css({
      width: 0
    });
  })

  $('.player__playback').on('click', e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const buttonPositionPercent = (clickedPosition / bar.width()) * 100;
    const playbackPositionSec = (player.duration / 100) * buttonPositionPercent;

    $('.player__playback .range-slider__button').css({
      left: `${buttonPositionPercent}%`
    });

    $('.player__playback .range-slider__progress').css({
      width: `${buttonPositionPercent}%`
    });

    player.currentTime = playbackPositionSec;
  });

  $('.range-slider__button').on('click', e => {
    e.stopPropagation();
  })

  const playbackButtonAnimation = () => {
    let interval;
    const durationSec = player.duration;

    if (typeof interval != "undefined") {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      if (!playerContainer.hasClass('active')) {
        clearInterval(interval);
        return;
      }

      const completedSec = player.currentTime;
      const completedPercent = (completedSec / durationSec) * 100;

      $('.player__playback .range-slider__button').css({
        left: `${completedPercent}%`
      });

      $('.player__playback .range-slider__progress').css({
        width: `${completedPercent}%`
      });
    }, 1000);
  }

  player.addEventListener('play', playbackButtonAnimation);

  $('.player__volume-slider').on('click', e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const buttonPositionPercent = (clickedPosition / bar.width()) * 100;

    if (clickedPosition == 0) {
      $('.player__mute').addClass('active');
    } else {
      $('.player__mute').removeClass('active');
    }

    $('.player__volume-slider .range-slider__button').css({
      left: `${buttonPositionPercent}%`
    });

    $('.player__volume-slider .range-slider__progress').css({
      width: `${buttonPositionPercent}%`
    });

    player.volume = buttonPositionPercent / 100;
  });

  $('.player__mute').on('click', e => {
    e.preventDefault();

    const $this = $(e.currentTarget);

    if ($this.hasClass('active')) {
      player.muted = false;
      $this.removeClass('active');

      player.volume = currentVolume;

      $('.player__volume-slider .range-slider__button').css({
        left: `${currentPosition}`
      });

      $('.player__volume-slider .range-slider__progress').css({
        width: `${currentPosition}`
      });
    } else {
      currentPosition = $('.player__volume-slider .range-slider__button').css('left');
      currentVolume = player.volume;

      player.muted = true;
      $this.addClass('active');

      $('.player__volume-slider .range-slider__button').css({
        left: 0
      });

      $('.player__volume-slider .range-slider__progress').css({
        width: 0
      });
    }
  });
})()