import React, {Component} from 'react';
import {Form, InputNumber, Button} from 'antd';

class SatelliteSettingForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
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

        // Form (contains form items): needs 2 main steps:
        // step1 : data validation (eg: antd3 API's getFieldDecorator() method)
        // step2: data collection (eg: antd3 API's validateFields() method)
        return (
            <Form {...formItemLayout}
                  className="sat-setting"
                  onSubmit={this.showSatellite}
            >
                <Form.Item label="Longitude (degrees)">
                    {getFieldDecorator("Longitude", { // HOF, * decorator for UI
                        rules: [
                            {
                                required: true,
                                message: "Please input your Longitude"
                            }
                        ]
                    })(<InputNumber min={-180} max={180} placeholder={"Please input your Longitude"} style={{width: "100%"}} />)}
                </Form.Item>

                <Form.Item label="Latitude (degrees)">
                    {getFieldDecorator("Latitude", { // HOF, * decorator for UI
                        rules: [
                            {
                                required: true,
                                message: "Please input your Latitude"
                            }
                        ]
                    })(<InputNumber min={-180} max={180} placeholder={"Please input your Latitude"} style={{width: "100%"}} />)}
                </Form.Item>

                <Form.Item label="Elevation (meters)">
                    {getFieldDecorator("Elevation", { // HOF, * decorator for UI
                        rules: [
                            {
                                required: true,
                                message: "Please input your Elevation"
                            }
                        ]
                    })(<InputNumber min={-413} max={8850} placeholder={"Please input your Elevation"} style={{width: "100%"}} />)}
                </Form.Item>

                <Form.Item label="Altitude (degrees)">
                    {getFieldDecorator("Altitude", { // HOF, * decorator for UI
                        rules: [
                            {
                                required: true,
                                message: "Please input your Altitude"
                            }
                        ]
                    })(<InputNumber min={0} max={90} placeholder={"Please input your Altitude"} style={{width: "100%"}} />)}
                </Form.Item>

                <Form.Item label="Duration (seconds)">
                    {getFieldDecorator("Duration", { // HOF, * decorator for UI
                        rules: [
                            {
                                required: true,
                                message: "Please input your Duration"
                            }
                        ]
                    })(<InputNumber min={-180} max={180} placeholder={"Please input your Duration"} style={{width: "100%"}} />)}
                </Form.Item>

                <Form.Item className="show-nearby">
                    <Button
                        type="primary"
                        htmlType="submit"
                    >Find Nearby Satellite
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    showSatellite = (e) => {
        // step1: collect data from the form
        // validateFields() from antd3 API
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                console.log('Received values of form: ', value);

                // step2: pass data to the Main component
                this.props.onShow(value);
            }
        });



    }
}

// this is "High-Order Component", Form.create() is a HOC
// input: a function
// output: a function
const SatelliteSetting = Form.create({name: 'sat_setting'})(SatelliteSettingForm)
// equiv to:
// function create(MyComponent) {
//     const form = {};
//     return class NewComponent extends React.Component {
//         render() {
//             return <MyComponent form={value}>
//         }
//     }
// }
export default SatelliteSetting;