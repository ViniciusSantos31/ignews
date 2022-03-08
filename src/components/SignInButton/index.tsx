import { FaGithub } from "react-icons/fa";
import styles from "./styles.module.scss";

import { signIn, signOut, useSession } from "next-auth/react";

import { FiX } from "react-icons/fi";

export function SignInButton() {
  const { data } = useSession();

  return data ? (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {data.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
      Sign in with GitHub
    </button>
  );
}
