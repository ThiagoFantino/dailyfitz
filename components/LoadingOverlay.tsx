import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const loadingAnimation = function(){
  return (
      <View style={styles.overlay}>
        <View>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      </View>
    )
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:10,
  }
});

export default loadingAnimation;
