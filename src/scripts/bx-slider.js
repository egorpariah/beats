(function () {
  const slider = $('.slider__list').bxSlider({
    slideSelector: 'li.slide',
    controls: false,
    pager: false
  });

  $('.slider__control:first-child').on('click', e => {
    e.preventDefault();
  
    slider.goToPrevSlide();
  });
  
  $('.slider__control--right').on('click', e => {
    e.preventDefault();
  
    slider.goToNextSlide();
  });
})()
  

