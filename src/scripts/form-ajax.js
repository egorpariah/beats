(function () {
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
        document.body.append(modal);
  
        isScroll = true;
  
        modalButton.addEventListener('click', (e) => {
          e.preventDefault();
  
          $('.fixed-menu').removeAttr('style');
          modal.remove();
  
          isScroll = false;
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
  };
})()