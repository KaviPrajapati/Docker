import React from 'react';
import PropTypes from 'prop-types';
import './Registration.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        form : {
            name : "",
            email : "",
            password : "",
            topic : "",
        },
        allTopics : ["A","B","C"],
        loading : false,
        start : true
    };

    const firebaseConfig = {
        apiKey: "AIzaSyCVZ0t9UGrZimygjMqtT-Wa1h2DUbodYsE",
        authDomain: "assignement-2-e64fb.firebaseapp.com",
        projectId: "assignement-2-e64fb",
        storageBucket: "assignement-2-e64fb.appspot.com",
        messagingSenderId: "407294978927",
        appId: "1:407294978927:web:d603579dfdea3f9185569a"
    };
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }
  
  handleInp = (event) => {
    let id = event.target.id
    let form = this.state.form
    form[id] = event.target.value;
    this.setState({form : form , start : false})
  }

  register = async (e) => {
    e.preventDefault();
    const col = await collection(this.db, 'Users');
    await this.setState({loading : true})
    await addDoc(col,{
        Name: this.state.form.name,
        Email: this.state.form.email,
        Password: this.state.form.password,
        Topic: this.state.form.topic,
        State: "Offline"
    });
    await this.setState({loading : false , start : true})
  }
  
  getData = () => {

    return <React.Fragment>
        <div className="card col-md-5 color">
        <h3>Sign Up</h3>
        <table className="table">
        <tbody>
            <tr>
                <td>Name</td>
                <td>:</td>
                <td><input id="name" type="text" className="form-control" placeholder="Enter Name" value={this.state.form.name} onChange={this.handleInp}/></td>
            </tr>
            <tr>
                <td>Email</td>
                <td>:</td>
                <td><input id="email" type="email" className="form-control" placeholder="abc@xyz.com" value={this.state.form.email} onChange={this.handleInp}/></td>
            </tr>
            <tr>
                <td>Password</td>
                <td>:</td>
                <td><input id="password" type="password" className="form-control" placeholder="Enter Password" value={this.state.form.password} onChange={this.handleInp}/></td>
            </tr>
            <tr>
                <td>Select Topic</td>
                <td>:</td>
                <td>
                <select class="form-control" id="topic" onChange={this.handleInp}>
                    {
                        this.state.allTopics.map((d)=>{
                            return <option id="topic" value={d}>{d}</option>
                        })
                    }
                </select>
                </td>
            </tr>
        </tbody>
    </table>
    {
    this.state.loading ?
    <button className="btn btn-success" type="button" disabled>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
    :
    <button className="btn btn-success" onClick={this.register}>Register</button>
  }
  <br></br>
        {
          this.state.loading && !this.state.start ? 
          <div class="alert alert-success" role="alert">
            Successfully registered !
        </div>
        : ""
        }
        </div>
    </React.Fragment>
  }

  render() {
    return (
      this.getData()
    )
  }
}

export default Registration;