import { useState } from 'react';

function DepositForm({ goals, makeDeposit, formatCurrency }) {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [amount, setAmount] = useState('');

  // Handle form submission for deposit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGoalId) {
      alert('Please select a goal to deposit to.');
      return;
    }
    const depositAmount = Number(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Call the makeDeposit function passed from App.jsx
    makeDeposit(selectedGoalId, depositAmount);
    
    // Reset form fields after deposit
    setSelectedGoalId('');
    setAmount('');
  };

  return (
    <div className="form-container">
      <h2>Make a Deposit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goalSelect">Select Goal:</label>
          <select
            id="goalSelect"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            required
          >
            <option value="">-- Choose a Goal --</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.name} ({formatCurrency(goal.targetAmount - goal.savedAmount)} remaining)
              </option>
            ))}
          </select>
          {goals.length === 0 && <p>No active goals to deposit to.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="depositAmount">Deposit Amount (KES):</label>
          <input
            type="number"
            id="depositAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            min="0"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit">Deposit Now</button>
        </div>
      </form>
    </div>
  );
}

export default DepositForm;
