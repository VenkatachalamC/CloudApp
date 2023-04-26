import { useLayoutEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import { Platform, StatusBar } from "react-native";
import { sha256 } from "react-native-sha256";
import { PermissionsAndroid } from 'react-native';
export default LoginScreen = ({ navigation }) => {
    const [name, setname] = useState("")
    const [pass, setpass] = useState("")
    const [errormsg, seterrormsg] = useState("")
    const permission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "black",
            },
            contentStyle: {
                backgroundColor: "black"
            },
            headerTintColor: "white",
            headerTitleAlign: 'center'
        })
        permission();
    }, [])
    function signIn() {
        sha256(pass).then(hash => {
            fetch("http://192.168.1.8:5000/SignIn", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    Password: hash
                })
            }).then(res => res.json()).then(data => {
                if (data.status === "ok") {
                    seterrormsg("")
                    navigation.navigate("list-doc", { name: name, userid: data.userid })
                }
                else {
                    seterrormsg(data.status)
                }
            })
        }).catch((e) => {
            console.log("here")
            alert("Unable to connect to Server.")
        })

    }

    return (
        <View style={styles.container}>
            <Text style={styles.topic}>Implementation of Storage as a Service</Text>
            <Text style={styles.topic}>Using Cloud NAS</Text>
            <View style={styles.divider}></View>
            <Image source={require('../assets/cloud.png')} style={styles.img} />
            {errormsg != "" && <Text style={{ color: "red" }}>{errormsg}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Name"
                keyboardType="default"
                placeholderTextColor="white"
                value={name}
                onChangeText={(val) => setname(val)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="white"
                keyboardType="default"
                secureTextEntry={true}
                value={pass}
                onChangeText={(val) => setpass(val)}
            />
            <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={{ color: "white" }}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
                <Text style={{ color: "white" }}>New user?</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 12,
        borderWidth: 1,
        width: 300,
        height: 50,
        padding: 10,
        borderRadius: 20,
        borderColor: "white",
        color: "white"
    },
    button: {
        backgroundColor: "blue",
        alignItems: "center",
        margin: 10,
        height: 40,
        width: 300,
        justifyContent: "center",
        borderRadius: 20
    },
    img: {
        height: 150,
        width: 150
    },
    container: {
        flex: 1,
        padding: Platform.OS == "android" ? StatusBar.currentHeight : 0,
        alignItems: "center",
        justifyContent: "center"
    },
    topic: {
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        marginBottom: 2,
        fontWeight: "bold",
        color: "white"
    },
    divider: {
        margin: 20
    }
})