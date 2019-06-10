
$(document).ready(function () {
  console.log(myhistory)
  $('#outdrop').click(function () {
    $('#sign-out').click();
    $('#drop-content').hide()
  })
  $('input').on('keyup', function (e) {
    if (e.keyCode === 13) {
      $('#search').click();
    }
  });
  $('button.btn1').click(function() {
    $('article:visible button.switch').click()
    $('article.current').removeClass('current')
    map.setCenter({lat: 50, lng: 5})
    map.setZoom(3)
  })
  $('button.btn2').click(function () {
    $('article:visible button.closer').click()
    map.setCenter({lat: 50, lng: 5})
    map.setZoom(3)
  })
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
          .css("display", "block")
          .prependTo('section.history');
          let marker = $(`#${string.split(' ').join('_')}`).data().marker
          marker.setVisibility(true)
          $('article').not(`#${string.split(' ').join('_')}`).removeClass('current')
          let coords = { lat: $(`#${string.split(' ').join('_')}`).data().Latitude, lng: $(`#${string.split(' ').join('_')}`).data().Longitude - 0.075 }
          map.setCenter(coords);
          map.setZoom(12);
      } else {
        $.getJSON('http://grainofsand.online/api/' + string, function (data) {
          console.log(data);
          if ($.type(data) !== "string") {
            Object.assign(data, {"query": string})
            Object.assign(data, {"display": "block"})
            myhistory.push(data);
            console.log(myhistory)
            if (signedIn) {
              localStorage.setItem(key, JSON.stringify(myhistory));
            }
            let coords = plot(data);
            coords.lng -= 0.075
            console.log(coords)
            map.setCenter(coords);
            map.setZoom(12);
          } else {
            alert(data);
            myhistory.push({"query": string, Words: null});
          }
        })
      }
    }
  });
});





// Show hide menu
function show_hide() {
  let click = document.getElementById("drop-content");
  if (click.style.display === "none") {
    click.style.display = "block";
  } else {
    click.style.display = "none"
  }
}
