import { CustomLink } from './CustomLink';
import { Search } from './Search';

export function MobileNav() {
  return (
    <div className="fixed bottom-0 w-full sm:hidden flex items-center font-semibold text-lg bg-black opacity-90 px-4 pt-2 pb-6">
      <div className="text-center flex-1">
        <CustomLink to="/">Home</CustomLink>
      </div>
      <Search />
      <div className="text-center flex-1">
        <CustomLink to="/library">Library</CustomLink>
      </div>
    </div>
  );
}
