import React from 'react';

function Overview({ goals }) {
  return (
    <div>
      <h2>Overview</h2>
      <p>Total goals: {goals.length}</p>
    </div>
  );
}

export default Overview;