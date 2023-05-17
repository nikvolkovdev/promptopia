'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from "react";
import {signIn, signOut, useSession, getProviders} from 'next-auth/react';

const Nav = () => {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            await setProviders(response);
        }
        setUpProviders();
    }, [])

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    width="30"
                    height="30"
                    src="/assets/images/logo.svg"
                    alt="Promptopia logo"
                    className="object-contain"
                />
                <p className="logo_text">Promptopia</p>
            </Link>
            <div className="sm:flex hidden">
                {session?.user
                    ? (
                        <div className="flex gap-3 md:gap-5">
                            <Link href={"/create-prompt"} className="black_btn">
                                Create Post
                            </Link>
                            <button type="button" onClick={signOut} className="outline_btn">
                                Sign Out
                            </button>

                            <Link href={"/profile"}>
                                <Image alt="profile" src={session?.user.image} width={37} height={37} className="rounded-full"/>
                            </Link>
                        </div>
                    )
                    : (<>{providers && Object.values(providers).map(provider => {
                            return (
                                <button
                                    type="button"
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className="black_btn"
                                >
                                    Sign In
                                </button>
                            )
                        })}</>
                    )}
            </div>


            {/*Mobile view*/}
            <div className="sm:hidden flex relative">
                {session?.user ? (
                    <div className="flex">
                        <Image
                            width="30"
                            height="30"
                            src={session?.user.image}
                            alt="Promptopia logo"
                            className="object-contain"
                            onClick={() => setToggleDropdown(prevState => !prevState)}
                        />
                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link
                                    href="/profile"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    href="/create-prompt"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    Create Prompt
                                </Link>
                                <button
                                    type="button"
                                    className="mt-5 w-full black_btn"
                                    onClick={() => {
                                        setToggleDropdown(false);
                                        signOut();
                                    }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ): (<>{providers && Object.values(providers).map(provider => {
                    return (
                        <button
                            type="button"
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="black_btn"
                        >
                            Sign In
                        </button>
                    )
                })}</>)
                }
            </div>
        </nav>
    );
};

export default Nav;