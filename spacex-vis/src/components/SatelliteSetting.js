import React, {Component} from 'react';
import {Form, InputNumber, Button} from "antd";

class SatelliteSetting extends Component {
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 11 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 },
            },
        }

        return (
            <Form {...formItemLayout}>
                <Form.Item label="Longitude(degrees)">
                    {(<InputNumber min={-180} max={180} placeholder={"Please input your Longitude"} />)}
                </Form.Item>

                <Form.Item label="Latitude(degrees)">
                    {(<InputNumber min={-180} max={180} placeholder={"Please input your Latitude"} />)}
                </Form.Item>
            </Form>


        );
    }
}

export default SatelliteSetting;