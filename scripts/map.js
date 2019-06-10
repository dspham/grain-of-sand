// Initialize the platform object:
var platform = new H.service.Platform({
  'app_id': '7DZj4FZSRWbx6FTL8JER',
  'app_code': '9SXulP-IrrM3ZJnMBwBHLQ',
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map, {
    center: { lat: 50, lng: 5 },
    zoom: 3,
    pixelRatio: pixelRatio
  });

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
var group = new H.map.Group()
map.addObject(group);

  // Add 3Word Bubbles
  group.addEventListener('pointerdown', function (evt) {
    console.log("Is it working?")
    console.log(evt);
    bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
      content: '<p class="bubble">' + evt.target.getData() + '</p>'
    })
    ui.addBubble(bubble);
  }, false)



// plot markers based on search history
function plot (data) {
  let coords = { lat: data.Latitude, lng: data.Longitude };
  let marker = new H.map.Marker(coords);
  marker.setData(data.Words)
  if (data.display === "none") {
    marker.setVisibility(false);
  }
  group.addObject(marker);
  if (data.WQ) {
    var text = data.Address;
    var button = '///';
  } else {
    var text = data.Words;
    var button = '@';
  }

  splitwords = data.Words.slice(3).split(".")
  console.log(splitwords[0])
  console.log(splitwords[1])

  $('section.history').prepend(
    $('<article/>')
      .data(data)
      .data({"marker": marker})
      .attr("id", data.query.split(' ').join('_'))
      .css("display", data.display)
      .addClass('current')
      .append([
        '<button class="closer"></button>',
        '<p>' + text + '</p>',
        $('<button/>')
          .addClass('switch')
          .text(button)
          .click(function () {
            $(this).parent().find('p').text(function () {
              if ($(this).parent().data().WQ) {
                $(this).siblings('button.switch').text('@');
                $(this).parent().data().WQ = false;
                return $(this).parent().data().Words;
              } else {
                $(this).siblings('button.switch').text('///');
                $(this).parent().data().WQ = true;
                return $(this).parent().data().Address;
              }
            });
          })
      ])
  );
  $('article').click(function () {
    console.log($(this))
    $(this).addClass('current')
    let coords = { lat: $(this).data().Latitude, lng: $(this).data().Longitude - 0.075}
    map.setCenter(coords);
    map.setZoom(12);
    $('article').not($(this)).removeClass('current')
  })
  $('article').slice(1).removeClass('current')
  $('.closer').click(function () {
    console.log("here")
    $(this).parent().css("display", "none")
    $(this).parent().data().display = "none";
    let marker = $(this).parent().data().marker
    marker.setVisibility(false)
    for (let x of myhistory) {
      if (x.query === $(this).parent().data().query) {
        x.display = "none";
        break;
      }
    }
    localStorage.setItem(key, JSON.stringify(myhistory));
  });
  return coords;
}