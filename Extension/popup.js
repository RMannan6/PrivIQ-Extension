// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var parser = document.createElement('a');
var clickCount = 0;

chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}, function (tabs) {
  
  // Analyze tab's url
  var url = tabs[0].url;

  if (url != '') {
    parser.href = url;
    var scheme = parser.protocol; // 1. Get protocol
    let div1 = document.createElement('div');
    div1.className = "warning"; // 2. Set its class to "message"

    // 3. Set connection message
    div1.innerHTML = "<strong>Is the connection secure?</strong>\nThe site uses " + scheme.substring(0, scheme.length - 1) + "!";

    document.body.append(div1);

  }

});

document.getElementById("privacy").addEventListener("click", Analyze);

// Crawler code
function Analyze() {
  if(clickCount<1){
  let div = document.createElement('div');
  div.className = "message"; // 2. Set its class to "message"

  // 3. Fill it with the content
  div.innerHTML = "<strong>Great!</strong> You've checked the privacy of " + parser.hostname; // domain

  document.body.append(div);
  clickCount += 1
  }
  // call analyzeText function
  analyzeText();
}

/* Text Analytics begins here */
const functionURL =
  "https://eastus.api.cognitive.microsoft.com/text/analytics/v3.0/keyPhrases";
// array of privacy terms that we are looking for a match on
const privacyTerms = [
  "address",
  "cookies",
  "credit card",
  "credit card information",
  "ip address",
  "personal data",
  "personal information",
  "third-party",
  "use of personal information"
];
const objectOutput = document.getElementById("returnedObject");

// we need to find a way to get the privacy info to this testValue variable!!!
//
let testValue = "Scrapped privacy text would be set to this variable!";
// 
//

/* set value of input field as the body to be sent via the POST request */
const postData = {
  documents: [
    {
      language: "en",
      id: "1",
      text: testValue
    }
  ]
};

/* call Azure Function via HTTP POST and return a very simple object  */
function analyzeText(e) {
  fetch(functionURL, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": "659f9c405d9f4c4ca9671ea7eec23117",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(data => {
      console.log(postData.documents[0].text);
      console.log(data);
      evaluateKeyPhrases(data);
    })
    .catch(error => {
      console.error(error);
    });
}

// evaluate the returend Key Phrases
function evaluateKeyPhrases(data) {
  objectOutput.innerHTML = "";
  let keyPhrasesArray = data.documents[0].keyPhrases;

  // check to see if Key Phrases match any of our Privacy Terms
  let privacyTermMatches = 0;
  keyPhrasesArray.forEach(phrase => {
    privacyTerms.forEach(term => {
      if (term.toLowerCase() === phrase.toLowerCase()) {
        privacyTermMatches++;
      }
    });
  });
  if (privacyTermMatches > 3) {
    objectOutput.innerHTML +=
      "<h1 class='match-response true'>This site collects your data</h1>";
  } else {
    objectOutput.innerHTML +=
      "<h1 class='match-response false'>This site may collect your data</h1>";
  }

  // output phrases for web app demo, this can be removed it just 
  // outputs the returned phrases
  objectOutput.innerHTML += "<ul>";
  keyPhrasesArray.forEach(
    element => (objectOutput.innerHTML += "<li>" + element + "</li>")
  );
  objectOutput.innerHTML += "</ul>";
  objectOutput.innerHTML += "<h2>Privacy Terms</h2>";
  objectOutput.innerHTML += "<ul>";
  privacyTerms.forEach(
    element => (objectOutput.innerHTML += "<li>" + element + "</li>")
  );
  objectOutput.innerHTML += "</ul>";
}