import styles from './styles/Index.module.less';

const Exhibit = () => {
  return <section className={styles.exhibit}></section>;
};

const Index = () => {
  return (
    <main className={styles.main}>
      <Exhibit />
    </main>
  );
};

export default Index;
