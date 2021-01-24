import React, {Component} from 'react';
import { Button, List, Avatar, Checkbox, Spin } from "antd";
import satellite from "../assets/images/satellite.svg"

class SatelliteList extends Component {
    state = {
        selected: []
    }

    render() {
        // deconstruct/destruct data:
        // if satInfo is not null , get satInfo.above
        // bug fixed: const satList, NOT const {satList}
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        const { selected } = this.state;

        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button className="sat-list-btn"
                            type="primary"
                            size="large"
                            disabled={selected.length === 0}>Track on the map
                    </Button>
                </div>
                <hr/>

                {
                    isLoad ? (
                        <div className="spin-box">
                            <Spin tip="Loading..." size="large" />
                        </div>
                        ) : (
                        <List className="sat-list"
                              itemLayout="horizontal"
                              size="small"
                              dataSource={satList}
                              renderItem={item => (
                              <List.Item actions={[
                                  <Checkbox dataInfo={item} onChange={this.onChange}/>
                                  ]}
                              >
                                  <List.Item.Meta
                                      avatar={<Avatar size={50} src={satellite} />}
                                      title={<p>{item.satname}</p>}
                                      description={`Launch Date: ${item.launchDate}`}
                                  />
                              </List.Item>
                              )}
                        />
                    )}
            </div>
        );
    }

    onChange = (e) => {
        console.log("checkbox is clicked!");
        // step 1: is satellite checked (i.e. check-box is clicked)?
        const { dataInfo, checked } = e.target;

        // step 2: get selected list
        const { selected } = this.state;

        // step 3: get new selected list
        const list = this.addOrRemove(dataInfo, checked, selected);
        console.log(list);

        // step 4: update selected satellite list
        this.setState({
            selected: list
        })
    }

    addOrRemove = (dataInfo, checked, list) => {
        const found = list.some(item => item.satid === dataInfo.satid);

        // case 1: checked is true
        // - if item not in the list -> add it
        // - if item is already in the list -> do nothing
        if (checked && !found) {
            list.push(dataInfo); // Or using ES6 syntax: list = [...list, dataInfo]
        }

        // case 2: checked is false
        // - if item in the list -> remove it
        // - if item is not in the list -> do nothing
        if (!checked && found) {
            list = list.filter(item => item.satid !== dataInfo.satid);
        }
        return list;
    }
}

export default SatelliteList;