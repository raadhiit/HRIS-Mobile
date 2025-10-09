import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CircleIcon({
    name, 
    size = 28,
    bg = "#10b981",
    color = '#fff',
    dim = 48,
}: {
    name: React.ComponentProps<typeof MaterialIcons>['name'];
    size?: number;
    bg?: string;
    color?: string;
    dim?: number;
}) {
    return (
        <View 
            className="items-center justify-center rounded-full"
            style={{ width: dim, height: dim, backgroundColor: bg }}
        >
            <MaterialIcons name={name} size={size} color={color} />
        </View>
    );
};