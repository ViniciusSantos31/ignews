import { SignInButton } from "../SignInButton";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";

export function Header() {
  const { asPath } = useRouter();

  const isHome = asPath === "/";

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="i.gnews" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
