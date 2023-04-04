import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { PantryProvider } from './contexts/pantry-context';
import { RecipeProvider } from './contexts/recipe-context';
import { NutritionProvider } from './contexts/nutrition-context';
import { GroceryProvider } from './contexts/grocery-context';
import { UserProvider } from './contexts/user-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter base="/">
      <UserProvider>
        <PantryProvider>
          <RecipeProvider>
            <GroceryProvider>
              <NutritionProvider>
                <App />
              </NutritionProvider>
            </GroceryProvider>
          </RecipeProvider>
        </PantryProvider>
      </UserProvider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
