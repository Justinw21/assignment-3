/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
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
        //Calculates initial balance from api call items
        let credit = 0;
        this.state.creditList.forEach((obj) => {
          credit += obj.amount;
        });
        let debit = 0;
        this.state.debitList.forEach((obj) => {
          debit += obj.amount;
        });
        this.setState({
          accountBalance: credit - debit
        });
  }
  //Update debitList with the inputs from the Debit Form
  addDebit = (description, amount) => {
    //Converting amount to Number and rounding it to 2 decimal places
    const formAmount = Number(amount);
    const amountProperDigits = (Math.round(formAmount * 100) / 100).toFixed(2);

    const submissionDate = new Date();
    const year = submissionDate.getFullYear();
    const day = String(submissionDate.getDate()).padStart(2,'0');
    const month = String(submissionDate.getMonth() + 1).padStart(2,'0');
    const time = year + "-" + month + "-" + day;

    const newSubmission = {
      id: this.state.debitList.length + 1,
      description: description,
      amount: amountProperDigits,
      date: time
    };

    this.setState(prevState => ({
      debitList: [...prevState.debitList, newSubmission]
    })); 

    const debit = -1 * amountProperDigits;
    this.updateBalance(debit);
  }

  // add a Credit from form to the creditList
  addCredit = (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const description = formData.get('description'); 
    const credit = Number(formData.get('amount')); 
    const amount = (credit).toFixed(2);
    const id = this.state.creditList.length+1
    
    //Makes date for entry
    const submissionDate = new Date();
    const year = submissionDate.getFullYear();
    const day = String(submissionDate.getDate()).padStart(2,'0');
    const month = String(submissionDate.getMonth() + 1).padStart(2,'0');

    const date = year + "-" + month + "-" + day;

    const newCredit = {id, description, amount, date}
    this.setState((prevState) => ({
      creditList: [...prevState.creditList, newCredit]
    }));
    event.target.reset();
    
    this.updateBalance(credit)
  }

  //Update account balance with credit/debit
  updateBalance = (amount) => {
    this.setState(prevState => ({
      accountBalance: Math.round((prevState.accountBalance + amount) * 100) / 100 
    })); 
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
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} balance={this.state.accountBalance}/>) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} balance = {this.state.accountBalance}/>) 

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