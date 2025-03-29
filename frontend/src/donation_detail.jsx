import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import DonateModal from "./donate_modal";
import { backend } from "../../src/declarations/backend";
import { LoginContext } from "./App";
import { Principal } from "@dfinity/principal";

export default function DonationDetail() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search));
    const [amount, setAmount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const { actor } = useContext(LoginContext);
    const [donationList, setDonationList] = useState([])
    const [totalAmount, setTotalAmount] = useState(0) 
    
    async function donate() { 
        const id = Principal.fromText(urlParams.get("userId"))
        await actor.donate(id, BigInt(amount))
        setIsOpen(false)
    }

    async function get_data() { 
        const id = Principal.fromText(urlParams.get("userId"))
        const res = await backend.get_donation_list(id)
        const donation_list = res.Ok.map(({amount, donor, timestamp}) => {
            setTotalAmount((state) => state + parseInt(amount, 10))
            return {
                amount,
                donor: Principal.fromUint8Array(donor._arr).toText(),
                timeDiff: (Date.now().toFixed() - parseInt(timestamp, 10)/1000000)/1000
            }
        })
        setDonationList(donation_list)
    }
    
    useEffect(() => {
        get_data()
    },[])
    
    return (
        <main>
            <section className='px-8 py-16 mt-16 border-b-2 border-gray-200'>
                <h1 className='text-[2rem] font-medium'>
                    { urlParams.get("campaign_title") }
                </h1>
                <div className="flex flex-row gap-8 my-8 h-96">
                    <div className="grow bg-gray-500 rounded-2xl"></div>
                    <div className="flex flex-col gap-8 grow">
                        <div className="grow bg-gray-500 rounded-2xl"></div>
                        <div className="grow bg-gray-500 rounded-2xl"></div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="aspect-square w-12 mr-4 bg-gray-500 rounded-full"></div>
                    <p className="my-auto font-medium">{urlParams.get("userId")} is organizing this fundraiser.</p>
                </div>
            </section>

            <section className='px-8 py-16 border-b-2 border-gray-200'>
                <p className="mb-4">
                    {urlParams.get("description")}
                </p>
                <p className="font-medium">
                    Location: {urlParams.get("location")}
                </p>
            </section>

            <section className='px-8 py-16'>
                <div className="relative flex flex-row justify-between mb-4">
                    <p className="text-[1.5rem] font-bold text-blue-800">ICP {totalAmount}</p>
                    <p className="absolute right-0 px-6 py-2 text-gray-400 border-gray-400 rounded-2xl border-2">{(donationList || []).length} donations</p>
                </div>
                <p className="mb-4">ICP {urlParams.get("goal")} goal</p>
                <div className='mb-8 h-4 bg-gray-200 rounded-full'>
                    <div className={`h-4 w-[${(Number(urlParams.get("goal")) - totalAmount)/Number(urlParams.get("goal"))*100}%] bg-blue-800 rounded-full`}></div>
                </div>
                <button onClick={() => setIsOpen(true)} className='px-8 py-3 font-medium text-white bg-blue-800 rounded-full'>
                    Donate
                </button>
                
                <div className="flex flex-row gap-8 mt-8">
                    <div className="basis-1/2 grow p-6 bg-gray-200 rounded-2xl">
                        <h2 className="text-[1.1rem] font-medium">Donations List</h2>
                        <div className="flex flex-col gap-4 mt-4">
                            {(donationList || []).map(({amount, donor, timeDiff}) => {
                                return (
                                    <div className="flex flex-row">
                                        <div className="aspect-square flex w-12 rounded-full bg-gray-300">
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="m-auto"
                                            >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        </div>
                                        <div className="grow ml-4">
                                            <p className="font-medium">{donor}</p>
                                            <div className="flex flex-row justify-between">
                                                <p className="my-auto text-[.8rem]">ICP {amount}</p>
                                                <p className="text-gray-400">{timeDiff} seconds ago</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="basis-1/2 grow p-6 bg-gray-200 rounded-2xl">
                        <h2 className="text-[1.1rem] font-medium">Live Report</h2>
                        <div className="relative flex flex-col gap-6 mt-4">
                            <div className="absolute h-full rounded-full border-3 border-gray-400 translate-x-51"></div>
                            <div className="flex flex-row">
                                <div className="w-48">
                                    <p className="font-medium">December 10, 2024</p>
                                    <p className="text-[0.8rem]">12:34 WIB</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-800 rounded-full z-1"></div>
                                <div className="ml-12">
                                    <p className="font-medium">Kiara Kurniawan</p>
                                    <p className="text-[0.8rem]">Money transferred to Rumah Pintar</p>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="w-48">
                                    <p className="font-medium">December 10, 2024</p>
                                    <p className="text-[0.8rem]">12:34 WIB</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-800 rounded-full z-1"></div>
                                <div className="ml-12">
                                    <p className="font-medium">Kiara Kurniawan</p>
                                    <p className="text-[0.8rem]">Money transferred to Rumah Pintar</p>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="w-48">
                                    <p className="font-medium">December 10, 2024</p>
                                    <p className="text-[0.8rem]">12:34 WIB</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-800 rounded-full z-1"></div>
                                <div className="ml-12">
                                    <p className="font-medium">Kiara Kurniawan</p>
                                    <p className="text-[0.8rem]">Money transferred to Rumah Pintar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <DonateModal donate={donate} setAmount={setAmount} isOpen={isOpen}/>
        </main>
    );
}