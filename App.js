import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

const BreathingPhase = {
  INHALE: 'inhale',
  HOLD: 'hold',
  EXHALE: 'exhale',
  REST: 'rest',
};

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(BreathingPhase.INHALE);
  const [cycleCount, setCycleCount] = useState(0);
  
  const scaleValue = useState(new Animated.Value(1))[0];
  const opacityValue = useState(new Animated.Value(0.6))[0];

  const durations = {
    [BreathingPhase.INHALE]: 4,
    [BreathingPhase.HOLD]: 4,
    [BreathingPhase.EXHALE]: 4,
    [BreathingPhase.REST]: 2,
  };

  const getPhaseText = () => {
    switch (phase) {
      case BreathingPhase.INHALE:
        return 'Inhale';
      case BreathingPhase.HOLD:
        return 'Hold';
      case BreathingPhase.EXHALE:
        return 'Exhale';
      case BreathingPhase.REST:
        return 'Rest';
      default:
        return '';
    }
  };

  const animateBreathing = () => {
    const animations = {
      [BreathingPhase.INHALE]: () => {
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: durations[BreathingPhase.INHALE] * 1000,
          useNativeDriver: true,
        }).start();
      },
      [BreathingPhase.HOLD]: () => {
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: durations[BreathingPhase.HOLD] * 1000,
          useNativeDriver: true,
        }).start();
      },
      [BreathingPhase.EXHALE]: () => {
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: durations[BreathingPhase.EXHALE] * 1000,
          useNativeDriver: true,
        }).start();
      },
      [BreathingPhase.REST]: () => {
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: durations[BreathingPhase.REST] * 1000,
          useNativeDriver: true,
        }).start();
      },
    };

    animations[phase]();
  };

  useEffect(() => {
    let timeoutId;

    if (isActive) {
      animateBreathing();

      timeoutId = setTimeout(() => {
        switch (phase) {
          case BreathingPhase.INHALE:
            setPhase(BreathingPhase.HOLD);
            break;
          case BreathingPhase.HOLD:
            setPhase(BreathingPhase.EXHALE);
            break;
          case BreathingPhase.EXHALE:
            setPhase(BreathingPhase.REST);
            break;
          case BreathingPhase.REST:
            setPhase(BreathingPhase.INHALE);
            setCycleCount(prev => prev + 1);
            break;
        }
      }, durations[phase] * 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [isActive, phase]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase(BreathingPhase.INHALE);
    setCycleCount(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase(BreathingPhase.INHALE);
    scaleValue.setValue(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Breathing App</Text>
        <Text style={styles.cycleText}>Cycles: {cycleCount}</Text>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            },
          ]}
        />
        <Text style={styles.phaseText}>{getPhaseText()}</Text>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Inhale: 4s | Hold: 4s | Exhale: 4s | Rest: 2s
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startBreathing}>
            <Text style={styles.buttonText}>Start Breathing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopBreathing}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cycleText: {
    fontSize: 18,
    color: '#a5d8ff',
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: '#4a6fa5',
    position: 'absolute',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 100,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#b8b8b8',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});