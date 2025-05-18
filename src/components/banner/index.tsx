import { View, Pressable, Image, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { useTheme } from "../context/ThemeContext";
import { useRef, useEffect, useState } from "react";

export function Banner() {
  const { theme } = useTheme();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const bannersCount = 2; // número total de banners

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % bannersCount;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    }, 4000); // troca a cada 4 segundos

    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <View style={[styles.bannerContainer, { backgroundColor: theme.background }]}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        pageMargin={14}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <Pressable style={styles.bannerItem} onPress={() => console.log("Clicou no Banner 1")}>
          <Image
            source={require("../../assets/Designer11.png")}
            style={styles.bannerImage}
            resizeMode="stretch"
          />
        </Pressable>

        <Pressable style={styles.bannerItem} onPress={() => console.log("Clicou no Banner 2")}>
          <Image
            source={require("../../assets/Designer10.png")}
            style={styles.bannerImage}
            resizeMode="stretch"
          />
        </Pressable>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    marginTop: 60,
    borderRadius: 20,
    padding: 10,
  },
  bannerItem: {
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "80%",
    borderRadius: 20,
  },
});
