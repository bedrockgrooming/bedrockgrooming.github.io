// changes to the responsive topnav for mobile
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// Creates and returns a unique user ID
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
  
  // Generates a cookie with name passed as parameter that contains
  // a unique user ID. 
  function generateCookie(cookie_name) {
    let cookie = getCookie(cookie_name);
    // if cookie does not already exist, create a new one
    if (cookie == "") {

      //create a unique ID for user
      let cookie_id = create_UUID();
      let cookie_expiration = 365;
      const d = new Date();
      d.setTime(d.getTime() + cookie_expiration * 24 * 60 * 60 * 1000);
      let expires = ";expires=" + d.toUTCString();
      
      document.cookie = cookie_name+"="+cookie_id+";"+cookie_expiration+"; path=/"+expires;
      //document.cookie = cookie_name+"="+cookie_id+";"+"; path=/";
    }
  }
  
  // Searches for a cookie with name passed as parameter.
  function getCookie(cookie_name) {
    let name = cookie_name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");

    // Check list of cookies for cookie_name
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      // if cookie is found, return its value
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    // else return nothing
    return "";
  }

  let userid = getCookie("uniqueUser");
  
  // Turn uniqueUser cookie into javascript object
  var cookieObject = {
      id: userid
  };

  // This function returns a response from the worker in the form of a JSON message
  async function callWorker(message, alreadyExists) {
    if (alreadyExists == false ) {
      // Send request to correct worker
      const workerUrl = 'https://unique-visitor-2.marquat9.workers.dev/';
      
      const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
      });

      // If worker doesn't respond, throw an error
      if (!response.ok) {
          throw new Error(`Error calling Cloudflare Worker: ${response.statusText}`);
      }
      
      // Wait for worker response and return the contents of said response
      const data = await response.json();
      return data;
    }
    else if (alreadyExists == true) {
      // Send request to correct worker
      const workerUrl = 'https://unique-visitor-2.marquat9.workers.dev/';
      
      const response = await fetch(workerUrl, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      // If worker doesn't respond, throw an error
      if (!response.ok) {
          throw new Error(`Error calling Cloudflare Worker: ${response.statusText}`);
      }
      
      // Wait for worker response and return the contents of said response
      const data = await response.json();
      return data;
    }  
  }

  // If uniqeUser cookie does not exist, create a new one and call worker.
  if(userid == "") {
    userid = generateCookie("uniqueUser");
    
    // Send a POST request to the worker
    let returnValue = callWorker(cookieObject, false).then((returnValue) => {
      const userCount = document.createElement("p");
      const node = document.createTextNode(returnValue);
      userCount.appendChild(node);
      const element = document.getElementById("divUserCount");
      element.appendChild(userCount);
      console.log(returnValue)});
    console.log(returnValue);
  }
  else {
    // else cookie already exists, just GET current count
    let returnValue = callWorker(cookieObject, true).then((returnValue) => {
      const userCount = document.createElement("p");
      const node = document.createTextNode(returnValue);
      userCount.appendChild(node);
      const element = document.getElementById("divUserCount");
      element.appendChild(userCount);
      console.log(returnValue)});
    console.log(returnValue);
  }