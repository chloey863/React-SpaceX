import React, {Component} from 'react';
import SatelliteSetting from "./SatelliteSetting";
import SatelliteList from "./SatelliteList";
import axios from "axios";

import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from "../constants";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            setInfo: null,
            setting: null,
            isLoadingList: false
        }
    }

    componentDidMount() {
        // fetch data
    }



    showNearbySatellite = setting => {
        console.log("setting ->", setting);
        this.setState({
            setting: setting
        });

        // fetch data
        this.fetchSatellite(setting);

    }

    fetchSatellite = (setting) => {
        // step 1: get setting data
        const {latitude, longitude, elevation, altitude} = setting;

        // step 2: get url
        // Note: "/api" is mapped to "https://api.n2yo.com" in setupProxy.js
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        // step 3: trigger isLoading


        // step 4: make ajax call
        axios.get(url)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log("err in fetch satallite ->", error);
            })
    }

    render() {
        return (
            <div className='main'>
                <div className='left-side'>
                    <SatelliteSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList />
                </div>
                <div className='right-side'>right side</div>
            </div>
        );
    }
}

export default Main;