import React from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc , deleteDoc, doc } from 'firebase/firestore/lite';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        form : {
            email : "",
            password : ""
        },
        loading : false,
        error : false
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
    this.setState({form : form})
  }

 login = async (e) => {
    e.preventDefault();
    const col = await collection(this.db, 'Users');
    await this.setState({loading : true, error : false})
    const result = await getDocs(col);
    const data = result.docs.map(doc => doc.data());
    let ans = data.filter((d)=> {
      return d.Email==this.state.form.email && d.Password==this.state.form.password
    })
    await this.setState({loading : false})
    if(ans.length == 0){
      this.setState({error : true})
    } else {
      let docc = ""
      await result.docs.map(doc => {
        if(doc.data().Email == ans[0].Email){
          docc = doc.ref;
        }
      })
      await deleteDoc(docc)
      ans[0].State = "Online"
      await addDoc(col, ans[0]);
      localStorage.setItem("email",ans[0].Email)
    }
  }
  
  getData = () => {

    return <React.Fragment>
        <div className="card col-md-5 color">
        <h3>Log In</h3>
        <table className="table">
        <tbody>
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
        </tbody>
    </table>
    {
    this.state.loading ?
    <button className="btn btn-success" type="button" disabled>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
    :
    <button className="btn btn-success" onClick={this.login}>Login</button>
  }
      <br></br>
        </div>
        {
          this.state.error ? 
          <div class="alert alert-danger" role="alert">
            Invalid credentials
        </div>
        : ""
        }
       
    </React.Fragment>
  }

  render() {
    return (
      this.getData()
    )
  }
}

export default Login;