function importSpreadsheet(callback, redirect) {
  $.getScript('//apis.google.com/js/api.js', function() {
    var developerKey = 'AIzaSyAmORTYPQNspqATkLYzMAEVi-wKQsQHhhA';
    var clientId = '542489408757.apps.googleusercontent.com';
    var scope = ['https://www.googleapis.com/auth/drive.readonly'];
    var pickerApiLoaded = false;
    var oauthToken;

    gapi.load('auth', {'callback': onAuthApiLoad});
    gapi.load('picker', {'callback': onPickerApiLoad});

    function onAuthApiLoad() {
      window.gapi.auth.authorize(
          {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
          },
          handleAuthResult);
    }

    function onPickerApiLoad() {
      pickerApiLoaded = true;
      createPicker();
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
      }
    }

    function createPicker() {
      if (pickerApiLoaded && oauthToken) {
        var picker = new google.picker.PickerBuilder().
            addView(google.picker.ViewId.SPREADSHEETS).
            setOAuthToken(oauthToken).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
      }
    }

    function pickerCallback(data) {
      var id = false;
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        id = doc[google.picker.Document.ID];
        access_token = gapi.auth.getToken().access_token;
        url = 'https://docs.google.com/spreadsheets/export?id=' + id +
              '&exportFormat=csv&access_token=' + access_token;
        console.log(url);
        $.ajax({
          url: callback,
          data: {'csv': url},
          method: 'POST',
          beforeSend: function() {
            $('#google-drive-progress-bar').removeClass('hidden');
          },
          success: function(data) {
            window.location.href = redirect;
          },
          error: function() {
            alert('Invalid data');
          },
          complete: function() {
            $('#google-drive-progress-bar').addClass('hidden');
          }
        });
      }
    }
  });
}
