/*==================================================
src/components/Credits.js

The Credits component contains information for Credits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';
import "./Credits.css";

const Credits = (props) => {
  // Create the list of Credit items
  let creditsView = () => {
    const { credits } = props;
    return credits.map((credit) => {  // Extract "id", "amount", "description" and "date" properties of each credits JSON array element
      let date = credit.date.slice(0,10);
      let amount = (Math.round(credit.amount * 100) / 100).toFixed(2);
      return <li key={credit.id}>{amount} {credit.description} {date}</li>
    });
  }
  

  // Render the list of Credit items and a form to input new Credit item
  return (
    <div>
      <h1>Credits</h1>

      <h1><AccountBalance accountBalance={props.balance}/></h1>
      
      <div class = "list">
          {creditsView()}
      </div>

      <form onSubmit={props.addCredit}>
        <input type="text" name="description" placeholder='Description'/>
        <input type="text" name="amount" placeholder='Amount'/>
        <button type="submit">Add Credit</button>
      </form>

      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Credits;