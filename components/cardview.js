import { Image, Text, View, StyleSheet } from "react-native";
export default function CardView(props) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: props.doc[0].uri }} style={styles.img} />
            <Text style={styles.text}>{props.doc[0].name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        flex: 1,
        height: 150,
        width: 275,
        borderRadius: 20

    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        height: 200,
        width: 300,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: "#a3a3c2",
        padding: 15
    },
    text: {
        width: 200,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    }
})