import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        top: -200

      }}
    >
<Image source={require('./../assets/images/landing1.jpeg')} 
     style={{
              width: '90%', 
              height: 310
              }} />

    </View>
  );
}
