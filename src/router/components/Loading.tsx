interface ILoadingProps {}

const Loading: React.FC<Readonly<ILoadingProps>> = (props) => {
  console.log(props);

  return <div>Loading</div>;
};

export default Loading;
