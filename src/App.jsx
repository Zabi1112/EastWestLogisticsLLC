import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Testimonials from './components/Testimonials.jsx'
// OUR CARRIERS: To restore, uncomment this import, the component below,
// and the Our Carriers link in Navbar.jsx. The sheet integration is preserved.
// import CarrierDirectory from './components/CarrierDirectory.jsx'
import CarrierPerformance from './components/CarrierPerformance.jsx'
import CarrierSignup from './components/CarrierSignup.jsx'
import SmsConsent from './components/SmsConsent.jsx'
import FAQ from './components/FAQ.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <CarrierPerformance />
      <About />
      <Services />
      <Testimonials />
      {/* OUR CARRIERS: Uncomment the component and import above to restore this section. */}
      {/* <CarrierDirectory /> */}
      <CarrierSignup />
      <SmsConsent />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}

export default App
