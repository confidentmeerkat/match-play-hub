HTTP_OK = 200;
HTTP_BAD_REQUEST, SOMETHING NOT FOUND= 400;
HTTP_INTERNAL_SERVER_ERROR = 500
HTTP_UNAUTHORIZED | Token has expired = 401
Unprocessable Entity or Invalid Input = 422
PAGE NOT FOUND = 404

FOR ios
Keyboard.removeListener is not a function -crash issue manage bellow code,
-
change node_modules\react-native-gifted-chat\lib\MessageContainer.js …
in MessageContainer.js constructor

this.attachKeyboardListeners = () => {
const { invertibleScrollViewProps: invertibleProps } = this.props;
if (invertibleProps) {

-        Keyboard.addListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
-        Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
-        Keyboard.addListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
-        Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);

*        this.willShowSub = Keyboard.addListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
*        this.didShowSub = Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
*        this.willHideSub = Keyboard.addListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
*        this.didHideSub = Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);
      }
  };
  this.detachKeyboardListeners = () => {
  const { invertibleScrollViewProps: invertibleProps } = this.props;

- Keyboard.removeListener('keyboardWillShow', invertibleProps.onKeyboardWillShow);
- Keyboard.removeListener('keyboardDidShow', invertibleProps.onKeyboardDidShow);
- Keyboard.removeListener('keyboardWillHide', invertibleProps.onKeyboardWillHide);
- Keyboard.removeListener('keyboardDidHide', invertibleProps.onKeyboardDidHide);

* this.willShowSub?.remove();
* this.didShowSub?.remove();
* this.willHideSub?.remove();
* this.didHideSub?.remove();
  };
