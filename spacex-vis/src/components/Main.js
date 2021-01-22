import React, {Component} from 'react';
import SatelliteSetting from "./SatelliteSetting";
import SatelliteList from "./SatelliteList";

class Main extends Component {
    render() {
        return (
            <div className='main'>
                <div className='left-side'>
                    <SatelliteSetting />
                    <SatelliteList />
                </div>
                <div className='right-side'>right side</div>
            </div>
        );
    }
}

export default Main;