import React, { Component } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firebase-firestore";
import firebaseConfig from "./firebaseConfig";
import logo from "./logo.svg";
import "./App.css";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { registros: [] };
  }
  cria() {
    const { user, signOut, signInWithGoogle } = this.props;
    firebaseDb
      .collection("lab3")
      .add({
        portador: "Teste",
        user: user.displayName,
        datahora: new Date().getTime()
      })
      .then(ref => {
        console.log(ref);
        firebaseDb
          .collection("lab3")
          .orderBy("datahora", "desc")
          .limit(5)
          .get()
          .then(querySnapshot => {
            let registros = [];
            querySnapshot.forEach(doc => {
              console.log(`${doc.id} => ${doc.data()}`, doc.data().user);
              registros.push({ id: doc.id, registro: doc.data() });
            });
            this.setState({ ...this.state, registros: registros });
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    const regs = this.state.registros.map(r => {
      const t = new Date();
      t.setTime(r.registro.datahora * 1);
      return (
        <section key={r.id} className="registro">
          <div> {r.registro.portador}.</div>
          <div>
            {r.registro.user} {t.toLocaleString()}
          </div>
        </section>
      );
    });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {user ? <p>Hello, {user.displayName}</p> : <p>Please sign in.</p>}

          {user ? (
            <div>
              <button onClick={signOut}>Sign out</button>
              <button onClick={this.cria.bind(this)}>Cria</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
          <ul>{regs}</ul>
        </header>
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();
const firebaseDb = firebaseApp.firestore();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);
