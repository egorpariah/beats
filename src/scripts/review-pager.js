(function () {
  const review = document.querySelectorAll('.review');
  const pagerItem = document.querySelectorAll('.photo-pager__item');

  pagerItem.forEach((element, index) => {
    element.addEventListener('click', function () {
      pagerItem.forEach((element, j) => {
        element.classList.remove('photo-pager__item--active');
        review.item(j).classList.remove('reviews__item--active');
      });
      element.classList.add('photo-pager__item--active');
      review.item(index).classList.add('reviews__item--active');
    });
  });
})()