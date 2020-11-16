// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}, function(tabs) {
  // and use that tab to fill in out title and url
  var tab = tabs[0];
  // console.log(tab.url);
  // alert(tab.url);
});

// extract privacy URL from the document
var urls = [];

// the privacy URL of the website
var privacyURL;

for(var i = document.links.length; i --> 0;)
	var name = document.links[i].href;
	if (name.indexOf("privacy-policy") > -1) {
		privacyURL = name;
	} else if (name.indexOf("privacy") > -1) {
		privacyURL = name;
	}
	// saving all the URLs for future work
  urls.push(name);
  
// extract text from privacy URL
const axios = require('axios');
const cheerio = require('cheerio');

// variable that stores text to be used for analytics
var data;

axios.get(url)
  .then(response => {
    const html = response.data;
	const $ = cheerio.load(html);
	// console.log(html);
	$('div, p, h1').each(function(i, elem) {
		data = $(this).text().trim();
		console.log($(this).find('p').text().trim());
	});
  })
  .catch(error => {
    console.log(error);
  })