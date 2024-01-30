import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { AccountContext } from './app/AccountContext';
import { AppContainer } from './app/AppContainer';
import { GlobalStyles } from './app/GlobalStyles';
import { i18n } from './i18n/i18n';
import { ResponsiveApp } from './ui-components/ResponsiveApp';
import { ThemedApp } from './ui-components/ThemedApp';

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
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
      </I18nextProvider>
    </div>
  );
}

export default App;
