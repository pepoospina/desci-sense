import { BrowserRouter } from 'react-router-dom';

import './App.css';
import { AppContainer } from './app/AppContainer';
import { GlobalStyles } from './app/GlobalStyles';
import { ResponsiveApp } from './app/ResponsiveApp';
import { ThemedApp } from './app/ThemedApp';

function App() {
  return (
    <div className="App">
      <GlobalStyles />
      <ThemedApp>
        <ResponsiveApp>
          <BrowserRouter>
            <AppContainer></AppContainer>
          </BrowserRouter>
        </ResponsiveApp>
      </ThemedApp>
    </div>
  );
}

export default App;
