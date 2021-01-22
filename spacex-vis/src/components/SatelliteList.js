import React, {Component} from 'react';
import { Button } from "antd";

class SatelliteList extends Component {
    render() {
        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button className="sat-list-btn"
                            type="primary"
                            size="large">Track on the map
                    </Button>
                </div>

                <hr/>
                <div>data from server</div>
            </div>
        );
    }
}

export default SatelliteList;