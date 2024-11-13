/*==================================================
src/components/Debits.js

The Debits component contains information for Debits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';
import { useState } from 'react';
import AccountBalance from './AccountBalance';
import "./Debits.css"

const Debits = (props) => {

  //States to update list 
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Create the list of Debit items
  let debitsView = () => {
    const { debits } = props;
    return debits.map((debit) => {  // Extract "id", "amount", "description" and "date" properties of each debits JSON array element
      let date = debit.date.slice(0,10);
      let amount = (Math.round(debit.amount * 100) / 100).toFixed(2);
      return <li key={debit.id}>{debit.amount} {debit.description} {date}</li>
    });
  }

  //Functions to update states
  const updateAmount = (event) => {
    setAmount(event.target.value);
  }

  const updateDescription = (event) => {
    setDescription(event.target.value);
  }

  const doSubmit = (event) => {
    event.preventDefault();
    props.addDebit(description, amount);
    setDescription('');
    setAmount('');
  }

  // Render the list of Debit items and a form to input new Debit item
  return (
    <div>
      <h1>Debits</h1>

      <h1><AccountBalance accountBalance={props.balance}/></h1>

      <div class = "list">
          {debitsView()}
      </div>

      <form onSubmit={doSubmit}>
        <input type="text" name="description" value = {description} placeholder='Description' onChange = {updateDescription}/>
        <input type="number" name="amount" value = {amount} placeholder='Amount' onChange = {updateAmount}/>
        <button type="submit">Add Debit</button>
      </form>

      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Debits;