'use client'

import styles from "./page.module.css";
import { authClient } from "@repo/auth";
 
const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}

export default function Home() {
    return (
        <div className={styles.page}>
            <button onClick={signIn}>Sign in</button>
        </div>
    )
}
