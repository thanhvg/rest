//Global vars
USER = null;
JSESSIONID = null;
//ROOTURL = 'http://192.168.120.199:9000/api';
ROOTURL = 'http://192.168.122.238:9000/api';


function nag() {
  alert("got clicked");
}

// ajax template
// function login
function login(username, password) {
  // $.ajax (url:"http://192.168.120.199:9000/api/session",
  //         success: function(result) {
  //
  //         }});
}

function doLogin() {
  // can have parameter to move to page after loggin
  $('#mainContent').load('static/login.html');
}


function doLogout() {
  $.ajax({
    type: 'DELETE',
    url: ROOTURL + '/session',

    success: function(result, textStatus, jqXHR){
      JSESSIONID = null;
      USER = null;
      ;
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
  if (!JSESSIONID) {
    doLogin();
    return;
  }
  // ok now list the table
  $.ajax({
    type: 'GET',
    url: ROOTURL + '/network-stations',
    dataType: "json",
    success: function(result, textStatus, jqXHR){
      var arr = result.networkStations;
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
  if (!JSESSIONID) {
    doLogin();
    return;
  }

  $('#mainContent').load('static/broadcast.html');

}

function showNowBroadcast(_message,_duration) {
  MESSAGE = _message;
  DURATION = _duration;
  $('#mainContent').load('static/broadcast-timer.html');
}
