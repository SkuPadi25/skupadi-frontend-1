import React from "react";
import Routes from './Routes';
import PaymentStructureProvider from './contexts/PaymentStructureContext';
import { SchoolProvider } from './contexts/SchoolContext';

function App() {
  return (
    <SchoolProvider>
      <PaymentStructureProvider>
        <Routes />
      </PaymentStructureProvider>
    </SchoolProvider>
  );
}

export default App;