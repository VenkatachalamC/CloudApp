import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Loading from '../components/loadingspinner';
function ListData({ navigation, route }) {
    const [files, setfiles] = useState([]);
    const [userid, setuserid] = useState("");
    const [loading,setloading]=useState(false);
    useEffect(() => {
        setuserid(route.params.userid)
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('menu',{userid:userid})}>
                        <Image source={require('../assets/menu-bar.png')} style={{height:40,width:40}}/>
                    </TouchableOpacity>
                )
            },
            headerLeft: () => {
                return (
                    <View>
                    </View>
                )
            },
            headerTitleAlign: 'center',
            title: "Documents",
            headerStyle: {
                backgroundColor: "black",
            },
            contentStyle: {
                backgroundColor: "black"
            },
            headerTintColor: "white",
        })
        fetch(`http://192.168.1.8:5000/documents/${userid}`)
            .then(res => res.json())
            .then(data => setfiles(data))
    }, [files, navigation])
    function download(documentName) {
        setloading(true);
        const { fs, config } = RNFetchBlob;
        const path = fs.dirs.DownloadDir;
        config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: path + "/" + documentName,
                description: 'file download',
            }
        }).fetch('GET', `http://192.168.1.8:5000/${documentName}`, {
            Authorization: 'Bearer access-token...'
        }).then(res => {setloading(false);alert("Download successful");})
    }
    function renderList(ItemData) {
        let fname;
        const url = `http://192.168.1.8:5000/${ItemData.item.fileName}`
        const myArray = ItemData.item.filetype.split("/");
        switch (myArray[0]) {
            case "image": fname = <Image source={{ uri: url }} style={styles.img} />; break;
            case "video": fname = <Image source={require("../assets/video.png")} style={styles.img} />; break;
            case "application": fname = <Image source={require("../assets/file.png")} style={styles.img} />; break;
        }
        function openfile() {
            navigation.navigate('viewscreen', { url: url, filename: ItemData.item.fileName, type: myArray[0], userid: userid })
        }
        function DeleteHandle(name) {
            setloading(true)
            fetch("http://192.168.1.8:5000/Delete", {
                method: "DELETE",
                body: JSON.stringify({
                    name: name,
                    uid: userid
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(data => { setloading(false)})
            const f = files.filter((item) => { item.name != name })
            setfiles(f);
        }
        return (
            <View style={styles.list}>
                <Pressable onPress={openfile} style={styles.buttoncontainer}>
                    {fname}
                </Pressable>
                <Text style={styles.txt}>{ItemData.item.fileName}</Text>
                <Pressable onPress={() => download(ItemData.item.fileName)}>
                    <Image source={require('../assets/download.png')} style={{ height: 20, width: 20, margin: 20 }} />
                </Pressable>
                <Pressable onPress={() => DeleteHandle(ItemData.item.fileName)}>
                    <Image source={require('../assets/delete.png')} style={{ height: 20, width: 20, margin: 20 }} />
                </Pressable>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <FlatList data={files} renderItem={renderList} />
            <View style={styles.buttoncontainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('upload', { userid: userid })}>
                    <Image style={styles.icon} source={require("../assets/add-button.png")} />
                </TouchableOpacity>
            </View>
            <Loading isloading={loading}/>
        </View>
    )
}

export default ListData;

const styles = StyleSheet.create({
    navbar: {
        flex: 0.09,
        backgroundColor: "black",
        marginTop: Platform.OS === "android" ? 30 : 0,
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        height: 50,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginBottom: 50
    },
    list: {
        margin: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    img: {
        flex: 0.5,
        height: 75,
        width: 75,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    list: {
        flexDirection: "row",
        margin: 5,
    },
    txt: {
        flex: 1,
        marginLeft: 3,
        marginTop: 10,
        width: 200,
        color: "white"
    },
    buttoncontainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    icon: {
        height: 75,
        width: 75,
    }
})