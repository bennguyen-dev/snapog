'use client'

import {useState} from "react";

export default function Home() {
    const [url, setUrl] = useState<string>('');
    const [image, setImage] = useState<string>('');

    const handleSubmit = async () => {
        console.log('url 😋', {url}, '');

        const body = {
            url
        }

        const res = await fetch('/api/generate?url=' + url, {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const imageRes = await res?.json()

        console.log('imageRes 😋', {imageRes}, '');


        setImage(imageRes?.image)
    }

    console.log('image 😋', {image}, '');

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <div>
                    <label htmlFor="first_name"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
                    <input type="text" id="first_name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="John" required
                           value={url}
                           onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <button type="submit"
                        onClick={handleSubmit}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                </button>
            </div>

            {image &&
                <img className="h-auto max-w-full" src={image} alt="image description"/>
            }
        </main>
    );
}
