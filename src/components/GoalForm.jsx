import { useState, useEffect } from 'react';

function GoalForm({ addGoal, updateGoal, selectedGoal, onCancel }) {
  // Initialize form state based on whether a goal is being edited or a new one is being added
  const [goal, setGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: ''
  });

  // Use effect to populate the form when a goal is selected for editing
  useEffect(() => {
    if (selectedGoal) {
      setGoal(selectedGoal);
    } else {
      // Reset form if no goal is selected (for adding a new goal)
      setGoal({
        name: '',
        targetAmount: '',
        category: '',
        deadline: ''
      });
    }
  }, [selectedGoal]); // Re-run this effect when selectedGoal changes

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prevGoal => ({
      ...prevGoal,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!goal.name || !goal.targetAmount || !goal.category || !goal.deadline) {
      alert('Please fill in all goal details!'); // Simple alert for missing fields
      return;
    }
    if (Number(goal.targetAmount) <= 0) {
      alert('Target amount must be a positive number.');
      return;
    }

    // Determine whether to add or update based on selectedGoal
    if (selectedGoal) {
      updateGoal(goal); // Call update function if editing
    } else {
      addGoal(goal); // Call add function if creating new
    }
    // After submission, clear the form and optionally navigate away
    setGoal({ name: '', targetAmount: '', category: '', deadline: '' });
    onCancel(); // Use onCancel to switch back to the goals list or overview
  };

  return (
    <div className="form-container">
      <h2>{selectedGoal ? 'Edit Your Goal' : 'Add a New Goal'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Goal Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={goal.name}
            onChange={handleChange}
            placeholder="e.g., Dream Vacation"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount (KES):</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            placeholder="e.g., 50000"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={goal.category}
            onChange={handleChange}
            placeholder="e.g., Travel, Education"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={goal.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit">
            {selectedGoal ? 'Update Goal' : 'Add Goal'}
          </button>
          <button type="button" className="cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalForm;
