import { Text, View, FlatList, Image, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import { useState, useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Loading from '../components/loadingspinner';
const Bin = ({ navigation, route }) => {
    const [binfiles, setbinfiles] = useState([]);
    const [userid, setuserid] = useState("");
    const [loading, setloading] = useState(false);
    useLayoutEffect(() => {
        setuserid(route.params.userid);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "black"
            },
            contentStyle: {
                backgroundColor: "black"
            },
            headerTintColor: "white",
            title: "Bin",
            headerTitleAlign: "center",
            headerLeft: () => {
                return (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/menu-bar.png')} style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                )
            }
        })
        fetch(`https://cloudserver-2iuc.onrender.com/getbin/${userid}`)
            .then(res => res.json())
            .then(data => { setbinfiles(data); });
    }, [userid, binfiles])
    function DisplayData(ItemData) {
        let fname;
        const url = `https://cloudserver-2iuc.onrender.com/${ItemData.item.fileName}`
        const myArray = ItemData.item.filetype.split("/");
        switch (myArray[0]) {
            case "image": fname = <Image source={{ uri: url }} style={styles.img} />; break;
            case "video": fname = <Image source={require("../assets/video.png")} style={styles.img} />; break;
            case "application": fname = <Image source={require("../assets/file.png")} style={styles.img} />; break;
        }
        function DeleteHandle(name) {
            setloading(true);
            fetch("https://cloudserver-2iuc.onrender.com/permanentdelete", {
                method: "DELETE",
                body: JSON.stringify({
                    name: name,
                    uid: userid
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(data => { setloading(false) })
            const f = binfiles.filter((item) => { item.name != name })
            setbinfiles(f);
        }
        function restore(name) {
            setloading(true)
            fetch('https://cloudserver-2iuc.onrender.com/restore', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname: name,
                    uid: userid
                })
            }).then(res => res.json())
                .then(data => {
                    setloading(false);
                    ToastAndroid.show('File Restored Successfully', ToastAndroid.LONG);
                }).catch(err => {
                    setloading(false)
                    ToastAndroid.show('file restoration failed', ToastAndroid.LONG)
                })
        }
        return (
            <View style={styles.list}>
                {fname}
                <Text style={styles.txt}>{ItemData.item.fileName}</Text>
                <Pressable onPress={() => restore(ItemData.item.fileName)}>
                    <Image source={require('../assets/restore.png')} style={{ height: 30, width: 30, margin: 20 }} />
                </Pressable>
                <Pressable onPress={() => DeleteHandle(ItemData.item.fileName)}>
                    <Image source={require('../assets/delete.png')} style={{ height: 30, width: 30, margin: 20 }} />
                </Pressable>
            </View>
        )
    }
    return (
        <View>
            <FlatList data={binfiles} keyExtractor={item => item._id} renderItem={DisplayData} />
            <Loading isloading={loading} />
        </View>
    )
}

export default Bin;

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