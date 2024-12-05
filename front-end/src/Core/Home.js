import React from "react";
import backjpg from "../assest/back.jpg";
import Explorer from "../Allposts/Explorer";
const Home = () => {
  return (
  <>      
 <div className="hero-section position-relative h-60">
  <img src={backjpg} alt="Hero Image" className="w-100 object-cover" style={{ height: '450px' }} />
  <div className="hero-overlay position-absolute top-50 start-50 translate-middle text-center">
    <h1 className="text-white fw-bold">Change your social presence.</h1>
    <p className="text-white">For who thoroughly her boy estimating conviction.</p>
    <input type="text" className="form-control w-50 mx-auto" placeholder="Search..." />
  </div>
</div>
 <div className="container mt-4">
 <div className="row">   
 <Explorer  />
 </div>
</div>
  </>
  );
};

export default Home;

