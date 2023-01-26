import {Platform} from 'react-native';

const font_type = {
  FontRegular: Platform.select({
    ios: 'ProximaNova-Regular',
    android: 'ProximaNova-Regular',
  }),
  FontBold: Platform.select({
    ios: 'ProximaNova-Bold',
    android: 'ProximaNova-Bold',
  }),
  FontSemiBold: Platform.select({
    ios: 'ProximaNova-Semibold',
    android: 'ProximaNova-Semibold',
  }),
  FontExtraBold: Platform.select({
    ios: 'ProximaNova-Extrabld',
    android: 'ProximaNova-Extrabld',
  }),
};
export default font_type;
