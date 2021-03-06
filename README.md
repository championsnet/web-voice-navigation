# web-voice-navigation
Voice navigation plugin for web implementation using Web Speech API

0. Introduction

v1.2.1 - 19/04/22
This plugin implements Web Speech API in a React widget to navigate through a website using the user's voice. 
Once inserted in the website a button appears typically in the bottom left of the screen. 
Pressing the button, a panel opens and the system waits for input. 
After collecting and analyzing the input, the system navigates according to commands automatically detected from elements such as links and buttons.

Widget is currently supported on Chrome and Edge.

Created by Evangelos "ChaNe" Stamkopoulos within The Laboratory of Medical Physics and 
Digital Innovation, Medical School of Aristotle University of Thessaloniki.

------------------------------------------
1. Preparation

Upload /build/static folder to your server and add these two lines of code to your ```<head>```: 
```HTML
<script defer="defer" src="path-to/static/js/main.{xyzxyzxy}.js"></script>
<link href="path-to/static/css/main.{abcabcab}.css" rel="stylesheet">
```

------------------------------------------
2. Commands

Commands are detected by gathering all textContent of ```<a>``` elements. Voice input is compared to all known commands in order to more accurately predict what the user is trying to say.

------------------------------------------
3. Feedback

Please do not hesitate to send your feedback to vaggelisstam@gmail.com or at the github project:
https://github.com/championsnet/web-voice-navigation/tree/react

------------------------------------------
4. Updates

v1.2.1 - 19/04/22:
- Added Translations file where translated strings can be stored
- Added translations for Greek

v1.2.0 - 17/04/22:
- Recognition accuracy improved by searching for alternatives and comparing with known commands
- Fixed a bug where lowercase and uppercase characters were considered different

v1.1.1 - 16/03/22: 
- Better link detection based on title property of ```<a>``` elements
- Now shows relevant message if browser is unsupported
