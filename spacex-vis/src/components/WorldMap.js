import React, {Component} from 'react';
import axios from "axios"; // the order of this line of importing axios IS VERY IMPORTANT
import { feature } from 'topojson-client';
import { geoKavrayskiy7} from "d3-geo-projection"; // example: https://observablehq.com/@d3/kavrayskiy-vii
// geoGraticule() is used to draw longitude and latitude on map; geoPath() is used to generate line
import { geoGraticule, geoPath} from "d3-geo";
import { select as d3Select } from 'd3-selection';
import { WORLD_MAP_URL, SATELLITE_POSITION_URL, SAT_API_KEY } from "../../src/constants";
import { timeFormat as d3TimeFormat } from "d3-time-format";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
            isDrawing: false
        };

        this.refMap = React.createRef();
        this.refTrack = React.createRef();
        this.map = null;
    }

    componentDidMount() {
        axios.get(WORLD_MAP_URL)
            .then(res => {
            // console.log(res);
            const { data } = res;
            const land = feature(data, data.objects.countries).features;
            // console.log(land);
            this.generateMap(land);
        }).catch(err => {
            console.log("Error in fetch world map data", err.message);
        })
    }

    generateMap = land => {
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(0.1);

        // console.log(projection);

        // for map:
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height);
        let context = canvas.node().getContext("2d");

        // for track:
        const canvas2 = d3Select(this.refTrack.current)
            .attr("width", width)
            .attr("height", height);
        let context2 = canvas2.node().getContext("2d");

        const graticule = geoGraticule();
        let path = geoPath().projection(projection).context(context);

        land.forEach( ele => {
            // draw countries:
            context.fillStyle = '#B3DDEF';
            context.strokeStyle = '#000';
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();

            // draw latitude and longitude lines (graticule):
            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            // draw boundary lines outside latitude and longitude (top and buttom graticule):
            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        });

        this.map = {
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.satData !== this.props.satData) {
            const { Latitude, Longitude, Elevation, Duration } = this.props.observerData;
            const endTime = Duration * 60;

            // generate all satellites' url, store them as array
            const urls = this.props.satData.map( sat => {
                // console.log(sat);
                const { satid } = sat;
                const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${Latitude}/${Longitude}/${Elevation}/${endTime}/&apiKey=${SAT_API_KEY}`;

                // ajax call, to fetch data from server, return a promise for each url's corresponding data
                return axios.get(url);
            });
            // console.log(urls);


            // parsing the promise:
            // Alternatively, can also use "async await"
            axios
                .all(urls)
                .then(axios.spread((...args) => {
                        return args.map(item => item.data);
                    })
                )
                .then(res => {
                    this.setState({
                        isLoading: false,
                        isDrawing: true
                    });

                    if (!prevState.isDrawing) {
                        // track satellite
                        this.track(res);
                    } else {
                        const oHint = document.getElementsByClassName("hint")[0];
                        oHint.innerHTML =
                            "Please wait for these satellite animation to finish before selection new ones!";
                    }
                }).catch(e => {
                    console.log("err in fetch satellite position -> ", e.message);
            });
        }
    }



    render() {
        return (
            <div className="map-box">
                <canvas className="map"
                        ref={this.refMap}>
                </canvas>
                <canvas className="track"
                        ref={this.refTrack}>
                </canvas>
            </div>
        );
    }
}

export default WorldMap;