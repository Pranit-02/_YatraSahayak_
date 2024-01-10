import './home.css'

function HomePage() {
  return (
    <>
   
    <section className='main-section'>
      <div className='text-content'>
          <h1 id='home-head'>
            Unleash Your Next Adventure: Your AI-Powered Itinerary Generator for 
            <span id='home-span'> Seamless Travel Experiences!</span>
          </h1>
         
          <p id='home-para'>YatraSahayak: Crafting Memorable Journeys Tailored to Your Desires and Budget</p>
          <a href="/plan" className='btn'>Get Started ➝</a>
      </div>

      <div className='demo-img-div'>
        <img className='demo-img' src="" alt="" />
      </div>
    </section>
    </>
  )
}

export default HomePage;