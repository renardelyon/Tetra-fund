import { useState } from 'react';
import { icp_hello_backend } from 'declarations/icp_hello_backend';

import Navbar from './layout/navbar';
import Footer from './layout/footer';
import Homepage from './pages/homepage';
import Donation from './pages/donation';
import DonationDetail from './pages/donation_detail';
import Fundraiser from './pages/fundraiser';
import Login from './pages/login';

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
  //   </main>
  // );

  return (
    <main className='font-display'>

    <Navbar />
    <Homepage />
    {/* <Donation /> */}
    {/* <DonationDetail /> */}
    {/* <Fundraiser /> */}
    <Footer />

    {/* <Login /> */}
    </main>
  );
}

export default App;
