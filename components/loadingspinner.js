import { ActivityIndicator,Modal,View,StyleSheet } from "react-native";
const Loading=({isloading})=>{
    return(
        <Modal visible={isloading} animationType="slide" transparent={true}>
            <View style={styles.container}>
            <ActivityIndicator color="blue" size={100}/>
            </View>
        </Modal>
    )
}

export default Loading;
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        opacity:0.8,
        backgroundColor:"black"

    }
})