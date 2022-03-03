import { CustomLink } from '.';
import { render, screen } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';

describe('RequireAuth component', () => {
  test('should render a Link component', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CustomLink to="/">content</CustomLink>
      </MemoryRouter>
    );

    expect(screen.getByText(/content/)).toBeInTheDocument();
  });
});
