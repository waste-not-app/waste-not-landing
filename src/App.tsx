import './styles/global.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import DownloadSection from './components/DownloadSection'
import ScreenshotSection from './components/ScreenshotSection'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DownloadSection />
        <ScreenshotSection />
      </main>
      <Footer />
    </>
  )
}

export default App
