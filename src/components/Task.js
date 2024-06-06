import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { Icon } from "@rneui/themed";

import moment from "moment";
import 'moment/locale/pt-br';

import globalStyles from "../globalStyles";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export default props => {

    const doneOrNotStyle = props.doneAt != null ? {textDecorationLine: 'line-through'} : {}
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd. D [de] MMMM')

    const getRightContent = () => {
        return (
            <View style={styles.right}>
                <Text style={styles.excludeText}>Excluir</Text>
                <Icon name="trash" size={30} color={globalStyles.colors.secondary} type="evilicon"/>
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={getRightContent}
                onSwipeableOpen={() => props.onDelete && props.onDelete(props.id)}>

                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}> 
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{formattedDate + ""}</Text>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name="check"
                      size={18}
                      color="white"/>
            </View>
        )
    } else {
        return (
            <View style={styles.pending}></View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderColor: "#AAA",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 5
    },
    checkContainer: {
        width: "18%",
        alignItems: "center"
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        BorderColor: "#555"
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: "#4D7031",
        justifyContent: "center",
        alignItems: "center"
    },
    desc: {
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.colors.mainText,
        fontSize: 16
    },
    date: {
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.colors.subText,
        fontSize: 14
    },
    right: {
        backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        flex: 1,
        marginTop: 5
    },
    excludeText: {
        color: 'white',
        fontSize: 20,
        marginRight: 10,
    }
})