import React, {Component} from 'react';
import axios from "axios"; // the order of this line of importing axios IS VERY IMPORTANT
import { feature } from 'topojson-client';
import { geoKavrayskiy7} from "d3-geo-projection"; // example: https://observablehq.com/@d3/kavrayskiy-vii
// geoGraticule() is used to draw longitude and latitude on map; geoPath() is used to generate line
import { geoGraticule, geoPath} from "d3-geo";
import { select as d3Select } from 'd3-selection';
import { schemeCategory10 } from "d3-scale-chromatic";
import * as d3Scale from "d3-scale";
import { WORLD_MAP_URL, SATELLITE_POSITION_URL, SAT_API_KEY } from "../../src/constants";
import { timeFormat as d3TimeFormat } from "d3-time-format";
import {Spin} from "antd";

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
        this.color = d3Scale.scaleOrdinal(schemeCategory10);
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

            this.setState({
                isLoading: true
            });

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

                    // If not drawing, track satellite
                    if (!prevState.isDrawing) {
                        this.track(res);
                    } else { // if it's already drawing, wait until drawing is completed
                        const oHint = document.getElementsByClassName("hint")[0];
                        oHint.innerHTML =
                            "Please wait for these satellite animation to finish before selection new ones!";
                    }
                }).catch(e => {
                    console.log("err in fetch satellite position -> ", e.message);
            });
        }
    }

    // track the real location of satellite
    track = data => {
        // corner case:
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
            return;
        }

        // step 1. get # of positions.
        const len = data[0].positions.length;
        const { duration } = this.props.observerData;
        const { context2 } = this.map;

        // step 2. record the current time
        let now = new Date();
        let i = 0; // a counter to count the # of point draw so far

        // step 3. for every 1000ms (0.1 second), draw a point on map to represent the satellite real location
        let timer = setInterval(() => {
            // record the current time when drawing
            let ct = new Date();

            let timePassed = i === 0 ? 0 : ct - now;
            let time = new Date(now.getTime() + 60 * timePassed);

            // clean everything on canvas before drawing a point
            context2.clearRect(0, 0, width, height);

            // drawing point
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);

            // case 1: completed drawing all point when i >= len
            if (i >= len) {
                clearInterval(timer);
                this.setState({ isDrawing: false });
                // const oHint = document.getElementsByClassName("hint")[0];
                // oHint.innerHTML = "";
                return;
            }

            // case 2: if i < len, continue drawing next point
            data.forEach(sat => {
                const { info, positions } = sat;
                // draw a point based on the sat's info and position
                this.drawSat(info, positions[i]);
            });

            i += 60;
        }, 1000);

    }

    // draw points that represent the satellite's location
    drawSat = (sat, pos) => {
        const { satlongitude, satlatitude } = pos;

        if (!satlongitude || !satlatitude) {
            return;
        }

        const { satname } = sat;
        const nameWithNumber = satname.match(/\d+/g).join(""); // regular expression

        const { projection, context2 } = this.map;
        const xy = projection([satlongitude, satlatitude]);

        // style/coloring for context2 canvas
        context2.fillStyle = this.color(nameWithNumber);
        // draw point
        context2.beginPath();
        // point shape
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        // fill point shape with color
        context2.fill();

        // style for text for satellite's name and info
        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);
    };

    render() {
        const { isLoading } = this.state;
        return (
            <div className="map-box">
                {isLoading ? (
                    <div className="spinner">
                        <Spin tip="Loading..." size="large" />
                    </div>
                ) : null }
                <canvas className="map"
                        ref={this.refMap}>
                </canvas>
                <canvas className="track"
                        ref={this.refTrack}>
                </canvas>
                <div className="hint" />
            </div>
        );
    }
}

export default WorldMap;