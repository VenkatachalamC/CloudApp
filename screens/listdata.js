
import {useLayoutEffect, useState } from 'react';
import {Text,View,StyleSheet, Platform, FlatList, TouchableOpacity,Image} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
function ListData({navigation,route}){
    const [files,setfiles]=useState([])
    const [userid,setuserid]=useState("")
    useLayoutEffect(()=>{
        setuserid(route.params.userid)
        navigation.setOptions({
            headerRight:()=>{
                return (
                    <TouchableOpacity onPress={()=>navigation.navigate('sign-in')}>
                        <Text style={{color:"#ccccff"}}>Logout</Text>
                    </TouchableOpacity>
                    )
            },
            headerLeft:()=>{
                return(
                    <View>     
                    </View>
                    )
            },
            headerTitleAlign: 'center',
            title:"Documents",
            headerStyle:{
                backgroundColor:"#333333",
            },
            contentStyle:{
                backgroundColor:"#333333"
            },
            headerTintColor:"#ccccff",
         })
    //fetch the uploaded image from the server..for the user name..
    fetch(`http://192.168.1.7:5000/documents/${userid}`)
    .then(res=>res.json())
    .then(data=>setfiles(data))

    },[navigation,files])
    function download(documentName){
        const {fs,config}=RNFetchBlob;
        const path=fs.dirs.DownloadDir;
        config({
            fileCache:true,
            addAndroidDownloads:{
                useDownloadManager:true,
                notification:true,
                path:path+"/"+documentName,
                description:'file download',
            }
        }).fetch('GET',`http://192.168.1.7:5000/${documentName}`,{
            Authorization : 'Bearer access-token...'
        }).then(res=>alert("download successful"))
    }
    function renderList(ItemData){
        let fname;
        const myArray = ItemData.item.filetype.split("/");
        switch(myArray[0]){
            case "image":fname=<Image source={require("../assets/image.png")} style={styles.img}/>;break;
            case "video":fname=<Image source={require("../assets/video.png")} style={styles.img}/>;break;
            case "application":fname=<Image source={require("../assets/file.png")} style={styles.img}/>;break;
        }
        function DeleteHandle(name){
            fetch("http://192.168.1.7:5000/Delete",{
                method:"DELETE",
                body:JSON.stringify({
                    name:name,
                    uid:userid
                }),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>res.json())
                .then(data=>{})
        }
        return(
            <View style={styles.list}>
                <TouchableOpacity onPress={()=>download(ItemData.item.fileName)} style={styles.list}>
                    {fname}
                <Text style={styles.txt}>{ItemData.item.fileName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deletebutton} onPress={()=>DeleteHandle(ItemData.item.fileName)}>
                <Text>Delete</Text>
            </TouchableOpacity>
            </View>
        )
    }
    return(
        <View style={{flex:1}}>
        <FlatList data={files} renderItem={renderList}/>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('upload',{userid:userid})}>
            <Text style={{color:"black"}}>upload</Text>
        </TouchableOpacity>
        </View>
    )
}

export default ListData;

const styles=StyleSheet.create({
    navbar:{
        flex:0.09,
        backgroundColor:"black",
        marginTop:Platform.OS==="android"?30:0,
        alignItems:"center",
        justifyContent:"center"
    },
    button:{
        height:50,
        backgroundColor:"#aa80ff",
        alignItems:'center',
        justifyContent:'center'
    },
    list:{
        margin:10,
        alignItems:"center",
        justifyContent:"center"
    },
    img:{
        height:100,
        width:100
    },
    list:{
        flexDirection:"row",
        margin:5,
    },
    txt:{
        marginLeft:3,
        marginTop:25,
        width:200,
        color:"#ccccff"
    },
    deletebutton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"red",
        height:40,
        marginTop:25,
        borderRadius:10,
        width:50,
        marginRight:15
    }
})