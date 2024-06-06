import React, {Component} from "react";
import { FlatList, 
         ImageBackground, 
         StyleSheet, 
         Text, 
         View,
         TouchableOpacity,
         Platform, 
         Alert} from "react-native";
import { Icon } from "@rneui/themed";

import moment from "moment";
import 'moment/locale/pt-br';

import todayImage from "../../assets/imgs/today.jpg";
import globalStyles from "../globalStyles";
import Task from "../components/Task";
import AddTask from "./AddTask";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {
    state = {
        ...initialState
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('state')
        const state = JSON.parse(stateString) || initialState
        this.setState(state, this.filterTasks)
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null

        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks: visibleTasks})
        AsyncStorage.setItem('state', JSON.stringify(this.state))
    }


    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if (task.id === taskId) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({ tasks: tasks }, this.filterTasks)
    }

    addTask = newTask => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada!')
            return
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTasks )
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({ tasks }, this.filterTasks )
        Alert.alert('Item Excluido', 'A tarefa '+`${id}`+' foi excluida!')
    }

    render() {

        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>

                <AddTask 
                    isVisible={this.state.showAddTask} 
                    onCancel={ () => this.setState({showAddTask: false}) }
                    onSave={this.addTask}
                />

                <ImageBackground 
                    source={todayImage} 
                    style={styles.background} >
    
                    <View style={styles.iconBar} >
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'done-all' : 'remove-done' } size={25} color="white"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>
                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList 
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask} onDelete={this.deleteTask}/>}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => this.setState({ showAddTask: true })}
                    activeOpacity={0.7}>

                    <Icon
                        name="plus"
                        size={20}
                        color={globalStyles.colors.secondary}
                        type="entypo"
                    />
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10
    },
    subTitle: {
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginHorizontal: 40,
        marginTop: Platform.OS === 'ios' ? 60 : 20
    },
    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: globalStyles.colors.today,
        justifyContent: "center",
        alignItems: "center"
    }
})