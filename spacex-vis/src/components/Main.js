import React, {Component} from 'react';
import SatelliteSetting from "./SatelliteSetting";

class Main extends Component {
    render() {
        return (
            <div className='main'>
                <div className='left-side'>
                    <SatelliteSetting />
                </div>
                <div className='right-side'>right side</div>
            </div>
        );
    }
}

export default Main;