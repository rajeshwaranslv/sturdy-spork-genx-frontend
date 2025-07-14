import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TableSelection from './components/TableSelection';
import MenuSelection from './components/MenuSelection';
import OrderReview from './components/OrderReview';
import Billing from './components/Billing';
import Success from './components/Success';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TableSelection} />
        <Route path="/menu/:tableId" component={MenuSelection} />
   <Route path="/orders/:orderId" component={OrderReview} />

        <Route path="/billing/:orderId" component={Billing} />
        <Route path="/success" component={Success} />
      </Switch>
    </Router>
  );
}
