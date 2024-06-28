import React from 'react';
import Main from './components/Main';
import  { ReactFlowProvider }  from "reactflow";  

function App() {
  

  return (
    <ReactFlowProvider>
        <Main />
    </ReactFlowProvider>
  );
}

export default App;






