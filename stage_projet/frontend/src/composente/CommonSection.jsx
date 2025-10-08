import React from 'react';
import '../style/CommonSection.css';

const CommonSection = (props) => {
  return (
    <section className="common__section">
      <div className="container">
        <h2>{props.title}</h2>
      </div>
    </section>
  );
};

export default CommonSection;
