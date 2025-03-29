import { createContext, useState } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';
import Homepage from './Homepage';
import Donation from './donation';
import DonationDetail from './donation_detail';
import Fundraiser from './fundraiser';
import Login from './login';

import Route from './Route';
import NavigationProvider from './NavigationProvider';

export const LoginContext = createContext();

function App() { 
  // const [greeting, setGreeting] = useState('');

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const name = event.target.elements.name.value;
  //   icp_hello_backend.greet(name).then((greeting) => {
  //     setGreeting(greeting);
  //   });
  //   return false;
  // }

  // return (
  //   <main>
  //     <img src="/logo2.svg" alt="DFINITY logo" />
  //     <br />
  //     <br />
  //     <form action="#" onSubmit={handleSubmit}>
  //       <label htmlFor="name">Enter your name: &nbsp;</label>
  //       <input id="name" alt="Name" type="text" />
  //       <button type="submit">Click Me!</button>
  //     </form>
  //     <section id="greeting">{greeting}</section>
    // </main>
  // );

  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const providerValue = {
    authClient,
    setAuthClient,
    actor,
    setActor,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <LoginContext.Provider value={providerValue}>
      <NavigationProvider>
        <main className='font-display'>

          <Navbar />
          <Route href="/">
            <Homepage />
          </Route>
          <Route href="/donation">
            <Donation /> 
          </Route>
          <Route href="/donation/detail">
            <DonationDetail /> 
          </Route>
          <Route href="/fundraise">
            <Fundraiser /> 
          </Route>
          <Route href="/login">
            <Login /> 
          </Route>
          <Footer />
        </main>
      </NavigationProvider>
    </LoginContext.Provider>
  );
}

export default App;
