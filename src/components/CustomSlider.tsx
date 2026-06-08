import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';

interface Props {
  minimumValue: number;
  maximumValue: number;
  step?: number;
  value: number;
  onValueChange?: (value: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

const THUMB_SIZE = 28;
const THUMB_HALF = THUMB_SIZE / 2;
const TRACK_HEIGHT = 8;
const GRAB_RADIUS = 36;
const DRAG_SCALE = 1.8;
const ARROW_SIZE = 36;

export function CustomSlider({
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  value,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  minimumTrackTintColor = '#FF6B00',
  maximumTrackTintColor = '#333',
  thumbTintColor = '#FF6B00',
}: Props) {
  const trackWidth = useRef(0);
  const containerWidthRef = useRef(0);
  const dragStartValue = useRef(value);
  const latestValue = useRef(value);
  const [dragging, setDragging] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const grabbedThumb = useRef(false);

  const propsRef = useRef({ minimumValue, maximumValue, step, value, onValueChange, onSlidingStart, onSlidingComplete });
  propsRef.current = { minimumValue, maximumValue, step, value, onValueChange, onSlidingStart, onSlidingComplete };

  const clamp = (v: number, min: number, max: number, s: number) => {
    let clamped = Math.max(min, Math.min(max, v));
    if (s > 0) {
      clamped = Math.round((clamped - min) / s) * s + min;
      clamped = Math.max(min, Math.min(max, clamped));
    }
    return Math.round(clamped * 1000) / 1000;
  };

  const handleStepDown = useCallback(() => {
    const newVal = clamp(value - step, minimumValue, maximumValue, step);
    if (newVal !== value) {
      onValueChange?.(newVal);
      onSlidingComplete?.(newVal);
    }
  }, [value, step, minimumValue, maximumValue, onValueChange, onSlidingComplete]);

  const handleStepUp = useCallback(() => {
    const newVal = clamp(value + step, minimumValue, maximumValue, step);
    if (newVal !== value) {
      onValueChange?.(newVal);
      onSlidingComplete?.(newVal);
    }
  }, [value, step, minimumValue, maximumValue, onValueChange, onSlidingComplete]);

  const handleLayout = useCallback((e: any) => {
    const w = e.nativeEvent.layout.width;
    containerWidthRef.current = w;
    trackWidth.current = w - THUMB_SIZE;
    setLayoutWidth(w);
  }, []);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,

    onPanResponderGrant: (evt) => {
      const { minimumValue: min, maximumValue: max, step: s, value: curVal, onValueChange: ovc, onSlidingStart: oss } = propsRef.current;
      const range = max - min;
      const usableW = trackWidth.current || 1;

      const thumbRatio = range > 0 ? (curVal - min) / range : 0;
      const thumbX = THUMB_HALF + thumbRatio * usableW;
      const touchX = evt.nativeEvent.locationX;

      oss?.();
      setDragging(true);

      // Always start from current value — never jump to touch position.
      // Android locationX is unreliable in PanResponder (can report 0 or
      // coordinates relative to a child view), causing jumps to 0.
      grabbedThumb.current = true;
      dragStartValue.current = curVal;
      latestValue.current = curVal;
    },

    onPanResponderMove: (_evt, gestureState) => {
      if (!grabbedThumb.current) return;
      const { minimumValue: min, maximumValue: max, step: s, onValueChange: ovc } = propsRef.current;
      const range = max - min;
      const usableW = trackWidth.current || 1;
      const deltaRatio = (gestureState.dx / DRAG_SCALE) / usableW;
      const startRatio = range > 0 ? (dragStartValue.current - min) / range : 0;
      const newRatio = Math.max(0, Math.min(1, startRatio + deltaRatio));
      const newVal = clamp(min + newRatio * range, min, max, s);
      if (newVal !== latestValue.current) {
        latestValue.current = newVal;
        ovc?.(newVal);
      }
    },

    onPanResponderRelease: () => {
      setDragging(false);
      grabbedThumb.current = false;
      propsRef.current.onSlidingComplete?.(latestValue.current);
    },

    onPanResponderTerminate: () => {
      setDragging(false);
      grabbedThumb.current = false;
      propsRef.current.onSlidingComplete?.(latestValue.current);
    },
  }), []);

  const range = maximumValue - minimumValue;
  const ratio = range > 0 ? (value - minimumValue) / range : 0;
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  // Pixel-based thumb position: stays within container bounds
  const usableTrackWidth = Math.max(0, layoutWidth - THUMB_SIZE);
  const thumbLeft = THUMB_HALF + clampedRatio * usableTrackWidth;
  // Track fill width as fraction of the track area (inside padding)
  const trackFillPercent = clampedRatio * 100;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={handleStepDown}
        style={[styles.arrowButton, { borderColor: thumbTintColor }]}
        activeOpacity={0.6}
        disabled={value <= minimumValue}
      >
        <Text style={[styles.arrowText, { color: thumbTintColor, opacity: value <= minimumValue ? 0.3 : 1 }]}>&#9664;</Text>
      </TouchableOpacity>

      <View
        style={styles.sliderContainer}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        {/* Track is inset by THUMB_HALF so endpoints align with thumb center */}
        <View style={styles.trackPadding}>
          <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
            <View
              style={[
                styles.trackFill,
                { width: `${trackFillPercent}%`, backgroundColor: minimumTrackTintColor },
              ]}
            />
          </View>
        </View>
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbTintColor,
              left: thumbLeft,
              transform: [{ scale: dragging ? 1.2 : 1 }],
            },
          ]}
        />
      </View>

      <TouchableOpacity
        onPress={handleStepUp}
        style={[styles.arrowButton, { borderColor: thumbTintColor }]}
        activeOpacity={0.6}
        disabled={value >= maximumValue}
      >
        <Text style={[styles.arrowText, { color: thumbTintColor, opacity: value >= maximumValue ? 0.3 : 1 }]}>&#9654;</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowButton: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  trackPadding: {
    paddingHorizontal: THUMB_HALF,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_HALF,
    marginLeft: -THUMB_HALF,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
