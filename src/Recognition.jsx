
class Recognition {

    constructor() {
        this.newSpeech();
    }

    newSpeech() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
        //var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

        var lang = document.documentElement.lang;
        if (!lang) lang = "en-US";

        //let colors = commands[lang].map(({ command }) => command);

        //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        //speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = lang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 100;

        recognition.onresult = function(event) {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at the last position.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            var color = event.results[0][0].transcript;
            /*for (let i = 0; i < colors.length; i++) {
              if (color == colors[i]) {
                window.location.href = commands[document.documentElement.lang][i].directions;
              }
            }*/
            console.log('Confidence: ' + event.results[0][0].confidence + ' for word: ' + color);
          }
          
          recognition.onspeechend = function() {
            recognition.stop();
          }
          
          recognition.onnomatch = function(event) {
          }
          
          recognition.onerror = function(event) {
          }
    }
    
}

export default Recognition;