import React, { Component } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebaseApp from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firebase-firestore";
import firebaseConfig from "./firebaseConfig";
import logo from "./logo.png";
import "./App.css";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { nome: "", registros: [] };
  }
  cria() {
    const { user } = this.props;
    firebaseDb
      .collection("lab3")
      .add({
        portador: this.state.nome,
        user: user.displayName,
        datahora: new Date().getTime()
      })
      .then(ref => {
        console.log(ref);
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({ nome: '' })
  }


  componentDidMount() {
    this.unsubscribe =
      firebaseDb
        .collection("lab3")
        .orderBy("datahora", "desc")
        .limit(15)
        .onSnapshot(querySnapshot => {
          let registros = [];
          querySnapshot.forEach(doc => {
            registros.push({ id: doc.id, registro: doc.data() });
          });
          this.setState({ ...this.state, registros: registros });
        });
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }


  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    const regs = this.state.registros.slice(0, 5).map(r => {
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
    let names = [];
    this.state.registros.forEach(r => {
      if (names.indexOf(r.registro.user) < 0) {
        names.push(r.registro.user);
      }
    });
    const datalist = names.map(n => {
      return (
        <option value={n} />
      );
    });
      return (
        <div className="App">
          <header className="App-header">
            <datalist id="nomes">{datalist}</datalist>
            <img src={logo} className="App-logo" alt="logo" />
            <Button id="login" variant="outlined"  onClick={signOut}>Sign out</Button>
            {user ? <p>Hello, {user.displayName}</p> : <p>Please sign in.</p>}

            {user ? (
              <div>
                <TextField id="myInput" label="Name" value={this.state.name} onChange={(e) => {
                  this.setState({ ...this.state, nome: e.target.value })

                }} />

                <Button variant="outlined" onClick={this.cria.bind(this)}>Enviar</Button>
                <ul>{regs}</ul>
              </div>
            ) : (
                <Button variant="outlined"  onClick={signInWithGoogle}>Sign in with Google</Button>
              )}

          </header>

          <footer>Desenvolvido por <a target="_blank" href="https://www.ufjf.br/getsi/">GET SI</a></footer>
        </div>
      );
    }
  }

  firebaseApp.initializeApp(firebaseConfig);
  const firebaseAppAuth = firebaseApp.auth();
  firebaseApp.firestore().enablePersistence();
  const firebaseDb = firebaseApp.firestore();

  const providers = {
    googleProvider: new firebaseApp.auth.GoogleAuthProvider()
  };


  export default withFirebaseAuth({
    providers,
    firebaseAppAuth
  })(App);
