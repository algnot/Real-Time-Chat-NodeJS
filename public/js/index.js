const bodyParser = require("body-parser");

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user=getCookie("username");
  if (user != "") {

} else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
  }
}

function changUsername(){
    user = prompt("Please enter your name:","");
    if (user != "" && user != null) {
      setCookie("username", user, 30);
    }
    document.getElementById('username').innerHTML = getCookie('username');
}

function sendMessage(room){
    let message = document.getElementById('message').value;
    let username = getCookie('username');
    let date = new Date();
    let time = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    time += +" - "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

    if (message != "" && message != null) {
        fetch('/send', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: room,
                username : username,
                message: message
            })
        })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(response => {
            window.location.reload();
        })
    } 
}

function scroll(){
    jQuery( function(){
        var pre = jQuery("#chat-box");
        pre.scrollTop( pre.prop("scrollHeight") );
    });
}