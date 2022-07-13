(function () {
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
})()