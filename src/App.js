/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component, useState, useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';
// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }
  
  async componentDidMount() {
    try {
      const creditResponse = await fetch('https://johnnylaicode.github.io/api/credits.json');
      if (!creditResponse.ok) {
        throw Error('Failed to fetch credits data');
      }
      const creditData = await creditResponse.json();
      this.setState({ creditList: creditData });
  
      const debitResponse = await fetch('https://johnnylaicode.github.io/api/debits.json');
      if (!debitResponse.ok) {
        throw Error('Failed to fetch debits data');
      }
      const debitData = await debitResponse.json();
      this.setState({ debitList: debitData });
  
      const totalCredits = creditData.reduce((acc, credit) => acc + parseFloat(credit.amount), 0);
      const totalDebits = debitData.reduce((acc, debit) => acc + parseFloat(debit.amount), 0);
      this.setState({ accountBalance: (1234567.89 + totalCredits - totalDebits).toFixed(2) });
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} />) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} />) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/assignment-3/">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;