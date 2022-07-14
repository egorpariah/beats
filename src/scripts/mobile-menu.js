(function () {
  const burger = document.querySelector('.burger');
  const close = document.querySelector('.menu__close');
  const menu = document.querySelector('.menu');
  
  burger.addEventListener('click', function () {
    isScroll = true;

    menu.style.display = 'block';
  });
  
  close.addEventListener('click', function () {
    isScroll = false;

    menu.removeAttribute('style');
  });
})();