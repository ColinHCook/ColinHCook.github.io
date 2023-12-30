import React, { useState } from "react";
import "./AboutUs.css";
import CEOImage from "../assets/images/CEO.png";

const teamMembers = [
  {
    name: "Colin Cook",
    position: "CEO",
    bio: "[Name] excels in [Role], combining industry expertise with a dynamic approach to drive success and innovation at our company.",
    image: "path-to-image",
  },
  {
    name: "Jane Doe",
    position: "CFO",
    bio: "[Name] excels in [Role], combining industry expertise with a dynamic approach to drive success and innovation at our company.",
    image: "path-to-image",
  },
  {
    name: "Bob Smith",
    position: "CTO",
    bio: "[Name] excels in [Role], combining industry expertise with a dynamic approach to drive success and innovation at our company.",
    image: "path-to-image",
  },
  {
    name: "Joe Swanson",
    position: "Sales Rep",
    bio: "[Name] excels in [Role], combining industry expertise with a dynamic approach to drive success and innovation at our company.",
    image: "path-to-image",
  },
];

const testimonials = [
  "This company transformed our business, and we cannot thank them enough!",
  "A truly exceptional experience from start to finish. Highly recommended!",
  "Their attention to detail is unmatched. Absolutely delighted with the outcome!",
  "Professional, creative, and punctual. Went above and beyond our expectations!",
];

const AboutUs = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="about-us">
      {/* Meet the Team Section */}
      <section className="meet-the-team">
        <h2>Meet Our Team</h2>
        <div className="team-members-container">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <img src={CEOImage} alt={`${member.name}`} />
              <h3>{member.name}</h3>
              <p>{member.position}</p>
              <p>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="our-mission">
        <h2>Our Mission</h2>
        <p>
          At [Company Name], our mission is to lead the industry by setting the
          standard for excellence in [Primary Field or Service]. We are
          dedicated to innovating and delivering high-quality products and
          services that exceed our customers' expectations. Through our
          commitment to research, sustainability, and ethical practices, we aim
          to not only meet the present demands but also anticipate future
          challenges and opportunities. We foster a culture of growth,
          diversity, and collaboration, ensuring that our team is empowered to
          contribute and thrive. Our goal is to create lasting relationships
          with our clients and partners, drive meaningful change, and make a
          significant, positive difference in the communities we serve.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-container">
          <button className="testimonial-nav" onClick={prevTestimonial}>
            &#10094;
          </button>
          <blockquote className="testimonial">
            "{testimonials[currentTestimonial]}"
          </blockquote>
          <button className="testimonial-nav" onClick={nextTestimonial}>
            &#10095;
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
