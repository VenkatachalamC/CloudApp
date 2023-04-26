import { Text, View, StyleSheet, ToastAndroid, Modal, Button } from 'react-native';
import { TouchableOpacity, Image } from 'react-native';
import { useLayoutEffect, useState } from 'react';
const Menu = ({ navigation, route }) => {
    const [userid, setuserid] = useState("");
    const [modal, setmodal] = useState(false);

    useLayoutEffect(() => {
        setuserid(route.params.userid)
        navigation.setOptions({
            title: "Menu",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: {
                backgroundColor: "black",
            },
            contentStyle: {
                backgroundColor: "black"
            },
            headerLeft:()=>{
                return(
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Image source={require('../assets/home.png')} style={{height:40,width:40}}/>
                    </TouchableOpacity>
                )
            }
        })
    })

    function DeactivateHandle() {
        fetch("http://192.168.1.8:5000/deactivate", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: userid
            })
        }).then(res => res.json())
            .then(data => {
                if (data.status === "ok") {
                    ToastAndroid.show("Account Deleted successfully", ToastAndroid.LONG)
                    navigation.navigate('sign-in')
                }
            })
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.samerow} onPress={() => navigation.navigate('bin-data', { userid: userid })}>
                <Image source={require('../assets/bin.png')} style={styles.image} />
                <Text style={styles.option}>
                    Bin
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.samerow} onPress={() => setmodal(true)}>
                <Image source={require('../assets/disable.png')} style={styles.image} />
                <Text style={styles.option}>
                    Deactivate Account
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("sign-in")} style={styles.samerow}>
                <Image source={require('../assets/log-out.png')} style={styles.image} />
                <Text style={styles.option}>
                    Logout
                </Text>
            </TouchableOpacity>
            <Modal visible={modal} animationType='slide' transparent={true}>
                <View style={styles.modalmain}>
                    <View style={styles.modalsub}>
                        <Text style={styles.ModalTopic}>Account Deactivation</Text>
                        <Text style={styles.ModalContent}>Deactivating Account will delete your Account permanently and also the files linked to your Account.Are you sure you want to deactivate?</Text>
                        <View style={styles.buttonrow}>
                            <TouchableOpacity onPress={DeactivateHandle} style={styles.buttonDeactivate} >
                                <Text style={styles.txt}>Deactivate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => setmodal(false)} style={styles.buttonCancel}>
                                <Text style={styles.txt}>Cancel</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
        </View>)

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    samerow: {
        margin:20,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    modalmain: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        opacity:0.8,
        backgroundColor:"black"
    },
    modalsub: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: 200,
        width: 300
    },
    buttonrow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        width:300,
    },
    buttonDeactivate:{
        backgroundColor:"green",
        height:40,
        padding:10,
        borderRadius:10,
        alignContent:'center'
    },
    buttonCancel:{
        backgroundColor:"red",
        height:40,
        padding:10,
        borderRadius:10,
        alignContent:'center'
    },
    txt:{
        color:"white"
    },
    ModalTopic:{
        color:"red",
        fontWeight:"bold",
        fontSize:20,
        margin:10
    },
    ModalContent:{
        margin:10,
        color:"white",
        fontSize:15,
        alignItems:"center",
        justifyContent:"center"
    },
    image:{
        height: 40,
         width: 40, 
         margin: 20, 
    },
    option:{
        color:"white"
    }
})
export default Menu;