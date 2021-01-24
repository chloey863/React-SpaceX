import React, {Component} from 'react';
import axios from "axios"; // the order of this line of importing axios IS VERY IMPORTANT
import { feature } from 'topojson-client';
import { geoKavrayskiy7} from "d3-geo-projection"; // example: https://observablehq.com/@d3/kavrayskiy-vii
// geoGraticule() is used to draw longitude and latitude on map; geoPath() is used to generate line
import { geoGraticule, geoPath} from "d3-geo";
import { select as d3Select } from 'd3-selection';
import { WORLD_MAP_URL } from "../../src/constants";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor() {
        super();
        this.refMap = React.createRef();
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
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height);

        let context = canvas.node().getContext("2d");

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
        })
    }

    render() {
        return (
            <div className="map-box">
                <canvas className="map"
                        ref={this.refMap}>
                </canvas>
            </div>
        );
    }
}

export default WorldMap;