import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default function EveryOneVoteMatter() {
  return (
    <View style={styles.statusMsg}>
      <Text style={styles.header1}>
        <Text>{'Every '}</Text>
        <Text style={{color:'#F47D20'}}>{'ONE'}</Text>
        <Text style={{color:'#2360AD'}}>{'Vote '}</Text>
        <Text>{'Matters'}</Text>
      </Text>
      <Text style={styles.header2}>{'by vCampaign'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusMsg: {
    flex:0.5,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins'
  },
  header1:{
    fontSize:20,
    fontWeight:"500",
    lineHeight:30,
    color:'black',
    flexDirection:'row'
  },
  header2:{
    fontSize:16,
    fontWeight:"400",
    lineHeight:24,
    color:'black',
  }
});
