import { View, Pressable, Image, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

export function Banner() {
    return (
        <View style={styles.bannerContainer}>
            <PagerView style={{ flex: 1 }} initialPage={0} pageMargin={14}>
                {/* Banner 1 */}
                <Pressable style={styles.bannerItem} onPress={() => console.log("Clicou no Banner 1")}>
                    <Image
                        source={require("../../assets/Designer11.png")}
                        style={styles.bannerImage}
                        resizeMode="stretch"
                    />
                </Pressable>

                {/* Banner 2 */}
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
        width: '100%', 
        height: 250,
        marginBottom: 20,
        marginTop: 60, // Ajuste esse valor conforme necessário para encaixar abaixo do header
    },
    
    bannerItem: {
        width: '100%', // Cada banner ocupa toda a largura
        height: '100%', // Cada banner ocupa toda a altura definida no container
    },
    bannerImage: {
        width: '100%',
        height: '80%',
        borderRadius: 20, // Bordas arredondadas
        marginTop:'-10'
    },
});
