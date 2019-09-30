
import React from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';
import ShowSymp from "./SymptomsForm";
import { Grid, Cell } from 'react-mdl';


class NewAssessment extends React.Component {

    constructor(){
        super()
        this.state = {
            assessments : {
                //use get method to get the assessment id <- should be equal to # of assessments + 1
                id: '',
                patient_id: "0110",
                patient_age: "20",
                vht_id : null,
                date: "",
                gestational_age: "20",
                heart_rate: "100",
                systolic: "100",
                diastolic: "100",
                ews_color: "red",
                symptoms: [],
                referred: false,
                follow_up: false,
                follow_up_date: null,
                recheck: false,

                //Temp
                time_scale: "w",
                initial: "AJ",
                temp_symptoms: "",
                //Symptoms
                symptoms_arr: [
                    {id: 1, name: 'No Symptoms (patient healthy)', checked: true},
                    {id: 2, name: 'Headache', checked: false},
                    {id: 3, name: 'Blurred vision', checked: false},
                    {id: 4, name: 'Abdominal pain', checked: false},
                    {id: 5, name: 'Bleeding', checked: false},
                    {id: 6, name: 'Feverish', checked: false},
                    {id: 7, name: 'Unwell', checked: false},
                ]
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleCheckbox = this.handleCheckbox.bind(this)
    }

    // private String patient_id;
    // private String patient_age;
    // private String vht_id;
    // private String date;
    // private String gestational_age;
    // private int heart_rate;
    // private int systolic;
    // private int diastolic;
    // private String ews_color;
    // private String symptoms;
    // private boolean referred;
    // private boolean follow_up;
    // private String follow_up_date;
    // private boolean recheck;
    //



    componentDidMount() {
        // custom rule will have name 'isValidEWS'
        ValidatorForm.addValidationRule('isValidEWS', (value) => {
            if (value === 'green' || value === 'yellow' || value ==='red') {
                return true;
            }
            return false;
        });
    }

    // componentWillUnmount() {
    //     // remove rule when it is not needed
    //     ValidatorForm.removeValidationRule('isValidEWS');
    // }

    handleCheckbox(id){
        this.setState(prevState => {
            const updatedSymp = prevState.assessments.symptoms_arr.map(each => {
                if(each.id === id){
                    each.checked = !each.checked
                }
                return each
            });
            prevState.assessments.symptoms_arr = updatedSymp;
            return prevState;
        })
        console.log(this.state.assessments.symptoms_arr)
    }

    addSymptoms(){
        const symp = this.state.assessments.symptoms_arr;
        for(var index in symp){
            if (symp[index].checked){
                this.state.assessments.symptoms.push(symp[index].name)
            }
        }
    }

    changeType(){
        this.state.assessments.heart_rate = parseInt(this.state.assessments.heart_rate)
        this.state.assessments.systolic = parseInt(this.state.assessments.systolic)
        this.state.assessments.diastolic = parseInt(this.state.assessments.diastolic)
        if(this.state.assessments.temp_symptoms !== ""){
            this.state.assessments.symptoms.push(this.state.assessments.temp_symptoms)
        }
        this.addSymptoms()
        this.state.assessments.gestational_age += this.state.assessments.time_scale
        delete this.state.assessments.temp_symptoms;
        delete this.state.assessments.symptoms_arr;
        delete this.state.assessments.initial;
        delete this.state.assessments.time_scale;


    }


    handleSubmit = () => {
        this.changeType();
        console.log(this.state)
            axios.post('http://localhost:8080/assessments/add', this.state.assessments)
            .then(response => {
                console.log(this.state)
                this.props.history.push(
                    '/',
                    { detail: response.data }
                )
            })
            .catch(error => {
                console.log('error block')
                console.log(error)
            })

    }


    handleChange(event){
        const { assessments } = this.state;
        assessments[event.target.name] = event.target.value;
        this.setState({ assessments });
    }



    render() {
        const symptom = this.state.assessments.symptoms_arr.map(item => <ShowSymp key = {item.id} item = {item}
                                                              handleChange = { this.handleCheckbox}/>)

        return (
            <ValidatorForm
                style={{
                    backgroundColor: 'white',
                    margin : 'auto',
                    padding : '50px',
                    textAlign: 'center'
                    // width: '400px',
                    // height: '400px'
                }}
                ref="form"
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >
                <Grid>
                    <Cell col={4}>
                        <h4> Patient Form </h4>
                        <TextValidator
                            label="Assigned Worker Id"
                            onChange={this.handleChange}
                            name="id"
                            value={this.state.assessments.id}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <br/>
                        <TextValidator
                            label="Patient ID"
                            onChange={this.handleChange}
                            name="patient_id"
                            value={this.state.assessments.patient_id}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <br/>

                        <TextValidator
                            label="Initials"
                            onChange={this.handleChange}
                            name="initial"
                            value={this.state.assessments.initial}
                            validators={['required']}
                            errorMessages={['this field is required']}

                        />
                        <br/>

                        <TextValidator
                            label="Age"
                            onChange={this.handleChange}
                            name="patient_age"
                            value={this.state.assessments.patient_age}
                            validators={['required','minNumber:0', 'maxNumber:200', 'matchRegexp:^[0-9]*$']}
                            errorMessages={['this field is required', 'MUST BE BETWEEN 0-200']}
                        />
                        <br/>
                        <br/>
                        <label>Gestational Age:</label>
                        <select
                            value={this.state.assessments.time_scale}
                            onChange={this.handleChange}
                            name="time_scale"
                        >
                            <option value=""> --SELECT ONE---</option>
                            <option value="w"> Weeks</option>
                            <option value="m"> Months</option>
                            <option value="n/a"> Not Pregnant</option>
                        </select>
                        <br/>


                        <TextValidator
                            label="Gestational Age"
                            onChange={this.handleChange}
                            name="gestational_age"
                            value={this.state.assessments.gestational_age}
                            validators={['required', 'minNumber:0', 'maxNumber:60', 'matchRegexp:^[0-9]*$']}
                            errorMessages={['this field is required','MUST BE BETWEEN 0-60','MUST BE BETWEEN 0-60','MUST BE BETWEEN 0-60']}
                        />
                    </Cell>
                    <Cell col={4}>
                        <h4> Symptoms </h4>

                        {symptom}


                        <TextValidator
                            label="Other Symptoms"
                            onChange={this.handleChange}
                            name="temp_symptoms"
                            value={this.state.assessments.temp_symptoms}
                        />

                        <br/>
                    </Cell>
                    <Cell col = {4}>

                        <h4>Vitals</h4>
                        <TextValidator
                            label="Systolic"
                            onChange={this.handleChange}
                            name="systolic"
                            value={this.state.assessments.systolic}
                            validators={['required', 'minNumber:0', 'maxNumber:300', 'matchRegexp:^[0-9]*$']}
                            errorMessages={['this field is required','MUST BE BETWEEN 0-300']}
                        />
                        <br/>
                        <TextValidator
                            label="Diastolic"
                            onChange={this.handleChange}
                            name="diastolic"
                            value={this.state.assessments.diastolic}
                            validators={['required', 'minNumber:0', 'maxNumber:300', 'matchRegexp:^[0-9]*$']}
                            errorMessages={['this field is required','MUST BE BETWEEN 0-300']}
                        />
                        <br/>
                        <TextValidator
                            label="Heart Rate"
                            onChange = {this.handleChange}
                            name="heart_rate"
                            value={this.state.assessments.heart_rate}
                            validators={['required', 'minNumber:0', 'maxNumber:300', 'matchRegexp:^[0-9]*$']}
                            errorMessages={['this field is required','MUST BE BETWEEN 0-300']}
                        />
                        <br/>
                        <TextValidator
                            label="Early Warning Sign"
                            onChange={this.handleChange}
                            name="ews_color"
                            value={this.state.assessments.ews_color}
                            validators={['isValidEWS', 'required']} //TO DO
                            errorMessages={['Must be one of green, yellow, or red', 'this field is required']}
                        />
                    </Cell>
                </Grid>
                <br/>

                <br/>
                <Button type="submit" style={{
                    backgroundColor: 'blue',
                    color:'white'
                }}>Submit</Button>
                <br/>
                <br/>

            </ValidatorForm>
        );
    }
}




export default NewAssessment
