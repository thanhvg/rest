//Global vars
USER = null;
JSESSIONID = null; //should get cookie instead
// ROOTURL = 'http://192.168.120.199:9000/api';
// ROOTURL = 'http://192.168.120.158/api/E00-69AA-4E0B-BD3F';
ROOTURL = 'http://testnet15.userful.ca:9000/api';
//ROOTURL = 'http://192.168.122.238:9000/api';

function nag() {
  alert("got clicked");
}

function doLogin() {
  // can have parameter to move to page after loggin
  $('#mainContent').load('static/login.html');
}


function doLogout() {
  $.ajax({
    type: 'DELETE',
    url: ROOTURL + '/session',

    xhrFields: {
          withCredentials: true
    },
    success: function(result, textStatus, jqXHR){
      JSESSIONID = null;
      USER = null;
      document.getElementById("mainContent").innerHTML = "You have logged out";
      flipLogInOut();
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Login error: ' + textStatus);
    }
  });
}

function sendLoginReqest(username, password) {
  $.ajax({
    type: 'POST',
    url: ROOTURL + '/session',
    dataType: "json",
    xhrFields: {
          withCredentials: true
    },
    data: JSON.stringify({
      "user":username,
      "password":password
    }),
    success: function(result, textStatus, jqXHR){
      JSESSIONID = result.session.value;
      USER = username;
      var html = result.session.name + ' : ' + result.session.value ;
      document.getElementById("mainContent").innerHTML = html;
      flipLogInOut();
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Login error: ' + textStatus);
    }
  });
}

function flipLogInOut() {
  if (JSESSIONID) {
    // hide login
    $('#login').hide();
    $('#logout').show();
  } else {
    $('#login').show();
    $('#logout').hide();
  }
}

function doNetworkStation() {
  //log in check
  // if (!JSESSIONID) {
  //   doLogin();
  //   return;
  // }
  // ok now list the table
  $.ajax({
    type: 'GET',
    url: ROOTURL + '/network',
    dataType: "json",
    xhrFields: {
          withCredentials: true
    },
    success: function(result, textStatus, jqXHR){
      var arr = result.network;
      var i;
      var out = "<div class='table-responsive'> <table class='table'>";
      var table_header = "<thead>" +
      "<tr>" +
      "<th>Name</th>" +
        "<th>IP</th>" +
        "<th>MAC</th>" +
        "<th>Status</th>" +
        "<th>Model</th>" +
        "<th>Firmware</th>" +
      "</tr>" +
      "</thead>" ;
      out +=  table_header;
      for(i = 0; i < arr.length; i++) {
       out += "<tr><td>" +
       arr[i].name +
       "</td><td>" +
       arr[i].ip +
       "</td><td>" +
       arr[i].mac +
       "</td><td>" +
       arr[i].status +
       "</td><td>" +
       arr[i].model +
       "</td><td>" +
       arr[i].firmware +
       "</td></tr>";
     }
   out += "</table> </div>" ;
   document.getElementById("mainContent").innerHTML = out;


    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('network stations error: ' + textStatus);
    }
  });

}

function startBroadcast(_message, _alertLevel, _duration) {
  $.ajax({
    type: 'PUT',
    url: ROOTURL + '/system/broadcast/start',
    data: JSON.stringify({
      message: _message,
      alertLevel: _alertLevel,
      lengthMillisec: _duration
    }),
    xhrFields: {
          withCredentials: true
    },
    success: function(result, textStatus, jqXHR){
      showNowBroadcast(_message,_duration);
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Broadcast error: ' + textStatus);
    }
  });
}

function doBroadcast() {
  //log in check
  // if (!JSESSIONID) {
  //   doLogin();
  //   return;
  // }

  $('#mainContent').load('static/broadcast.html');

}

function showNowBroadcast(_message,_duration) {
  //MESSAGE = _message; no need of global vars haha
  // DURATION = _duration;
  $('#mainContent').load('static/broadcast-timer.html', function(){
    showTimer(_message, _duration);
  });
}

function doPreset() {
  //$('#mainContent').load('static/preset.html');
  getPresetList();

}

function getPresetList() {

  $.ajax({
    type: 'GET',
    url: ROOTURL + '/presets',
    dataType: "json",
    xhrFields: {
          withCredentials: true
    },
    success: function(result, textStatus, jqXHR){
      var presets = result.presets;
      // should check if null

      // clear content
      $('#mainContent').html("");

      // get document
      var elem;
      $.get('static/preset.html', function(response){
        console.log(presets.length);
        for (i = 0; i < presets.length; i++) {
          elem = $(response);
          //console.log(elem.find(".panel-heading").html('thanh'));
          elem.find(".panel-heading").html(presets[i].name);
          elem.find(".well").html(presets[i].id);


          $('#mainContent').append(elem);
        }
        // now change the value
      });
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Preset error: ' + textStatus);
    }
  });
}

function deletePresetButtonClick(objectButton) {
  var _presetid = $(objectButton).parents('.panel.panel-primary').find('.well').html();
  deletePreset(_presetid, function(){
    $(objectButton).parents('.panel.panel-primary').hide(400, 'swing');
  });
}

//should take a preset id, instead of objectButton to be more abstract
function deletePreset(presetid, successFunction) {
  $.ajax({
    type: 'DELETE',
    url: ROOTURL + '/presets/byid/' + presetid,
    xhrFields: {
          withCredentials: true
    },
    success: successFunction(),
    error: function(jqXHR, textStatus, errorThrown){
      alert('Broadcast error: ' + textStatus);
    }
  });
}
