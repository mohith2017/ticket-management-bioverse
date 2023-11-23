import { useState } from 'react';
import Head from 'next/head';
import Admin from '../src/admin'; 
import Form from '../src/form';
import { Button, FormControlLabel, Switch } from '@mui/material';
import axios from 'axios';


export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  // const [tickets, setTickets] = useState<>();

  const toggleComponent = async() => {
    

    setShowAdmin(!showAdmin);
  };

  return (
    <>
      <div>
        <Head>
          <title>Bioverse Ticket Management</title>
        </Head>   
        <Button onClick={toggleComponent} className="mx-5 my-2 font-mono font-bold px-4 py-2 bg-black text-white rounded-md hover:text-black" > {showAdmin ? 'User' : 'Admin'}</Button>
        <div className="md:w-1/2 w-5/6 p-5 border mx-auto my-32 bg-black rounded-lg">
          <div className="flex justify-between items-center mb-4">
            
            <h1 className="text-white text-xl font-bold">
              {showAdmin ? 'Admin Page' : 'Raise Ticket'}
            </h1>
          </div>
          <br></br>
          {showAdmin ? <Admin /> : <Form />}
        </div>
      </div>
    </>
  );
}


