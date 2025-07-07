import '../App/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../Home/Home'
// import Error from './Error'


import Header from '../../components/Header/Header';  
import Footer from '../../components/Footer/Footer';  


function App() {
    return (
        <BrowserRouter>
            <>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    {/* <Route path="/Book/:id" element={<Book />} /> */}
                    {/* <Route path="*" element={<Error />} /> */}
                </Routes>
                <Footer />
            </>
        </BrowserRouter>
    )
}

export default App
