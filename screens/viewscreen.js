import { View, Image, Text, StyleSheet, Pressable, TextInput, Button, Modal, TouchableOpacity, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import { useLayoutEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
const ViewFile = ({ navigation, route }) => {
    const [modal, setmodal] = useState(false);
    const [rename, setrename] = useState(route.params.filename);
    const [fname, setfname] = useState(route.params.filename)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            title: "file View",
            headerStyle: {
                backgroundColor: "black",
            },
            contentStyle: {
                backgroundColor: "black"
            },
            headerTintColor: "white",

        })
    })
    const url = route.params.url;
    const type = route.params.type;
    const userid = route.params.userid;
    var item;
    function downloadFile(filename) {
        const { fs, config } = RNFetchBlob;
        const path = fs.dirs.DownloadDir;
        config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: path + "/" + filename,
                description: 'file download',
            }
        }).fetch('GET', `http://192.168.1.7:5000/${filename}`, {
            Authorization: 'Bearer access-token...'
        }).then(res => alert("Download successful"))
    }
    switch (type) {
        case "image": item = <Image source={{ uri: url }} style={styles.img} />; break;
        case "video": item = <Video source={{ uri: url }} style={styles.img} onBuffer={this.onBuffer} onError={this.videoError}
            controls={true} paused={false} muted={false} resizeMode="contain" />; break;
        case "application": item = <Image source={require("../assets/file.png")} style={styles.img} />; break;
    }
    function HandleRename() {
        fetch('http://192.168.1.7:5000/rename', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: userid,
                filename: fname,
                newname: rename
            })

        }).then(res => res.json()).then(data => {
            if (data.status === 'ok') {
                setfname(rename);
                ToastAndroid.show('Rename successfull', ToastAndroid.LONG);
            }
            else {
                ToastAndroid.show('Rename failed', ToastAndroid.LONG)
            }
        })
        setmodal(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.txt}>{fname}</Text>
            {item}
            {type === "application" && <Text style={styles.txt}>Files can only be downloaded</Text>}
            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => downloadFile(fname)} style={styles.button}>
                    <Text>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setmodal(true)} style={styles.button}>
                    <Text>Rename File</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType='slide' visible={modal} transparent={true}>
                <View style={styles.modalcontainer}>
                    <View style={styles.modal}>
                        <TextInput value={rename} onChangeText={(val) => setrename(val)} style={styles.modaltextinput} />
                        <TouchableOpacity onPress={HandleRename}>
                            <Text>Rename</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        height: 300,
        width: 350,
        justifyContent: "center"
    },
    container: {
        margin: 30,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    txt: {
        margin: 20,
        alignItems: 'center',
        color: "white"
    },
    buttons: {
        flexDirection: 'row'
    },
    modal: {
        height: 200,
        width: 300,
        backgroundColor: '#202060ee',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modaltextinput: {
        margin: 20,
        width: 250,
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    button: {
        margin: 20,
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 10,
    }
})
export default ViewFile;