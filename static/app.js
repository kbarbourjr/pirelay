
var relays = null;    // array to contain all the relay objects

/**
 * Initialize the application by fetching all the relay states and creating a
 * button element with an onclick function
 */
function init() {
  var buttonNav = document.getElementById("relay_buttons");
  fetch_relays(function(relays){
    relays.forEach(function(relay, i, relays) {
      var elem = document.createElement("div");
      var btnElem = document.createElement('button');
      elem.className += 'level-item';
      elem.id = 'relay_'+i;
      btnElem.innerHTML = relay.name;
      btnElem.className = relay_btn_classname(relay);
      elem.appendChild(btnElem);
      buttonNav.appendChild(elem);
      btnElem.onclick = function() { toggle_relay(btnElem, i); }
    });
  });
}

/**
 * Asyncrously Fetch an array of all the relays and pass them to
 * a callback function
 */
function fetch_relays(on_recvd) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      relays = JSON.parse(this.response);
      on_recvd(relays);
    } else if (this.status > 300) {
      console.log("Error fetching Relays",this);
    }
  }
  xmlhttp.open("GET", '/relays/', true);
  xmlhttp.send();
}

/**
 * Sets the on/off state of a relay given the button and relay object
 */
function set_relay(elem, relay, state)
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {  // what to do with the response
    if (this.readyState == 4 && this.status == 200) {
      relay = update_relay(relay.id, JSON.parse(this.response));
      elem.className = relay_btn_classname(relay);
      console.log(this.response);
    }
  }
  elem.className += ' is-loading'; // add the loading animation
  console.log(elem, relay.id, state);

  xmlhttp.open('PUT','/relays/'+relay.id);
  xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  var str = 'active='+(state ? 'true':'false');
  console.log(str);
  xmlhttp.send(str);  //send the request
}

/**
 * Toggle the state of the relay
 */
function toggle_relay(elem, id)
{
  var relay = relays[id];
  set_relay(elem, relay, (relay.active ? false : true));
}

/**
 * Update our global list of arrays with new data
 */
function update_relay(id, data) {
  relays[id] = data;
  return data;
}

/**
 * What CSS classname should we use to display the relay correctly
 */
function relay_btn_classname(relay)
{
  var className = 'button';
  if (relay.active) className += (relay.active) ? ' is-primary' : 'is-outlined';
  return className;
}

// Start running the application
$(document).ready(function() {
  console.log('Loading app js');
  init();
});
