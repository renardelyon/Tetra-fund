export default function Login() {
    return (
        <main className="flex flex-row p-4 min-h-screen">
            <div className="basis-1/2 grow bg-gray-500 rounded-4xl"></div>
            <div className="basis-1/2 grow flex flex-col justify-center px-16">
                <div className="flex justify-center">
                    <img className='h-10' src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/320px-Logo_dana_blue.svg.png" alt="logo"/>
                </div>
                <h1 className="my-8 text-center text-[3rem] font-medium text-blue-800">Please Choose a Provider</h1>
                <div className="flex flex-col gap-4">
                    <a href="#" className="py-2 text-[1.2rem] text-center font-medium rounded-full border-3 border-gray-300">Internet Identity</a>
                    <a href="#" className="py-2 text-[1.2rem] text-center font-medium rounded-full border-3 border-gray-300">Plug Wallet</a>
                    <a href="#" className="py-2 text-[1.2rem] text-center font-medium rounded-full border-3 border-gray-300">Internet Identity</a>
                </div>
            </div>
        </main>
    );
}