import React, {Component} from 'react';
import SatelliteSetting from "./SatelliteSetting";
import SatelliteList from "./SatelliteList";
import axios from "axios";

import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from "../constants";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            satInfo: null,
            settings: null,
            // initially, isLoadingList is false, because "Find Nearby Satellite" is not clicked yet
            isLoadingList: false
        }
    }

    // componentDidMount() {
    //     // fetch data
    // }

    showNearbySatellite = (setting) => {
        console.log("setting ->", setting);
        this.setState({
            settings: setting
        });

        // fetch data
        this.fetchSatellite(setting);
    }

    fetchSatellite = (setting) => {
        // step 1: get setting data
        // bug fixed (typo): Latitude, Longitude, Elevation, Altitude should match those in SatelliteSetting.js
        const {Latitude, Longitude, Elevation, Altitude} = setting;

        // step 2: get url
        // Note: "/api" is mapped to "https://api.n2yo.com" in setupProxy.js
        const url = `/api/${NEARBY_SATELLITE}/${Latitude}/${Longitude}/${Elevation}/${Altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        // step 3: trigger isLoading
        this.setState({
            // if data is not got yet, set isLoadingList to true
            isLoadingList: true
        });

        // step 4: make ajax call
        axios.get(url)
            .then(response => {
                console.log(response.data);
                this.setState({
                    satInfo: response.data,
                    // after getting data, set isLoadingList to false
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log("err in fetch satallite ->", error);
                this.setState({
                    // or if error, set isLoadingList to false
                    isLoadingList: false
                })
            })
    }

    render() {
        const { satInfo, isLoadingList } = this.state;
        return (
            <div className='main'>
                <div className='left-side'>
                    <SatelliteSetting onShow={this.showNearbySatellite} />
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList} /> {/*data communication*/}
                </div>
                <div className='right-side'>right side</div>
            </div>
        );
    }
}

export default Main;