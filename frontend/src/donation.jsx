import { useContext, useEffect, useState } from 'react';
import { backend } from '../../src/declarations/backend/index.js';
import { LoginContext } from './App';
import { Principal } from '@dfinity/principal';

export default function Donation() {
    const { actor } = useContext(LoginContext);
    const [imgSrc, setImgSrc] = useState()
    const [fundraiseData, setFundraiseData] = useState([])

    async function get_data() {  
        const res = await actor.get_bulk_fundraise_data(10)
        const dataProcessed = res.Ok.map(({fundraise_data, id}) => {
            const userId = Principal.fromUint8Array(id._arr).toText()
            return {
                goal: fundraise_data.goal,
                description: fundraise_data.description,
                campaign_title: fundraise_data.campaign_title,
                category: fundraise_data.category,
                location: fundraise_data.location,
                userId
            }
        })
        setFundraiseData(dataProcessed)

        res.Ok.forEach(async ({_, id}) => {
            const userId = Principal.fromUint8Array(id._arr).toText()
            const res = await actor.get_base64_image(id)
            setImgSrc({
                [userId]: res.Ok
            })
        })
        
    }

    useEffect(() => {
      if (actor) {
        get_data()
      }

      console.log(fundraiseData)
    },[actor, fundraiseData])

    return (
        <main>
            <section className='flex flex-col px-8 py-16 mt-16 border-b-2 border-gray-200'>
                <h1 className='text-[4rem] font-medium text-center'>
                    Make a Difference <span className='text-blue-800'>Today</span>
                </h1>
                <p className='mt-8 text-center'>Your generousity can change lives. Choose a cause and donate now.</p>
            </section>

            <section className='px-8 py-16'>
                <div className="flex flex-row justify-between mb-8 font-medium">
                    <h2 className="text-[2rem]">Education Fundraisers</h2>
                    <a href="#" className="text-gray-400">See More</a>
                </div>
                <div className='flex flex-row gap-4'>
                    { (fundraiseData || []).map((data, index) => (
                            <div className='grow' key={index}>
                                <img className='h-64 bg-gray-500 rounded-2xl' src={(imgSrc || {[data.userId]: ''})[data.userId]} />
                                <p className='my-4 font-bold'>{ data.campaign_title }</p>
                                <div className='h-4 bg-gray-200 rounded-full'>
                                    <div className={`h-4 w-[${34.56}%] bg-blue-800 rounded-full`}></div>
                                </div>
                                <p className='mt-2'>ICP {data.goal.toString()} raised</p>
                            </div>
                        )) 
                    }
                </div>
            </section>

            <section className='px-8 py-16 text-center'>
                <a href="#" className='px-8 py-3 text-[1.5rem] font-medium text-gray-500 rounded-full border-3 border-gray-500'>
                    Discover More
                </a>
            </section>
        </main>
    );
}