import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './PatientList.css';
import requestServer from './RequestServer';


class PatientList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: []
        }
    }

    componentDidMount() {
        this.getPatientList()
        this.timer = setInterval(() => this.getPatientList(), 5000);
        this.setState({
            columns: [
                { title: 'Name', field: 'name' },
                { title: 'Surname', field: 'surname' },
                { title: 'Sex', field: 'sex' },
                { title: 'Birth Date', field: 'birthDate' },
                { title: 'ID Number', field: 'id' },
            ],
            data: [],
        })
    }


    populateData(response) {
        console.log(response)
        var patientList = []
        response.forEach(patient => {
            var name = (patient.name.split(" "))[0]
            var surname = (patient.name.split(" "))[1]
            var birthDate = patient.birth_date
            var sex = patient.gender[0]
            var id = patient.id

            var patient_obj = {
                name: name,
                surname: surname,
                birthDate: birthDate,
                sex: sex,
                id: id
            }

            patientList.push(patient_obj)
        });

        this.setState({ data: patientList })

    }

    async getPatientList() {
        var passback = await requestServer.getPatientList()
        if (passback !== null) {
            this.populateData(passback.data)
        }
    }

    render() {
        return (
            <div className="table-position">
                <MaterialTable
                    title="Patients"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    const data = [...this.state.data];
                                    data[data.indexOf(oldData)] = newData;
                                    this.setState({ ...this.state, data });
                                }, 600);
                            }),
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    const data = [...this.state.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    this.setState({ ...this.state, data });
                                }, 600);
                            }),
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    {
                                        const data = [...this.state.data];
                                        data.push(newData);
                                        this.setState({ ...this.state, data });
                                    }
                                    resolve();
                                }, 1000);
                            }),
                        // onRowAdd: newData =>
                        //     new Promise((resolve) => {
                        //       console.log("onrowadd", newData)
                        //     }),

                    }}

                    //Other Actions
                    actions={[
                        {
                          //Graph button for patient chart
                          icon: 'assessment',
                          tooltip: 'Graph',
                          onClick: () => {
                            //Popup for Patient chart, opens PatientChart.js
                            window.open("/PatientChart",'popUpWindow',
                            'height=500,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
                          }
                        },
                        {
                            icon: 'assignment',
                            tooltip: 'Medications',
                            onClick: () => {
                              //Popup for Patient chart, opens PatientChart.js
                              window.open("/PatientNotes",'popUpWindow',
                              'height=1000,width=1200,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
                            }
                        }
                      ]}
                />
            </div>

        );
    }


}

export default PatientList;
