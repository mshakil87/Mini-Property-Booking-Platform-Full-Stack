import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Properties from './pages/Properties'
import Availability from './pages/Availability'
import Bookings from './pages/Bookings'
import PropertyMedia from './pages/PropertyMedia'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import DefaultLayout from './components/DefaultLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<DefaultLayout />}>
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/add" element={<AddProperty />} />
        <Route path="/properties/edit/:id" element={<EditProperty />} />
        <Route path="/properties/:id/availability" element={<Availability />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/properties/:id/media" element={<PropertyMedia />} />
      </Route>
    </Routes>
  )
}
