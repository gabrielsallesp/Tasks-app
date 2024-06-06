import React, { Component } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

import globalStyles from "../globalStyles";

const initialState = {
    desc: '',
    date: new Date()
}


export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })
    }



    getDateTimePicker = () => {
        return (
            <DateTimePicker 
                value={this.state.date}
                onChange={(_, date) => this.setState({ date })}
                display="spinner"
            />
        )
    }


    render() {
        let keyboardVerticalOffset = 0
        return (

            <Modal transparent={true} 
                   visible={this.props.isVisible}
                   onRequestClose={this.props.onCancel}
                   animationType="fade">

                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Nova Tarefa</Text>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput 
                        style={styles.input} 
                        placeholder="Informe a Descrição"
                        value={this.state.desc}
                        onChangeText={desc => this.setState({desc })}/>
                    
                    <View style={styles.datePicker}>
                        {this.getDateTimePicker()}
                    </View>

                </KeyboardAvoidingView>

                {/* <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback> */}

            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        flex: 1.5,
        backgroundColor: "#FFF"
    },
    header: {
        flexDirection: "row",
        backgroundColor: globalStyles.colors.today,
    },
    
    headerText: {
        flex: 1,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.colors.secondary,
        
        fontSize: 20,
        textAlign: "left",
        padding: 15
    },
    
    button: {
        flex: 1,
        color: globalStyles.colors.secondary,
        padding: 20
    },

    input: {
        fontFamily: globalStyles.fontFamily,
        width: '90%',
        height: 40,
        margin: 15,
        padding: 7,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    datePicker: {
        alignItems: "center",
    }
})