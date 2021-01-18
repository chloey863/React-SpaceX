// shortcut: rcc + tab key
import React, {Component} from 'react';
import spacex_logo from "../assets/images/spacex_logo.svg";

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={spacex_logo} className="App-logo" alt="logo" />
                <p>
                    StarLink Tracker - SpaceX Visualization
                </p>
            </header>
        );
    }
}

export default Header;