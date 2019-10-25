import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './AssessmentList.css';
import TrafficIcons from "./Visuals/TrafficIcons";
import ModalPopup from '../Modals/ModalPopup';
import requestServer from './RequestServer';


class AssessmentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
        }
    }

    componentDidMount() {
        this.getAssessmentList()
        this.timer = setInterval(() => this.getAssessmentList(), 10000);
        this.setState({
            columns: [
                { title: 'Assessment Id', field: 'id', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Early Warning Color', field: 'ews_color', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Shock Arrow', field: 'arrow', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'patient Id', field: 'patient_id', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'VHT Id', field: 'vht_id', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Gestational Age', field: 'gestational_age', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Gestational Unit', field: 'gestational_unit', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Referred?', field: 'referred', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Follow Up?', field: 'follow_up', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Recheck?', field: 'recheck', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
                { title: 'Assessment Information', field: 'info', headerStyle: { textAlign: 'center' }, cellStyle: { textAlign: 'center' } },
            ],
            data: [
                {
                    assessment_id: 'LOADING...',
                    ews_color: 'LOADING...',
                    patient_id: 'LOADING...',
                    vht_id: 'LOADING...',
                    gestational_age: 'LOADING...',
                    gestational_unit: 'LOADING...',
                    referred: 'LOADING...',
                    follow_up: 'LOADING...',
                    recheck: 'LOADING...',
                    arrow: 'LOADING...',
                    info: <ModalPopup />
                },
            ],

        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }


    populateData(response) {

        var assessmentList = []
        response.forEach(function (assessment) {
            var info = <ModalPopup
                patient_id={assessment.patient_id}
                vht_id={assessment.vht_id}
                symptoms={assessment.symptoms}
                systolic={assessment.systolic}
                diastolic={assessment.diastolic}
                heart_rate={assessment.heart_rate}
                date={assessment.date}
            />
            var assessment_obj = {
                id: assessment._id,
                ews_color: getColorVisual(assessment.ews_color),
                arrow: getArrowVisual(assessment.arrow),
                patient_id: assessment.patient_id,
                vht_id: assessment.vht_id,
                gestational_age: assessment.gestational_age,
                referred: getBoolVisual(assessment.referred),
                follow_up: getBoolVisual(assessment.follow_up),
                recheck: getBoolVisual(assessment.recheck),
                patient_age: assessment.patient_age,
                date: assessment.date,
                heart_rate: assessment.heart_rate,
                systolic: assessment.systolic,
                diastolic: assessment.diastolic,
                symptoms: assessment.symptoms,
                follow_up_date: assessment.follow_up_date,
                info: info,
            }

            assessmentList.push(assessment_obj)
        });

        this.setState({ data: assessmentList })
    }

    async getAssessmentList() {

        var userData = localStorage.getItem("userData")
        if (userData === null) {
            var passback = await requestServer.getAssessmentsList()
            if (passback !== null) {
                this.populateData(passback.data)
            }
        } else {
            // userData.roles.forEach(id => {
            //     console.log(id)
            // });
        }
    }


    render() {
        return (
            <div className="table-position">
                <MaterialTable
                    title="Assessment List"
                    columns={this.state.columns}
                    data={this.state.data}
                />
            </div>

        );
    }
}



const styles = {
    overflow: "hidden",
    display: "auto",
    flexWrap: "flex",
    alignItems: "center",
    fontFamily: "sans-serif",
    justifyContent: "left"
};
const GreenLight = () => (
    <div style={styles}>
        <TrafficIcons name="greencircle" width={50} fill={"#228B22"} />
    </div>
);
const RedLight = () => (
    <div style={styles}>
        <TrafficIcons name="redcircle" width={50} fill={"#B22222"} />
    </div>
);
const YellowLight = () => (
    <div style={styles}>
        <TrafficIcons name="yellowcircle" width={50} fill={"#CCCC00"} />
    </div>
);



function getArrowVisual(input) {
    switch (String(input).toUpperCase()) {
        case "UP":
            return <i class="arrow up icon" />
        case "DOWN":
            return <i class="arrow down icon" />
        case "EMPTY":
            return <i class="window minimize icon" />
        default:
            return input
    }
}

function getColorVisual(input) {
    switch (String(input).toUpperCase()) {
        case "GREEN":
            return <GreenLight />
        case "YELLOW":
            return <YellowLight />
        case "RED":
            return <RedLight />
        default:
            return input
    }
}

function getBoolVisual(input) {
    switch (String(input).toUpperCase()) {
        case "TRUE":
            return <i aria-hidden="true" className="check icon" />
        case "FALSE":
            return <i aria-hidden="true" className="x icon" />
        default:
            return input
    }
}


export default AssessmentList;
