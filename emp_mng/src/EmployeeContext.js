import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { employeeAPI } from '../services/api';

const EmployeeContext = createContext();

const employeeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload, loading: false };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        )
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const EmployeeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, {
    employees: [],
    loading: true,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      dispatch({ type: 'SET_EMPLOYEES', payload: response.data });
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const addEmployee = async (employee) => {
    try {
      const response = await employeeAPI.create(employee);
      dispatch({ type: 'ADD_EMPLOYEE', payload: response.data });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // Add other CRUD operations...

  return (
    <EmployeeContext.Provider value={{
      ...state,
      addEmployee,
      // ... other methods
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeeContext);