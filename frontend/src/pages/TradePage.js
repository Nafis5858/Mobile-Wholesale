import { Link } from 'react-router-dom';

const TradePage = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Trade Account Application</h1>
          <p>Apply for a wholesale trade account to unlock exclusive pricing and bulk benefits.</p>
        </div>
      </header>
      <div className="hero-card">
        <h2>Why register as a trade buyer?</h2>
        <ul>
          <li>Access wholesale pricing across the entire product catalog.</li>
          <li>Get fast dispatch and dedicated trade support.</li>
          <li>Enjoy higher stock visibility and better order terms.</li>
        </ul>
        <p className="trade-note">
          If you already have an account, please <Link to="/login">log in</Link>. Otherwise, create a new trade account now.
        </p>
        <Link className="button" to="/register">Apply for Trade</Link>
      </div>
    </div>
  );
};

export default TradePage;
