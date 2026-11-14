import NotFoundPanel from '../components/NotFoundPanel';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <NotFoundPanel
      title="Page not found"
      message="We couldn't find the page you were looking for."
      to="/"
      linkLabel="Go home"
    />
  );
}
