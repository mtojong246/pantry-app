import './App.scss';
import { Routes, Route } from 'react-router';
import Title from './routes/Title/title.component';
import Login from './routes/Login/login.component';
import Register from './routes/Register/register.component';
import Navigation from './routes/Navigation/navigation.component';
import Home from './routes/Home/home.component';
import RecipesRouter from './routes/RecipesRouter/recipes-router.component';
import GroceryList from './routes/GroceryList/grocery-list.component';
import FoodLog from './routes/FoodLog/food-log.component';
import Favorites from './routes/Favorites/favorites.component';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Title/>} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} /> 
      <Route path='profile/*' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='recipes/*' element={<RecipesRouter />} />
        <Route path='grocery-list' element={<GroceryList />} />
        <Route path='food-log' element={<FoodLog />} />
        <Route path='favorites' element={<Favorites />} />
      </Route>
    </Routes>
  );
}

export default App;
