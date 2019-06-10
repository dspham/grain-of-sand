
//initialize session search history array, default cookie and user key
myhistory = [];
console.log(myhistory)
signedIn = false

function signOut () {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    alert('You have been successfully signed out');
    $('.g-signin2').css('display', 'inline-block');
    $('#pic').css('display', 'none')
    $('#sign-out').css('display', 'none')
    delete key
    signedIn = false
    myhistory = [];
    $('article').remove()
    console.log(group)
    group.removeAll();
  });
}

function onSignIn (googleUser) {
  var profile = googleUser.getBasicProfile();
  const url = 'http://grainofsand.online/api/verify';
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    // cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id_token)
  })
    .then(function (response) {
      if (response.status != 201) {
        alert('error: invalid login');
      } else {
        signedIn = true
        $('.g-signin2').css('display', 'none');
        $('#pic').css('display', 'inline-block')
        $('#sign-out').css('display', 'inline-block')
        $('#pic').attr('src', profile.getImageUrl());
        key = profile.getId().toString() 
        old = localStorage.getItem(key)
        console.log(old)
        if (old && JSON.parse(old).length) {
          old = JSON.parse(old);
          console.log(myhistory)
          old = old.concat(myhistory);
          localStorage.setItem(key, JSON.stringify(old))
          console.log(old)
          myhistory = old
          console.log(myhistory)
          $('article').remove()
          for (let x of myhistory) {
            last = plot(x)
            if (x.display !== 'block') {
              last = { lat: 50, lng: 5 }
              zoom = 3;
            }
            else {
              last.lng -= 0.075
              zoom = 12;
            }
          }
          map.setCenter(last);
          map.setZoom(zoom);
        } else {
          localStorage.setItem(key, JSON.stringify(myhistory))
        }
        console.log(myhistory)
      }
    });
}























