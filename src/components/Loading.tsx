import styles from "./Loading.module.css";

export function Loading() {
  return (
    <div className={styles.loading}>
      <image href="https://liveblocks.io/loading.svg" />
    </div>
  );
}
