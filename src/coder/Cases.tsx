import { Link } from '@/router';

import { useExamples } from './hooks/useExamples';

const Cases = () => {
  const examples = useExamples();

  return (
    <div>
      {examples.map((example) => (
        <div key={example.fullPath}>
          <Link to={example.fullPath}>{example.meta?.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Cases;
