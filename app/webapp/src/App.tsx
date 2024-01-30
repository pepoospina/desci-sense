import { BrowserRouter } from 'react-router-dom';

import { AccountContext } from './app/AccountContext';
import { AppContainer } from './app/AppContainer';
import { GlobalStyles } from './app/GlobalStyles';
import { ResponsiveApp } from './ui-components/ResponsiveApp';
import { ThemedApp } from './ui-components/ThemedApp';

function App() {
  return (
    <div className="App">
      <AccountContext>
        <GlobalStyles />
        <ThemedApp>
          <ResponsiveApp>
            <BrowserRouter>
              <AppContainer></AppContainer>
            </BrowserRouter>
          </ResponsiveApp>
        </ThemedApp>
      </AccountContext>
    </div>
  );
}

export default App;
