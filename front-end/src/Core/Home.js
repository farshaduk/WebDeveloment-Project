import React from "react";
import backjpg from "../assest/back.jpg";

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
   <div className="col-md-4 mb-4">
     <div className="card shadow-sm">
       <img src="https://via.placeholder.com/350x200" className="card-img-top" alt="Post Image" />
       <div className="card-body">
         <p className="card-text">Speedily say has suitable disposal add boy. On forth doubt miles of child.</p>
         <div className="d-flex justify-content-between text-muted">
           <span><i className="fas fa-thumbs-up"></i> 56</span>
           <span><i className="fas fa-comment"></i> 12</span>
           <span><i className="fas fa-share"></i> 3</span>
         </div>
       </div>
     </div>
   </div>  
   <div className="col-md-4 mb-4">
     <div className="card shadow-sm">
       <img src="https://via.placeholder.com/350x200" className="card-img-top" alt="Post Image" />
       <div className="card-body">
         <p className="card-text">Exercise joy man children rejoiced. Yet uncommonly his ten who.</p>
         <div className="d-flex justify-content-between text-muted">
           <span><i className="fas fa-thumbs-up"></i> 102</span>
           <span><i className="fas fa-comment"></i> 65</span>
           <span><i className="fas fa-share"></i> 40</span>
         </div>
       </div>
     </div>
   </div>
 </div>
</div>
  </>

  
  );
};

export default Home;

