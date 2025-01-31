import {RouterProvider} from 'react-router-dom';
import {ThemeProvider} from '@context';
import Navigation from '@navigation';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={Navigation} />
    </ThemeProvider>
  );
}

export default App;
