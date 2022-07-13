(function () {
let myMap;

const init = () => {
  myMap = new ymaps.Map('map', {
    center: [55.74602, 37.623803],
    zoom: 11,
    controls: []
  });

  const coords = [
    [55.752004, 37.576133],
    [55.763462, 37.623741],
    [55.824311, 37.634407],
    [55.672126, 37.585853]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: './images/marker.svg',
    iconImageSize: [58, 73],
    iconImageOffset: [0, -37]
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);
})()