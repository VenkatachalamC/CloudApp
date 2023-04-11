import { useState, useLayoutEffect } from "react"
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native"
import { StyleSheet } from "react-native"
import { sha256 } from 'react-native-sha256';
function SignUp({ navigation }) {
    const [userName, setuserName] = useState("")
    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [match, setmatch] = useState(false)
    const [errormsg, seterrormsg] = useState("")

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
    }
    )

    function signupHandle() {
        setmatch(false)
        if (password != confirmPassword) {
            setmatch(true)
        }
        else {
            sha256(password).then(hash => {
                fetch("http://192.168.1.7:5000/signup", {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: userName,
                        Password: hash
                    })
                }).then(res => res.json()).then(data => {
                    if (data.status === "ok") {
                        navigation.navigate("sign-in")
                    }
                    else {
                        seterrormsg(data.status)
                    }
                })
            })
        }
        //post request to the server to save user data

    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/cloud.png')} style={styles.img} />
            {match && <Text style={{ color: "red", margin: 15 }}>Password do not match..</Text>}
            {errormsg && <Text style={styles.error}>{errormsg}</Text>}
            <TextInput
                placeholderTextColor="white"
                placeholder="Username"
                style={styles.input}
                value={userName}
                onChangeText={(val) => setuserName(val)}
            />
            <TextInput
                placeholderTextColor="white"
                placeholder="Password"
                style={styles.input}
                secureTextEntry={true}
                value={password}
                onChangeText={(val) => setpassword(val)}
            />
            <TextInput
                placeholderTextColor="white"
                placeholder="Confirm password"
                style={styles.input}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(val) => setconfirmPassword(val)}
            />
            <TouchableOpacity style={styles.button} onPress={signupHandle}>
                <Text style={{ color: "white" }}>sign Up</Text>
            </TouchableOpacity>
        </View>
    )
}
export default SignUp;
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
        margin: 60,
        alignItems: "center",
        justifyContent: "center"
    },
    error: {
        color: "red"
    }
})