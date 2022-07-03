// slick slider
$(document).ready(function () {
  $('.slider__list').slick({
    prevArrow: '.slider__control:first-child',
    nextArrow: '.slider__control--right',
    slide: '.slide'
  });
});

// mobile menu    
const burger = document.querySelector('.burger');
const close = document.querySelector('.menu__close');
const menu = document.querySelector('.menu');

burger.addEventListener('click', function () {
  menu.style.display = 'block';
});

close.addEventListener('click', function () {
  menu.removeAttribute('style');
});

// crew accordeon
$(document).ready(function () {
  $('.person__header').on('click', (e) => {
    e.preventDefault();
    const $this = $(e.currentTarget);

    $('.person__wrapper').height(0);
    $('.person__triangle').css('transform', 'rotate(0)');

    $this.next().height() == 0 ?
    ($this.next().height($this.next().find('.person__description').height()),
    $this.find('.person__triangle').css('transform', 'rotate(180deg)')) :
    ($this.next().height(0),
    $this.find('.person__triangle').css('transform', 'rotate(0)'));
  });
}); 

// review pager    
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

// form AJAX
const form = document.querySelector('.form');
const submit = document.querySelector('#submit');

submit.addEventListener('click', e => {
  e.preventDefault();

  if (validateForm(form)) {
    const data = {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      comment: form.elements.comment.value,
      to: "mmmail@beats.us"
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('load', () => {
      const modal = document.createElement('div');
      const modalWindow = document.createElement('div');
      const resp = document.createElement('p');
      const modalButton = document.createElement('button');

      modal.classList.add('modal');
      modalWindow.classList.add('modal__window');
      resp.classList.add('modal__text');
      modalButton.classList.add('modal__button', 'button');
      modalButton.innerText = 'Закрыть';

      modal.innerHTML = '';

      if (xhr.response.status == 0) {
        resp.classList.add('modal__text--error');
      }
      resp.innerText = xhr.response.message;
      
      modalWindow.append(resp, modalButton);
      modal.append(modalWindow);
      form.append(modal);

      modalButton.addEventListener('click', (e) => {
        e.preventDefault();

        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target == modal) {
          modalButton.click();
        }
      })
    });
  }
});

function validateForm(form) {
  let valid = true;

  form.querySelectorAll('.form__input').forEach(element => {
    element.classList.remove('form__input--error');
  });

  if (!form.elements.name.checkValidity()) {
    form.elements.name.classList.add('form__input--error');
    valid = false;
  }

  if (!form.elements.phone.checkValidity()) {
    form.elements.phone.classList.add('form__input--error');
    valid = false;
  }

  if (!form.elements.comment.checkValidity()) {
    form.elements.comment.classList.add('form__input--error')
    valid = false;
  }

  return valid;
}