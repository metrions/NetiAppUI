import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const TimePanel = ({ startTime, endTime, placeNumber, isAvailable, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.timePanel, !isAvailable && styles.disabledPanel]}
            onPress={isAvailable ? onPress : null}
            disabled={!isAvailable}
        >
            <Text style={styles.timeText}>
                {startTime} - {endTime} {isAvailable ? "" : "(Занято)"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    timePanel: {
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 8,
        marginVertical: 5,
        alignItems: "center",
    },
    disabledPanel: {
        backgroundColor: "#555",  // Серый цвет для занятых мест
        opacity: 0.5,
    },
    timeText: {
        color: "white",
        fontSize: 16,
    },
});
