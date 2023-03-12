import { useLayoutEffect, useState } from "react";
import { View ,TextInput, TouchableOpacity,Text,Image} from "react-native";
import { StyleSheet } from "react-native";
import { Platform,StatusBar } from "react-native";
import { sha256 } from "react-native-sha256";
export default LoginScreen=({navigation})=>{
    const [name,setname]=useState("")
    const [pass,setpass]=useState("")
    const [errormsg,seterrormsg]=useState("")


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor:"#333333",
            },
            contentStyle:{
                backgroundColor:"#333333"
            },
            headerTintColor:"#ccccff",
            headerTitleAlign: 'center'
        })
    })
    function signIn(){
        //post request to the server to confirm username and password
        sha256(pass).then(hash=>{
        fetch("http://192.168.1.7:5000/SignIn",{
            method:"POST",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                Password:hash
            })
        }).then(res=>res.json()).then(data=>{
            if(data.status==="ok"){
                seterrormsg("")
                navigation.navigate("list-doc",{name:name,userid:data.userid})
            }
            else{
                seterrormsg(data.status)
            }
        })})
        
    }

    return(
        <View style={styles.container}>
        <Image source={require('../assets/cloud.png')} style={styles.img}/>
        {errormsg!="" && <Text style={{color:"red"}}>{errormsg}</Text>}
        <TextInput
        style={styles.input}
        placeholder="Name"
        keyboardType="default"
        placeholderTextColor="#ccccff" 
        value={name}
        onChangeText={(val)=>setname(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccccff" 
        keyboardType="default"
        secureTextEntry={true}
        value={pass}
        onChangeText={(val)=>setpass(val)}
      />
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={{color:"white"}}>sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('sign-up')}>
        <Text style={{color:"#ccccff"}}>New user?</Text>
      </TouchableOpacity>
        </View>
    )
}

const styles=StyleSheet.create({
    input:{
        margin:12,
        borderWidth: 1,
        width:300,
        height:50,
        padding:10,
        borderRadius:20,
        borderColor:"#ccccff",
        color:"#ccccff"
    },
    button:{
        backgroundColor:"blue",
        alignItems:"center",
        margin:10,
        height:40,
        width:300,
        justifyContent:"center",
        borderRadius:20
    },
    img:{
        height:150,
        width:150
    },
    container:{
        flex:1,
        padding:Platform.OS=="android"?StatusBar.currentHeight:0,
        alignItems:"center",
        justifyContent:"center"
    }
})