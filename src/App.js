import React from 'react';
import './App.css';
import './Button.css';
import './Panel.css';
import commands from './commands.json';
import translations from './translations.json';
import icon from './voice-recognition-icon.png';

class App extends React.Component {

  constructor(){
    super()
    this.state={
      textsLang : "en",
      active : false,
      status : translations["en"]["awaitingCommand"],
      words : "-",
      recognition : null,
      supported : true
    }
  }

  componentDidMount() {
    this.hookShortcutListener();
    const lang = this.setupTranslations();
    this.setState({
      textsLang : lang
    })
    this.setupCommands();
    try {
      this.setupRecognition();
    }
    catch(err) {
      this.setState({
        supported : false,
        status : translations[lang]["browserUnsupported"]
      })
    }
  }
  
  
  render() {

    const button = <Button key="button" onButtonClick={this.handleButtonClick} navIcon={icon} voiceNavigationWidget={this.translate("voiceNavigationWidget")} voiceRecognition={this.translate("voiceRecognition")}/>;
    const panel = this.state.active? <Panel key="panel" statusText={this.state.status} words={this.state.words} onCloseWidgetClick={this.handleButtonClick} voiceNavigationMenu={this.translate("voiceNavigationMenu")} reportProblem={this.translate("reportProblem")} visitGitHub={this.translate("visitGitHub")}/> : null;

    return[
      button,
      panel
    ]
  }
  

  handleButtonClick = () => {
    let message;
    if (!this.state.active && this.state.supported) {
      this.state.recognition.stop();
      this.state.recognition.start();
      message = this.translate("awaitingCommand");
    }
    else if (this.state.active && this.state.supported) {
      this.state.recognition.stop();
      message = "";
    }
    else {
      message = this.translate("browserUnsupported");
    }
    this.setState({
      active: !this.state.active,
      status : message,
      words : "-"
    });
    
  }

  hookShortcutListener() {
    document.addEventListener('keydown', (e) => {  
      if ((e.ctrlKey) && e.code === 'KeyI') {
        this.handleButtonClick();
        e.Handled = true;
      }  
    })
  }

  setupTranslations() {
    var textsLang = document.documentElement.lang;
    textsLang = this.correctLanguage(textsLang);
    if (!translations.hasOwnProperty(textsLang)) textsLang = "en";
    return textsLang;
  }

  translate(textKey) {
    let translation = translations[this.state.textsLang][textKey];
    if (!translations[this.state.textsLang].hasOwnProperty(textKey)) translation = translations["en"][textKey];
    return translation;
  }

  correctLanguage(language) {
    if (!language) language = "en";
    if (language === "es-ES") language = "es";
    return language;
  }

  setupCommands() {
    if (typeof commands == 'undefined') commands = {};

    var lang = document.documentElement.lang;
    lang = this.correctLanguage(lang);
    console.log(lang);
    if (!commands.hasOwnProperty(lang)) {
      commands[lang] = [];
    }
    let allA = document.querySelectorAll('a');

    allA.forEach(a => {
      if(a.hasAttribute('title')) {
        const command = a.title;
        const action = 'link';
        const directions = a.href;
        commands[lang].push({command, action, directions});
      }
      else if (!a.textContent.includes("   ") && a.textContent !== "") {
        const command = a.textContent;
        const action = 'link';
        const directions = a.href;

        commands[lang].push({command, action, directions});
      }
    });
  }

  setupRecognition() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    //var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

    var lang = document.documentElement.lang;
    lang = this.correctLanguage(lang);
    
    let colors = commands[lang].map(({ command }) => command.toLowerCase());
    console.log(colors);
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

    var recog = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recog.grammars = speechRecognitionList;
    recog.continuous = false;
    recog.lang = lang;
    recog.interimResults = false;
    recog.maxAlternatives = 100;
    var recognizedText = '';

