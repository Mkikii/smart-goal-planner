import { useState, useEffect } from 'react';
import GoalList from './components/GoalList.jsx';
import GoalForm from './components/GoalForm.jsx';
import DepositForm from './components/DepositForm.jsx';
import Overview from './components/Overview.jsx';
import './styles/App.css'; // Import the main CSS file

function App() {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null); // Used for editing a specific goal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // Controls which section is visible
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages

  // Effect to fetch initial goal data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/goals'); // Using port 3001
        if (!response.ok) {
          // Throw an error if the network response is not successful
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setGoals(data); // Update goals state with fetched data
      } catch (error) {
        console.error('Error fetching goals:', error);
        setError('Failed to load goals. Please ensure json-server is running on port 3001.');
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  // Utility function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { // Using Kenyan Shilling format
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0 // No decimal places for simplicity
    }).format(amount);
  };

  // Function to add a new goal to the database and update state
  const addGoal = async (newGoal) => {
    try {
      const response = await fetch('http://localhost:3001/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          savedAmount: 0, // New goals start with 0 saved
          createdAt: new Date().toISOString() // Record creation timestamp
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }
      const data = await response.json();
      setGoals([...goals, data]); // Add the new goal to the existing goals array
      setSuccessMessage('Goal added successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error adding goal:', error);
      setError('Failed to add goal.'); // Set error message
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    }
  };

  // Function to update an existing goal in the database and state
  const updateGoal = async (updatedGoal) => {
    try {
      const response = await fetch(`http://localhost:3001/goals/${updatedGoal.id}`, {
        method: 'PUT', // PUT replaces the entire resource
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }
      const data = await response.json();
      // Map through goals and replace the updated one
      setGoals(goals.map(goal => goal.id === data.id ? data : goal));
      setSelectedGoal(null); // Clear selected goal after update
      setSuccessMessage('Goal updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to delete a goal from the database and state
  const deleteGoal = async (id) => {
    // Basic confirmation before deletion
    if (!window.confirm('Are you sure you want to delete this goal? This cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/goals/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }
      setGoals(goals.filter(goal => goal.id !== id)); // Remove deleted goal from state
      setSuccessMessage('Goal deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError('Failed to delete goal.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to make a deposit to a specific goal
  const makeDeposit = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) {
        throw new Error('Goal not found for deposit.');
      }
      const updatedAmount = Number(goal.savedAmount) + Number(amount);
      
      const response = await fetch(`http://localhost:3001/goals/${goalId}`, {
        method: 'PATCH', // PATCH is used for partial updates (only savedAmount)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedAmount: updatedAmount })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }
      const data = await response.json();
      setGoals(goals.map(goal => goal.id === data.id ? data : goal)); // Update the goal in state
      setSuccessMessage(`Deposit of ${formatCurrency(amount)} successful!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error making deposit:', error);
      setError('Failed to make deposit.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to clear all messages (success and error)
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div className="loading">Loading your goals... just a moment!</div>;
  }

  // Display error message if fetching fails
  if (error && !isLoading) { // Only show persistent error if not loading
    return <div className="error-page">Oops! Something went wrong: {error}. Please try again later.</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>My Goal Tracker</h1>
        <nav className="tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => { setActiveTab('overview'); clearMessages(); }}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'goals' ? 'active' : ''}
            onClick={() => { setActiveTab('goals'); clearMessages(); }}
          >
            My Goals
          </button>
          <button 
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => { setActiveTab('add'); clearMessages(); setSelectedGoal(null); }} // Clear selectedGoal when going to Add tab
          >
            {selectedGoal ? 'Edit Goal' : 'Add Goal'} {/* Dynamic button text */}
          </button>
          <button 
            className={activeTab === 'deposit' ? 'active' : ''}
            onClick={() => { setActiveTab('deposit'); clearMessages(); }}
          >
            Make Deposit
          </button>
        </nav>
      </header>

      <main className="app-main">
        {/* Display success and error messages */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && !isLoading && <div className="error-message">{error}</div>} {/* Show error only if not loading */}

        {/* Conditionally render content based on activeTab state */}
        {activeTab === 'overview' && (
          <Overview 
            goals={goals} 
            formatCurrency={formatCurrency} 
          />
        )}

        {activeTab === 'goals' && (
          <GoalList 
            goals={goals}
            deleteGoal={deleteGoal}
            setSelectedGoal={(goal) => { // Function to set goal for editing and switch tab
              setSelectedGoal(goal);
              setActiveTab('add');
              clearMessages();
            }}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'add' && (
          <GoalForm 
            addGoal={addGoal}
            updateGoal={updateGoal}
            selectedGoal={selectedGoal}
            onCancel={() => { // Callback for cancel button in GoalForm
              setSelectedGoal(null); // Clear selected goal
              setActiveTab('goals'); // Switch back to goals list
              clearMessages();
            }}
          />
        )}

        {activeTab === 'deposit' && (
          <DepositForm 
            // Filter goals to only show those not yet completed for deposits
            goals={goals.filter(g => g.savedAmount < g.targetAmount)}
            makeDeposit={makeDeposit}
            formatCurrency={formatCurrency}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Your Progress So Far: Total Goals: {goals.length} | Total Saved: {formatCurrency(
          goals.reduce((sum, goal) => sum + Number(goal.savedAmount), 0)
        )}</p>
      </footer>
    </div>
  );
}

export default App;
