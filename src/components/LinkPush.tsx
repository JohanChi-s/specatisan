import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Button } from './ui/button';

interface LinkPushProps {
  href: ReactNode;
  className?: string;
}

const LinkPush: React.FC<LinkPushProps> = ({ href, className }) => {
  const router = useRouter();

  const pushToCurrentRoute = () => {
    router.push(router.pathname);
  };

  return (
    <Button variant="link" className={className} onClick={pushToCurrentRoute} />
  );
};

export default LinkPush;
