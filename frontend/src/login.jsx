import { useContext, useEffect } from "react";
import { LoginContext } from "./App";
import { createActor } from 'declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId } from 'declarations/backend/index.js';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

export default function Login() {
    const { setActor,setAuthClient, setIsAuthenticated, authClient } = useContext(LoginContext)

    useEffect(() => {
        updateActor();
    }, []);

    async function updateActor() {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        console.log("User Principal ID:", identity.getPrincipal().toText());
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

    async function login(e) {
        e.preventDefault();
        await authClient.login({
            identityProvider,
            onSuccess: updateActor
        });
    }

    return (
        <main className="flex flex-row p-4 min-h-screen">
            <div className="basis-1/2 grow bg-gray-500 rounded-4xl"></div>
            <div className="basis-1/2 grow flex flex-col justify-center px-16">
                <div className="flex justify-center">
                    <img className='h-10' src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/320px-Logo_dana_blue.svg.png" alt="logo"/>
                </div>
                <h1 className="my-8 text-center text-[3rem] font-medium text-blue-800">Please Choose a Provider</h1>
                <div className="flex flex-col gap-4">
                    <a onClick={login} href="#" className="py-2 text-[1.2rem] text-center font-medium rounded-full border-3 border-gray-300">Internet Identity</a>
                </div>
            </div>
        </main>
    );
}