import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

export function CustomLink({ children, to, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={`${match ? 'text-cyan-400' : ''}`} to={to} {...props}>
      {children}
    </Link>
  );
}
