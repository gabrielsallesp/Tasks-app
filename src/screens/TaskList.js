import React, {Component} from "react";
import { FlatList, 
         ImageBackground, 
         StyleSheet, 
         Text, 
         View,
         TouchableOpacity,
         Platform } from "react-native";
import { Icon } from "@rneui/themed";

import moment from "moment";
import 'moment/locale/pt-br';

import todayImage from "../../assets/imgs/today.jpg";
import globalStyles from "../globalStyles";
import Task from "../components/Task";

export default class TaskList extends Component {
    state = {
        showDoneTasks: true,
        visibleTasks: [],
        tasks: [
            {
                id: Math.random(),
                desc: 'Comprar Cebola',
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            {
                id: Math.random(),
                desc: 'Correr no lago',
                estimateAt: new Date(),
                doneAt: null,
            },
            {
                id: Math.random(),
                desc: 'Estudar Geografia',
                estimateAt: new Date(),
                doneAt: null,
            },
        ]
    }

    componentDidMount = () => {
        this.filterTasks()
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

    render() {

        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
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
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask} />}
                    />
                </View>

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
})