    recog.onresult = (event) => {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at the last position.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object
      recognizedText = event.results[0][0].transcript;
      console.log('Confidence: ' + event.results[0][0].confidence + ' for word: ' + recognizedText);

      let message = this.translate("noCommandRecognized");
      
      var stringSimilarity = require("string-similarity");
      var match = stringSimilarity.findBestMatch(recognizedText.toLowerCase(), colors);
      let tries = 1;
      console.log('1st Try Rating: ' + match.bestMatch.rating + ' for command: ' + match.bestMatch.target);

      if (match.bestMatch.rating > 0.5) {
        window.location.href = commands[document.documentElement.lang][match.bestMatchIndex].directions;
        message = this.translate("commandRecognized");
        recognizedText = match.bestMatch.target;
      }
      else {
        let bestMatch = match;
        tries = 0;
        for (let i = 1; i < event.results[0].length; i++) {
          match = stringSimilarity.findBestMatch(event.results[0][i].transcript.toLowerCase(), colors);
          if (match.bestMatch.rating > bestMatch.bestMatch.rating) bestMatch = match;
          console.log('2nd Try Rating: ' + match.bestMatch.rating + ' for command: ' + match.bestMatch.target);
          tries += 1;
        }
        if (bestMatch.bestMatch.rating > 0.25) {
          window.location.href = commands[document.documentElement.lang][bestMatch.bestMatchIndex].directions;
          message = this.translate("commandRecognized");
          recognizedText = bestMatch.bestMatch.target;
        }
      }
      console.log("Total number of commands tried: " + tries);
      this.setState({
        status: message,
        words: recognizedText
      });
    }

    recog.onspeechend = function() {
      recog.stop();
    }
    
    recog.onnomatch = (event) => {
      this.setState({
        status: this.translate("noWordsRecognized")
      });
    }
    
    recog.onerror = function(event) {
      console.log("error on WebSpeech");
    }

    recog.onend = (event) => {
      if (recognizedText !== '') return;
      this.setState({
        status: this.translate("listeningStopped")
      });
    }

    this.setState({
      recognition : recog
    });
    
  }

}

function Button(props) {
  return(
    <div className='voice-nav-container' title={props.voiceRecognition}>
        <button id='voice-nav' onClick={props.onButtonClick}>
            <span className='voice-nav-span'>
                <img  className='voice-nav-img' width='57' height='57' alt={props.voiceNavigationWidget} src={props.navIcon}/>
            </span>
        </button>
    </div>
  );
}

function Panel(props) {

  return(
    <main className="voice-nav-panel-widget-container p5">
      <div className="voice-nav-panel voice-nav-panel-menu-app p5">
        <div className="widget navigation-menu">
          <div className="widget-header-wrapper flex-box light-head">
            <div className="widget-header__l">
              <div className="widget-header flex-box">
                <div className="title">
                  {props.voiceNavigationMenu} <span>(CTRL+I)</span>
                </div>
              </div>
            </div>
            <button type="button" className="widget-close-btn" onClick={props.onCloseWidgetClick} aria-label="Press enter to Close the voice navigation menu"><span className="focus-outline"></span></button>
         </div>
         <div className="widget-body scroll-wrapper">
            <div className="widget-content ">
              <div>
                <div className="lang-select-wrap "></div>
                  <div className="widget-form no-top-padding no-bottom-padding actions-wrapper-main">
                    <div className="actions-wrapper actions-wrapper__gridF">
                      <div className="status">{props.statusText}</div>
                      <div className="spoken-words-container">
                        <div className="spoken-words">{props.words}</div>
                      </div>
                    </div>
                  </div>
                </div>
              <div ui-view=""></div>
            </div>
          </div>
          <div className="widget-footer">
            <div className="row">
              <div className="col">
                <div className="widget-footer-nav">
                  <div className="widget-footer-nav__item"><a href="https://github.com/championsnet/web-voice-navigation/issues" tabIndex="0">{props.reportProblem}</a></div>
                  <div className="widget-footer-nav__item"><a href="https://github.com/championsnet/web-voice-navigation" tabIndex="0">{props.visitGitHub}</a></div>
                </div>
              </div>
              <div className="col">
                <div className="logo-wrap">
                  <div className="logo"><a className="logo-img" href="https://medphys.med.auth.gr/"><img src="https://medphys.med.auth.gr/sites/default/files/%CE%9B%CE%BF%CE%B3%CF%8C%CF%84%CF%85%CF%80%CE%BF%20%CE%95%CF%81%CE%B3%CE%B1%CF%83%CF%84%CE%B7%CF%81%CE%AF%CE%BF%CF%85%20%CE%99%CE%A6%CE%A8%CE%9A-01%20MEDIUM.png" alt="MedPhys AUTH Logo - opens in a new tab"/></a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  )
}

export default App;
