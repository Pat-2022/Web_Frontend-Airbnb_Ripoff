import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const initialValue = {
//   var1: '',
//   var2: '',
  stateNavigate: useNavigate(),
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
