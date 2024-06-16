import React from 'react';
import './App.css'

export const createClient = () => {
  console.log('factory invoked');
  return {name: 'Pepe', lastname: 'Perez'};
}

function App() {
  const [myClient, setMyClient]  =  React.useState(() => createClient());
  
  return (
      <>
        <h1>{myClient.name}</h1>
        <input value={myClient.name} onChange={(e) => setMyClient({...myClient, name: e.target.value})}/>
      </>
  )
}

export default App
