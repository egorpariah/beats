(function () {
  const measureWidth = item => {
    let reqItemWidth = 0;

    const isTablet = window.matchMedia('(max-width: 768px)').matches;
    const isMobile = window.matchMedia('(max-width: 480px)').matches;

    const screenWidth = $(window).width();
    const container = item.closest('.horiz-accord');
    const buttonsBlocks = container.find('.horiz-accord__button');
    const oneButtonWidth = buttonsBlocks.outerWidth();
    const buttonsWidth = oneButtonWidth * buttonsBlocks.length;

    const textContainer = item.find('.horiz-accord__content');
    const paddingLeft = parseInt(textContainer.css('padding-left'));
    const paddingRight = parseInt(textContainer.css('padding-right'));

    if (isMobile) {
      reqItemWidth = screenWidth - oneButtonWidth;
    } else if (isTablet) {
      reqItemWidth = screenWidth - buttonsWidth;
    } else {
      reqItemWidth = 524;
    }

    return {
      container: reqItemWidth,
      textContainer: reqItemWidth - paddingLeft - paddingRight,
      buttonWidth: oneButtonWidth
    }
  };

  const openItem = item => {
    const isMobile = window.matchMedia('(max-width: 480px)').matches;

    const hiddenWrapper = item.find('.horiz-accord__wrapper');
    const targetWidth = measureWidth(item);
    const textBlock = item.find('.horiz-accord__content');

    item.addClass('active');
    hiddenWrapper.width(targetWidth.container);
    textBlock.width(targetWidth.textContainer);

    if (isMobile) {
      const translateIndex = item.siblings().length - item.index();
      const itemTranslate = translateIndex * targetWidth.buttonWidth;

      item.css({
        transform: `translateX(${itemTranslate}px)`,
        'z-index': 1
      });
    }
  };

  const closeEveryItem = container => {
    const isMobile = window.matchMedia('(max-width: 480px)').matches;

    const items = container.find('.horiz-accord__item');
    const wrapper = container.find('.horiz-accord__wrapper');

    items.removeClass('active');
    wrapper.width(0);

    if (isMobile) {
      items.css({
        transform: `translateX(0)`,
        'z-index': 0
      });
    }
  };

  $('.horiz-accord__button').on('click', (e) => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const item = $this.closest('.horiz-accord__item');
    const itemOpened = item.hasClass('active');
    const container = $this.closest('.horiz-accord');

    if (itemOpened) {
      closeEveryItem(container);
    } else {
      closeEveryItem(container);
      openItem(item);
    };
  });
})()