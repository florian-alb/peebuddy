import styles from "./page.module.css";
import { prisma } from "@repo/db";

export default async function Home() {
  const user = await prisma.user.findFirst();
  return (
    <div className={styles.page}>{user?.email ?? "No user added yet"}</div>
  );
}
