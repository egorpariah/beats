let isScroll = false;

(function () {
  const sections = $('section');
  const mainContent = $('.main-content');
  const fixedMenu = $('.fixed-menu');
  const fixedMenuItems = fixedMenu.find('.fixed-menu__item');

  // http://hgoebl.github.io/mobile-detect.js/
  const mobileDetect = new MobileDetect(window.navigator.userAgent);
  const isMobile = mobileDetect.mobile();

  let isEnd = false;

  sections.first().addClass('active');

  const translatePosition = (sectionNdx, direction) => {
    const activeSection = sections.filter('.active');
    const prevSection = activeSection.prev();

    const activeSectionHeight = activeSection.height();
    const prevSectionHeight = prevSection.height();

    const windowHeight = $(window).height();

    let position = 0;
    let currentTransform = 0;

    if (mainContent.css('transform') != 'none') {
      currentTransform = parseFloat(mainContent.css('transform').split(',')[5]);
    }

    if (direction == 'down') {
      if (activeSectionHeight > windowHeight && isEnd == false) {
        position = currentTransform + windowHeight - activeSectionHeight;
        isEnd = true;
      } else {
        position = currentTransform - windowHeight;
        isEnd = false;
      }
    }

    if (direction == 'up') {
      if (isEnd == true) {
        position = currentTransform + activeSectionHeight - windowHeight;
        isEnd = false;
      } else {
        position = currentTransform + windowHeight;

        if (prevSectionHeight > windowHeight) {
          isEnd = true;
        } else {
          isEnd = false;
        }
      }
    }

    if (direction == 'link') {
      sections.slice(0, sectionNdx).each(function () {
        position -= $(this).outerHeight();
      });

      isEnd = false;
    }

    if (isNaN(position)) {
      console.error('Передано неверное значение в translatePosition');
      return 0;
    }

    return {
      position: position,
      isEnd: isEnd
    };
  };

  const changeMenuTheme = sectionNdx => {
    const currentSection = sections.eq(sectionNdx);
    const menuTheme = currentSection.attr('data-fixedmenu-theme');
    const themeClass = 'fixed-menu--dark';

    if (menuTheme == 'dark') {
      fixedMenu.addClass(themeClass);
    } else {
      fixedMenu.removeClass(themeClass);
    };
  };

  const resetActiveClass = (items, itemNdx, activeClass) => {
    items.eq(itemNdx).addClass(activeClass).siblings().removeClass(activeClass);
  };

  function translateFunc(sectionNdx, direction) {
    if (isScroll) return;

    isScroll = true;

    const shift = translatePosition(sectionNdx, direction);

    changeMenuTheme(sectionNdx);

    mainContent.css({ transform: `translateY(${shift.position}px)` })

    if (direction == 'down') {
      if (shift.isEnd == false) {
        resetActiveClass(sections, sectionNdx, 'active');
        resetActiveClass(fixedMenuItems, sectionNdx, 'fixed-menu__item--active');
      }
    }

    if (direction == 'up') {
      if (shift.isEnd == true) {
        resetActiveClass(sections, sectionNdx, 'active');
        resetActiveClass(fixedMenuItems, sectionNdx, 'fixed-menu__item--active');
      } else if ((shift.isEnd == false) && (sections.eq(sectionNdx).height() <= $(window).height())) {
        resetActiveClass(sections, sectionNdx, 'active');
        resetActiveClass(fixedMenuItems, sectionNdx, 'fixed-menu__item--active');
      }
    }

    if (direction == 'link') {
      mainContent.css({ transform: `translateY(${shift.position}px)` });

      resetActiveClass(sections, sectionNdx, 'active');
      resetActiveClass(fixedMenuItems, sectionNdx, 'fixed-menu__item--active');
    }

    mainContent.on('transitionend', (e) => {
      if (e.target !== mainContent[0]) return;

      isScroll = false;
    });
  }

  const sectionScroller = () => {
    const activeSection = sections.filter('.active');

    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    return {
      next() {
        if (nextSection.length) {
          translateFunc(nextSection.index(), 'down');
        }
      },
      prev() {
        if ((prevSection.length) || (isEnd == true)) {
          if (isEnd == true) {
            translateFunc(activeSection.index(), 'up');
          } else {
            translateFunc(prevSection.index(), 'up');
          }
        }
      }
    }
  };

  $(window).on('wheel', (e) => {
    const deltaY = e.originalEvent.deltaY;
    const scroller = sectionScroller();

    if (deltaY > 0) {
      scroller.next();
    }

    if (deltaY < 0) {
      scroller.prev();
    }
  });

  $(window).on('keydown', e => {
    const targetTag = e.target.tagName.toLowerCase();
    const userTypingInput = targetTag == 'input' || targetTag == 'textarea';
    const scroller = sectionScroller();

    if (userTypingInput) return;

    switch (e.keyCode) {
      case 38:
        scroller.prev();
        break;

      case 40:
        scroller.next();
        break;
    };
  });

  $('.wrapper').on('touchmove', e => e.preventDefault());

  $('[data-target]').on('click', e => {
    e.preventDefault();

    const menu = document.querySelector('.menu');

    isScroll = false;
    menu.removeAttribute('style');

    const $this = $(e.currentTarget);
    const target = $this.attr('data-target');
    const reqSection = $(`[data-section-id=${target}]`)

    translateFunc(reqSection.index(), 'link');
  });

  if (isMobile) {
    // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    $('body').swipe({
      swipe: function (event, direction) {
        const scroller = sectionScroller();
        let scrollDirection = '';

        if (direction == 'up') scrollDirection = 'next';
        if (direction == 'down') scrollDirection = 'prev';

        if (direction == 'left' || direction == 'right') return;

        scroller[scrollDirection]();
      },
    });
  }
})()