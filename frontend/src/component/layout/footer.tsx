import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
    <footer className='text-center flex flex-col gap-4'>
        <p>DBDLE -- {new Date().getFullYear()}</p>
        <Link href={"/privacy_policy"}>Privacy Policy</Link>
    </footer>
    );
};
export default Footer;