import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import {
  BarcodeMaskWithOuterLayout,
  useBarcodeRead,
} from '@nartc/react-native-barcode-mask';
import {RNCamera} from 'react-native-camera';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class BarcodeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      autoFocusPoint: {
        normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
          x: Dimensions.get('window').width * 0.5 - 32,
          y: Dimensions.get('window').height * 0.5 - 32,
        },
      },
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      recordOptions: {
        mute: false,
        maxDuration: 5,
        quality: RNCamera.Constants.VideoQuality['288p'],
      },
      isRecording: false,
      canDetectFaces: false,
      canDetectText: false,
      canDetectBarcode: true,
      faces: [],
      textBlocks: [],
      barcodes: [],
      visible: false,
      barcode: null,
      barcodeText: '',
    };
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: this.state.flash === 'torch' ? 'off' : 'torch',
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: {x, y},
        drawRectPosition: {x: pageX, y: pageY},
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.warn('takePicture ', data);
    }
  };

  takeVideo = async () => {
    const {isRecording} = this.state;
    if (this.camera && !isRecording) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({isRecording: true});
          const data = await promise;
          console.warn('takeVideo', data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  toggle = value => () =>
    this.setState(prevState => ({[value]: !prevState[value]}));

  facesDetected = ({faces}) => this.setState({faces});

  renderFace = ({bounds, faceID, rollAngle, yawAngle}) => (
    <View
      key={faceID}
      transform={[
        {perspective: 600},
        {rotateZ: `${rollAngle.toFixed(0)}deg`},
        {rotateY: `${yawAngle.toFixed(0)}deg`},
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}>
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({bounds, value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text
        style={[
          styles.textBlock,
          {left: bounds.origin.x, top: bounds.origin.y},
        ]}>
        {value}
      </Text>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      />
    </React.Fragment>
  );

  textRecognized = object => {
    const {textBlocks} = object;
    this.setState({textBlocks});
  };

  barcodeRecognized = ({barcodes}) => this.setState({barcodes});

  barcodeRead = barcode => {
    this.setState({barcode});
    // if (barcode.type === this.props.subKind) {
    this.setState({
      barcodeText: '',
      canDetectBarcode: false,
    });

    setTimeout(() => {
      this.props.getBarcode && this.props.getBarcode(barcode);
    }, 1000);

    // } else {
    //     this.setState({
    //         barcodeText: this.props.subKind + " is not in frame"
    //     })
    // }
  };

  renderBarcodes = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );

  renderBarcode = ({bounds, data, type}) => {
    return (
      <React.Fragment key={data + bounds.origin.x}>
        <View
          style={[
            styles.text,
            {
              ...bounds.size,
              left: bounds.origin.x,
              top: bounds.origin.y,
            },
          ]}>
          {/* <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text> */}
        </View>
      </React.Fragment>
    );
  };

  renderBarcode = () => {
    const {barcodes} = this.state;

    if (barcodes.length > 0) {
      const bounds = barcodes[0].bounds;
      const data = barcodes[0].data;
      const type = barcodes[0].type;
      return (
        <React.Fragment key={data + bounds.origin.x}>
          <View
            style={[
              styles.text,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}>
            {/* <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text> */}
          </View>
        </React.Fragment>
      );
    }
  };

  renderSingleBarcode = () => {
    const {barcode} = this.state;
    if (barcode) {
      var finalWidth = parseFloat((barcode.bounds.size.width * 30) / 100);
      var finalHeidth = parseFloat((barcode.bounds.size.height * 20) / 100);
      const width = finalWidth + '%';
      const height = finalHeidth + '%';
      return (
        // <View style={styles.facesContainer} pointerEvents="none">
        <React.Fragment key={barcode.data + barcode.bounds.origin.x}>
          <View
            style={[
              styles.text,
              {
                ...{width: width, height: height},
                left: parseFloat(barcode.bounds.origin.x),
                top: parseFloat(barcode.bounds.origin.y),
              },
            ]}>
            {/* <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text> */}
          </View>
        </React.Fragment>
        // </View>
      );
    }
  };

  renderRecording = () => {
    const {isRecording} = this.state;
    const backgroundColor = isRecording ? 'white' : 'darkred';
    const action = isRecording ? this.stopVideo : this.takeVideo;
    const button = isRecording ? this.renderStopRecBtn() : this.renderRecBtn();
    return (
      <TouchableOpacity
        style={[
          styles.flipButton,
          {
            flex: 0.3,
            alignSelf: 'flex-end',
            backgroundColor,
          },
        ]}
        onPress={() => action()}>
        {button}
      </TouchableOpacity>
    );
  };

  stopVideo = async () => {
    await this.camera.stopRecording();
    this.setState({isRecording: false});
  };

  renderRecBtn() {
    return <Text style={styles.flipText}> REC </Text>;
  }

  renderStopRecBtn() {
    return <Text style={styles.flipText}> ☕ </Text>;
  }

  renderCamera() {
    const {canDetectFaces, canDetectText, canDetectBarcode} = this.state;

    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        captureAudio={false}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionLandmarks={
          RNCamera.Constants.FaceDetection.Landmarks
            ? RNCamera.Constants.FaceDetection.Landmarks.all
            : undefined
        }
        onFacesDetected={canDetectFaces ? this.facesDetected : null}
        // onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
        onBarCodeRead={e => canDetectBarcode && this.barcodeRead(e)}>
        <View style={StyleSheet.absoluteFill}>
          {/* <View style={[styles.autoFocusBox, drawFocusRingPosition]} /> */}
          <TouchableWithoutFeedback onPress={()=>this.touchToFocus()}>
            <View style={{flex: 1}} />
          </TouchableWithoutFeedback>
        </View>

        <BarcodeMaskWithOuterLayout
          maskOpacity={0.3}
          width={'90%'}
          height={'40%'}
          showAnimatedLine={true}
          // startValue={5}
          // onLayoutChange={onBarcodeFinderLayoutChange}
        />
        <View
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={{color: 'white'}}>{this.state.barcodeText}</Text>
        </View>
        <View style={{bottom: 0}}>
          {this.state.zoom !== 0 && (
            <Text style={[styles.flipText, styles.zoomText]}>
              Zoom: {this.state.zoom}
            </Text>
          )}
          <View
            style={{
              height: 56,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
            {/* <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={this.zoomIn.bind(this)}
                        >
                            <Text style={styles.flipText}> + </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={this.zoomOut.bind(this)}
                        >
                            <Text style={styles.flipText}> - </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                            onPress={this.toggleFocus.bind(this)}
                        >
                            <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={this.toggleFlash.bind(this)}
                        >
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain', margin: 1, tintColor: "white" }} source={require('../../assets/RedCrossSurface/Add.png')} />
                        </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.flipButton, {flex: 0.2, alignSelf: 'flex-end'}]}
              onPress={()=>this._onPressClose()}>
              <Text style={styles.flipText}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* {!!canDetectFaces && this.renderFaces()}
                {!!canDetectFaces && this.renderLandmarks()}
                {!!canDetectText && this.renderTextBlocks()} */}
        {/* {Platform.OS === 'android' && this.renderBarcode()} */}
        {Platform.OS === 'ios' && this.renderSingleBarcode()}
      </RNCamera>
    );
  }

  show(display) {
    this.setState({visible: display, canDetectBarcode: true, barcode: null});
  }

  _onPressClose() {
    this.show(false);
  }

  _onRequreClose() {
    this.show(false);
  }

  render() {
    const {visible} = this.state;
    return (
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={visible}
        onRequestClose={()=>this._onRequreClose()}>
        <View style={styles.container}>{this.renderCamera()}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
