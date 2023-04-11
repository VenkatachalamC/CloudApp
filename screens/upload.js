import {Text,TouchableOpacity,View,StyleSheet,Image} from 'react-native';
import DocumentPicker from 'react-native-document-picker'
import { useLayoutEffect, useState } from 'react';
import CardView from '../components/cardview';
function Upload({navigation,route}){
    useLayoutEffect(()=>{
    navigation.setOptions({
        headerStyle:{
            backgroundColor:"black",
        },
        contentStyle:{
            backgroundColor:"black"
        },
        headerTintColor:"white",
        headerTitleAlign: 'center'
    })}
    )

    const[doc,setdoc]=useState(null)
    
    function FileuploadHandler(){
        DocumentPicker.pick().then(res=>{setdoc(res);})
    }
    //function for uploading..
    function uploadHandler(){
        const fd=new FormData()
        fd.append("file",{
            name:doc[0].name,
            uri:doc[0].uri,
            type:doc[0].type
        })
        fd.append("userid",route.params.userid)
        fetch("http://192.168.1.7:5000/upload",{
            method:"POST",
            body:fd,
            headers:{
                "content-Type":"multipart/form-data"
            }
        }).then(alert("File uploaded successfully ☺️")).catch(err=>alert("File not uploaded! 😔\n Try again"))
        setdoc(null)
    }



    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={FileuploadHandler} style={styles.button}>
                <Text style={styles.text}>Select File</Text>
            </TouchableOpacity>
               {doc && <CardView doc={doc}/>}
               {doc &&<TouchableOpacity onPress={uploadHandler}>
                <Image source={require("../assets/upload.png")} style={styles.Image}/>
            </TouchableOpacity>}
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    button:{
        margin:10,
        backgroundColor:"blue",
        width:150,
        height:30,
        alignItems:'center',
        justifyContent:"center",
        borderRadius:15
    },
    Image:{
        height:50,
        width:50
    },
    text:{
        color:"white",
        fontWeight:"400"
    }
})

export default Upload;