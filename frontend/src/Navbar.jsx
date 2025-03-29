import { useContext, useEffect } from "react";
import { LoginContext } from "./App";
import { createActor } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId } from 'declarations/backend/index.js';

export default function Navbar() {
    const { setActor, setAuthClient, setIsAuthenticated, authClient, isAuthenticated } = useContext(LoginContext)

    useEffect(() => {
        updateActor();
    }, []);

    async function updateActor() {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const actor = createActor(canisterId, {
            agentOptions: {
                identity
            }
        });
        const isAuthenticated = await authClient.isAuthenticated();

        setActor(actor);
        setAuthClient(authClient);
        setIsAuthenticated(isAuthenticated);
    }
      
    async function logout(e) {
      e.preventDefault();
      await authClient.logout();
      updateActor();
    }

    return (
      <nav className='fixed top-0 left-0 right-0 flex flex-row justify-between px-8 py-4 font-medium bg-white z-1 drop-shadow-lg'>
        <a href="#" className='my-auto'>
          <img className='h-8' src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/320px-Logo_dana_blue.svg.png" alt="logo"/>
        </a>
        <ul className='flex flex-row gap-16'>
          <li className='m-auto h-min'>
            <a href="/">Home</a>
          </li>
          <li className='m-auto h-min'>
            <a href="/donation">Donation</a>
          </li>
          <li className='m-auto h-min'>
            <a href="/fundraise">Fundraise</a>
          </li>
          {/* <li className='m-auto h-min'>
            <a href="#">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className='inline mr-4'
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                  fill="currentColor"
                />
              </svg>
              Search
            </a>
          </li> */}
        </ul>
        {!isAuthenticated ? (
          <a href="/login" className='px-7 py-2 text-white bg-blue-800 rounded-2xl'>
            Sign In
          </a>
        ) : (
          <a href="#" onClick={logout} className='px-7 py-2 text-white bg-blue-800 rounded-2xl'>
            Log Out
          </a>
        )}
        
      </nav>
    );
  }