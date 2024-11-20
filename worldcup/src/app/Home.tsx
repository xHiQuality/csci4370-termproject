"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Home.module.css';
import Signup from './components/Signup';

type User = {
id: number;
name: string;
username: string;
imageUrl?: string;
email: string;
password: string;
};

const USERS_INIT: User[] = [
{
    id: 1,
    name: 'World Cup Queries',
    username: 'worldcup',
    email: 'contact@worldcup.com',
    password: 'password',
    imageUrl: '/images/logo.png',
},
];

export default function Home() {
const [users, setUsers] = useState<User[]>(USERS_INIT);
const router = useRouter();

const addUserHandler = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    router.push('/dashboard');
};

return (
    <div className={styles.container}>
    <div className={styles.logoContainer}>
        <img
        src="/images/logo.png"
        alt="Logo"
        className={styles.logo}
        />
    </div>

    <h1 className={`pixelated-text ${styles.title}`}>World Cup Queries</h1>
    <Signup onAddUser={addUserHandler} />

    </div>
);
}
