import '@xyflow/react/dist/style.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Root } from '@/app/Root';
import { App } from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Root>
        <App />
      </Root>
    </BrowserRouter>
  </StrictMode>,
);
