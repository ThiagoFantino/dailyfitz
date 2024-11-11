import React, { useState } from 'react';
import LoginScreen from '@/screens/LoginScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import { SafeAreaView } from 'react-native';

const SesionForm = () => {
  const [toLogin, setToLogin] = useState(true);

  const toggleForm = () => {
    setToLogin(!toLogin);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {toLogin ? (
        <LoginScreen onFormToggle={toggleForm} />
      ) : (
        <SignUpScreen onFormToggle={toggleForm} />
      )}
    </SafeAreaView>
  );
};

export default SesionForm;
