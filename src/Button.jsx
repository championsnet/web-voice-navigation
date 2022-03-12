import React from 'react';
import './Button.css';

class Button extends React.Component {
    constructor() {
        super();
        this.state = {visible: false};
    }

    render() {
        return this.buttonHtml();
    }

    buttonHtml() {
        return(
            <div className='voice-nav-container' title='Voice Recognition'>
                <button id='voice-nav' onClick={() => this.togglePanel()}>
                    <span className='voice-nav-span'>
                        <img  className='voice-nav-img' width='43' height='43' alt='Voice Navigation Widget' src='./voice-recognition-icon.png'/>
                    </span>
                </button>
            </div>
        );
    }

    togglePanel() {
        this.setState({
            visible: !this.state.visible
        });
    }
  }

  export default Button;