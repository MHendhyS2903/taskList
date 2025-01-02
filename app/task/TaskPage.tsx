import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskItem, { Task } from "./TaskItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut } from "lucide-react-native";
import * as Updates from "expo-updates";

const TaskPage = () => {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) {
      Alert.alert("Error", "Task cannot be empty!");
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask("");
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

    Alert.alert("Success", "Task added successfully!");
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the task "${task?.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedTasks = tasks.filter((t) => t.id !== id);
            setTasks(updatedTasks);
            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            Alert.alert("Deleted", "Task deleted successfully.");
          },
        },
      ]
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
  };

  const saveEditedTask = async () => {
    if (!editedTitle.trim()) {
      Alert.alert("Error", "Task title cannot be empty!");
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask?.id ? { ...task, title: editedTitle } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setEditingTask(null);
    setEditedTitle("");
    Alert.alert("Success", "Task updated successfully!");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("tasks");
      await Updates.reloadAsync();
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const activeTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <LinearGradient
      colors={["#F0F4F8", "#D6E4ED"]}
      style={[styles.containerMain, { paddingTop: insets.top }]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.infoText}>
            Active: {activeTasks} | Completed: {completedTasks}
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut color={"#1D1D1D"} size={24} />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Add a new task"
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          placeholderTextColor={"#A1A1A1"}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={handleEditTask}
            />
          )}
          style={styles.taskList}
        />

        <Modal
          visible={editingTask !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEditingTask(null)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.modalInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Edit task title"
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={saveEditedTask}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditingTask(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1D",
    letterSpacing: 0.5,
  },
  logoutButton: {
    padding: 10,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderColor: "#B9B9B9",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  taskList: {
    marginTop: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  modalInput: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
    borderRadius: 12,
    borderColor: "#B9B9B9",
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TaskPage;
