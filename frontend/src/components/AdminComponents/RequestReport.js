// All the rest of the content of the landing page is coming from 
import React, {Component} from 'react';
import Utility from '../NewForm/Utility';
import Button from '@material-ui/core/Button';
import '../../App.css';
import requestServer from '../RequestServer';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class RequestReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vht_list: [],
            location_list: [],
            location: '',
            vht_id : '',
            temp_from_date : new Date(),
            temp_to_date: new Date(),
            from_date: 'date',
            to_date: 'date',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
    }

    componentDidMount() {
        this.getVHTsList()
        this.getAllLocations()
    }


    populateData(response) {
        console.log("response", response)
        var VHTList = []

        response.forEach(user => {
            var id = user.id
            if (id == null){
                var id = "N/A";
            }
            console.log(id)
            var vht_obj = {
                title: id,
                id: id
            }
            VHTList.push(vht_obj)
        });

        this.setState({vht_list: VHTList})
        console.log("set data", VHTList)

    }

    populateLocationData(response) {
        var LocationList = []

        response.forEach(location => {
            var name = location.name
            var address = location.address
            console.log(name)
            var location_obj = {
                name: name,
                address: address
            }
            LocationList.push(location_obj)
        });

        this.setState({location_list: LocationList})
        console.log("set location data", LocationList)

    }

    async getVHTsList() {
        var passback = await requestServer.getAllVHTs()
        if (passback !== null) {
            this.populateData(passback.data)
        }
        else {
            console.log("Did not receive anything")
        }
    }

    async getAllLocations() {
        var passback = await requestServer.getLocations()
        if (passback !== null) {
            this.populateLocationData(passback.data)
        }
        else {
            console.log("Did not receive anything")
        }
    }


    handleChange(event){
        this.setState({
            vht_id: event.target.value
        })
        console.log("value is", event.target.value)
    }

    handleChangeLocation(event){
        this.setState({
            location: event.target.value
        })
        console.log("location is", event.target.value)
    }

    handleSubmit = async () => {
        if (this.state.vht_id = ''){
            window.alert("You need to select valid VHT")
        }
        else {
            console.log(this.state)
            if (this.state.from_date === "date" && this.state.to_date === "date") {
                let input_date_from = Utility.convertDate(this.state.temp_from_date)
                let input_date_to = Utility.convertDate(this.state.temp_to_date)
                let today = Utility.convertDate(new Date())
                this.setState({
                    from_date: input_date_from,
                    to_date: input_date_to
                })
            }
            this.changeState();
            var response = null;
            console.log(this.state.update)
            if (this.state.update) {
                //response = await RequestServer.updatePatient(this.state)
                window.alert("Requesting report of VHT id : " + this.state.vht_id + "From : " + this.state.from_date + "To : " + this.state.to_date)
            } else {
                window.alert("I'm here")
                // response = await RequestServer.addPatient(this.state)
                // if (response !== null) {
                //     toast("Patient Added");
                //     this.props.history.push(
                //         '/',
                //         {detail: response.data}
                //     )
                // } else {
                //     this.setState({
                //         error: true,
                //         errorMsg: 'Unable to register'
                //     })
                // }
            }
        }
    }

    changeFromDate = date => {
        this.setState({
            temp_from_date: date
        });
    };

    changeToDate = date => {
        if (date - this.state.temp_from_date < 0){
            window.alert("Invalid Range of Date. Please try again")
        }
        else {
            this.setState({
                temp_to_date: date
            });
        }
    };

    render() {
        let vht_select_option = this.state.vht_list.map(item => <option key={item.id}
            value={item.id}> {item.id} </option>)

        let location_select_option = this.state.location_list.map(location => <option key={location.id}
            value={location.name}> {location.name} </option>)

        console.log("Location Select Option",location_select_option)
        return (
            <div style={{
                backgroundColor: 'white',
                margin: 'auto',
                padding: '50px',
                textAlign: 'center'
            }}>
                <h1 style={{color: "black"}}> VHT Activity Report</h1>
                {/* <h4 style={{color: "white"}}> Health Facility Location</h4> */}
                <h4 style={{color: "black"}} >Select Health Facility Location </h4>
                    <select
                            onChange={this.handleChangeLocation}
                            value={this.state.location}
                            name="location_list"
                    >
                            <option value="null"> --SELECT ONE--</option>
                            {location_select_option}
                    </select>
                <br/>

                <h4 style={{color: "black"}}>Select VHT: </h4>
                <form onSubmit={this.handleSubmit}>
                    <select
                            onChange={this.handleChange}
                            value={this.state.vht_id}
                            name="vht_list"
                    >
                            <option value="null"> --SELECT ONE--</option>
                            {vht_select_option}
                    </select>

                    <h4 style={{color: "black"}}> Select Duration for the Report</h4>
                    <h4 style={{color: "black"}}> From</h4>
                    <br/>
                        <DatePicker 
                            name = "from_date"
                            selected={this.state.temp_from_date}
                            onChange={this.changeFromDate}
                            maxDate={new Date()}
                        />
                    <h4 style={{color: "black"}}> To</h4>
                    <br/>
                        <DatePicker
                            name = "to_date"
                            selected={this.state.temp_to_date}
                            onChange={this.changeToDate}
                            maxDate={new Date()}
                        />
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Button type="submit" style={{
                        backgroundColor: 'blue',
                        color: 'white'
                    }}>Submit</Button>
                    <br/>
                </form>
            </div>

        );

    }
}

export default RequestReport;