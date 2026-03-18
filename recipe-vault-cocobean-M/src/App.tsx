import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ViewRecipe from './pages/ViewRecipe';
import ImportRecipe from './pages/ImportRecipe';
import Suggestions from './pages/Suggestions';

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/import" element={<ImportRecipe />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/recipe/:id" element={<ViewRecipe />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}
