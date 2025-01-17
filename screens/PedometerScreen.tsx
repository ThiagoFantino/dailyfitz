import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = () => {
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    // Start listening to step count changes
    const subscription = Pedometer.watchStepCount(result => {
      setStepCount(result.steps);
    });

    // Clean up the subscription when the component is unmounted
    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>Pedometer Steps: {stepCount}</Text>
    </View>
  );
};

export default PedometerScreen;
