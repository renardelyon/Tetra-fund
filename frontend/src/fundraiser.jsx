import React, { useState, useContext } from 'react';
import { backend } from '../../src/declarations/backend/index.js';
import { LoginContext } from './App';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

export default function Fundraiser() {
    const { actor } = useContext(LoginContext);
    const [fileTransferProgress, setFileTransferProgress] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [fundraiseData, setFundraiseData] = useState({
        title: '',
        goal: 0,
        category: '',
        location: '',
        description: '',
        goal: '',
        location: '',

    });

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        setErrorMessage();

        if (!file) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        if (await actor.check_file_exists(file.name)) {
            setErrorMessage(`File "${file.name}" already exists. Please choose a different file name.`);
            return;
        }
        setFileTransferProgress({
            mode: 'Uploading',
            fileName: file.name,
            progress: 0
        });

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = new Uint8Array(e.target.result);
            const chunkSize = 1024 * 1024; // 1 MB chunks
            const totalChunks = Math.ceil(content.length / chunkSize);

            try {
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, content.length);
                const chunk = content.slice(start, end);

                await actor.upload_file(file.name, chunk, BigInt(i), file.type);
                setFileTransferProgress((prev) => ({
                ...prev,
                progress: Math.floor(((i + 1) / totalChunks) * 100)
                }));
            }
            } catch (error) {
            console.error('Upload failed:', error);
            setErrorMessage(`Failed to upload ${file.name}: ${error.message}`);
            } finally {
            // await loadFiles();
            setFileTransferProgress(null);
            }
        };

        reader.readAsArrayBuffer(file);
    }

    async function onSubmit() {
        try {
            await actor.create_fundraise({
                campaign_title: fundraiseData.title,
                category: fundraiseData.category,
                description: fundraiseData.description,
                goal: fundraiseData.goal,
                location: fundraiseData.location
            });
            } catch (error) {
            console.error('Failed submit fundraise:', error);
            setErrorMessage('Failed submit fundraise. Please try again.');
        }
    }

    return (
        <main>
            <section className='flex flex-col px-8 py-16 mt-16 border-b-2 border-gray-200'>
                <h1 className='text-[4rem] font-medium text-center'>
                    Start Your Fundraiser
                </h1>
                <p className='mt-8 text-center'>Make a difference by creating a campaign for a cause you care about.</p>
            </section>

            <section className="px-8 py-16">
                <div className="mb-12">
                    <h2 className="mb-6 text-[1.5rem] font-medium">Fundraiser Details</h2>
                    <div className="flex flex-row gap-8 mb-4">
                        <div className="basis-1/2 grow flex flex-col">
                            <label for="name" className="mb-2 font-medium">Campaign Title</label>
                            <input onChange={(e) => setFundraiseData((state) => ({ ...state, title: e.target.value }))} type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                        </div>
                        <div className="basis-1/2 grow flex flex-col">
                            <label for="name" className="mb-2 font-medium">Fundraising Goal</label>
                            <input onChange={(e) => setFundraiseData((state) => ({ ...state, goal: parseInt(e.target.value, 10) }))} type="number" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                        </div>
                    </div>
                    <div className="flex flex-row gap-8">
                        <div className="basis-1/2 grow flex flex-col">
                            <label for="name" className="mb-2 font-medium">Category</label>
                            <input onChange={(e) => setFundraiseData((state) => ({ ...state, category: e.target.value }))} type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                            </div>
                        <div className="basis-1/2 grow flex flex-col">
                            <label for="name" className="mb-2 font-medium">Location</label>
                            <input onChange={(e) => setFundraiseData((state) => ({ ...state, location: e.target.value }))} type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                            </div>
                    </div>
                </div>
                <div className="flex flex-col mb-12">
                    <h2 className="mb-6 text-[1.5rem] font-medium">Add Media</h2>
                    <div className="relative">
                        <input onChange={handleFileUpload} type="file" name="name" id="name" className="absolute inset-0 p-4 rounded-2xl border-2 border-gray-300 border-dashed" multiple/>
                        <div className="flex flex-col justify-center h-64 text-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full my-4 h-16"
                                >
                                <path
                                    d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861V7.82831L16.2428 11.0711L17.657 9.65685L12.0001 4L6.34326 9.65685L7.75748 11.0711L11 7.82854V14.9861Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p>SVG, PNG, or JPG (max. 2 MB)</p>
                            {fileTransferProgress && (
                                <div className="mb-4">
                                <p className="mb-2 text-sm text-gray-600">
                                    {`${fileTransferProgress.mode} ${fileTransferProgress.fileName} ... ${fileTransferProgress.progress}%`}
                                </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mb-12">
                    <div className="mb-6">
                        <h2 className="text-[1.5rem] font-medium">Campaign Description</h2>
                        <p>Tell your story. Why is this cause important? Share the story behind it.</p>
                    </div>
                    <textarea onChange={(e) => setFundraiseData((state) => ({ ...state, description: e.target.value }))} name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300"></textarea>
                </div>
                <div className="flex flex-col mb-12">
                    <div className="mb-6">
                        <h2 className="text-[1.5rem] font-medium">Payment Information</h2>
                        <p>Where should the funds go?</p>
                    </div>
                    <div className="flex flex-col mb-2">
                        <label for="name" className="mb-2 font-medium">Your Bank Account Name</label>
                        <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                    </div>
                    <div className="flex flex-col">
                        <label for="name" className="mb-2 font-medium">Your Bank Account Number</label>
                        <input type="text" name="name" id="name" className="px-3 py-2 rounded-xl bg-gray-50 border-2 border-gray-300" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 mb-12 font-medium">
                    <div className="flex flex-row">
                        <input type="checkbox" id="name" name="name" className="w-6 h-6"/>
                        <label for="name" className="ml-4">I confirm that all information provided is accurate.</label>
                    </div>
                    <div className="flex flex-row">
                        <input type="checkbox" id="name" name="name" className="w-6 h-6"/>
                        <label for="name" className="ml-4">
                            I agree to the <a href="#" className="text-blue-800">Terms</a> and <a href="#" className="text-blue-800">Privacy Policy</a>
                        </label>
                    </div>
                </div>

                <button onClick={onSubmit} className="w-full py-3 text-[1.1rem] font-medium text-white bg-blue-800 rounded-full hover:opacity-75 transition-transform cursor-pointer">
                    Submit
                </button>
            </section>
        </main>
    );
}