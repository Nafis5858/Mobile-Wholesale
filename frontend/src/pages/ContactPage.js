const ContactPage = ({ contactInfo }) => {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Contact Information</h1>
          <p>Reach us for wholesale ordering and support.</p>
        </div>
      </header>
      <div className="hero-card">
        <p><strong>Email:</strong> {contactInfo.email}</p>
        <p><strong>Phone:</strong> {contactInfo.phone}</p>
        <p><strong>Address:</strong> {contactInfo.address}</p>
      </div>
    </div>
  );
};

export default ContactPage;
