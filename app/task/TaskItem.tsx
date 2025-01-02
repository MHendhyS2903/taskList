import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onToggle,
  onEdit,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.row}>
      <MaterialIcons
        name={task.completed ? "check-box" : "check-box-outline-blank"}
        size={28}
        color={task.completed ? "#4CAF50" : "#B9B9B9"}
      />
      <Text style={[styles.text, task.completed && styles.completed]}>
        {task.title}
      </Text>
    </TouchableOpacity>
    <Text style={styles.createdAtText}>
      Created at: {new Date(task.createdAt).toLocaleString()}
    </Text>

    <View style={styles.buttons}>
      <TouchableOpacity onPress={() => onEdit(task)} style={styles.editButton}>
        <MaterialIcons name="edit" size={22} color="#4CAF50" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
      >
        <MaterialIcons name="delete" size={22} color="#E57373" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 18,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  text: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "500",
    flexShrink: 1,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#B9B9B9",
  },
  createdAtText: {
    fontSize: 12,
    color: "#A1A1A1",
    marginVertical: 6,
    width: "100%",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#e1f5e1",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ffebee",
  },
});

export default TaskItem;
