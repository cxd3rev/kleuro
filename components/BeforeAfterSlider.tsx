import { useMemo, useRef, useState } from "react";
import {
  Image,
  PanResponder,
  View,
  type GestureResponderEvent,
} from "react-native";
import { AppText } from "./AppText";

type BeforeAfterSliderProps = {
  beforeUri: string;
  afterUri: string;
  aspectRatio: number;
};

export function BeforeAfterSlider({
  beforeUri,
  afterUri,
  aspectRatio,
}: BeforeAfterSliderProps) {
  const boxRef = useRef<View>(null);
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0.5);
  const height = width > 0 ? width / Math.max(aspectRatio, 0.6) : 220;

  const updateFromEvent = (event: GestureResponderEvent) => {
    boxRef.current?.measureInWindow((x, _y, measuredWidth) => {
      const next = (event.nativeEvent.pageX - x) / measuredWidth;
      setPosition(Math.min(1, Math.max(0, next)));
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: updateFromEvent,
        onPanResponderMove: updateFromEvent,
      }),
    [],
  );

  const clipWidth = Math.round(width * position);

  return (
    <View
      ref={boxRef}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      className="overflow-hidden rounded-3xl bg-kleuro-card"
      style={{ height }}
      {...panResponder.panHandlers}
    >
      {width > 0 ? (
        <>
          <Image
            source={{ uri: afterUri }}
            accessibilityLabel="Na"
            style={{ width, height, position: "absolute" }}
            resizeMode="cover"
          />
          <View
            collapsable={false}
            style={{
              width: clipWidth,
              height,
              overflow: "hidden",
              position: "absolute",
            }}
          >
            <Image
              source={{ uri: beforeUri }}
              accessibilityLabel="Voor"
              style={{ width, height }}
              resizeMode="cover"
            />
          </View>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: clipWidth - 1,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#FFFFFF",
            }}
          />
          <View
            pointerEvents="none"
            className="absolute items-center justify-center rounded-full bg-white"
            style={{
              left: clipWidth - 18,
              top: height / 2 - 18,
              width: 36,
              height: 36,
            }}
          >
            <AppText variant="bold" className="text-kleuro-dark">
              ↔
            </AppText>
          </View>
          <View className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1">
            <AppText variant="semibold" className="text-xs text-kleuro-dark">
              Voor
            </AppText>
          </View>
          <View className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1">
            <AppText variant="semibold" className="text-xs text-kleuro-dark">
              Na
            </AppText>
          </View>
        </>
      ) : null}
    </View>
  );
}
