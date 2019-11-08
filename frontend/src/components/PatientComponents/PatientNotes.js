import React, {Component} from 'react';
import MaterialTable from 'material-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestServer from '../RequestServer';
import NewMedicationPopup from '../../Modals/NewMedicationPopup';

class PatientNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: []
        }
    }

    componentDidMount() {
      // this.getMatchingPatientID("81991")
      // this.timer = setInterval(() => this.getMatchingPatientID("81991"), 10000);
      this.getMedicationList()
      this.timer = setInterval(() => this.getMedicationList(), 10000);
      this.setState({
            columns: [
                { title: 'Medication', field: 'medication' },
                { title: 'Dose', field: 'dose' },
                { title: 'Start Date', field: 'startDate'},
                { title: 'End Date', field: 'endDate'},
                { title: 'Side Effects', field: 'sideEffects'},
              ], 
              data: [
                { 
                  medication: 'Medication Name',
                  dose: '5mg',
                  startDate: 'Start', 
                  endDate: 'End', 
                  sideEffects: 'dry mouth' },
                {
                  medication: 'Medication Name 2',
                  dose: '2mg',
                  startDate: 'Start',
                  endDate: 'End',
                  sideEffects: 'itchy skin',
                },
            ],
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    populateData(response) {
      var medicationsList = []
      response.forEach(medications => {
        var medicationName = medications.medication_name
        var dose = medications.dose
        var startDate = medications.start_date
        var endDate = medications.end_date
        var sideEffects = medications.side_effects

        var medications_obj = {
          medicationName: medicationName,
          dose: dose,
          startDate: startDate,
          endDate: endDate,
          sideEffects: sideEffects
      }

      medicationsList.push(medications_obj)
    });
    this.setState({data: medicationsList})
}
    async getMedicationList() {
      var passback = await RequestServer.getMedicationList()
      if (passback !== null && passback.data !== "") {
          this.populateData(passback.data)
      }
  }
  async getMatchingPatientID(patient_id) {
    var passback = await RequestServer.getPatientByID(patient_id)
    if (passback != null) {
        this.populateData(passback.data.list_of_medications
        )
        console.log(passback.data.list_of_medications)
        console.log("passback.data.list_of_assessments[0]")
        console.log(passback.data.list_of_medications[0])
    }
}
render(){
    return (
        <div className = "table-position" >
        <MaterialTable
        title="Medications"
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          // onRowAdd: newData =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       const data = [...state.data];
          //       data.push(newData);
          //       setState({ ...state, data });
          //     }, 600);
          //   }),
          // onRowUpdate: (newData, oldData) =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       const data = [...state.data];
          //       data[data.indexOf(oldData)] = newData;
          //       setState({ ...state, data });
          //     }, 600);
          //   }),
          // onRowDelete: oldData =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       const data = [...state.data];
          //       data.splice(data.indexOf(oldData), 1);
          //       setState({ ...state, data });
          //     }, 600);
          //       }),
          }}
        />
        <div>
        <NewMedicationPopup/>
        </div>
      </div>
       );
}


}
export default PatientNotes;
