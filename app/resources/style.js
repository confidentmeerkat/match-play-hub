import {StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  containerWelcome: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalWelcome: {flex: 1},
  containerModal: {flex: 1, justifyContent: 'center'},
  containerCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: {height: 3, width: 0},
    shadowOpacity: 0.5,
    marginStart: wp(5.5),
    marginEnd: wp(5.5),
    marginTop: hp(2),
    width: wp(70),
    height: hp(55),
    alignSelf: 'center',
  },
  txtWelcomeUser: {
    textAlign: 'center',
    fontSize: RFPercentage(3.5),
    color: Colors.colorText,
    padding: 10,
    marginStart: wp(2),
    marginEnd: wp(2),
    marginTop: hp(2),
  },
  txtClickHereProfile: {
    textAlign: 'center',
    fontSize: RFPercentage(2.5),
    color: Colors.colorText,
    padding: 10,
    marginStart: wp(2),
    marginEnd: wp(2),
  },
  txtLater: {
    textAlign: 'center',
    fontSize: RFPercentage(2),
    color: Colors.colorText,
    padding: 15,
  },
  iconPen: {
    width: wp(25),
    height: wp(20),
    alignSelf: 'center',
    marginTop: hp(8),
  },
  editView: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
