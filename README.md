# web-voice-navigation
Voice navigation plugin for web implementation using Web Speech API

0. Introduction

v1.0.0 - 6/11/21
This plugin implements Web Speech API to navigate through a website using the user's voice. 
Once inserted in the website a button appears typically in the top right of the screen. 
Pressing the button, the system waits for input. 
After collecting and analyzing the input, the system navigates according to known commands.

Created by Evangelos "ChaNe" Stamkopoulos within The Laboratory of Medical Physics and 
Digital Innovation, Medical School of Aristotle University of Thessaloniki.

------------------------------------------
1. Preparation

Upload folder on server.
Replace all links in webSpeech.html with the proper path if needed.
Insert either the webSpeech.html file or the code inside after the body tag of the website.
Modify commands.json file accorting to your needs.

------------------------------------------
2. Commands

Commands are placed inside the commands.json file and are separated by language of voice recognition.
The template format is:


commands = {
	
	"--language-code-1--": [
	
    	{
		
        	"command": "--word(s)-for-command--",
			
        	"action": "--action-type--",
			
        	"directions": "--where-to-go--"
			
    	}
		
	],
	
	"--language-code-2--": [
	
    	{
		
    	"command": "--word(s)-for-command--",
		
    	"action": "--action-type--",
		
    	"directions": "--where-to-go--"
		
    	}
		
  	]
	
}


--language-code--: language code for recognizing voide i.e. "en-GB" or "el"
	
--word(s)-for-command--: words the user needs to speek to activate the command
	
--action-type--: As of now, only "link" type actions are supported
	
--where-to-go--: The full link where the system needs to navigate for the selected command

------------------------------------------
3. Feedback

Please do not hesitate to send your feedback to vaggelisstam@gmail.com or at the github project:
https://github.com/championsnet/web-voice-navigation
