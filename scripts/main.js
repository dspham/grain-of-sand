
$(document).ready(function () {
  console.log(myhistory)
  $('input').on('keyup', function (e) {
    if (e.keyCode === 13) {
      $('#search').click();
    }
  });
  $('#search').click(function () {
    console.log(myhistory)
    console.log($('input').val());
    let string = $('input').val().trim();
    $('input').val('');
    past = null;
    if (string) {
      for (let x of myhistory) {
        if (x.query === string) {
          past = x;
          break;
        }
      }
      if (past && past.Words === null) {
        return;
      }
      if (past) {
        $(`#${string.split(' ').join('_')}`)
          .addClass('current')
          .prependTo('section.history')
          $('article').not(`#${string.split(' ').join('_')}`).removeClass('current')
          let coords = { lat: $(`#${string.split(' ').join('_')}`).data().Latitude, lng: $(`#${string.split(' ').join('_')}`).data().Longitude }
          map.setCenter(coords);
          map.setZoom(12);
      } else {
        $.getJSON('http://0.0.0.0:5000/api/' + string, function (data) {
          console.log(data);
          if (data !== 'bad') {
            Object.assign(data, {"query": string})
            myhistory.push(data);
            console.log(myhistory)
            if (signedIn) {
              localStorage.setItem(key, JSON.stringify(myhistory));
            }
            let coords = plot(data);
            map.setCenter(coords);
            map.setZoom(12);
          } else {
            alert("Not Found");
            myhistory.push({"query": string, Words: null});
          }
        })
      }
    }
  });
});
