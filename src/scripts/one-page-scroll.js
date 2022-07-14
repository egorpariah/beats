let isScroll = false;

(function () {
  const sections = $('section');
  const mainContent = $('.main-content');
  const fixedMenu = $('.fixed-menu');
  const fixedMenuItems = fixedMenu.find('.fixed-menu__item');

  // http://hgoebl.github.io/mobile-detect.js/
  const mobileDetect = new MobileDetect(window.navigator.userAgent);
  const isMobile = mobileDetect.mobile();

  sections.first().addClass('active');

  const translatePosition = (sectionNdx) => {
    const position = sectionNdx * -100;

    if (isNaN(position)) {
      console.error('Передано неверное значение в translatePosition');
      return 0;
    }

    return position;
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

  function translateFunc(sectionNdx) {
    if (isScroll) return;

    isScroll = true;

    const position = translatePosition(sectionNdx);

    changeMenuTheme(sectionNdx);

    mainContent.css({ transform: `translateY(${position}%)` })

    resetActiveClass(sections, sectionNdx, 'active');
    resetActiveClass(fixedMenuItems, sectionNdx, 'fixed-menu__item--active');

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
          translateFunc(nextSection.index());
        }
      },
      prev() {
        if (prevSection.length) {
          translateFunc(prevSection.index());
        }
      }
    };
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

  $('[data-target]').on('click', e => {
    e.preventDefault();

    const menu = document.querySelector('.menu');

    isScroll = false;
    menu.removeAttribute('style');

    const $this = $(e.currentTarget);
    const target = $this.attr('data-target');
    const reqSection = $(`[data-section-id=${target}]`)

    translateFunc(reqSection.index());
  });

  $('.wrapper').on('touchmove', e => e.preventDefault());

  if (isMobile) {
    // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    $('body').swipe({
      swipe: function (event, direction) {
        if (direction == 'left' || direction == 'right') return;

        const scroller = sectionScroller();

        let scrollDirection = '';

        if (direction == 'up') scrollDirection = 'next';
        if (direction == 'down') scrollDirection = 'prev';

        scroller[scrollDirection]();
      },
    });
  }
})()