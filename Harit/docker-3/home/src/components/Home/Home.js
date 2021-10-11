import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc , getDocs, deleteDoc } from 'firebase/firestore/lite';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : false,
        show : false,
        name : "",
        current : {},
        currentRef : "",
        online : []
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

  componentWillMount = async () => {

    const col = await collection(this.db, 'Users');
    let email = localStorage.getItem("email")
    if(email){
      await this.setState({loading : true , show : true})
      const result = await getDocs(col);
      const data = result.docs.map(doc => doc.data());
      let name = ""
      let current = {}
      let currentRef = ""
      let ans = data.filter((d)=> {
        if(d.State=="Online"){
          if(d.Email==email){
            name = d.Name
            current = d
            return false
          }
          return true
        }
        return false
      })
      await result.docs.map(doc => {
        if(doc.data().Email == current.Email){
          currentRef = doc.ref
        }
      })
      await this.setState({loading : false , name : name , online : ans, current : current, currentRef : currentRef})
    }
  }

  logout = async (e) => {
    e.preventDefault();
    const col = await collection(this.db, 'Users');
    await deleteDoc(this.state.currentRef)
    let x = this.state.current
    x.State = "Offline"
    await addDoc(col, x);
    localStorage.removeItem("email")
  }
  
  getData = () => {

    return <React.Fragment>
      {
        this.state.show ?
        <React.Fragment>
          <div className="card col-md-10 color">
          <h3>Welcome {this.state.name} ( {localStorage.getItem("email")} ) , you are logged in</h3>
          <hr></hr>
          {
            this.state.online.length > 0 ?
            <div>
              <h5>Here are other users who are online</h5>
              {
                this.state.online.map((o)=>{
                  return <li>{o.Name +  "(" + o.Email + ")"}</li>
                })
              }
            </div>
            :
            <div>
              <h5>No users are online</h5>
            </div>
          }
          <br></br>
          <br></br>
          <button className="btn btn-danger" onClick={this.logout}>Logout</button>
        </div>
          </React.Fragment>
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

export default Home;